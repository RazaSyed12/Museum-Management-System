/** The live portal exposes only fields and queries accepted by the Express API. */
export type LiveResource =
  | 'collections'
  | 'events'
  | 'categories'
  | 'items'
  | 'locations'
  | 'visitors'
  | 'visits'
  | 'memberships'
  | 'plans'
  | 'users'
  | 'bookings'
  | 'hero';
export type BackendRecord = Record<string, unknown>;
export interface LiveField {
  key: string;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'textarea'
    | 'number'
    | 'money'
    | 'datetime-local'
    | 'select'
    | 'checkbox'
    | 'tags'
    | 'reference';
  required?: boolean;
  options?: string[];
  reference?: LiveResource | 'media';
  multiple?: boolean;
  createOnly?: boolean;
  editOnly?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  default?: string;
  hint?: string;
}
export interface LiveDefinition {
  title: string;
  singular: string;
  path: string;
  id: string;
  listKey: string;
  key: string;
  fields: LiveField[];
  columns: string[];
  search?: boolean;
  completeList?: boolean;
  create?: boolean;
  edit?: boolean;
  filters?: LiveField[];
  notice?: string;
}
const text = (key: string, label: string, required = false, maxLength = 200): LiveField => ({
  key,
  label,
  required,
  maxLength,
});
const choice = (
  key: string,
  label: string,
  options: string[],
  defaultValue?: string,
): LiveField => ({ key, label, type: 'select', options, default: defaultValue });
const ref = (
  key: string,
  label: string,
  reference: LiveField['reference'],
  required = false,
): LiveField => ({ key, label, type: 'reference', reference, required });
const description: LiveField = {
  key: 'description',
  label: 'Description',
  type: 'textarea',
  maxLength: 5000,
};
const location = ref('location_id', 'Location', 'locations');
const period = text('historical_period', 'Historical period', false, 150);
const statuses = (options: string[], defaultValue = options[0]) =>
  choice('status', 'Status', options, defaultValue);
