import { ApiError, apiUrlAbsolute } from './client';

/* Small helper for the signed-in calls that lib/api/client.ts has no function
   for (PUT, PATCH and DELETE with a token). Always talks to the real backend
   (NEXT_PUBLIC_API_BASE_URL), so callers use it only behind their own
   "mocking disabled" toggle. */

const SESSION_KEY = 'hm-session';
const REMEMBER_KEY = 'hm-remember';

/** The signed-in visitor's access token, if any (browser only). Same keys lib/auth.tsx stores it under. */
export function getToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(REMEMBER_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { access_token?: string }).access_token : undefined;
  } catch {
    return undefined;
  }
}

async function errorFrom(res: Response): Promise<ApiError> {
  const body = (await res.json().catch(() => ({}))) as { error?: { message?: string; code?: string } };
  return new ApiError(body.error?.message ?? `${res.status} ${res.statusText}`, body.error?.code ?? 'unknown_error', res.status);
}

export async function authedRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  token: string | undefined,
  body?: unknown,
): Promise<T> {
  const res = await fetch(apiUrlAbsolute(path), {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw await errorFrom(res);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
