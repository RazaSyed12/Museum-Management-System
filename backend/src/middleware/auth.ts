import { Request, Response, NextFunction } from 'express';
import { authClient, userClient } from '../lib/supabaseClients';

export type Role = 'registered' | 'member' | 'staff';

export interface AuthContext {
  token: string;
  userId: string;
  email: string | undefined;
  fullName: string;
  role: Role;
}

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthContext;
  }
}

function fail(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}

/**
 * Requires "Authorization: Bearer <access_token>". Checks the token
 * with Supabase Auth, loads the caller's profile (through RLS, as the
 * caller) and refuses suspended/deleted accounts. On success the
 * result is available as req.auth.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.header('authorization') ?? '';
    const match = /^Bearer\s+(.+)$/i.exec(header);
    if (!match) {
      return fail(res, 401, 'unauthorized', 'Sign in required.');
    }
    const token = match[1].trim();

    const { data: userData, error: userError } = await authClient().auth.getUser(token);
    if (userError || !userData.user) {
      return fail(res, 401, 'unauthorized', 'Your session is invalid or has expired. Please sign in again.');
    }

    const { data: profile, error: profileError } = await userClient(token)
      .from('profiles')
      .select('full_name, role, account_status')
      .eq('id', userData.user.id)
      .single();
    if (profileError || !profile) {
      return fail(res, 401, 'unauthorized', 'No profile found for this account.');
    }
    if (profile.account_status !== 'active') {
      return fail(res, 403, 'account_inactive', 'This account is not active.');
    }

    req.auth = {
      token,
      userId: userData.user.id,
      email: userData.user.email,
      fullName: profile.full_name,
      role: profile.role as Role,
    };
    next();
  } catch (err) {
    next(err);
  }
}

/** Use after requireAuth. Only staff accounts get through. */
export function requireStaff(req: Request, res: Response, next: NextFunction) {
  if (req.auth?.role !== 'staff') {
    return fail(res, 403, 'forbidden', 'Staff access required.');
  }
  next();
}