export type StaffRole = 'Admin' | 'Manager' | 'Staff';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: 'Active' | 'Inactive' | 'Invited';
  lastLogin: string | null;
}

export interface Asset {
  id: string;
  url: string;
  name: string;
  alt: string;
}

export interface StaffEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  startAt: string;
  endAt: string;
  location: string;
  price: number;
  memberPrice: number;
  childPrice: number;
  capacity: number;
  memberAllocation: number;
  booked: number;
  status: 'Draft' | 'Published' | 'Cancelled' | 'Completed';
  images: Asset[];
}

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredAt: string;
}

export interface StaffBooking {
  id: string;
  visitorId: string;
  eventId: string;
  visitDate: string;
  quantity: number;
  ticketType: 'General' | 'Member' | 'Child';
  total: number;
  payment: 'Pending' | 'Paid' | 'Free' | 'Refunded';
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
  checkedInAt: string | null;
}

export interface Membership {
  id: string;
  visitorId: string;
  type: 'Individual' | 'Joint' | 'Family';
  joinDate: string;
  expiryDate: string;
  payment: 'Pending' | 'Paid';
  price: number;
}

export interface StaffCollection {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  period: string;
  location: string;
  catalogueTotal: number;
  featured: boolean;
  status: 'Draft' | 'Published' | 'Archived';
  images: Asset[];
}

export interface StaffItem {
  id: string;
  name: string;
  collectionId: string;
  categoryId: string;
  period: string;
  date: string;
  origin: string;
  maker: string;
  description: string;
  location: string;
  accession: string;
  tags: string[];
  status: 'Draft' | 'Published' | 'Archived';
  images: Asset[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived';
}

export interface Visit {
  id: string;
  visitorId: string;
  bookingId: string | null;
  quantity: number;
  visitedAt: string;
}

export interface StaffNotification {
  id: string;
  title: string;
  href: string;
  createdAt: string;
  read: boolean;
}

export interface MuseumSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: Asset | null;
  timezone: 'Australia/Adelaide';
  currency: 'AUD';
  bookingNotifications: boolean;
  eventNotifications: boolean;
  membershipNotifications: boolean;
  defaultPrice: number;
  cancellationHours: number;
  individualPrice: number;
  jointPrice: number;
  familyPrice: number;
}

export interface StaffResources {
  events: StaffEvent;
  visitors: Visitor;
  bookings: StaffBooking;
  memberships: Membership;
  collections: StaffCollection;
  items: StaffItem;
  categories: Category;
  users: StaffUser;
  visits: Visit;
}

export type Resource = keyof StaffResources;
export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
export interface ListQuery {
  q?: string;
  status?: string;
  type?: string;
  role?: string;
  eventId?: string;
  visitorId?: string;
  categoryId?: string;
  collectionId?: string;
  period?: string;
  origin?: string;
  from?: string;
  to?: string;
  tab?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface References {
  events: StaffEvent[];
  visitors: Visitor[];
  categories: Category[];
  collections: StaffCollection[];
  memberships: Membership[];
  settings: MuseumSettings;
}

export interface Metric {
  label: string;
  value: number;
  previous: number;
  icon: string;
}
export interface Dashboard {
  metrics: Metric[];
  bookings: StaffBooking[];
  events: StaffEvent[];
  references: References;
}
export type ReportKind = 'visitors' | 'tickets' | 'memberships' | 'events' | 'collections';
export interface ReportRow {
  id: string;
  label: string;
  count: number;
  revenue: number;
  capacity?: number;
  attendance?: number;
  cancelled?: number;
  active?: number;
  expired?: number;
  pending?: number;
}
export interface StaffReport {
  rows: ReportRow[];
  total: number;
  revenue: number;
  label: string;
}
export interface SearchResult {
  id: string;
  label: string;
  kind: string;
  href: string;
}
