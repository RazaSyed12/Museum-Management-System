import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

/**
 * Server-side clients must not persist or auto-refresh sessions.
 * By default supabase-js behaves like a browser tab: it writes the
 * signed-in session to storage and refreshes it on a timer. On a
 * server there's no per-user storage, so a cached client could leak
 * one user's session into another user's request. Disabling all
 * three keeps every client stateless — identity is passed explicitly
 * per request instead.
 */
const SERVER_AUTH_OPTIONS = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};

/**
 * Public, unauthenticated client. Created once at module load, reused
 * across every request — it holds no per-user state, so sharing it is
 * safe. Queries run as the `anon` Postgres role: auth.uid() is NULL,
 * so only RLS policies that don't reference it (events, collections,
 * categories, locations, membership plans) return anything.
 */
const anon: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, SERVER_AUTH_OPTIONS);

export function anonClient(): SupabaseClient {
  return anon;
}

/**
 * Authenticated client for one request. Created fresh every call —
 * never cached or reused — because it carries one specific visitor's
 * access token in its headers. Forwarding that token lets Postgres
 * resolve auth.uid() to the real caller, so policies like
 * profiles_select_own, bookings_select_own, and anything gated by
 * is_staff() evaluate correctly instead of treating everyone as anon.
 */
export function userClient(accessToken: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    ...SERVER_AUTH_OPTIONS,
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}