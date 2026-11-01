import type { AuthenticatedRequest } from './staff-catalogue';
import {
  LIVE_RESOURCES,
  object,
  records,
  string,
  type BackendRecord,
  type LiveResource,
} from '../staff/backend-resources';
import { adelaideInput, adelaideTimestamp, localDay } from '../staff/format';
import type { SearchResult } from '../staff/types';

export class StaffBackendError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
    this.name = 'StaffBackendError';
  }
}
export interface BackendPage {
  rows: BackendRecord[];
  total: number;
  page: number;
  pageSize: number;
}
export interface SaveResult {
  record: BackendRecord;
  warning?: string;
}
export function createStaffBackendApi(fetchAuthed: AuthenticatedRequest) {
  async function response(path: string, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    if (typeof init.body === 'string') headers.set('Content-Type', 'application/json');
    const result = await fetchAuthed(path, { ...init, headers });
    if (!result.ok) {
      const body = object(await result.json().catch(() => ({})));
      const error = object(body.error);
      if (
        path !== '/staff/me' &&
        typeof window !== 'undefined' &&
        ['account_inactive', 'tier_not_assigned'].includes(string(error.code))
      )
        window.dispatchEvent(new Event('staff-access-changed'));
      throw new StaffBackendError(
        string(error.message) || 'We could not complete that request. Please try again.',
        result.status,
        string(error.code) || 'unknown_error',
      );
    }
    return result;
  }
  async function request(path: string, init: RequestInit = {}): Promise<BackendRecord> {
    const result = await response(path, init);
    return result.status === 204 ? {} : object(await result.json());
  }
  async function list(
    resource: LiveResource,
    query: Record<string, string> = {},
    signal?: AbortSignal,
  ): Promise<BackendPage> {
    const def = LIVE_RESOURCES[resource];
    const page = Math.max(1, Math.floor(Number(query.page) || 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(Number(query.pageSize) || 10)));
    const params = new URLSearchParams();
    if (!def.completeList) {
      params.set('limit', String(pageSize));
      params.set('offset', String((page - 1) * pageSize));
      if (def.search && query.q?.trim()) params.set('q', query.q.trim());
      for (const field of def.filters ?? []) {
        if (query[field.key] && field.key !== 'tab') params.set(field.key, query[field.key]!);
      }
      // History filters are used by detail panels, not exposed as arbitrary inputs.
      for (const key of ['visitor_id', 'user_id', 'booking_id']) {
        if (
          query[key] &&
          ((resource === 'visits' && key !== 'user_id') ||
            (resource === 'memberships' && key !== 'booking_id') ||
            (resource === 'bookings' && key === 'user_id'))
        )
          params.set(key, query[key]);
      }
      if (resource === 'events' && !params.has('when')) params.set('when', 'all');
      if (resource === 'bookings' && query.tab && !query.date_from && !query.date_to) {
        const today = localDay();
        const midnight = adelaideTimestamp(`${today}T00:00`);
        const nextDay = new Date(`${today}T12:00:00Z`);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);
        const tomorrow = adelaideTimestamp(`${nextDay.toISOString().slice(0, 10)}T00:00`);
        if (query.tab !== 'past') params.set('date_from', midnight);
        if (query.tab !== 'upcoming')
          params.set(
            'date_to',
            new Date(Date.parse(query.tab === 'past' ? midnight : tomorrow) - 1).toISOString(),
          );
      }
    }
    const data = await request(`${def.path}${params.size ? `?${params}` : ''}`, { signal });
    let rows = records(data[def.listKey]);
    let total = Number(data.total) || 0;
    if (def.completeList) {
      const q = query.q?.trim().toLowerCase();
      rows = rows.filter(
        (row) =>
          (!q ||
            [row.name, row.title, row.description].some((value) =>
              string(value).toLowerCase().includes(q),
            )) &&
          (!query.active || string(row.active) === query.active),
      );
      total = rows.length;
      rows = rows.slice((page - 1) * pageSize, page * pageSize);
    }
    return { rows, total, page, pageSize };
  }
  async function get(
    resource: LiveResource,
    id: string,
    signal?: AbortSignal,
  ): Promise<BackendRecord> {
    const def = LIVE_RESOURCES[resource];
    if (resource === 'hero') {
      const rows = records((await request('/hero', { signal })).slides);
      const row = rows.find((item) => item.slide_id === id);
      if (!row) throw new StaffBackendError('This slide could not be found.', 404, 'not_found');
      return row;
    }
    const path = resource === 'bookings' ? '/bookings' : def.path;
    return object((await request(`${path}/${encodeURIComponent(id)}`, { signal }))[def.key]);
  }
  async function save(
    resource: LiveResource,
    input: BackendRecord,
    id?: string,
  ): Promise<SaveResult> {
    const def = LIVE_RESOURCES[resource];
    if (id ? !def.edit : !def.create) throw new Error('This operation is not available.');
    const permitted = def.fields
      .filter((field) => !(id ? field.createOnly : field.editOnly))
      .map((field) => field.key);
    const body = Object.fromEntries(
      Object.entries(input).filter(([key]) => permitted.includes(key)),
    );
    let path = `${def.path}${id ? `/${encodeURIComponent(id)}` : ''}`;
    if (resource === 'items' && !id) {
      if (!input.collection_id) throw new Error('Choose a collection.');
      path = `/collections/${encodeURIComponent(string(input.collection_id))}/items`;
      delete body.collection_id;
    }
    const data = await request(path, { method: id ? 'PATCH' : 'POST', body: JSON.stringify(body) });
    return {
      record: object(data[def.key]),
      warning: string(object(data.categories_error).message) || undefined,
    };
  }
  async function all(
    resource: LiveResource | 'media',
    signal?: AbortSignal,
  ): Promise<BackendRecord[]> {
    const rows: BackendRecord[] = [];
    for (let page = 1; ; page++) {
      const result =
        resource === 'media'
          ? await request(`/media?limit=100&offset=${(page - 1) * 100}`, { signal }).then(
              (data) => ({ rows: records(data.media), total: Number(data.total) }),
            )
          : await list(resource, { page: String(page), pageSize: '100' }, signal);
      rows.push(...result.rows);
      if (rows.length >= result.total) return rows;
      if (!result.rows.length) throw new Error('The list changed while loading. Please try again.');
    }
  }
  async function action(
    resource: LiveResource,
    id: string,
    actionName: 'archive' | 'cancel' | 'refund' | 'check-in' | 'delete',
    body: BackendRecord = {},
  ) {
    const path = resource === 'bookings' ? '/bookings' : LIVE_RESOURCES[resource].path;
    return request(
      `${path}/${encodeURIComponent(id)}${actionName === 'delete' ? '' : `/${actionName}`}`,
      {
        method: actionName === 'delete' ? 'DELETE' : 'POST',
        ...(actionName === 'delete' ? {} : { body: JSON.stringify(body) }),
      },
    );
  }
  async function upload(file: File) {
    if (
      !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    )
      throw new Error('Choose JPG, PNG, WebP or GIF images up to 5 MB each.');
    return object(
      (
        await request(`/media?${new URLSearchParams({ filename: file.name })}`, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        })
      ).media,
    );
  }
  async function search(q: string, signal?: AbortSignal): Promise<SearchResult[]> {
    if (q.trim().length < 2) return [];
    const query = new URLSearchParams({ q: q.trim(), limit: '5' });
    const [catalogue, operational] = await Promise.all([
      request(`/search?${query}`, { signal }),
      request(`/admin/search?${query}`, { signal }),
    ]);
    const results: SearchResult[] = [];
    for (const resource of ['events', 'collections', 'items', 'locations', 'categories'] as const) {
      for (const row of records(catalogue[resource])) {
        const id = string(row[LIVE_RESOURCES[resource].id]);
        results.push({
          id,
          kind: resource,
          label: string(row.name),
          href: `/staff/${resource}/${encodeURIComponent(id)}`,
        });
      }
    }
    const destinations: Record<string, LiveResource> = {
      visitor: 'visitors',
      event: 'events',
      booking: 'bookings',
      membership: 'memberships',
      collection: 'collections',
      item: 'items',
      staff_user: 'users',
    };
    for (const row of records(operational.results)) {
      const resource = destinations[string(row.kind)];
      const id = string(row.id);
      if (resource && /^[a-zA-Z0-9-]+$/.test(id))
        results.push({
          id,
          kind: resource,
          label: string(row.label),
          href: `/staff/${resource}/${encodeURIComponent(id)}`,
        });
    }
    return [...new Map(results.map((row) => [row.href, row])).values()];
  }
  return { request, response, list, get, save, all, action, upload, search };
}
export type StaffBackendApi = ReturnType<typeof createStaffBackendApi>;

/** Compare form values with the original record before producing a PATCH. */
export function fieldValue(row: BackendRecord, key: string): unknown {
  if (key === 'category_ids') return records(row.categories).map((item) => item.category_id);
  if (key === 'collection_ids') return records(row.collections).map((item) => item.collection_id);
  if (key === 'status' && row.account_status !== undefined) return row.account_status;
  return row[key];
}
export function formValue(row: BackendRecord, key: string, type?: string): string | string[] {
  const value = fieldValue(row, key);
  if (Array.isArray(value)) return type === 'tags' ? value.join(', ') : value.map(string);
  if (type === 'datetime-local' && value) return adelaideInput(string(value));
  return string(value);
}
