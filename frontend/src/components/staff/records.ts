import type { Resource, References } from '@/lib/staff/types';
import { localDay } from '@/lib/staff/format';

export interface RecordField {
  key: string;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'money'
    | 'date'
    | 'datetime-local'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'tags';
  required?: boolean;
  min?: number;
  step?: number;
  options?: string[];
  reference?: 'events' | 'visitors' | 'categories' | 'collections';
  hint?: string;
}

interface RecordDefinition {
  title: string;
  singular: string;
  description: string;
  icon: string;
  fields: RecordField[];
  statuses?: string[];
  tabs?: { value: string; label: string }[];
}
const period: RecordField = { key: 'period', label: 'Historical period' };
const status = (options: string[]): RecordField => ({
  key: 'status',
  label: 'Status',
  type: 'select',
  options,
  required: true,
});

export const RECORDS: Record<Resource, RecordDefinition> = {
  events: {
    title: 'Events & exhibitions',
    singular: 'event',
    description: 'Plan the programme and keep track of places across each event.',
    icon: 'calendar-days',
    statuses: ['Draft', 'Published', 'Cancelled', 'Completed'],
    tabs: [
      { value: '', label: 'All events' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'past', label: 'Past events' },
    ],
    fields: [
      { key: 'title', label: 'Event name', required: true },
      {
        key: 'type',
        label: 'Event type',
        type: 'select',
        options: ['Exhibition', 'Workshop', 'Tour', 'Talk', 'Special event'],
        required: true,
      },
      {
        key: 'categoryId',
        label: 'Category',
        type: 'select',
        reference: 'categories',
        required: true,
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      { key: 'location', label: 'Location', required: true },
      {
        key: 'startAt',
        label: 'Start date and time',
        type: 'datetime-local',
        required: true,
        hint: 'Adelaide local time',
      },
      {
        key: 'endAt',
        label: 'End date and time',
        type: 'datetime-local',
        required: true,
        hint: 'Adelaide local time',
      },
      {
        key: 'price',
        label: 'General admission (AUD)',
        type: 'money',
        required: true,
      },
      {
        key: 'memberPrice',
        label: 'Member admission (AUD)',
        type: 'money',
        required: true,
      },
      {
        key: 'childPrice',
        label: 'Child or student (AUD)',
        type: 'money',
        required: true,
      },
      {
        key: 'capacity',
        label: 'Total event capacity',
        type: 'number',
        min: 1,
        required: true,
        hint: 'One capacity pool for the whole event.',
      },
      {
        key: 'memberAllocation',
        label: 'Places reserved for members',
        type: 'number',
        min: 0,
        required: true,
        hint: 'Unused places release 48 hours before the event starts.',
      },
      status(['Draft', 'Published', 'Completed']),
    ],
  },
  bookings: {
    title: 'Tickets & bookings',
    singular: 'booking',
    description: 'Manage reservations, record payments, and welcome visitors.',
    icon: 'ticket',
    statuses: ['Confirmed', 'Pending', 'Cancelled'],
    tabs: [
      { value: '', label: 'All bookings' },
      { value: 'today', label: 'Today' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'past', label: 'Past' },
    ],
    fields: [
      {
        key: 'visitorId',
        label: 'Visitor',
        type: 'select',
        reference: 'visitors',
        required: true,
      },
      {
        key: 'eventId',
        label: 'Event',
        type: 'select',
        reference: 'events',
        required: true,
      },
      { key: 'visitDate', label: 'Visit date', type: 'date', required: true },
      {
        key: 'ticketType',
        label: 'Ticket type',
        type: 'select',
        options: ['General', 'Member', 'Child'],
        required: true,
      },
      {
        key: 'quantity',
        label: 'Number of tickets',
        type: 'number',
        min: 1,
        required: true,
      },
      {
        key: 'payment',
        label: 'Payment status',
        type: 'select',
        options: ['Pending', 'Paid'],
        hint: 'Prototype only. No card is charged.',
      },
      status(['Pending', 'Confirmed']),
    ],
  },
  visitors: {
    title: 'Visitors',
    singular: 'visitor',
    description: 'Look after visitor details, bookings, memberships, and recorded visits.',
    icon: 'users',
    fields: [
      { key: 'name', label: 'Full name', required: true },
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'phone', label: 'Phone', type: 'tel' },
      { key: 'address', label: 'Address', type: 'textarea' },
    ],
  },
  visits: {
    title: 'Recorded visits',
    singular: 'visit',
    description: 'Record walk-ins here. Use a booking’s check-in action for ticketed visits.',
    icon: 'scan-line',
    fields: [
      {
        key: 'visitorId',
        label: 'Visitor',
        type: 'select',
        reference: 'visitors',
        hint: 'Leave empty for an anonymous walk-in.',
      },
      {
        key: 'quantity',
        label: 'Number of visitors',
        type: 'number',
        required: true,
        min: 1,
      },
    ],
  },
  memberships: {
    title: 'Memberships',
    singular: 'membership',
    description: 'Supporters who help keep the museum open to everyone.',
    icon: 'award',
    statuses: ['Active', 'Expired', 'Pending'],
    tabs: [
      { value: '', label: 'All members' },
      { value: 'Active', label: 'Active' },
      { value: 'Expired', label: 'Expired' },
    ],
    fields: [
      {
        key: 'visitorId',
        label: 'Visitor',
        type: 'select',
        reference: 'visitors',
        required: true,
        hint: 'Contact details are held on the visitor record.',
      },
      {
        key: 'type',
        label: 'Membership type',
        type: 'select',
        options: ['Individual', 'Joint', 'Family'],
        required: true,
      },
      { key: 'joinDate', label: 'Join date', type: 'date', required: true },
      { key: 'expiryDate', label: 'Expiry date', type: 'date', required: true },
      {
        key: 'payment',
        label: 'Payment status',
        type: 'select',
        options: ['Pending', 'Paid'],
        required: true,
      },
    ],
  },
  collections: {
    title: 'Collections',
    singular: 'collection',
    description: 'Organise the collections and prepare their public pages.',
    icon: 'library-big',
    statuses: ['Draft', 'Published', 'Archived'],
    fields: [
      { key: 'name', label: 'Collection name', required: true },
      {
        key: 'categoryId',
        label: 'Category',
        type: 'select',
        reference: 'categories',
        required: true,
      },
      { key: 'description', label: 'Description', type: 'textarea' },
      period,
      { key: 'location', label: 'Gallery location' },
      {
        key: 'catalogueTotal',
        label: 'Catalogue total',
        type: 'number',
        min: 0,
        required: true,
        hint: 'Total objects, including those not yet individually digitised.',
      },
      {
        key: 'featured',
        label: 'Feature on the public home page',
        type: 'checkbox',
      },
      status(['Draft', 'Published']),
    ],
  },
  items: {
    title: 'Artefacts',
    singular: 'artefact',
    description: 'Catalogue objects, their histories, and where visitors can find them.',
    icon: 'gem',
    statuses: ['Draft', 'Published', 'Archived'],
    fields: [
      { key: 'name', label: 'Artefact title', required: true },
      {
        key: 'collectionId',
        label: 'Collection',
        type: 'select',
        reference: 'collections',
        required: true,
      },
      {
        key: 'categoryId',
        label: 'Category',
        type: 'select',
        reference: 'categories',
        required: true,
      },
      period,
      {
        key: 'date',
        label: 'Approximate date',
        hint: 'For example, c. 300 BCE. This is descriptive text.',
      },
      { key: 'origin', label: 'Origin' },
      { key: 'maker', label: 'Creator or maker' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'location', label: 'Display location' },
      { key: 'accession', label: 'Accession number' },
      {
        key: 'tags',
        label: 'Tags',
        type: 'tags',
        hint: 'Separate tags with commas.',
      },
      status(['Draft', 'Published']),
    ],
  },
  categories: {
    title: 'Categories',
    singular: 'category',
    description: 'Shared categories used by the catalogue and public collection filters.',
    icon: 'tags',
    statuses: ['Active', 'Archived'],
    fields: [
      { key: 'name', label: 'Category name', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  users: {
    title: 'User management',
    singular: 'staff member',
    description: 'Manage staff access with three clear roles.',
    icon: 'shield-check',
    statuses: ['Active', 'Inactive', 'Invited'],
    fields: [
      { key: 'name', label: 'Full name', required: true },
      { key: 'email', label: 'Email address', type: 'email', required: true },
      { key: 'phone', label: 'Phone', type: 'tel' },
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: ['Admin', 'Manager', 'Staff'],
        required: true,
      },
      status(['Active', 'Inactive', 'Invited']),
    ],
  },
};

export function defaults(resource: Resource, refs: References): Record<string, string> {
  const base: Record<string, string> = {};
  for (const field of RECORDS[resource].fields) base[field.key] = field.options?.[0] ?? '';
  if (resource === 'events')
    Object.assign(base, {
      price: String(refs.settings.defaultPrice / 100),
      memberPrice: String(refs.settings.defaultPrice / 100),
      childPrice: '0',
      capacity: '100',
      memberAllocation: '0',
      booked: '0',
    });
  if (resource === 'bookings')
    Object.assign(base, {
      quantity: '1',
      visitDate: localDay(),
      status: 'Confirmed',
    });
  if (resource === 'visits') base.quantity = '1';
  if (resource === 'memberships') {
    const expiry = new Date(`${localDay()}T12:00:00Z`);
    expiry.setUTCFullYear(expiry.getUTCFullYear() + 1);
    Object.assign(base, { joinDate: localDay(), expiryDate: localDay(expiry) });
  }
  if (resource === 'users') Object.assign(base, { role: 'Staff', status: 'Invited' });
  if (resource === 'collections') base.catalogueTotal = '0';
  if (resource === 'categories') base.status = 'Active';
  return base;
}
