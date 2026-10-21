import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { readerClient } from '../lib/readerClient';

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

export default router;
