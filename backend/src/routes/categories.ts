import { Router, Request, Response } from 'express';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff } from '../middleware/auth';

const router = Router();

const CATEGORY_SELECT = 'category_id, name, description, parent_category_id, active';

const listQuerySchema = z.object({
  top_level: z.enum(['true', 'false']).optional(),
});

// GET /categories — public. Feeds the onboarding interest picker, the
// "Your interests" editor, category filters and the staff forms.
// Row-level security decides visibility: guests and visitors only get
// active categories, while a staff token also returns deactivated ones
// (so admin screens can show and re-activate them). The list is small
// (tens of rows), so it is returned whole, sorted by name, without paging.
// ?top_level=true returns only categories with no parent — what the
// onboarding page shows, keeping the choice short.
router.get('/', async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({
      error: { message: parsed.error.issues[0].message, code: 'validation_error' },
    });
  }

  const db = await readerClient(req, res);
  if (!db) return;

  let query = db.from('categories').select(CATEGORY_SELECT).order('name', { ascending: true });
  if (parsed.data.top_level === 'true') query = query.is('parent_category_id', null);
  if (parsed.data.top_level === 'false') query = query.not('parent_category_id', 'is', null);

  const { data, error } = await query;
  if (error) {
    return res.status(500).json({
      error: { message: 'Could not load categories.', code: 'server_error' },
    });
  }

  return res.status(200).json({ categories: data ?? [] });
});

// ---------------------------------------------------------------------------
// Staff management: get one, create, edit / deactivate.
// ---------------------------------------------------------------------------

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}
function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}
function notFound(res: Response) {
  return res.status(404).json({ error: { message: 'Category not found.', code: 'not_found' } });
}
function conflict(res: Response) {
  return res.status(409).json({
    error: { message: 'A category with that name already exists.', code: 'conflict' },
  });
}

// Postgres error codes: 23503 = foreign key (unknown parent), 23505 = unique violation.
const isBadReference = (error: { code?: string }) => error.code === '23503';
const isDuplicate = (error: { code?: string }) => error.code === '23505';

const idSchema = z.object({ id: z.guid('Category id must be a valid UUID') });

// GET /categories/:id — public for active categories; an inactive one looks
// like a missing one unless the caller is staff.
router.get('/:id', async (req: Request, res: Response) => {
  const parsed = idSchema.safeParse(req.params);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const db = await readerClient(req, res);
  if (!db) return;

  const { data, error } = await db
    .from('categories')
    .select(CATEGORY_SELECT)
    .eq('category_id', parsed.data.id)
    .maybeSingle();
  if (error) return serverError(res, 'Could not load the category.');
  if (!data) return notFound(res);
  return res.status(200).json({ category: data });
});

const createSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  description: z.string().trim().max(2000).nullish(),
  parent_category_id: z.guid().nullish(),
  active: z.boolean().default(true),
});

// POST /categories — staff only.
router.post('/', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const db = userClient(req.auth!.token);
  const { data, error } = await db.from('categories').insert(parsed.data).select(CATEGORY_SELECT).single();

  if (error || !data) {
    if (error && isBadReference(error)) return badRequest(res, 'The parent category does not exist.');
    if (error && isDuplicate(error)) return conflict(res);
    return serverError(res, 'Could not create the category.');
  }
  return res.status(201).json({ category: data });
});

// Walks up from the proposed parent. If it reaches the category being edited,
// saving would make the tree loop back on itself. Returns null if a lookup failed.
async function wouldCreateLoop(db: SupabaseClient, id: string, newParentId: string): Promise<boolean | null> {
  let current: string | null = newParentId.toLowerCase();
  for (let depth = 0; current && depth < 50; depth++) {
    if (current === id.toLowerCase()) return true;
    const result: { data: { parent_category_id: string | null } | null; error: unknown } = await db
      .from('categories')
      .select('parent_category_id')
      .eq('category_id', current)
      .maybeSingle();
    if (result.error) return null;
    current = result.data?.parent_category_id ?? null;
  }
  return false;
}

// Every field optional and with no default, so fields that aren't sent are left alone.
const updateSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(100).optional(),
    description: z.string().trim().max(2000).nullish(),
    parent_category_id: z.guid().nullish(),
    active: z.boolean().optional(),
  })
  .refine((body) => Object.keys(body).length > 0, { message: 'Send at least one field to update' });

// PATCH /categories/:id — staff only. To retire a category send {"active": false}:
// it disappears from the public site but stays in the database.
router.patch('/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const idParsed = idSchema.safeParse(req.params);
  if (!idParsed.success) return badRequest(res, idParsed.error.issues[0].message);
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const id = idParsed.data.id;
  const db = userClient(req.auth!.token);

  if (parsed.data.parent_category_id) {
    const loop = await wouldCreateLoop(db, id, parsed.data.parent_category_id);
    if (loop === null) return serverError(res, 'Could not update the category.');
    if (loop) return badRequest(res, 'A category cannot be placed under itself or one of its own sub-categories.');
  }

  const { data, error } = await db
    .from('categories')
    .update(parsed.data)
    .eq('category_id', id)
    .select(CATEGORY_SELECT)
    .maybeSingle();

  if (error) {
    if (isBadReference(error)) return badRequest(res, 'The parent category does not exist.');
    if (isDuplicate(error)) return conflict(res);
    return serverError(res, 'Could not update the category.');
  }
  if (!data) return notFound(res);
  return res.status(200).json({ category: data });
});

export default router;