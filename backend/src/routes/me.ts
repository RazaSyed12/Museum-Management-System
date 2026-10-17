import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { loadPreferences } from '../lib/preferences';
import { requireAuth } from '../middleware/auth';

const router = Router();

function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}

// GET /me/preferences — the caller's interest picks. Used by the Account
// page's "Your interests" editor to pre-tick the boxes. Runs as the caller,
// so RLS (user_preferences_select_own) limits it to their own rows.
router.get('/preferences', requireAuth, async (req: Request, res: Response) => {
  const auth = req.auth!;
  try {
    const categories = await loadPreferences(userClient(auth.token), auth.userId);
    return res.status(200).json({
      categories,
      onboarding_completed: auth.role === 'staff' || categories.length > 0,
    });
  } catch {
    return serverError(res, 'Could not load your interests.');
  }
});

// Onboarding can't be skipped, so at least one pick is required. The
// upper bound only guards against junk payloads (there are ~13 categories).
const updateSchema = z.object({
  category_ids: z
    .array(z.guid('Each category id must be a valid UUID'))
    .min(1, 'Pick at least one category')
    .max(20, 'Pick at most 20 categories'),
});

// PUT /me/preferences — saves the onboarding page's picks (and later edits
// from the Account page). The list sent REPLACES the user's whole set.
router.put('/preferences', requireAuth, async (req: Request, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { message: parsed.error.issues[0].message, code: 'validation_error' },
    });
  }

  const auth = req.auth!;
  const db = userClient(auth.token);
  const ids = [...new Set(parsed.data.category_ids)];

  // 1. Every id must be an existing, active category. The foreign key
  // would only catch ids that don't exist at all — not deactivated ones —
  // and RLS lets staff see inactive rows, hence the explicit filter.
  const { data: valid, error: checkError } = await db
    .from('categories')
    .select('category_id')
    .in('category_id', ids)
    .eq('active', true);
  if (checkError) return serverError(res, 'Could not save your interests.');
  if ((valid ?? []).length !== ids.length) {
    return res.status(400).json({
      error: { message: 'One or more categories do not exist or are no longer available.', code: 'invalid_category' },
    });
  }

  // 2. Add the new picks first, skipping ones the user already has, so a
  // failure here leaves their previous picks untouched.
  const { error: addError } = await db
    .from('user_preferences')
    .upsert(
      ids.map((category_id) => ({ user_id: auth.userId, category_id })),
      { onConflict: 'user_id,category_id', ignoreDuplicates: true },
    );
  if (addError) return serverError(res, 'Could not save your interests.');

  // 3. Then remove the picks that are no longer wanted.
  const { error: removeError } = await db
    .from('user_preferences')
    .delete()
    .eq('user_id', auth.userId)
    .not('category_id', 'in', `(${ids.join(',')})`);
  if (removeError) return serverError(res, 'Could not save your interests.');

  // 4. Re-read so the reply has the same shape as GET /me/preferences.
  try {
    const categories = await loadPreferences(db, auth.userId);
    return res.status(200).json({ categories, onboarding_completed: true });
  } catch {
    return serverError(res, 'Your interests were saved but could not be read back.');
  }
});

export default router;
