import express, { Router, Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { supabaseEnv, userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff } from '../middleware/auth';

// Paths are written in full (/media, /collections/:id/media, /events/:id/media),
// so this router is mounted without a prefix.
const router = Router();

const BUCKET = 'media';
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// The address browsers use to reach Supabase Storage. Set PUBLIC_SUPABASE_URL if it
// differs from the address the backend itself uses (e.g. when the backend runs in Docker).
const PUBLIC_BASE = (process.env.PUBLIC_SUPABASE_URL ?? supabaseEnv.url.replace('host.docker.internal', '127.0.0.1')).replace(/\/$/, '');
const URL_MARKER = `/storage/v1/object/public/${BUCKET}/`;
const publicUrl = (path: string) => `${PUBLIC_BASE}${URL_MARKER}${path}`;
function pathFromUrl(url: string): string | null {
  const i = url.indexOf(URL_MARKER);
  return i >= 0 ? url.slice(i + URL_MARKER.length) : null;
}

const MEDIA_SELECT = 'media_id, url, media_type, alt_text, created_at';

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}
function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}
function notFound(res: Response, what: string) {
  return res.status(404).json({ error: { message: `${what} not found.`, code: 'not_found' } });
}
const isBadReference = (error: { code?: string }) => error.code === '23503';

const idSchema = z.guid();

// Checks the first bytes of the file, so a text file labelled image/png is refused.
function looksLike(type: string, b: Buffer): boolean {
  if (type === 'image/png') return b.length > 8 && b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  if (type === 'image/jpeg') return b.length > 3 && b.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  if (type === 'image/gif') return b.length > 6 && b.subarray(0, 4).toString('ascii') === 'GIF8';
  if (type === 'image/webp') {
    return b.length > 12 && b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  return false;
}

// Reads the request body as raw bytes (images only, max 5 MB) and turns parser errors into our error shape.
const rawParser = express.raw({ type: Object.keys(EXTENSIONS), limit: '5mb' });
function imageBody(req: Request, res: Response, next: NextFunction) {
  rawParser(req, res, (err?: any) => {
    if (!err) return next();
    if (err.type === 'entity.too.large') {
      return res.status(413).json({ error: { message: 'The image is larger than 5 MB.', code: 'payload_too_large' } });
    }
    return badRequest(res, 'Could not read the image.');
  });
}

// POST /media?alt_text=... — staff only. Body = the image bytes, Content-Type = the image type.
router.post('/media', requireAuth, requireStaff, imageBody, async (req: Request, res: Response) => {
  const type = (req.header('content-type') ?? '').split(';')[0].trim().toLowerCase();
  const body = req.body;
  if (!EXTENSIONS[type] || !Buffer.isBuffer(body) || body.length === 0) {
    return badRequest(res, 'Send the image as the raw request body with Content-Type image/jpeg, image/png, image/webp or image/gif.');
  }
  if (!looksLike(type, body)) return badRequest(res, 'The file is not a valid image of that type.');

  const query = z.object({ alt_text: z.string().trim().max(300).optional() }).safeParse(req.query);
  if (!query.success) return badRequest(res, query.error.issues[0].message);

  const auth = req.auth!;
  const db = userClient(auth.token);
  const path = `${new Date().getUTCFullYear()}/${randomUUID()}.${EXTENSIONS[type]}`;

  const { error: uploadError } = await db.storage.from(BUCKET).upload(path, body, { contentType: type, upsert: false });
  if (uploadError) return serverError(res, 'Could not store the image.');

  const { data, error } = await db
    .from('media')
    .insert({ uploaded_by: auth.userId, url: publicUrl(path), media_type: type, alt_text: query.data.alt_text ?? null })
    .select(MEDIA_SELECT)
    .single();
  if (error || !data) {
    await db.storage.from(BUCKET).remove([path]); // do not leave a file with no row
    return serverError(res, 'Could not save the image record.');
  }
  return res.status(201).json({ media: data });
});

const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

// GET /media — staff only. The media library, newest first.
router.get('/media', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { limit, offset } = parsed.data;

  const { data, error, count } = await userClient(req.auth!.token)
    .from('media')
    .select(MEDIA_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) return serverError(res, 'Could not load the media library.');
  return res.json({ media: data ?? [], total: count ?? 0, limit, offset });
});

