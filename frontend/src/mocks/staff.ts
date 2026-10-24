import { http, HttpResponse, delay } from 'msw';
import { collections, items, categories } from './data';
import { can } from '@/lib/staff/permissions';
import { localDay, membershipStatus } from '@/lib/staff/format';
import type {
  Asset,
  Category,
  Dashboard,
  Membership,
  MuseumSettings,
  References,
  Resource,
  StaffBooking,
  StaffCollection,
  StaffEvent,
  StaffItem,
  StaffNotification,
  StaffUser,
  Visit,
  Visitor,
} from '@/lib/staff/types';

interface MockState {
  events: StaffEvent[];
  visitors: Visitor[];
  bookings: StaffBooking[];
  memberships: Membership[];
  collections: StaffCollection[];
  items: StaffItem[];
  categories: Category[];
  users: StaffUser[];
  visits: Visit[];
  notifications: StaffNotification[];
  settings: MuseumSettings;
}

const STATE_KEY = 'hm-staff-demo-v1';
const SESSION_KEY = 'hm-staff-demo-session';
const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const day = (offset: number) => localDay(new Date(Date.now() + offset * 86400000));

function seed(): MockState {
  const users: StaffUser[] = [
    {
      id: 'admin',
      name: 'Sarah Mitchell',
      email: 'admin@heritage.example',
      phone: '',
      role: 'Admin',
      status: 'Active',
      lastLogin: null,
    },
    {
      id: 'manager',
      name: 'Naomi Vale',
      email: 'manager@heritage.example',
      phone: '',
      role: 'Manager',
      status: 'Active',
      lastLogin: null,
    },
    {
      id: 'staff',
      name: 'Dan Oyelaran',
      email: 'staff@heritage.example',
      phone: '',
      role: 'Staff',
      status: 'Active',
      lastLogin: null,
    },
  ];
  const visitors: Visitor[] = [
    {
      id: 'amara',
      name: 'Amara Okafor',
      email: 'amara@example.com',
      phone: '0400 123 456',
      address: 'Adelaide SA',
      registeredAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
    {
      id: 'judith',
      name: 'Judith Clarke',
      email: 'judith@example.com',
      phone: '0400 234 567',
      address: 'Norwood SA',
      registeredAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
    {
      id: 'priya',
      name: 'Priya Raman',
      email: 'priya@example.com',
      phone: '',
      address: '',
      registeredAt: now(),
    },
  ];
  const events: StaffEvent[] = [
    {
      id: 'beneath',
      title: 'Beneath the Lanthorn Fields',
      description:
        'Ninety-two objects from a single Iron Age hoard, shown together for the first time since their discovery.',
      type: 'Exhibition',
      startAt: `${day(-14)}T00:30:00Z`,
      endAt: `${day(60)}T06:30:00Z`,
      location: 'Exhibition Wing',
      price: 1600,
      memberPrice: 1200,
      childPrice: 800,
      capacity: 200,
      memberAllocation: 20,
      booked: 2,
      status: 'Published',
      images: [],
    },
    {
      id: 'twilight',
      title: 'Twilight at the Museum',
      description: 'After-hours access with curator talks and a late opening.',
      type: 'Special event',
      startAt: `${day(7)}T08:00:00Z`,
      endAt: `${day(7)}T10:30:00Z`,
      location: 'Great Hall',
      price: 1400,
      memberPrice: 1000,
      childPrice: 700,
      capacity: 120,
      memberAllocation: 15,
      booked: 3,
      status: 'Published',
      images: [],
    },
    {
      id: 'hoard-talk',
      title: 'Reading the Lanthorn Hoard',
      description: 'Dr Naomi Vale on what ninety-two buried objects tell us about belief.',
      type: 'Talk',
      startAt: `${day(12)}T02:30:00Z`,
      endAt: `${day(12)}T03:30:00Z`,
      location: 'Lecture Theatre',
      price: 0,
      memberPrice: 0,
      childPrice: 0,
      capacity: 40,
      memberAllocation: 5,
      booked: 0,
      status: 'Published',
      images: [],
    },
    {
      id: 'conservation',
      title: 'Inside the conservation studio',
      description: 'A closer look at the work behind the galleries.',
      type: 'Tour',
      startAt: `${day(21)}T00:30:00Z`,
      endAt: `${day(21)}T02:30:00Z`,
      location: 'Conservation Studio',
      price: 1000,
      memberPrice: 600,
      childPrice: 500,
      capacity: 30,
      memberAllocation: 4,
      booked: 0,
      status: 'Draft',
      images: [],
    },
  ];
  return {
    users,
    visitors,
    events,
    categories: categories.map((name, index) => ({
      id: `category-${index}`,
      name,
      description: '',
      status: 'Active',
    })),
    collections: collections.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      categoryId: `category-${categories.indexOf(c.category)}`,
      period: c.period,
      location: c.location,
      catalogueTotal: c.items,
      featured: ['ice-age', 'dinosaurs', 'lanthorn'].includes(c.id),
      status: 'Published',
      images: [],
    })),
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      collectionId: 'lanthorn',
      categoryId: 'category-2',
      period: item.period,
      date: item.date,
      origin: item.origin,
      maker: 'Unknown',
      description: item.description,
      location: item.location,
      accession: `HM-${item.id}`,
      tags: ['Iron Age'],
      status: 'Published',
      images: [],
    })),
    memberships: [
      {
        id: 'membership-judith',
        visitorId: 'judith',
        type: 'Individual',
        joinDate: day(-60),
        expiryDate: day(305),
        payment: 'Paid',
        price: 6000,
      },
    ],
    bookings: [
      {
        id: 'HM-1001',
        visitorId: 'amara',
        eventId: 'beneath',
        visitDate: day(1),
        quantity: 2,
        ticketType: 'General',
        total: 3200,
        payment: 'Paid',
        status: 'Confirmed',
        createdAt: now(),
        checkedInAt: null,
      },
      {
        id: 'HM-1002',
        visitorId: 'judith',
        eventId: 'twilight',
        visitDate: day(7),
        quantity: 3,
        ticketType: 'Member',
        total: 3000,
        payment: 'Paid',
        status: 'Confirmed',
        createdAt: now(),
        checkedInAt: null,
      },
    ],
    visits: [
      {
        id: 'visit-1',
        visitorId: 'priya',
        bookingId: null,
        quantity: 2,
        visitedAt: now(),
      },
      {
        id: 'visit-2',
        visitorId: 'amara',
        bookingId: null,
        quantity: 1,
        visitedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    notifications: [
      {
        id: 'welcome',
        title: 'The staff portal is ready to explore',
        href: '/staff',
        read: false,
        createdAt: now(),
      },
    ],
    settings: {
      name: 'Heritage Museum',
      address: 'Adelaide, South Australia',
      phone: '',
      email: 'hello@heritagemuseum.example',
      website: '',
      logo: null,
      timezone: 'Australia/Adelaide',
      currency: 'AUD',
      bookingNotifications: true,
      eventNotifications: true,
      membershipNotifications: true,
      defaultPrice: 1600,
      cancellationHours: 24,
      individualPrice: 6000,
      jointPrice: 10000,
      familyPrice: 14000,
    },
  };
}

