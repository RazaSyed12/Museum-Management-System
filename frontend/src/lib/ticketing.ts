/**
 * Shared logic for the ticket-purchase flow (/tickets/[eventId]/...).
 * Not part of lib/api/* — Ticketing has no documented endpoint yet
 * (backend/API-REQUIREMENTS.md lists it under "Later"), so there's no
 * real contract to mock against. State travels between the flow's four
 * pages as query params rather than a client store, the same way
 * /reset-password already carries its email — bookmarkable, and nothing
 * is lost on a refresh.
 */
import type { MuseumEvent } from '@/lib/api/events';
import type { Allocation, BookingQuote } from '@/lib/api/bookings';
import { DEFAULT_CURRENCY, formatMoney, type CurrencyCode } from '@/lib/currency';

export interface TicketQty {
  general: number;
  member: number;
  child: number;
  /** Stable identity of the real allocation selected, independent of its category or display order. */
  allocationId?: string;
}

type TicketCategory = 'general' | 'member' | 'child';

export interface TicketType {
  key: TicketCategory;
  name: string;
  description: string;
  price: number;
  /** Only purchasable by a signed-in member. */
  memberOnly?: boolean;
  /** Real backend only: the ticket type (allocation) this row books. */
  allocationId?: string;
  /** Real backend only: tickets still unreserved. */
  available?: number;
}

export function ticketTypesFor(event: MuseumEvent, allocations?: Allocation[]): TicketType[] {
  if (allocations) return ticketTypesFromAllocations(event, allocations);
  return [
    { key: 'general', name: 'General admission', description: 'Adult, 18 and over', price: event.priceValue },
    { key: 'member', name: 'Member admission', description: 'Requires an active membership', price: event.memberPrice ?? event.priceValue, memberOnly: true },
    { key: 'child', name: 'Child or student', description: 'Under 18, or with a valid student card', price: event.childPrice ?? event.priceValue },
  ];
}

/** Prices shown here match allocation price categories; the server confirms discounts and fees. */
function ticketTypesFromAllocations(event: MuseumEvent, allocations: Allocation[]): TicketType[] {
  return allocations.map((allocation) => {
    const key: TicketCategory = allocation.membersOnly ? 'member' : allocation.kind === 'child' ? 'child' : 'general';
    return {
      key,
      name: allocation.name,
      description: key === 'member' ? 'Requires an active membership' : key === 'child' ? 'Child or student entry' : 'Standard entry',
      price: key === 'member' ? event.memberPrice ?? event.priceValue : key === 'child' ? event.childPrice ?? event.priceValue : event.priceValue,
      memberOnly: allocation.membersOnly,
      allocationId: allocation.id,
      available: allocation.available,
    };
  });
}

/** The one ticket type (and count) a real booking is made for — the backend
 *  books one type per order. undefined when nothing is selected, or when more
 *  than one type is (the select screen prevents that in real mode). */
export function selectedBooking(qty: TicketQty, types: TicketType[]): { type: TicketType; quantity: number } | undefined {
  const categories = (['general', 'member', 'child'] as const).filter((key) => qty[key] > 0);
  if (categories.length !== 1) return undefined;
  const type = types.find((t) => t.key === categories[0] && (!qty.allocationId || t.allocationId === qty.allocationId));
  return type?.allocationId ? { type, quantity: qty[type.key] } : undefined;
}

/** Summary rows from the server's quote or booking totals (AUD). */
export function quoteLines(
  q: { subtotal: number; discountAmount: number; taxAmount: number; serviceFee: number; discountPercent?: number },
  currency: CurrencyCode = DEFAULT_CURRENCY,
) {
  const lines: Array<{ label: string; value: string; strong?: boolean; tone?: 'discount'; icon?: string }> = [
    { label: 'Subtotal', value: money(q.subtotal, currency), strong: true },
  ];
  if (q.discountAmount > 0) {
    lines.push({
      label: q.discountPercent ? `Member discount (${q.discountPercent}%)` : 'Member discount',
      value: `−${money(q.discountAmount, currency)}`,
      tone: 'discount',
      icon: 'award',
    });
  }
  lines.push({ label: 'Tax', value: money(q.taxAmount, currency) }, { label: 'Service fee', value: money(q.serviceFee, currency) });
  return lines;
}

