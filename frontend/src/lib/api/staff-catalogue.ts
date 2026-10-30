/** Staff adapters for the existing Express routes in backend/openapi.yaml.
 *  These reads carry a token, unlike the public collection/event adapters. */
export type CatalogueResource = 'collections' | 'events' | 'categories';
export type CatalogueStatus =
  | 'draft'
  | 'published'
  | 'archived'
  | 'scheduled'
  | 'cancelled'
  | 'active'
  | 'inactive';
export interface CatalogueRef {
  id: string;
  name: string;
}
export interface CatalogueImage {
  id: string;
  url: string;
  alt: string;
}
export interface CatalogueRecord {
  id: string;
  name: string;
  description: string | null;
  status: CatalogueStatus;
  categories: CatalogueRef[];
  collections: CatalogueRef[];
  locationId: string | null;
  location: string | null;
  images: CatalogueImage[];
  featured?: boolean;
  startAt?: string;
  endAt?: string;
  price?: number;
  capacity?: number;
  parentId?: string | null;
}
export interface CatalogueQuery {
  q?: string;
  page?: number;
  pageSize?: number;
  featured?: string;
  status?: string;
  when?: string;
  categoryId?: string;
  collectionId?: string;
}
export interface CataloguePage {
  items: CatalogueRecord[];
  total: number;
  page: number;
  pageSize: number;
}
export interface CatalogueReferences {
  categories: CatalogueRecord[];
  collections: CatalogueRecord[];
  locations: CatalogueRef[];
}
interface RawMedia {
  media_id: string;
  url: string;
  alt_text: string | null;
}
interface RawCollection {
  collection_id: string;
  name: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  location_id: string | null;
  location: { name: string; city: string | null } | null;
  categories: { category_id: string; name: string }[];
  images: RawMedia[];
}
interface RawEvent extends Omit<RawCollection, 'collection_id' | 'status' | 'featured'> {
  event_id: string;
  status: 'draft' | 'scheduled' | 'cancelled';
  start_at: string;
  end_at: string;
  ticket_price: number;
  capacity: number;
  collections: { collection_id: string; name: string }[];
}
interface RawCategory {
  category_id: string;
  name: string;
  description: string | null;
  parent_category_id: string | null;
  active: boolean;
}
export class CatalogueApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
    this.name = 'CatalogueApiError';
  }
}

export function isCatalogueResource(resource: string): resource is CatalogueResource {
  return ['collections', 'events', 'categories'].includes(resource);
}

export function catalogueStatus(status: CatalogueStatus): string {
  return {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    scheduled: 'Published',
    cancelled: 'Cancelled',
    active: 'Active',
    inactive: 'Inactive',
  }[status];
}

function collection(row: RawCollection): CatalogueRecord {
  return {
    id: row.collection_id,
    name: row.name,
    description: row.description,
    status: row.status,
    featured: row.featured,
    categories: row.categories.map((c) => ({ id: c.category_id, name: c.name })),
    collections: [],
    locationId: row.location_id,
    location: row.location?.name ?? null,
    images: row.images.map((m) => ({ id: m.media_id, url: m.url, alt: m.alt_text ?? '' })),
  };
}
function event(row: RawEvent): CatalogueRecord {
  return {
    id: row.event_id,
    name: row.name,
    description: row.description,
    status: row.status,
    categories: row.categories.map((c) => ({ id: c.category_id, name: c.name })),
    collections: row.collections.map((c) => ({ id: c.collection_id, name: c.name })),
    locationId: row.location_id,
    location: row.location?.name ?? null,
    startAt: row.start_at,
    endAt: row.end_at,
    price: Math.round(row.ticket_price * 100),
    capacity: row.capacity,
    images: row.images.map((m) => ({ id: m.media_id, url: m.url, alt: m.alt_text ?? '' })),
  };
}
function category(row: RawCategory): CatalogueRecord {
  return {
    id: row.category_id,
    name: row.name,
    description: row.description,
    status: row.active ? 'active' : 'inactive',
    parentId: row.parent_category_id,
    categories: [],
    collections: [],
    locationId: null,
    location: null,
    images: [],
  };
}

export type AuthenticatedRequest = (path: string, init?: RequestInit) => Promise<Response>;