let memory: MockState | undefined;
function state(): MockState {
  if (!memory) {
    try {
      const saved = localStorage.getItem(STATE_KEY);
      memory = saved ? (JSON.parse(saved) as MockState) : seed();
    } catch {
      memory = seed();
    }
  }
  return memory;
}

function persist() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state()));
  } catch {
    throw new Error('Demo storage is full or unavailable. Remove a large image and try again.');
  }
}

function session(): StaffUser | undefined {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
    if (!raw) return undefined;
    const stored = JSON.parse(raw) as { id: string; expires: number };
    if (stored.expires < Date.now()) return undefined;
    return state().users.find((u) => u.id === stored.id && u.status === 'Active');
  } catch {
    return undefined;
  }
}

function references(): References {
  const s = state();
  return {
    events: s.events,
    visitors: s.visitors,
    categories: s.categories,
    collections: s.collections,
    memberships: s.memberships,
    settings: s.settings,
  };
}

function notify(title: string, href: string) {
  if (href.startsWith('/staff/bookings') && !state().settings.bookingNotifications) return;
  if (href.startsWith('/staff/events') && !state().settings.eventNotifications) return;
  if (href.startsWith('/staff/memberships') && !state().settings.membershipNotifications) return;
  state().notifications.unshift({
    id: id(),
    title,
    href,
    read: false,
    createdAt: now(),
  });
}

