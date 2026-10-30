import { ensureMockingStarted } from '@/mocks/init';
import { getAccessToken } from '@/lib/auth';
import {
  listCollectionsForStaff,
  getCollectionForStaff,
  createCollection,
  updateCollection,
  archiveCollection,
  listCategories,
  type Collection,
  type Category as RealCategory,
} from '@/lib/api/collections';
import {
  listEventsForStaff,
  getEventForStaff,
  createEvent,
  updateEvent,
  cancelEvent,
  type RawEvent,
} from '@/lib/api/events';
import type {
  Asset,
  Category,
  Dashboard,
  ListQuery,
  MuseumSettings,
  PageResult,
  References,
  ReportKind,
  Resource,
  SearchResult,
  StaffCollection,
  StaffEvent,
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
  // Always same-origin, for MSW's browser worker to intercept — there's no
  // real /api/staff/* backend, so NEXT_PUBLIC_API_BASE_URL never applies here.
  const response = await fetch(`/api/staff${path}`, {
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

/* ---------------------------------------------------------------------
 * Collections and Events bridge to the real backend (see
 * backend/API-REQUIREMENTS.md — everything else below stays on the mock,
 * since nothing else here has a real endpoint yet). list/get/save/action
 * branch per-resource below; the generic RecordList/RecordEditor/
 * RecordDetail components calling into staffApi don't need to know.
 * ------------------------------------------------------------------- */

function requireToken(): string {
  const token = getAccessToken();
  if (!token) throw new StaffApiError('Sign in required.', 401);
  return token;
}

function collectionToStaff(c: Collection): StaffCollection {
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? '',
    categoryId: c.categories[0]?.id ?? '',
    // No real Collection field for this — see lib/api/collections.ts.
    period: '',
    location: c.location?.name ?? '',
    // No real items-count field yet (collection_items has no API — see
    // backend/API-REQUIREMENTS.md), so this is honestly zero, not guessed.
    catalogueTotal: 0,
    featured: c.featured,
    status: c.status === 'published' ? 'Published' : c.status === 'archived' ? 'Archived' : 'Draft',
    images: c.image ? [{ id: c.image, url: c.image, name: '', alt: '' }] : [],
  };
}

function staffToCollectionInput(row: Record<string, unknown>) {
  return {
    name: String(row.name ?? ''),
    description: row.description ? String(row.description) : null,
    status:
      row.status === 'Published' ? ('published' as const) : row.status === 'Archived' ? ('archived' as const) : ('draft' as const),
    featured: Boolean(row.featured),
    category_ids: row.categoryId ? [String(row.categoryId)] : [],
  };
}

function eventToStaff(e: RawEvent): StaffEvent {
  return {
    id: e.event_id,
    title: e.name,
    description: e.description ?? '',
    // No real "event type" field.
    type: '',
    categoryId: e.categories[0]?.category_id ?? '',
    startAt: e.start_at,
    endAt: e.end_at,
    location: e.location?.name ?? '',
    price: e.ticket_price,
    // No real member/child pricing, allocation, or booked count yet (no
    // ticketing system — see backend/API-REQUIREMENTS.md). Mirroring price
    // rather than guessing a discount, and honestly zero for the rest.
    memberPrice: e.ticket_price,
    childPrice: e.ticket_price,
    capacity: e.capacity,
    memberAllocation: 0,
    booked: 0,
    status: e.status === 'scheduled' ? 'Published' : e.status === 'cancelled' ? 'Cancelled' : 'Draft',
    images: e.images[0] ? [{ id: e.images[0].media_id, url: e.images[0].url, name: '', alt: e.images[0].alt_text ?? '' }] : [],
  };
}

function staffToEventInput(row: Record<string, unknown>) {
  return {
    name: String(row.title ?? ''),
    description: row.description ? String(row.description) : null,
    status: row.status === 'Draft' ? ('draft' as const) : ('scheduled' as const),
    ticket_price: Number(row.price ?? 0),
    capacity: Number(row.capacity ?? 0),
    start_at: String(row.startAt ?? ''),
    end_at: String(row.endAt ?? ''),
    category_ids: row.categoryId ? [String(row.categoryId)] : [],
  };
}

/** Same filter/sort/paginate behaviour as mocks/staff.ts's own list() (not
 *  reusable from here — it's keyed to that file's in-memory state), applied
 *  client-side since the real list endpoints don't support arbitrary sort. */
function paginate<T extends Record<string, unknown>>(rows: T[], query: ListQuery): PageResult<T> {
  let filtered = rows;
  const q = query.q?.toLowerCase();
  if (q)
    filtered = filtered.filter((row) =>
      Object.values(row)
        .filter((v) => typeof v !== 'object')
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  if (query.status) filtered = filtered.filter((row) => row.status === query.status);
  if (query.tab === 'upcoming') filtered = filtered.filter((row) => String(row.endAt ?? '') >= new Date().toISOString());
  if (query.tab === 'past') filtered = filtered.filter((row) => String(row.endAt ?? '') < new Date().toISOString());
  const key = query.sort ?? 'name';
  const sorted = [...filtered].sort((a, b) => {
    const [av, bv] = [a[key], b[key]];
    const cmp =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av ?? '').localeCompare(String(bv ?? ''), 'en-AU', { numeric: true });
    return query.direction === 'desc' ? -cmp : cmp;
  });
  const pageSize = Math.max(1, Math.min(200, query.pageSize ?? 10));
  const page = Math.max(1, query.page ?? 1);
  return { items: sorted.slice((page - 1) * pageSize, page * pageSize), total: sorted.length, page, pageSize };
}

function realCategoryToStaff(c: RealCategory): Category {
  return { id: c.id, name: c.name, description: c.description ?? '', status: c.active ? 'Active' : 'Archived' };
}

export const staffApi = {
  /** Bridges the unified sign-in (lib/api/auth.ts) to this person's
   *  staff-portal profile — phone, Admin/Manager/Staff tier, status —
   *  once the unified session has confirmed role === 'staff'. Returns
   *  null if nobody in the staff roster has this email yet (an admin
   *  needs to add them under User management first). */
  myProfile: (email: string) => request<StaffUser | null>(`/auth/profile${queryString({ email })}`),
  clearProfile: () => request<void>('/auth/profile', { method: 'DELETE' }),
  list: async <K extends Resource>(resource: K, query: ListQuery = {}, signal?: AbortSignal): Promise<PageResult<StaffResources[K]>> => {
    if (resource === 'collections') {
      const result = await listCollectionsForStaff({ limit: 100 }, requireToken());
      return paginate(result.items.map(collectionToStaff) as unknown as Record<string, unknown>[], query) as unknown as PageResult<StaffResources[K]>;
    }
    if (resource === 'events') {
      const events = await listEventsForStaff(requireToken());
      return paginate(events.map(eventToStaff) as unknown as Record<string, unknown>[], query) as unknown as PageResult<StaffResources[K]>;
    }
    return request<PageResult<StaffResources[K]>>(`/${resource}${queryString(query)}`, { signal });
  },
  get: async <K extends Resource>(resource: K, id: string, signal?: AbortSignal): Promise<StaffResources[K]> => {
    if (resource === 'collections') {
      const c = await getCollectionForStaff(id, requireToken());
      if (!c) throw new StaffApiError('This record could not be found.', 404);
      return collectionToStaff(c) as unknown as StaffResources[K];
    }
    if (resource === 'events') {
      const e = await getEventForStaff(id, requireToken());
      if (!e) throw new StaffApiError('This record could not be found.', 404);
      return eventToStaff(e) as unknown as StaffResources[K];
    }
    return request<StaffResources[K]>(`/${resource}/${encodeURIComponent(id)}`, { signal });
  },
  save: async <K extends Resource>(resource: K, input: Partial<StaffResources[K]>, id?: string): Promise<StaffResources[K]> => {
    const row = input as Record<string, unknown>;
    if (resource === 'collections') {
      const token = requireToken();
      const saved = id
        ? await updateCollection(id, staffToCollectionInput(row), token)
        : await createCollection(staffToCollectionInput(row), token);
      return collectionToStaff(saved) as unknown as StaffResources[K];
    }
    if (resource === 'events') {
      const token = requireToken();
      const saved = id
        ? await updateEvent(id, staffToEventInput(row), token)
        : await createEvent({ ...staffToEventInput(row), capacity: Number(row.capacity ?? 0) }, token);
      return eventToStaff(saved) as unknown as StaffResources[K];
    }
    return request<StaffResources[K]>(`/${resource}${id ? `/${encodeURIComponent(id)}` : ''}`, {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(input),
    });
  },
  action: async <K extends Resource>(resource: K, id: string, action: string, input: Record<string, unknown> = {}): Promise<StaffResources[K]> => {
    if (resource === 'collections' && action === 'archive') {
      return collectionToStaff(await archiveCollection(id, requireToken())) as unknown as StaffResources[K];
    }
    if (resource === 'events' && action === 'cancel') {
      return eventToStaff(await cancelEvent(id, String(input.reason ?? ''), requireToken())) as unknown as StaffResources[K];
    }
    return request<StaffResources[K]>(`/${resource}/${encodeURIComponent(id)}/${action}`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  references: async () => {
    const token = getAccessToken();
    const [mock, categories, collections, events] = await Promise.all([
      request<References>('/references'),
      listCategories(),
      token ? listCollectionsForStaff({ limit: 100 }, token).catch(() => ({ items: [] as Collection[] })) : Promise.resolve({ items: [] as Collection[] }),
      token ? listEventsForStaff(token).catch(() => [] as RawEvent[]) : Promise.resolve([] as RawEvent[]),
    ]);
    // categories/collections/events are real everywhere they're referenced
    // from (the collections/items/bookings/memberships forms' dropdowns),
    // so every resource picks a record that actually exists — the rest of
    // `mock` (visitors, settings) stays as-is.
    return {
      ...mock,
      categories: categories.map(realCategoryToStaff),
      collections: collections.items.map(collectionToStaff),
      events: events.map(eventToStaff),
    };
  },
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
