import { apiFetch, apiGetAuthed, apiPostAuthed, ApiError } from './client';

/* ── Real backend (openapi.yaml: /membership/plans, /me/membership, /membership/purchase) ──
 *
 * Own toggle: NEXT_PUBLIC_MEMBERSHIP_API_MOCKING=disabled switches the
 * membership page, the buy flow and the member status shown on the profile to
 * the real backend. Unset, the page keeps its placeholder plans and the demo
 * "Become a member" toggle exactly as before.
 *
 * Buying a plan is a simulated payment today (no card is charged); the
 * backend settles it straight away, the account becomes a member, and
 * /auth/me then reports role "member". */

export function membershipMockingDisabled(): boolean {
  return process.env.NEXT_PUBLIC_MEMBERSHIP_API_MOCKING === 'disabled';
}

/** Currency the real backend charges in (Payment.currency in openapi.yaml). */
export const MEMBERSHIP_CURRENCY = 'AUD' as const;

/* Same keys lib/auth.tsx stores the session under, read directly so this file
   doesn't depend on the auth module. */
const SESSION_KEY = 'hm-session';
const REMEMBER_KEY = 'hm-remember';

export function getMemberAccessToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem(REMEMBER_KEY) ?? window.sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as { access_token?: string }).access_token : undefined;
  } catch {
    return undefined;
  }
}

export interface PlanBenefit {
  id: string;
  /** Plain-language line, e.g. "15% off ticketed events". */
  label: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  /** 0 = a free plan. */
  price: number;
  durationMonths: number;
  benefits: PlanBenefit[];
}

export interface MyMembership {
  id: string;
  /** ISO date-time; null for a membership that never ends. */
  endsAt?: string;
  plan: MembershipPlan;
}

interface RawBenefit {
  benefit_id: string;
  benefit_type: string;
  benefit_value: string | null;
  configuration: Record<string, unknown> | null;
}

interface RawPlan {
  plan_id: string;
  name: string;
  description: string | null;
  price: number;
  duration_months: number;
  active: boolean;
  benefits: RawBenefit[];
}

function humanise(type: string): string {
  const words = type.replace(/[_-]+/g, ' ').trim().toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** One readable line per benefit. `discount_percent` is the type bookings use;
 *  anything else the museum adds is shown from its own description or name. */
export function describeBenefit(b: RawBenefit): string {
  const described = typeof b.configuration?.description === 'string' ? b.configuration.description : undefined;
  if (described) return described;
  if (b.benefit_type === 'discount_percent' && b.benefit_value) return `${b.benefit_value}% off ticketed events`;
  return b.benefit_value ? `${humanise(b.benefit_type)}: ${b.benefit_value}` : humanise(b.benefit_type);
}

function mapPlan(p: RawPlan): MembershipPlan {
  return {
    id: p.plan_id,
    name: p.name,
    description: p.description ?? undefined,
    price: p.price,
    durationMonths: p.duration_months,
    benefits: p.benefits.map((b) => ({ id: b.benefit_id, label: describeBenefit(b) })),
  };
}

/** Plans on sale, cheapest first. Real mode only — empty while mocking is on. */
export async function getPlans(): Promise<MembershipPlan[]> {
  if (!membershipMockingDisabled()) return [];
  const data = await apiFetch<{ plans: RawPlan[] }>('/membership/plans', { absolute: true });
  return data.plans.filter((p) => p.active).map(mapPlan).sort((a, b) => a.price - b.price);
}

/** The signed-in account's active membership, or undefined if it has none. */
export async function getMyMembership(token: string): Promise<MyMembership | undefined> {
  const data = await apiGetAuthed<{
    is_member: boolean;
    membership: { membership_id: string; ends_at: string | null; plan: RawPlan } | null;
  }>('/me/membership', token, { absolute: true });
  if (!data.is_member || !data.membership) return undefined;
  return {
    id: data.membership.membership_id,
    endsAt: data.membership.ends_at ?? undefined,
    plan: mapPlan(data.membership.plan),
  };
}

/** Buys a plan with the simulated provider. Resolves once the membership is
 *  active; throws ApiError for a declined payment (402), an existing
 *  membership (409 already_member), an expired purchase window and so on. */
export async function purchasePlan(
  token: string,
  planId: string,
  simulate?: 'success' | 'card_declined',
): Promise<MyMembership> {
  const body = { plan_id: planId, method: 'card', ...(simulate ? { simulate } : {}) };
  const out = await apiPostAuthed<{
    membership?: { membership_id: string; status: string; ends_at: string | null; plan: { plan_id: string; name: string; price: number; duration_months: number } };
  }>('/membership/purchase', token, body, { absolute: true });
  // 202 = started but not settled; the simulated provider settles immediately unless asked not to.
  if (!out.membership || out.membership.status !== 'active') {
    throw new ApiError('The payment has not settled yet. Please check your membership in a moment.', 'payment_pending', 202);
  }
  const m = out.membership;
  return {
    id: m.membership_id,
    endsAt: m.ends_at ?? undefined,
    plan: { id: m.plan.plan_id, name: m.plan.name, price: m.plan.price, durationMonths: m.plan.duration_months, benefits: [] },
  };
}

const MUSEUM_TIMEZONE = 'Australia/Adelaide'; // matches lib/api/events.ts

export function formatMemberDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { timeZone: MUSEUM_TIMEZONE, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

/** "year" for a 12-month plan, otherwise "N months". */
export function planPeriod(months: number): string {
  if (months === 12) return 'year';
  if (months % 12 === 0) return `${months / 12} years`;
  return months === 1 ? 'month' : `${months} months`;
}
