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
import { DEFAULT_CURRENCY, formatMoney, type CurrencyCode } from '@/lib/currency';

export interface TicketQty {
  general: number;
  member: number;
  child: number;
}

export interface TicketType {
  key: keyof TicketQty;
  name: string;
  description: string;
  price: number;
  /** Only purchasable by a signed-in member. */
  memberOnly?: boolean;
}

export function ticketTypesFor(event: MuseumEvent): TicketType[] {
  return [
    { key: 'general', name: 'General admission', description: 'Adult, 18 and over', price: event.priceValue },
    { key: 'member', name: 'Member admission', description: 'Requires an active membership', price: event.memberPrice ?? event.priceValue, memberOnly: true },
    { key: 'child', name: 'Child or student', description: 'Under 18, or with a valid student card', price: event.childPrice ?? event.priceValue },
  ];
}

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
  const priceOf = (key: keyof TicketQty) => types.find((t) => t.key === key)!.price;
  const sub = qty.general * priceOf('general') + qty.member * priceOf('member') + qty.child * priceOf('child');
  const fee = sub ? 1.5 : 0;
  const vat = Math.round(sub * 0.05 * 100) / 100;
  const discount = isMember && qty.general ? Math.round(qty.general * 2 * 100) / 100 : 0;
  const total = Math.round((sub + fee + vat - discount) * 100) / 100;
  const count = qty.general + qty.member + qty.child;
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
  return { general: get('general'), member: get('member'), child: get('child') };
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
  return params;
}

/** Structurally matches components/tickets/Summary's SummaryLine — kept
 *  duck-typed here rather than importing that type, so this file (plain
 *  order math) doesn't depend on a component. */
export function ticketTypeLines(qty: TicketQty, types: TicketType[], currency: CurrencyCode = DEFAULT_CURRENCY) {
  return types.map((t) => ({ label: `${t.name} × ${qty[t.key]}`, value: money(qty[t.key] * t.price, currency), muted: !qty[t.key] }));
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
