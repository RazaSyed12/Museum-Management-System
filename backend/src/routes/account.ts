import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authClient, userClient, supabaseEnv } from '../lib/supabaseClients';
import { requireAuth } from '../middleware/auth';

// Full paths (/me/profile, /auth/change-password, ...), so this router is mounted without a prefix.
const router = Router();

function send(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}
const badRequest = (res: Response, message: string) => send(res, 400, 'validation_error', message);
const serverError = (res: Response, message: string) => send(res, 500, 'server_error', message);

// Ends sessions on the auth server. "local" = just this one, "others" = every other device.
async function endSessions(token: string, scope: 'local' | 'others') {
  await fetch(`${supabaseEnv.url}/auth/v1/logout?scope=${scope}`, {
    method: 'POST',
    headers: { apikey: supabaseEnv.anonKey, Authorization: `Bearer ${token}` },
  }).catch(() => undefined);
}

const profileSchema = z
  .object({
    full_name: z.string().trim().min(1, 'Full name is required').max(100, 'Full name must be at most 100 characters'),
  })
  .strict();

// PATCH /me/profile — signed in. Changes the caller's own name (row-level security limits it to their row;
// role and status cannot be sent here).
router.patch('/me/profile', requireAuth, async (req: Request, res: Response) => {
  const parsed = profileSchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const a = req.auth!;

  const { data, error } = await userClient(a.token)
    .from('profiles')
    .update({ full_name: parsed.data.full_name, updated_at: new Date().toISOString() })
    .eq('id', a.userId)
    .select('full_name, role')
    .maybeSingle();
  if (error) return serverError(res, 'Could not update your profile.');
  if (!data) return send(res, 404, 'not_found', 'Profile not found.');

  return res.json({ user: { id: a.userId, email: a.email, full_name: data.full_name, role: data.role } });
});

const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .max(72, 'Password must be at most 72 characters'),
});

// POST /auth/change-password — signed in. Needs the current password. On success every OTHER
// device is signed out; this one stays signed in.
router.post('/auth/change-password', requireAuth, async (req: Request, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { current_password, new_password } = parsed.data;
  const a = req.auth!;
  if (!a.email) return serverError(res, 'Could not change the password.');

  if (current_password === new_password) {
    return send(res, 400, 'same_password', 'The new password must be different from the current one.');
  }

  // 1. Prove the caller knows the current password. This opens a throwaway session, closed again at once.
  const check = await authClient().auth.signInWithPassword({ email: a.email, password: current_password });
  if (check.error || !check.data.session) {
    return send(res, 400, 'invalid_current_password', 'The current password is incorrect.');
  }
  await endSessions(check.data.session.access_token, 'local');

  // 2. Set the new password.
  const response = await fetch(`${supabaseEnv.url}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseEnv.anonKey,
      Authorization: `Bearer ${a.token}`,
    },
    body: JSON.stringify({ password: new_password }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { msg?: string; message?: string; error_code?: string };
    if (response.status === 401 || response.status === 403) {
      return send(res, 401, 'unauthorized', 'Your session is invalid or has expired. Please sign in again.');
    }
    if (body.error_code === 'same_password') {
      return send(res, 400, 'same_password', 'The new password must be different from the current one.');
    }
    return send(res, 400, 'password_change_failed', body.msg ?? body.message ?? 'Password could not be updated.');
  }

  // 3. Sign out every other device (best effort).
  await endSessions(a.token, 'others');

  return res.json({ message: 'Password updated. Your other devices have been signed out.' });
});

const resendSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
});

// POST /auth/resend-confirmation — public. Same answer whether or not the address has an account, so it
// cannot be used to find out who is registered. Email confirmation is off today, so until the museum
// turns it on this sends nothing.
router.post('/auth/resend-confirmation', async (req: Request, res: Response) => {
  const parsed = resendSchema.safeParse(req.body ?? {});
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { error } = await authClient().auth.resend({ type: 'signup', email: parsed.data.email });
  if (error && (error.status === 429 || error.code === 'over_email_send_rate_limit')) {
    return send(res, 429, 'rate_limited', 'Too many requests. Please wait a minute and try again.');
  }
  return res.json({ message: 'If that account still needs confirming, a new confirmation email has been sent.' });
});

export default router;