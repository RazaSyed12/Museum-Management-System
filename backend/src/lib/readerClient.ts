import { Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
import { anonClient, authClient, userClient } from './supabaseClients';

export interface ReaderContext {
  db: SupabaseClient;
  /** null for an anonymous visitor */
  userId: string | null;
}

/**
 * Like readerClient(), but also says WHO is reading — for public
 * endpoints whose answer depends on the caller (e.g. recommendations).
 * Same rules: no header -> anonymous; valid token -> that user;
 * bad/expired token -> 401 is sent and null is returned.
 */
export async function readerContext(req: Request, res: Response): Promise<ReaderContext | null> {
  const header = req.header('authorization');
  if (!header) return { db: anonClient(), userId: null };

  const token = /^Bearer\s+(.+)$/i.exec(header)?.[1]?.trim();
  const { data, error } = token ? await authClient().auth.getUser(token) : { data: null, error: true };
  if (error || !data?.user || !token) {
    res.status(401).json({
      error: { message: 'Your session is invalid or has expired. Please sign in again.', code: 'unauthorized' },
    });
    return null;
  }
  return { db: userClient(token), userId: data.user.id };
}

/**
 * Picks which database identity a public read runs as, for endpoints
 * that work with or without a login (collections, categories, ...).
 *  - No Authorization header  -> anonymous visitor; RLS shows only
 *                                public rows (published, active, ...).
 *  - Valid Bearer token       -> that person; the database's own rules
 *                                decide what they see (staff see more).
 *  - Bad/expired token        -> 401 is sent and null is returned, so a
 *                                caller who meant to be signed in finds
 *                                out instead of silently getting less.
 */
export async function readerClient(req: Request, res: Response): Promise<SupabaseClient | null> {
  const context = await readerContext(req, res);
  return context ? context.db : null;
}