function recalculate() {
  const s = state();
  for (const event of s.events)
    event.booked = s.bookings
      .filter((b) => b.eventId === event.id && b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.quantity, 0);
}

function quote(input: Partial<StaffBooking>) {
  const s = state();
  const event = s.events.find((e) => e.id === input.eventId);
  if (!event || event.status !== 'Published' || event.endAt < now())
    throw new Error('Choose a published event that has not ended.');
  const quantity = Number(input.quantity);
  if (!Number.isInteger(quantity) || quantity < 1)
    throw new Error('Ticket quantity must be a positive whole number.');
  const previous = s.bookings.find(
    (b) => b.id === input.id && b.eventId === event.id && b.status !== 'Cancelled',
  );
  const remaining = event.capacity - event.booked + (previous?.quantity ?? 0);
  if (quantity > remaining) throw new Error(`Only ${remaining} places remain for this event.`);
  const activeMember = s.memberships.some(
    (m) => m.visitorId === input.visitorId && membershipStatus(m) === 'Active',
  );
  if (input.ticketType === 'Member' && !activeMember)
    throw new Error('This visitor needs an active membership for member tickets.');
  if (input.ticketType !== 'Member' && Date.parse(event.startAt) - Date.now() > 48 * 3600000) {
    const memberBooked = s.bookings
      .filter(
        (b) =>
          b.id !== input.id &&
          b.eventId === event.id &&
          b.ticketType === 'Member' &&
          b.status !== 'Cancelled',
      )
      .reduce((n, b) => n + b.quantity, 0);
    if (quantity > remaining - Math.max(0, event.memberAllocation - memberBooked))
      throw new Error('These places are currently reserved for members.');
  }
  if (
    !input.visitDate ||
    input.visitDate < localDay(event.startAt) ||
    input.visitDate > localDay(event.endAt) ||
    input.visitDate < day(0)
  )
    throw new Error('Choose a visit date within the event dates, today or later.');
  const price =
    input.ticketType === 'Member'
      ? event.memberPrice
      : input.ticketType === 'Child'
        ? event.childPrice
        : event.price;
  return { total: quantity * price, remaining };
}

function validate(resource: Resource, row: Record<string, unknown>) {
  const required: Partial<Record<Resource, string[]>> = {
    events: ['title', 'description', 'type', 'startAt', 'endAt', 'location'],
    visitors: ['name', 'email'],
    memberships: ['visitorId', 'type', 'joinDate', 'expiryDate'],
    collections: ['name', 'categoryId'],
    items: ['name', 'collectionId', 'categoryId'],
    categories: ['name'],
    users: ['name', 'email', 'role'],
  };
  for (const key of required[resource] ?? [])
    if (!String(row[key] ?? '').trim())
      throw new Error(`${key.replace(/([A-Z])/g, ' $1')} is required.`);
  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row.email)))
    throw new Error('Please enter a valid email address.');
  if (resource === 'events') {
    if (String(row.endAt) <= String(row.startAt))
      throw new Error('End time must be after start time.');
    if (
      !Number.isInteger(row.capacity) ||
      Number(row.capacity) <= 0 ||
      Number(row.capacity) < Number(row.booked ?? 0)
    )
      throw new Error(
        'Capacity must be a whole number above zero and cannot be below the booked count.',
      );
    if (Number(row.memberAllocation) < 0 || Number(row.memberAllocation) > Number(row.capacity))
      throw new Error('Member allocation must be between zero and capacity.');
    if (
      ['price', 'memberPrice', 'childPrice'].some(
        (key) => !Number.isInteger(row[key]) || Number(row[key]) < 0,
      )
    )
      throw new Error('Ticket prices must be zero or greater.');
  }
  if (resource === 'memberships' && String(row.expiryDate) < String(row.joinDate))
    throw new Error('Expiry date must be on or after the join date.');
  if (resource === 'users' && !['Admin', 'Manager', 'Staff'].includes(String(row.role)))
    throw new Error('Choose Admin, Manager or Staff.');
  if (
    (resource === 'users' || resource === 'visitors') &&
    state()[resource].some(
      (r) => r.id !== row.id && r.email.toLowerCase() === String(row.email).toLowerCase(),
    )
  )
    throw new Error('A record with this email already exists.');
}

