import { Router, Request, Response } from 'express';
import { z } from 'zod';
//import { authClient, userClient } from '../lib/supabaseClients';
import { authClient, userClient, supabaseEnv } from '../lib/supabaseClients';
import { requireAuth, Role } from '../middleware/auth';
import { isOnboardingCompleted } from '../lib/preferences';

const router = Router();

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}

const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/sign-in', async (req: Request, res: Response) => {
  const parsed = signInSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { email, password } = parsed.data;

  const { data, error } = await authClient().auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    // Same message for "no such user" and "wrong password" on purpose.
    return res.status(401).json({
      error: { message: 'Incorrect email or password.', code: 'invalid_credentials' },
    });
  }

  const { data: profile, error: profileError } = await userClient(data.session.access_token)
    .from('profiles')
    .select('full_name, role, account_status')
    .eq('id', data.user.id)
    .single();
  if (profileError || !profile) {
    return res.status(500).json({
      error: { message: 'Signed in, but the profile could not be loaded.', code: 'profile_missing' },
    });
  }
  if (profile.account_status !== 'active') {
    return res.status(403).json({
      error: { message: 'This account is not active.', code: 'account_inactive' },
    });
  }

  // Tells the frontend whether to send the user to the preferences page
  // (e.g. they signed up but closed the tab before picking interests).
  let onboardingCompleted: boolean;
  try {
    onboardingCompleted = await isOnboardingCompleted(
      userClient(data.session.access_token), data.user.id, profile.role as Role,
    );
  } catch {
    return res.status(500).json({
      error: { message: 'Signed in, but your interests could not be loaded.', code: 'server_error' },
    });
  }

  return res.status(200).json({
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name: profile.full_name,
      role: profile.role,
      onboarding_completed: onboardingCompleted,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
});

// Computed here rather than in requireAuth, so the many routes that use
// requireAuth don't pay for an extra query they don't need.
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const a = req.auth!;
  let onboardingCompleted: boolean;
  try {
    onboardingCompleted = await isOnboardingCompleted(userClient(a.token), a.userId, a.role);
  } catch {
    return res.status(500).json({
      error: { message: 'Could not load your interests.', code: 'server_error' },
    });
  }
  return res.status(200).json({
    user: {
      id: a.userId, email: a.email, full_name: a.fullName, role: a.role,
      onboarding_completed: onboardingCompleted,
    },
  });
});

const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const redirectTo = process.env.PASSWORD_RESET_REDIRECT_URL;
  const { error } = await authClient().auth.resetPasswordForEmail(
    parsed.data.email,
    redirectTo ? { redirectTo } : undefined,
  );

  if (error && (error.status === 429 || error.code === 'over_email_send_rate_limit')) {
    return res.status(429).json({
      error: { message: 'Too many requests. Please wait a minute and try again.', code: 'rate_limited' },
    });
  }

  // Identical answer whether or not the email has an account, so this
  // endpoint can't be used to find out who is registered.
  return res.status(200).json({
    message: 'If an account exists for that email, a password reset link has been sent.',
  });
});

const resetSchema = z.object({
  access_token: z.string().min(1, 'Reset token is required'),
  new_password: z.string().min(10, 'Password must be at least 10 characters'),
});

// The reset email link lands on the frontend with #access_token=...&type=recovery.
// The frontend sends that token here together with the new password.
router.post('/reset-password', async (req: Request, res: Response) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { access_token, new_password } = parsed.data;

  const response = await fetch(`${supabaseEnv.url}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseEnv.anonKey,
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ password: new_password }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { msg?: string; message?: string };
    const unauthorized = response.status === 401 || response.status === 403;
    return res.status(unauthorized ? 401 : 400).json({
      error: {
        message: unauthorized
          ? 'This reset link is invalid or has expired. Request a new one.'
          : body.msg ?? body.message ?? 'Password could not be updated.',
        code: unauthorized ? 'invalid_reset_token' : 'reset_failed',
      },
    });
  }

  return res.status(200).json({ message: 'Password updated. You can now sign in.' });
});


// POST /auth/refresh — swaps a refresh token for a brand-new session.
// The frontend calls this when the 1-hour access token expires, so the
// user stays signed in without typing their password again.
const refreshSchema = z.object({
  refresh_token: z.string().min(1, 'refresh_token is required'),
});

router.post('/refresh', async (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { message: parsed.error.issues[0].message, code: 'validation_error' },
    });
  }

  const { data, error } = await authClient().auth.refreshSession({
    refresh_token: parsed.data.refresh_token,
  });

  if (error || !data.session) {
    return res.status(401).json({
      error: { message: 'Your session has expired. Please sign in again.', code: 'invalid_refresh_token' },
    });
  }

  return res.status(200).json({
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
});


// POST /auth/sign-out — ends the caller's session on the server, so their
// refresh token stops working. Send the current access token as a Bearer token.
router.post('/sign-out', async (req: Request, res: Response) => {
  const token = /^Bearer\s+(.+)$/i.exec(req.header('authorization') ?? '')?.[1]?.trim();
  if (!token) {
    return res.status(401).json({
      error: { message: 'Missing or malformed Authorization header.', code: 'unauthorized' },
    });
  }

  // scope=local ends only THIS session (other devices stay signed in).
  const response = await fetch(`${supabaseEnv.url}/auth/v1/logout?scope=local`, {
    method: 'POST',
    headers: { apikey: supabaseEnv.anonKey, Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return res.status(401).json({
      error: { message: 'Your session is invalid or has already expired.', code: 'unauthorized' },
    });
  }

  return res.status(200).json({ message: 'Signed out.' });
});
export default router;



