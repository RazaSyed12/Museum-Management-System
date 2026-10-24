import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff } from '../middleware/auth';

// Paths are written in full (/bookings/..., /me/bookings, /admin/bookings, /events/:id/bookings),
// so this router is mounted without a prefix. Paying lives in routes/payments.ts.
const router = Router();

const HOLD_MINUTES = 15; // keep in step with the 15 minutes inside the SQL functions

const BOOKING_SELECT =
  'booking_id, user_id, event_id, booking_status, quantity, subtotal, discount_amount, tax_amount, service_fee, total_amount, booked_at, ' +
  'events(event_id, name, start_at, end_at), ' +
  'tickets(ticket_id, allocation_id, ticket_status, price, ticket_code), ' +
  'payments(payment_id, provider, method, payment_status, amount, currency, transaction_reference, failure_code, failure_message, paid_at, refunded_at, created_at)';

function send(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}
const badRequest = (res: Response, message: string) => send(res, 400, 'validation_error', message);
const serverError = (res: Response, message: string) => send(res, 500, 'server_error', message);
const notFound = (res: Response, what: string) => send(res, 404, 'not_found', `${what} not found.`);

// Turns the database functions' error words into proper replies.
function rpcFailure(res: Response, error: { message?: string; details?: string | null }, fallback: string) {
  switch (error.message) {
    case 'invalid_quantity':
      return badRequest(res, 'Quantity must be a whole number from 1 to 10.');
    case 'allocation_not_found':
      return notFound(res, 'Ticket type');
    case 'event_not_bookable':
      return send(res, 409, 'event_not_bookable', 'This event is not open for booking.');
    case 'members_only':
      return send(res, 403, 'members_only', 'This ticket type is for members only.');
    case 'not_enough_tickets': {
      const left = Number(error.details ?? 0);
      return send(res, 409, 'sold_out', left > 0 ? `Only ${left} tickets are left.` : 'This ticket type is sold out.');
    }
    case 'booking_not_found':
      return notFound(res, 'Booking');
    case 'cannot_cancel':
      return send(res, 409, 'cannot_cancel', 'This event has already started, so the booking can no longer be cancelled.');
    case 'account_not_active':
      return send(res, 403, 'forbidden', 'Your account cannot make bookings.');
    case 'not_signed_in':
      return send(res, 401, 'unauthorized', 'Sign in required.');
    default:
      return serverError(res, fallback);
  }
}

// Same shape as the database functions return: the event is called "event", plus expires_at for pending bookings.
function shapeBooking(row: any) {
  const { events, ...rest } = row;
  const expires_at =
    rest.booking_status === 'pending'
      ? new Date(new Date(rest.booked_at).getTime() + HOLD_MINUTES * 60000).toISOString()
      : null;
  return { ...rest, event: events ?? null, expires_at };
}

const idSchema = z.guid();

const quoteSchema = z.object({
  allocation_id: z.guid(),
  quantity: z.number().int().min(1).max(10),
});

// POST /bookings/quote — signed in. The price breakdown; nothing is reserved.
router.post('/bookings/quote', requireAuth, async (req: Request, res: Response) => {
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token).rpc('quote_booking', {
    p_allocation_id: parsed.data.allocation_id,
    p_quantity: parsed.data.quantity,
  });
  if (error) return rpcFailure(res, error, 'Could not calculate the price.');
  return res.json({ quote: data });
});

// POST /bookings — signed in. Reserves the seats. Free events are confirmed at once; otherwise the
// booking is "pending" and holds the seats for 15 minutes until it is paid.
router.post('/bookings', requireAuth, async (req: Request, res: Response) => {
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token).rpc('create_booking', {
    p_allocation_id: parsed.data.allocation_id,
    p_quantity: parsed.data.quantity,
  });
  if (error) return rpcFailure(res, error, 'Could not create the booking.');
  return res.status(201).json({ booking: data });
});

// POST /bookings/:id/cancel — the owner (or staff). Frees the seats; a paid booking is refunded.
router.post('/bookings/:id/cancel', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Booking');
  const { data, error } = await userClient(req.auth!.token).rpc('cancel_booking', { p_booking_id: id });
  if (error) return rpcFailure(res, error, 'Could not cancel the booking.');
  return res.json({ booking: data });
});

const listSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'expired']).optional(),
  event_id: z.guid().optional(),
  user_id: z.guid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Shared by the three list endpoints. "fixed" values cannot be overridden from the query string.
async function listBookings(req: Request, res: Response, fixed: { user_id?: string; event_id?: string }) {
  const parsed = listSchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const f = { ...parsed.data, ...fixed };

  const db = userClient(req.auth!.token);
  await db.rpc('release_expired_holds'); // so statuses are up to date

  let query = db
    .from('bookings')
    .select(BOOKING_SELECT, { count: 'exact' })
    .order('booked_at', { ascending: false })
    .range(f.offset, f.offset + f.limit - 1);
  if (f.status) query = query.eq('booking_status', f.status);
  if (f.event_id) query = query.eq('event_id', f.event_id);
  if (f.user_id) query = query.eq('user_id', f.user_id);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load the bookings.');
  return res.json({ bookings: (data ?? []).map(shapeBooking), total: count ?? 0, limit: f.limit, offset: f.offset });
}

// GET /me/bookings — signed in. The caller's own bookings (?status=, ?limit=, ?offset=).
router.get('/me/bookings', requireAuth, (req: Request, res: Response) =>
  listBookings(req, res, { user_id: req.auth!.userId }),
);

// GET /admin/bookings — staff only. All bookings (?status=, ?event_id=, ?user_id=).
router.get('/admin/bookings', requireAuth, requireStaff, (req: Request, res: Response) => listBookings(req, res, {}));

// GET /events/:id/bookings — staff only. The bookings of one event.
router.get('/events/:id/bookings', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Event');
  const { data: event, error } = await userClient(req.auth!.token).from('events').select('event_id').eq('event_id', id).maybeSingle();
  if (error) return serverError(res, 'Could not load the event.');
  if (!event) return notFound(res, 'Event');
  return listBookings(req, res, { event_id: id });
});

// GET /bookings/:id — the owner or staff (the database hides other people's bookings).
router.get('/bookings/:id', requireAuth, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Booking');
  const db = userClient(req.auth!.token);
  await db.rpc('release_expired_holds');
  const { data, error } = await db.from('bookings').select(BOOKING_SELECT).eq('booking_id', id).maybeSingle();
  if (error) return serverError(res, 'Could not load the booking.');
  if (!data) return notFound(res, 'Booking');
  return res.json({ booking: shapeBooking(data) });
});

export default router;