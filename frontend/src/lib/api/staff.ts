import { ensureMockingStarted } from '@/mocks/init';
import type {
  Asset,
  Dashboard,
  ListQuery,
  MuseumSettings,
  PageResult,
  References,
  ReportKind,
  Resource,
  SearchResult,
  StaffNotification,
  StaffReport,
  StaffResources,
  StaffUser,
} from '@/lib/staff/types';

export class StaffApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'StaffApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  await ensureMockingStarted();
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = base ? new URL(`/api/staff${path}`, base).toString() : `/api/staff${path}`;
  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (response.status === 401 && typeof window !== 'undefined')
      window.dispatchEvent(new Event('staff-session-expired'));
    throw new StaffApiError(
      body.message ?? 'We could not complete that request. Please try again.',
      response.status,
      body.fields,
    );
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}

function queryString(query: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (value !== undefined && value !== '') params.set(key, String(value));
  return params.size ? `?${params}` : '';
}

export const staffApi = {
  /** Bridges the unified sign-in (lib/api/auth.ts) to this person's
   *  staff-portal profile — phone, Admin/Manager/Staff tier, status —
   *  once the unified session has confirmed role === 'staff'. Returns
   *  null if nobody in the staff roster has this email yet (an admin
   *  needs to add them under User management first). */
  myProfile: (email: string) => request<StaffUser | null>(`/auth/profile${queryString({ email })}`),
  clearProfile: () => request<void>('/auth/profile', { method: 'DELETE' }),
  list: <K extends Resource>(resource: K, query: ListQuery = {}, signal?: AbortSignal) =>
    request<PageResult<StaffResources[K]>>(`/${resource}${queryString(query)}`, { signal }),
  get: <K extends Resource>(resource: K, id: string, signal?: AbortSignal) =>
    request<StaffResources[K]>(`/${resource}/${encodeURIComponent(id)}`, {
      signal,
    }),
  save: <K extends Resource>(resource: K, input: Partial<StaffResources[K]>, id?: string) =>
    request<StaffResources[K]>(`/${resource}${id ? `/${encodeURIComponent(id)}` : ''}`, {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(input),
    }),
  action: <K extends Resource>(resource: K, id: string, action: string, input: object = {}) =>
    request<StaffResources[K]>(`/${resource}/${encodeURIComponent(id)}/${action}`, {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  references: () => request<References>('/references'),
  dashboard: (signal?: AbortSignal) => request<Dashboard>('/dashboard', { signal }),
  quote: (input: object, signal?: AbortSignal) =>
    request<{ total: number; remaining: number }>('/bookings/quote', {
      method: 'POST',
      body: JSON.stringify(input),
      signal,
    }),
  notifications: () => request<StaffNotification[]>('/notifications'),
  readNotification: (id: string) =>
    request<void>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: 'POST',
    }),
  search: (q: string, signal?: AbortSignal) =>
    request<SearchResult[]>(`/search${queryString({ q })}`, { signal }),
  report: (kind: ReportKind, from: string, to: string, signal?: AbortSignal, groupBy?: string) =>
    request<StaffReport>(`/reports/${kind}${queryString({ from, to, groupBy })}`, { signal }),
  settings: () => request<MuseumSettings>('/settings'),
  saveSettings: (input: Partial<MuseumSettings>) =>
    request<MuseumSettings>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  upload: (file: File) => {
    const body = new FormData();
    body.set('file', file);
    return request<Asset>('/uploads', { method: 'POST', body });
  },
};