export type { BookingQuote };

export interface Order {
  qty: TicketQty;
  sub: number;
  fee: number;
  vat: number;
  discount: number;
  total: number;
  count: number;
}

/** Member discount: 2 units off every general ticket (in whichever
 *  currency is active), same rule the design system's prototype used —
 *  a flat, visible incentive rather than a per-event negotiated rate the
 *  fixture has no field for. */
export function computeOrder(qty: TicketQty, types: TicketType[], isMember: boolean): Order {
  const real = types.some((type) => type.allocationId);
  const selection = real ? selectedBooking(qty, types) : undefined;
  const sub = real ? (selection ? selection.quantity * selection.type.price : 0)
    : types.reduce((total, type) => total + qty[type.key] * type.price, 0);
  const fee = sub ? 1.5 : 0;
  const vat = Math.round(sub * 0.05 * 100) / 100;
  const discount = !real && isMember && qty.general ? Math.round(qty.general * 2 * 100) / 100 : 0;
  const total = Math.round((sub + fee + vat - discount) * 100) / 100;
  const count = real ? selection?.quantity ?? 0 : qty.general + qty.member + qty.child;
  return { qty, sub, fee, vat, discount, total, count };
}

export function money(n: number, currency: CurrencyCode = DEFAULT_CURRENCY): string {
  return formatMoney(n, currency);
}

export type SearchParamsLike = URLSearchParams | Record<string, string | string[] | undefined>;

function paramValue(params: SearchParamsLike, key: string): string | undefined {
  const raw = params instanceof URLSearchParams ? params.get(key) : params[key];
  return Array.isArray(raw) ? raw[0] : raw ?? undefined;
}

export function qtyFromParams(params: SearchParamsLike): TicketQty {
  const get = (key: string): number => {
    const n = Number(paramValue(params, key));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  };
  const allocationId = paramValue(params, 'allocation')?.toLowerCase();
  return { general: get('general'), member: get('member'), child: get('child'), ...(allocationId ? { allocationId } : {}) };
}

export interface Contact {
  name: string;
  email: string;
  phone?: string;
}

export function contactFromParams(params: SearchParamsLike): Contact {
  return { name: paramValue(params, 'name') ?? '', email: paramValue(params, 'email') ?? '', phone: paramValue(params, 'phone') };
}

export function qtyToSearchParams(qty: TicketQty): URLSearchParams {
  const params = new URLSearchParams();
  if (qty.general) params.set('general', String(qty.general));
  if (qty.member) params.set('member', String(qty.member));
  if (qty.child) params.set('child', String(qty.child));
  if (qty.allocationId) params.set('allocation', qty.allocationId);
  return params;
}

/** Structurally matches components/tickets/Summary's SummaryLine — kept
 *  duck-typed here rather than importing that type, so this file (plain
 *  order math) doesn't depend on a component. */
export function ticketTypeLines(qty: TicketQty, types: TicketType[], currency: CurrencyCode = DEFAULT_CURRENCY) {
  const selection = selectedBooking(qty, types);
  return types.map((type) => {
    const quantity = type.allocationId ? (selection?.type.allocationId === type.allocationId ? selection.quantity : 0) : qty[type.key];
    return { label: `${type.name} × ${quantity}`, value: money(quantity * type.price, currency), muted: !quantity };
  });
}

export function orderBreakdownLines(order: Order, currency: CurrencyCode = DEFAULT_CURRENCY) {
  const lines: Array<{ label: string; value: string; strong?: boolean; tone?: 'discount'; icon?: string }> = [
    { label: 'Subtotal', value: money(order.sub, currency), strong: true },
    { label: 'Service charge', value: money(order.fee, currency) },
    { label: 'VAT (5%)', value: money(order.vat, currency) },
  ];
  if (order.discount) lines.push({ label: 'Member discount', value: `−${money(order.discount, currency)}`, tone: 'discount', icon: 'award' });
  return lines;
}

export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const n = Math.floor(10000 + Math.random() * 90000);
  return `HM-${year}-${n}`;
}