const active: LiveField = { key: 'active', label: 'Active', type: 'checkbox', default: 'true' };
const categories: LiveField = {
  ...ref('category_ids', 'Categories', 'categories'),
  multiple: true,
};
const dateTime = (key: string, label: string, required = false): LiveField => ({
  key,
  label,
  type: 'datetime-local',
  required,
  hint: 'Adelaide local time',
});
const price = (key: string, label: string, required = false): LiveField => ({
  key,
  label,
  type: 'money',
  required,
  min: 0,
  max: 99999999.99,
});
export const LIVE_RESOURCES: Record<LiveResource, LiveDefinition> = {
  collections: {
    title: 'Collections',
    singular: 'collection',
    path: '/collections',
    id: 'collection_id',
    listKey: 'collections',
    key: 'collection',
    create: true,
    edit: true,
    search: true,
    fields: [
      text('name', 'Collection name', true),
      description,
      period,
      {
        key: 'catalogue_total',
        label: 'Catalogue total',
        type: 'number',
        min: 0,
        hint: 'All physical objects, including those not individually digitised.',
      },
      location,
      categories,
      { key: 'featured', label: 'Featured', type: 'checkbox', default: 'false' },
      statuses(['draft', 'published']),
    ],
    columns: ['name', 'status', 'historical_period', 'catalogue_total'],
    filters: [
      choice('status', 'Status', ['draft', 'published', 'archived']),
      ref('category_id', 'Category', 'categories'),
      choice('featured', 'Featured', ['true', 'false']),
      choice('sort', 'Sort', ['name', 'newest', 'oldest', 'updated']),
    ],
  },
  events: {
    title: 'Events & exhibitions',
    singular: 'event',
    path: '/events',
    id: 'event_id',
    listKey: 'events',
    key: 'event',
    create: true,
    edit: true,
    search: true,
    fields: [
      text('name', 'Event name', true),
      description,
      text('event_type', 'Event type', false, 100),
      dateTime('start_at', 'Start date and time', true),
      dateTime('end_at', 'End date and time', true),
      location,
      price('ticket_price', 'General admission (AUD)', true),
      {
        ...price('price_member', 'Member admission (AUD)'),
        hint: 'Leave blank if not offered. Booking charges currently use general admission and plan discounts.',
      },
      {
        ...price('price_child', 'Child admission (AUD)'),
        hint: 'Leave blank if not offered. This saved price is not currently used by checkout.',
      },
      { key: 'capacity', label: 'Event capacity', type: 'number', required: true, min: 0 },
      { ...categories, required: true },
      { ...ref('collection_ids', 'Linked collections', 'collections'), multiple: true },
      statuses(['draft', 'scheduled']),
    ],
    columns: ['name', 'display_status', 'start_at', 'ticket_price', 'capacity'],
    filters: [
      choice('when', 'Dates', ['all', 'upcoming', 'past']),
      choice('status', 'Status', ['draft', 'scheduled', 'cancelled']),
      text('type', 'Event type'),
      dateTime('date_from', 'From'),
      dateTime('date_to', 'Until'),
      choice('sort', 'Sort', ['start_at', 'newest', 'oldest']),
    ],
  },
  categories: {
    title: 'Categories',
    singular: 'category',
    path: '/categories',
    id: 'category_id',
    listKey: 'categories',
    key: 'category',
    create: true,
    edit: true,
    search: true,
    completeList: true,
    fields: [
      text('name', 'Category name', true, 100),
      { ...description, maxLength: 2000 },
      ref('parent_category_id', 'Parent category', 'categories'),
      active,
    ],
    columns: ['name', 'description', 'active'],
    filters: [choice('active', 'Status', ['true', 'false'])],
  },
  items: {
    title: 'Artefacts',
    singular: 'artefact',
    path: '/items',
    id: 'item_id',
    listKey: 'items',
    key: 'item',
    create: true,
    edit: true,
    search: true,
    fields: [
      { ...ref('collection_id', 'Collection', 'collections', true), createOnly: true },
      text('name', 'Artefact name', true),
      description,
      ref('category_id', 'Category', 'categories'),
      period,
      text('year_label', 'Approximate date', false, 100),
      text('origin', 'Origin', false, 150),
      text('creator', 'Creator or maker', false, 150),
      location,
      text('accession_number', 'Accession number', false, 100),
      {
        key: 'tags',
        label: 'Tags',
        type: 'tags',
        hint: 'Comma-separated; up to 30 tags, 50 characters each.',
      },
      statuses(['active']),
    ],
    columns: ['name', 'status', 'accession_number', 'historical_period'],
    filters: [
      choice('status', 'Status', ['active', 'archived']),
      ref('collection_id', 'Collection', 'collections'),
      ref('category_id', 'Category', 'categories'),
      text('historical_period', 'Period'),
      text('origin', 'Origin'),
      choice('sort', 'Sort', ['name', 'newest', 'oldest']),
    ],
  },
  locations: {
    title: 'Locations',
    singular: 'location',
    path: '/locations',
    id: 'location_id',
    listKey: 'locations',
    key: 'location',
    create: true,
    edit: true,
    search: true,
    fields: [
      text('name', 'Location name', true, 150),
      text('address', 'Address', false, 300),
      text('city', 'City', false, 100),
      text('country', 'Country', false, 100),
      { key: 'capacity', label: 'Capacity', type: 'number', min: 0, max: 1000000 },
    ],
    columns: ['name', 'address', 'city', 'capacity'],
  },
  visitors: {
    title: 'Visitors',
    singular: 'visitor',
    path: '/visitors',
    id: 'visitor_id',
    listKey: 'visitors',
    key: 'visitor',
    create: true,
    edit: true,
    search: true,
    fields: [
      text('full_name', 'Full name', true),
      { ...text('email', 'Email address'), type: 'email' },
      { ...text('phone', 'Phone', false, 50), type: 'tel' },
      { ...text('address', 'Address', false, 500), type: 'textarea' },
    ],
    columns: ['full_name', 'email', 'phone', 'created_at'],
    notice:
      'Visitor records can exist without a login. An email address does not automatically link an account.',
  },
  visits: {
    title: 'Recorded visits',
    singular: 'visit',
    path: '/visits',
    id: 'attendance_id',
    listKey: 'visits',
    key: 'visit',
    create: true,
    fields: [
      ref('visitor_id', 'Visitor', 'visitors'),
      {
        key: 'quantity',
        label: 'Number of visitors',
        type: 'number',
        required: true,
        min: 1,
        max: 1000,
        default: '1',
      },
      dateTime('visited_at', 'Visit date and time'),
    ],
    columns: ['visited_at', 'quantity', 'visitor_id', 'booking_id'],
    filters: [dateTime('date_from', 'From'), dateTime('date_to', 'Until')],
    notice:
      'Leave the visitor empty for an anonymous walk-in. Ticketed attendance is recorded through booking check-in. Visits are read-only after creation.',
  },
  memberships: {
    title: 'Memberships',
    singular: 'membership',
    path: '/staff/memberships',
    id: 'membership_id',
    listKey: 'memberships',
    key: 'membership',
    create: true,
    edit: true,
    fields: [
      { ...ref('visitor_id', 'Visitor', 'visitors'), createOnly: true },
      { ...ref('user_id', 'Account holder (Admin only)', 'users'), createOnly: true },
      { ...ref('plan_id', 'Membership plan', 'plans', true), createOnly: true },
      { ...dateTime('starts_at', 'Starts at'), createOnly: true },
      dateTime('ends_at', 'Expires at'),
      statuses(['active', 'pending', 'expired', 'cancelled']),
      {
        ...price('purchase_price', 'Recorded purchase price (AUD)'),
        hint: 'Omit on creation to use the plan price. Edit only to correct the historical purchase value.',
      },
    ],
    columns: ['plan', 'status', 'starts_at', 'ends_at', 'purchase_price'],
    filters: [
      choice('status', 'Status', ['active', 'pending', 'expired', 'cancelled']),
      ref('plan_id', 'Plan', 'plans'),
    ],
    notice:
      'Choose a visitor or an account holder, never both. An expiry extension does not record a new payment. Renewal and overlap rules are not enforced by this service.',
  },
  plans: {
    title: 'Membership plans',
    singular: 'plan',
    path: '/membership/plans',
    id: 'plan_id',
    listKey: 'plans',
    key: 'plan',
    create: true,
    edit: true,
    completeList: true,
    search: true,
    fields: [
      text('name', 'Plan name', true, 100),
      { ...description, maxLength: 1000 },
      { ...price('price', 'Price (AUD)', true), max: 100000 },
      {
        key: 'duration_months',
        label: 'Duration (months)',
        type: 'number',
        required: true,
        min: 1,
        max: 120,
        default: '12',
      },
      active,
    ],
    columns: ['name', 'price', 'duration_months', 'active'],
    filters: [choice('active', 'Status', ['true', 'false'])],
  },
  users: {
    title: 'User management',
    singular: 'account',
    path: '/admin/users',
    id: 'id',
    listKey: 'users',
    key: 'user',
    edit: true,
    search: true,
    fields: [
      { ...choice('role', 'Account role', ['registered', 'staff']), required: true },
      choice('tier', 'Staff tier', ['admin', 'manager', 'staff']),
      { ...choice('status', 'Account status', ['active', 'suspended']), required: true },
    ],
    columns: ['full_name', 'email', 'role', 'tier', 'account_status'],
    filters: [
      choice('role', 'Account role', ['registered', 'member', 'staff']),
      choice('tier', 'Staff tier', ['admin', 'manager', 'staff']),
      choice('status', 'Account status', ['active', 'suspended', 'deleted']),
    ],
    notice:
      'Grant staff access to an existing registered account by setting its role and tier. New people must register first. Invitations and editing another person’s contact details are not available.',
  },
  bookings: {
    title: 'Tickets & bookings',
    singular: 'booking',
    path: '/admin/bookings',
    id: 'booking_id',
    listKey: 'bookings',
    key: 'booking',
    search: true,
    fields: [],
    columns: ['booking_id', 'event', 'booking_status', 'quantity', 'total_amount', 'checked_in_at'],
    filters: [
      choice('status', 'Status', ['pending', 'confirmed', 'cancelled', 'expired']),
      ref('event_id', 'Event', 'events'),
      choice('tab', 'Visit date', ['today', 'upcoming', 'past']),
      dateTime('date_from', 'From'),
      dateTime('date_to', 'Until'),
      choice('sort', 'Sort', ['booked_at', 'visit_date']),
    ],
    notice:
      'Search by ticket code. Booking creation for another visitor and booking editing are not supported. Cancellation refunds completed payments; a standalone refund keeps the booking and its seats.',
  },
  hero: {
    title: 'Hero slides',
    singular: 'slide',
    path: '/hero',
    id: 'slide_id',
    listKey: 'slides',
    key: 'slide',
    create: true,
    edit: true,
    completeList: true,
    search: true,
    fields: [
      text('title', 'Title', true),
      text('eyebrow', 'Eyebrow', false, 100),
      { ...description, maxLength: 2000 },
      text('primary_label', 'Primary button label', false, 100),
      text('primary_href', 'Primary link', false, 500),
      text('secondary_label', 'Secondary button label', false, 100),
      text('secondary_href', 'Secondary link', false, 500),
      ref('event_id', 'Linked event', 'events'),
      ref('collection_id', 'Linked collection', 'collections'),
      ref('media_id', 'Background image', 'media'),
      { key: 'sort_order', label: 'Display order', type: 'number', min: 0 },
      { key: 'is_active', label: 'Active', type: 'checkbox', default: 'true' },
      dateTime('starts_at', 'Display from'),
      dateTime('ends_at', 'Display until'),
    ],
    columns: ['title', 'sort_order', 'is_active', 'starts_at', 'ends_at'],
    notice:
      'A slide may link to an event or a collection. Leave scheduling dates empty to display without a time limit.',
  },
};
export function isLiveResource(value: string): value is LiveResource {
  return Object.hasOwn(LIVE_RESOURCES, value);
}
export function object(value: unknown): BackendRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as BackendRecord)
    : {};
}
export function records(value: unknown): BackendRecord[] {
  return Array.isArray(value) ? value.map(object) : [];
}
export function string(value: unknown): string {
  return value === null || value === undefined ? '' : String(value);
}
export function title(value: unknown): string {
  return string(value)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
export function recordName(row: BackendRecord): string {
  return string(
    row.name ||
      row.full_name ||
      row.title ||
      row.email ||
      row.original_filename ||
      row.booking_id ||
      row.membership_id ||
      row.attendance_id ||
      row.media_id ||
      row.id,
  );
}