function list(resource: Resource, url: URL) {
  const s = state();
  const params = url.searchParams;
  let rows: Record<string, unknown>[] = s[resource].map((row) => ({ ...row }));
  if (resource === 'memberships')
    rows = rows.map((row) => ({
      ...row,
      status: membershipStatus(row as unknown as Membership),
      name: s.visitors.find((v) => v.id === row.visitorId)?.name ?? '',
    }));
  const q = (params.get('q') ?? '').toLowerCase();
  rows = rows.filter((row) => {
    const linked = `${s.visitors.find((v) => v.id === row.visitorId)?.name ?? ''} ${s.events.find((e) => e.id === row.eventId)?.title ?? ''}`;
    return `${Object.values(row)
      .filter((v) => typeof v !== 'object')
      .join(' ')} ${linked}`
      .toLowerCase()
      .includes(q);
  });
  for (const key of [
    'status',
    'type',
    'role',
    'eventId',
    'visitorId',
    'categoryId',
    'collectionId',
    'period',
    'origin',
  ])
    if (params.get(key))
      rows = rows.filter((row) =>
        ['period', 'origin'].includes(key)
          ? String(row[key]).toLowerCase().includes(params.get(key)!.toLowerCase())
          : row[key] === params.get(key),
      );
  rows = rows.filter((row) => {
    const value = String(
      row.visitDate ?? row.joinDate ?? row.startAt ?? row.visitedAt ?? row.createdAt ?? '',
    );
    const rowDay = value ? localDay(value) : '';
    if (
      params.get('from') &&
      (resource === 'events' ? localDay(String(row.endAt)) : rowDay) < params.get('from')!
    )
      return false;
    if (params.get('to') && rowDay > params.get('to')!) return false;
    const tab = params.get('tab');
    if (tab === 'today') return rowDay === day(0);
    if (tab === 'upcoming') return String(row.endAt ?? value) >= (row.endAt ? now() : day(0));
    if (tab === 'past') return String(row.endAt ?? value) < (row.endAt ? now() : day(0));
    return true;
  });
  const key = params.get('sort') ?? 'name';
  rows.sort(
    (a, b) =>
      (typeof a[key] === 'number' && typeof b[key] === 'number'
        ? Number(a[key]) - Number(b[key])
        : String(a[key] ?? '').localeCompare(String(b[key] ?? ''), 'en-AU', {
            numeric: true,
          })) * (params.get('direction') === 'desc' ? -1 : 1),
  );
  const pageSize = Math.max(1, Math.min(200, Number(params.get('pageSize')) || 10));
  const page = Math.max(1, Number(params.get('page')) || 1);
  return {
    items: rows.slice((page - 1) * pageSize, page * pageSize),
    total: rows.length,
    page,
    pageSize,
  };
}

