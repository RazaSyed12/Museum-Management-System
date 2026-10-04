import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { anonClient } from '../lib/supabaseClients';

const router = Router();

/**
 * Mirrors the "at least 10 characters" promised on the Create
 * Account screen. Keep this in sync with supabase/config.toml's
 * auth.minimum_password_length (and the equivalent dashboard
 * setting on the remote project) — Supabase itself is the real
 * gate; this just gives a clean message instead of forwarding a
 * raw Supabase error back to the frontend.
 */
const signUpSchema = z.object({
  full_name: z.string().trim().min(1, 'Full name is required').max(100),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(10, 'Password must be at least 10 characters'),
});

router.post('/sign-up', async (req: Request, res: Response) => {
  // 1. Validate the request body shape before touching Supabase at all.
  const parsed = signUpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { message: parsed.error.issues[0].message, code: 'validation_error' },
    });
  }
  const { full_name, email, password } = parsed.data;

  // 2. Hand off to Supabase Auth. This creates the auth.users row
  // (password hashed by GoTrue, not by us), which fires
  // handle_new_user() and creates the matching profiles row with
  // full_name already set — we never insert into profiles ourselves.
  const { data, error } = await anonClient().auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });

  // 3. Real failures land here — rate limiting, a password policy
  // violation if one's configured, Supabase being unreachable, etc.
  if (error) {
    return res.status(400).json({
      error: { message: error.message, code: 'sign_up_failed' },
    });
  }

  // 4. Supabase deliberately returns NO error for a duplicate,
  // already-confirmed email — instead it hands back a look-alike
  // user with an empty identities array, so this endpoint can't be
  // used to discover which emails are already registered. This is
  // the one duplicate case we have to detect ourselves.
  //
  // Known gap: if the existing account was created but never
  // confirmed, GoTrue returns that real account here instead of
  // taking this branch — Supabase's own anti-enumeration behaviour
  // doesn't fully cover that case yet.
  if (data.user && data.user.identities?.length === 0) {
    return res.status(409).json({
      error: { message: 'An account with that email already exists.', code: 'email_exists' },
    });
  }

  // 5. Success. session is null when email confirmation is
  // required — the frontend should treat that as "check your
  // email" rather than redirecting somewhere logged-in.
  return res.status(201).json({
    user: {
      id: data.user?.id,
      email: data.user?.email,
      full_name,
    },
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        }
      : null,
  });
});

export default router;