export function createStaffCatalogueApi(fetchAuthed: AuthenticatedRequest) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetchAuthed(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init.headers },
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new CatalogueApiError(
        body.error?.message ?? 'We could not complete that request. Please try again.',
        response.status,
        body.error?.code ?? 'unknown_error',
      );
    }
    return response.json() as Promise<T>;
  }

  async function list(
    resource: CatalogueResource,
    query: CatalogueQuery = {},
    signal?: AbortSignal,
  ): Promise<CataloguePage> {
    const page = Math.max(1, Math.floor(Number(query.page) || 1));
    const pageSize = Math.max(1, Math.min(100, Math.floor(Number(query.pageSize) || 10)));
    if (resource === 'categories') {
      const { categories } = await request<{ categories: RawCategory[] }>('/categories', {
        signal,
      });
      const q = (query.q ?? '').trim().toLowerCase();
      const items = categories
        .map(category)
        .filter(
          (row) =>
            (!query.status || row.status === query.status) &&
            `${row.name} ${row.description ?? ''}`.toLowerCase().includes(q),
        );
      return {
        items: items.slice((page - 1) * pageSize, page * pageSize),
        total: items.length,
        page,
        pageSize,
      };
    }
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String((page - 1) * pageSize),
    });
    if (query.q?.trim()) params.set('q', query.q.trim());
    if (resource === 'collections') {
      if (['true', 'false'].includes(query.featured ?? '')) params.set('featured', query.featured!);
      const data = await request<{ collections: RawCollection[]; total: number }>(
        `/collections?${params}`,
        { signal },
      );
      return { items: data.collections.map(collection), total: data.total, page, pageSize };
    }
    params.set('when', ['upcoming', 'past'].includes(query.when ?? '') ? query.when! : 'all');
    if (['draft', 'scheduled', 'cancelled'].includes(query.status ?? ''))
      params.set('status', query.status!);
    if (query.categoryId) params.set('category_id', query.categoryId);
    if (query.collectionId) params.set('collection_id', query.collectionId);
    const data = await request<{ events: RawEvent[]; total: number }>(`/events?${params}`, {
      signal,
    });
    return { items: data.events.map(event), total: data.total, page, pageSize };
  }

  async function all(
    resource: CatalogueResource,
    signal?: AbortSignal,
  ): Promise<CatalogueRecord[]> {
    const items: CatalogueRecord[] = [];
    for (let page = 1; ; page++) {
      const result = await list(resource, { page, pageSize: 100 }, signal);
      items.push(...result.items);
      if (items.length >= result.total) return items;
      if (!result.items.length)
        throw new Error('The catalogue changed while loading. Please try again.');
    }
  }

  async function get(
    resource: CatalogueResource,
    id: string,
    signal?: AbortSignal,
  ): Promise<CatalogueRecord> {
    if (resource === 'categories') {
      const row = (await all(resource, signal)).find((c) => c.id === id);
      if (!row) throw new CatalogueApiError('This category could not be found.', 404, 'not_found');
      return row;
    }
    const path = `/${resource}/${encodeURIComponent(id)}`;
    if (resource === 'collections') {
      const data = await request<{ collection: RawCollection }>(path, { signal });
      return collection(data.collection);
    }
    const data = await request<{ event: RawEvent }>(path, { signal });
    return event(data.event);
  }

  async function save(
    resource: 'collections' | 'events',
    input: Record<string, unknown>,
    id?: string,
  ) {
    // Keep the wire payload limited to fields the existing backend accepts.
    const keys =
      resource === 'collections'
        ? ['name', 'description', 'status', 'location_id', 'featured', 'category_ids']
        : [
            'name',
            'description',
            'status',
            'location_id',
            'start_at',
            'end_at',
            'ticket_price',
            'capacity',
            'category_ids',
            'collection_ids',
          ];
    const body = Object.fromEntries(Object.entries(input).filter(([key]) => keys.includes(key)));
    const path = `/${resource}${id ? `/${encodeURIComponent(id)}` : ''}`;
    const init = { method: id ? 'PATCH' : 'POST', body: JSON.stringify(body) };
    if (resource === 'collections') {
      const data = await request<{ collection: RawCollection }>(path, init);
      return collection(data.collection);
    }
    const data = await request<{ event: RawEvent }>(path, init);
    return event(data.event);
  }

  async function action(resource: 'collections' | 'events', id: string) {
    const name = resource === 'collections' ? 'archive' : 'cancel';
    const path = `/${resource}/${encodeURIComponent(id)}/${name}`;
    if (resource === 'collections') {
      const data = await request<{ collection: RawCollection }>(path, { method: 'POST' });
      return collection(data.collection);
    }
    const data = await request<{ event: RawEvent }>(path, { method: 'POST' });
    return event(data.event);
  }

  async function references(
    resource: 'collections' | 'events',
    signal?: AbortSignal,
  ): Promise<CatalogueReferences> {
    const [categories, collections, events] = await Promise.all([
      all('categories', signal),
      all('collections', signal),
      all('events', signal),
    ]);
    // There is no locations endpoint yet. Existing catalogue records provide
    // a usable set of known locations without inventing IDs or making writes.
    const locations = new Map<string, CatalogueRef>();
    for (const row of [...collections, ...events])
      if (row.locationId && row.location)
        locations.set(row.locationId, { id: row.locationId, name: row.location });
    return {
      categories,
      collections: resource === 'events' ? collections : [],
      locations: [...locations.values()],
    };
  }

  return { list, get, save, action, references };
}

export type StaffCatalogueApi = ReturnType<typeof createStaffCatalogueApi>;