// PATCH /media/:id — staff only. Only the description (alt text) can change.
router.patch('/media/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Image');
  const parsed = z.object({ alt_text: z.string().trim().max(300).nullable() }).safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token)
    .from('media')
    .update({ alt_text: parsed.data.alt_text })
    .eq('media_id', id)
    .select(MEDIA_SELECT)
    .maybeSingle();
  if (error) return serverError(res, 'Could not update the image.');
  if (!data) return notFound(res, 'Image');
  return res.json({ media: data });
});

// DELETE /media/:id — staff only. Removes the file and the row; it also disappears
// from every collection and event it was attached to.
router.delete('/media/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Image');
  const db = userClient(req.auth!.token);

  const { data: row, error: readError } = await db.from('media').select('media_id, url').eq('media_id', id).maybeSingle();
  if (readError) return serverError(res, 'Could not load the image.');
  if (!row) return notFound(res, 'Image');

  const { error } = await db.from('media').delete().eq('media_id', id);
  if (error) return serverError(res, 'Could not delete the image.');

  const path = pathFromUrl(row.url);
  if (path) await db.storage.from(BUCKET).remove([path]);
  return res.json({ message: 'Image deleted.' });
});

// ---- Attaching images to collections and events (same behaviour for both) ----

const targets = [
  { base: '/collections/:id/media', link: 'collection_media', parent: 'collections', key: 'collection_id', label: 'Collection' },
  { base: '/events/:id/media', link: 'event_media', parent: 'events', key: 'event_id', label: 'Event' },
  { base: '/items/:id/media', link: 'item_media', parent: 'collection_items', key: 'item_id', label: 'Item' },
];

const replaceSchema = z.object({ media_ids: z.array(z.guid()).max(50) });

function shapeLinks(rows: any[] | null) {
  return (rows ?? [])
    .filter((r) => r.media)
    .map((r) => ({ ...r.media, sort_order: r.sort_order }));
}

for (const t of targets) {
  const loadList = async (db: any, id: string) =>
    db
      .from(t.link)
      .select('sort_order, media(media_id, url, media_type, alt_text)')
      .eq(t.key, id)
      .order('sort_order', { ascending: true });

  // GET — public. Hidden (draft/archived) parents look like "not found" to visitors.
  router.get(t.base, async (req: Request, res: Response) => {
    const id = String(req.params.id);
    if (!idSchema.safeParse(id).success) return notFound(res, t.label);
    const db = await readerClient(req, res);
    if (!db) return;

    const { data: parent, error: parentError } = await db.from(t.parent).select(t.key).eq(t.key, id).maybeSingle();
    if (parentError) return serverError(res, 'Could not load the images.');
    if (!parent) return notFound(res, t.label);

    const { data, error } = await loadList(db, id);
    if (error) return serverError(res, 'Could not load the images.');
    return res.json({ media: shapeLinks(data) });
  });

  // PUT — staff only. The list REPLACES the attached images, in the order given
  // (the first one is the main image). An empty list removes them all.
  router.put(t.base, requireAuth, requireStaff, async (req: Request, res: Response) => {
    const id = String(req.params.id);
    if (!idSchema.safeParse(id).success) return notFound(res, t.label);
    const parsed = replaceSchema.safeParse(req.body);
    if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
    const mediaIds = [...new Set(parsed.data.media_ids)];
    const db = userClient(req.auth!.token);

    const { data: parent, error: parentError } = await db.from(t.parent).select(t.key).eq(t.key, id).maybeSingle();
    if (parentError) return serverError(res, 'Could not load the images.');
    if (!parent) return notFound(res, t.label);

    // Add or reorder first, so a bad image id fails before anything is removed.
    if (mediaIds.length > 0) {
      const { error: addError } = await db
        .from(t.link)
        .upsert(
          mediaIds.map((media_id, index) => ({ [t.key]: id, media_id, sort_order: index })),
          { onConflict: `${t.key},media_id` },
        );
      if (addError) {
        if (isBadReference(addError)) return badRequest(res, 'One of the images does not exist.');
        return serverError(res, 'Could not attach the images.');
      }
    }

    let removal = db.from(t.link).delete().eq(t.key, id);
    if (mediaIds.length > 0) removal = removal.not('media_id', 'in', `(${mediaIds.join(',')})`);
    const { error: removeError } = await removal;
    if (removeError) return serverError(res, 'Could not attach the images.');

    const { data, error } = await loadList(db, id);
    if (error) return serverError(res, 'The images were saved but could not be read back.');
    return res.json({ media: shapeLinks(data) });
  });
}

export default router;