function dashboard(): Dashboard {
  const s = state();
  const month = day(0).slice(0, 7);
  const previousDate = new Date();
  previousDate.setUTCDate(1);
  previousDate.setUTCMonth(previousDate.getUTCMonth() - 1);
  const previousMonth = localDay(previousDate).slice(0, 7);
  return {
    metrics: [
      {
        label: 'Recorded visits',
        value: s.visits
          .filter((v) => localDay(v.visitedAt).startsWith(month))
          .reduce((n, v) => n + v.quantity, 0),
        previous: s.visits
          .filter((v) => localDay(v.visitedAt).startsWith(previousMonth))
          .reduce((n, v) => n + v.quantity, 0),
        icon: 'users',
      },
      {
        label: 'Tickets booked',
        value: s.bookings
          .filter((b) => b.status !== 'Cancelled' && localDay(b.createdAt).startsWith(month))
          .reduce((n, b) => n + b.quantity, 0),
        previous: s.bookings
          .filter(
            (b) => b.status !== 'Cancelled' && localDay(b.createdAt).startsWith(previousMonth),
          )
          .reduce((n, b) => n + b.quantity, 0),
        icon: 'ticket',
      },
      {
        label: 'Active members',
        value: s.memberships.filter((m) => membershipStatus(m) === 'Active').length,
        previous: s.memberships.filter(
          (m) =>
            m.payment === 'Paid' && m.joinDate <= `${month}-01` && m.expiryDate >= `${month}-01`,
        ).length,
        icon: 'award',
      },
      {
        label: 'Upcoming events',
        value: s.events.filter((e) => e.status === 'Published' && e.endAt >= now()).length,
        previous: 0,
        icon: 'calendar-days',
      },
    ],
    bookings: [...s.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    events: s.events
      .filter((e) => e.status === 'Published' && e.endAt >= now())
      .sort((a, b) => a.startAt.localeCompare(b.startAt))
      .slice(0, 4),
    references: references(),
  };
}

export const staffHandlers = [
  http.all(/\/api\/staff(?:\/|$)/, async ({ request }) => {
    await delay(180);
    try {
      const s = state();
      const url = new URL(request.url);
      const path = url.pathname.split('/api/staff')[1] ?? '';
      const method = request.method;
      if (path === '/auth/session') return HttpResponse.json(session() ?? null);
      if (path === '/auth/login') {
        const body = (await request.json()) as {
          email: string;
          password: string;
          remember: boolean;
        };
        const user = s.users.find(
          (u) => u.email.toLowerCase() === body.email.toLowerCase() && u.status === 'Active',
        );
        if (!user || body.password !== 'museum-demo')
          return HttpResponse.json({ message: 'Check your email and password.' }, { status: 401 });
        user.lastLogin = now();
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
        (body.remember ? localStorage : sessionStorage).setItem(
          SESSION_KEY,
          JSON.stringify({
            id: user.id,
            expires: Date.now() + (body.remember ? 30 : 1) * 86400000,
          }),
        );
        persist();
        return HttpResponse.json(user);
      }
      if (path === '/auth/logout') {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
        return new HttpResponse(null, { status: 204 });
      }
      if (path === '/auth/forgot-password') return new HttpResponse(null, { status: 204 });
      if (path === '/auth/reset-password' || path === '/auth/accept-invitation')
        return HttpResponse.json(
          {
            message:
              'This demo cannot verify emailed links. Connect the authentication API to complete this flow.',
          },
          { status: 400 },
        );
      const user = session();
      if (!user)
        return HttpResponse.json(
          { message: 'Please sign in to the staff portal.' },
          { status: 401 },
        );
      if (path === '/references') return HttpResponse.json(references());
      if (path === '/dashboard') return HttpResponse.json(dashboard());
      if (path === '/notifications') {
        for (const event of s.events.filter(
          (e) =>
            e.status === 'Published' &&
            e.endAt >= now() &&
            e.capacity - e.booked <= Math.max(1, Math.floor(e.capacity * 0.1)),
        )) {
          if (
            s.settings.eventNotifications &&
            !s.notifications.some((n) => n.id === `capacity-${event.id}`)
          )
            s.notifications.unshift({
              id: `capacity-${event.id}`,
              title: `${event.title} is nearly at capacity`,
              href: `/staff/events/${event.id}`,
              read: false,
              createdAt: now(),
            });
        }
        for (const membership of s.memberships.filter(
          (m) => membershipStatus(m) === 'Active' && m.expiryDate <= day(7),
        )) {
          if (
            s.settings.membershipNotifications &&
            !s.notifications.some((n) => n.id === `expiry-${membership.id}`)
          )
            s.notifications.unshift({
              id: `expiry-${membership.id}`,
              title: `Membership for ${s.visitors.find((v) => v.id === membership.visitorId)?.name ?? 'a visitor'} expires within seven days`,
              href: `/staff/memberships/${membership.id}`,
              read: false,
              createdAt: now(),
            });
        }
        persist();
        return HttpResponse.json(
          s.notifications.filter(
            (n) => user.role === 'Admin' || !n.href.startsWith('/staff/users'),
          ),
        );
      }
      if (/^\/notifications\/[^/]+\/read$/.test(path)) {
        const notification = s.notifications.find((n) => n.id === path.split('/')[2]);
        if (notification) notification.read = true;
        persist();
        return new HttpResponse(null, { status: 204 });
      }
      if (path === '/settings') {
        if (method === 'PATCH') {
          if (!can(user.role, 'contacts'))
            return HttpResponse.json(
              {
                message: 'Only administrators and managers can change these settings.',
              },
              { status: 403 },
            );
          const body = (await request.json()) as Partial<MuseumSettings>;
          const allowed =
            user.role === 'Admin'
              ? body
              : Object.fromEntries(
                  Object.entries(body).filter(([key]) =>
                    [
                      'name',
                      'address',
                      'phone',
                      'email',
                      'website',
                      'logo',
                      'bookingNotifications',
                      'eventNotifications',
                      'membershipNotifications',
                    ].includes(key),
                  ),
                );
          Object.assign(s.settings, allowed, {
            timezone: 'Australia/Adelaide',
            currency: 'AUD',
          });
          persist();
        }
        return HttpResponse.json(s.settings);
      }
      if (path === '/uploads') {
        const body = await request.formData();
        const file = body.get('file');
        if (
          !(file instanceof File) ||
          !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
          file.size > 2 * 1024 * 1024
        )
          throw new Error('Choose a JPG, PNG or WebP image up to 2 MB.');
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        return HttpResponse.json({
          id: id(),
          url: dataUrl,
          name: file.name,
          alt: '',
        } satisfies Asset);
      }
      if (path === '/search') {
        const q = (url.searchParams.get('q') ?? '').toLowerCase();
        const results: {
          id: string;
          label: string;
          kind: string;
          href: string;
        }[] = [];
        for (const resource of [
          'visitors',
          'events',
          'bookings',
          'memberships',
          'collections',
          'items',
          ...(user.role === 'Admin' ? ['users'] : []),
        ] as Resource[]) {
          for (const row of s[resource]) {
            const r = row as unknown as Record<string, unknown>;
            const label = String(
              r.name ?? r.title ?? s.visitors.find((v) => v.id === r.visitorId)?.name ?? r.id,
            );
            if (`${label} ${r.email ?? ''} ${r.id}`.toLowerCase().includes(q))
              results.push({
                id: row.id,
                label,
                kind: resource,
                href: `/staff/${resource}/${row.id}`,
              });
          }
        }
        return HttpResponse.json(q ? results.slice(0, 15) : []);
      }
      if (path.startsWith('/reports/')) {
        const kind = path.split('/')[2];
        const from = url.searchParams.get('from') ?? '';
        const to = url.searchParams.get('to') ?? '9999';
        const within = (value: string) => localDay(value) >= from && localDay(value) <= to;
        const rows: {
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
        }[] = [];
        if (kind === 'visitors') {
          for (const visit of s.visits.filter((v) => within(v.visitedAt))) {
            const label = localDay(visit.visitedAt);
            const row = rows.find((r) => r.id === label);
            if (row) row.count += visit.quantity;
            else
              rows.push({
                id: label,
                label,
                count: visit.quantity,
                revenue: 0,
              });
          }
        } else if (kind === 'collections') {
          if (url.searchParams.get('groupBy') === 'period') {
            for (const item of s.items.filter((i) => i.status !== 'Archived')) {
              const label = item.period || 'Unspecified';
              const row = rows.find((r) => r.label === label);
              if (row) row.count++;
              else rows.push({ id: label, label, count: 1, revenue: 0 });
            }
          } else
            for (const category of s.categories)
              rows.push({
                id: category.id,
                label: category.name,
                count: s.items.filter(
                  (i) => i.categoryId === category.id && i.status !== 'Archived',
                ).length,
                revenue: 0,
              });
        } else if (kind === 'memberships') {
          for (const type of ['Individual', 'Joint', 'Family']) {
            const members = s.memberships.filter((m) => m.type === type && within(m.joinDate));
            rows.push({
              id: type,
              label: type,
              count: members.length,
              revenue: members.filter((m) => m.payment === 'Paid').reduce((n, m) => n + m.price, 0),
              active: members.filter((m) => membershipStatus(m) === 'Active').length,
              expired: members.filter((m) => membershipStatus(m) === 'Expired').length,
              pending: members.filter((m) => membershipStatus(m) === 'Pending').length,
            });
          }
        } else {
          for (const event of s.events) {
            const booked = s.bookings.filter((b) => b.eventId === event.id && within(b.createdAt));
            rows.push({
              id: event.id,
              label: event.title,
              count: booked
                .filter((b) => b.status !== 'Cancelled')
                .reduce((n, b) => n + b.quantity, 0),
              revenue: booked.filter((b) => b.payment === 'Paid').reduce((n, b) => n + b.total, 0),
              capacity: event.capacity,
              attendance: booked.filter((b) => b.checkedInAt).reduce((n, b) => n + b.quantity, 0),
              cancelled: booked
                .filter((b) => b.status === 'Cancelled')
                .reduce((n, b) => n + b.quantity, 0),
            });
          }
        }
        return HttpResponse.json({
          rows,
          total: rows.reduce((n, r) => n + r.count, 0),
          revenue: rows.reduce((n, r) => n + r.revenue, 0),
          label:
            kind === 'visitors'
              ? 'Recorded visits'
              : kind === 'collections'
                ? 'Digitised artefacts'
                : kind === 'memberships'
                  ? 'Memberships joined'
                  : 'Tickets booked',
        });
      }
      if (path === '/bookings/quote')
        return HttpResponse.json(quote((await request.json()) as Partial<StaffBooking>));
      const [, resourceName, recordId, action] = path.split('/');
      if (
        !resourceName ||
        ![
          'events',
          'visitors',
          'bookings',
          'memberships',
          'collections',
          'items',
          'categories',
          'users',
          'visits',
        ].includes(resourceName)
      )
        return new HttpResponse(null, { status: 404 });
      const resource = resourceName as Resource;
      if (resource === 'users' && user.role !== 'Admin')
        return HttpResponse.json(
          { message: 'Only administrators can manage staff accounts.' },
          { status: 403 },
        );
      if (method === 'GET' && !recordId) return HttpResponse.json(list(resource, url));
      const rows = s[resource] as unknown as Record<string, unknown>[];
      const existing = rows.find((row) => row.id === recordId);
      if (recordId && !existing)
        return HttpResponse.json({ message: 'This record could not be found.' }, { status: 404 });
      if (method === 'GET') return HttpResponse.json(existing);
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      if (action && existing) {
        if (action === 'archive') {
          if (!can(user.role, 'archive'))
            return HttpResponse.json(
              { message: 'You do not have permission to archive records.' },
              { status: 403 },
            );
          if (
            resource === 'categories' &&
            (s.items.some((i) => i.categoryId === recordId && i.status !== 'Archived') ||
              s.collections.some((c) => c.categoryId === recordId && c.status !== 'Archived'))
          )
            throw new Error(
              'Reassign the active collections and artefacts before archiving this category.',
            );
          existing.status = 'Archived';
        } else if (resource === 'events' && action === 'cancel') {
          if (!can(user.role, 'archive'))
            return HttpResponse.json(
              {
                message: 'Only administrators and managers can cancel events.',
              },
              { status: 403 },
            );
          if (!String(body.reason ?? '').trim())
            throw new Error('A cancellation reason is required.');
          existing.status = 'Cancelled';
          for (const booking of s.bookings.filter((b) => b.eventId === recordId)) {
            booking.status = 'Cancelled';
            if (booking.payment === 'Paid') booking.payment = 'Refunded';
          }
          notify(
            `${existing.title} has been cancelled. Demo refunds were recorded.`,
            `/staff/events/${recordId}`,
          );
        } else if (resource === 'bookings' && action === 'cancel') {
          existing.status = 'Cancelled';
        } else if (resource === 'bookings' && action === 'refund') {
          if (!can(user.role, 'refund'))
            return HttpResponse.json(
              {
                message: 'Only administrators and managers can record refunds.',
              },
              { status: 403 },
            );
          if (existing.payment !== 'Paid') throw new Error('Only a paid booking can be refunded.');
          existing.payment = 'Refunded';
          existing.status = 'Cancelled';
        } else if (resource === 'bookings' && action === 'check-in') {
          if (existing.status !== 'Confirmed' || existing.checkedInAt)
            throw new Error('This booking cannot be checked in, or has already been checked in.');
          if (existing.visitDate !== day(0))
            throw new Error('Check-in is available on the booked visit date.');
          existing.checkedInAt = now();
          s.visits.push({
            id: id(),
            visitorId: String(existing.visitorId),
            bookingId: String(existing.id),
            quantity: Number(existing.quantity),
            visitedAt: now(),
          });
        } else if (resource === 'users' && action === 'invite') {
          existing.status = 'Invited';
          notify(`Invitation requested for ${existing.name}`, `/staff/users/${recordId}`);
        } else throw new Error('This action is not available.');
        recalculate();
        persist();
        return HttpResponse.json(existing);
      }
      const row: Record<string, unknown> = {
        ...existing,
        ...body,
        id:
          existing?.id ??
          (resource === 'bookings' ? `HM-${Date.now().toString().slice(-8)}` : id()),
      };
      if (resource === 'events' && row.status === 'Cancelled' && existing?.status !== 'Cancelled')
        throw new Error('Use the Cancel event action to handle existing bookings.');
      if (
        row.status === 'Archived' &&
        existing?.status !== 'Archived' &&
        !can(user.role, 'archive')
      )
        return HttpResponse.json(
          { message: 'Only administrators and managers can archive records.' },
          { status: 403 },
        );
      if (
        resource === 'users' &&
        existing?.role === 'Admin' &&
        (row.role !== 'Admin' || row.status !== 'Active') &&
        s.users.filter((u) => u.role === 'Admin' && u.status === 'Active').length <= 1
      )
        throw new Error('Keep at least one active administrator.');
      if (resource === 'bookings') {
        if (existing?.checkedInAt || existing?.status === 'Cancelled')
          throw new Error('A checked-in or cancelled booking cannot be edited.');
        const calculation = quote(row as Partial<StaffBooking>);
        if (!s.visitors.some((v) => v.id === row.visitorId)) throw new Error('Select a visitor.');
        Object.assign(row, {
          total: calculation.total,
          createdAt: existing?.createdAt ?? now(),
          checkedInAt: existing?.checkedInAt ?? null,
          payment: calculation.total === 0 ? 'Free' : row.payment,
        });
        notify(`Booking ${row.id} saved`, `/staff/bookings/${row.id}`);
      }
      if (resource === 'visitors') row.registeredAt = existing?.registeredAt ?? now();
      if (resource === 'visits') {
        if (!Number.isInteger(row.quantity) || Number(row.quantity) < 1)
          throw new Error('Visit quantity must be a positive whole number.');
        row.visitedAt = now();
        row.bookingId = null;
      }
      if (resource === 'users') {
        row.lastLogin = existing?.lastLogin ?? null;
        if (!existing) notify(`Staff account created for ${row.name}`, `/staff/users/${row.id}`);
      }
      if (resource === 'memberships') {
        const key = `${String(row.type).toLowerCase()}Price` as
          'individualPrice' | 'jointPrice' | 'familyPrice';
        row.price = existing?.price ?? s.settings[key];
      }
      validate(resource, row);
      if (existing) Object.assign(existing, row);
      else rows.push(row);
      recalculate();
      persist();
      return HttpResponse.json(row, { status: existing ? 200 : 201 });
    } catch (error) {
      return HttpResponse.json(
        {
          message: error instanceof Error ? error.message : 'The demo request failed.',
        },
        { status: 422 },
      );
    }
  }),
];
