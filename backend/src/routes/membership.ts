import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff } from '../middleware/auth';

// Paths are written in full (/membership/..., /me/membership), so this router is mounted without a prefix.
// Buying a plan (POST /membership/purchase) lives in routes/payments.ts with the other payments.
const router = Router();

const BENEFIT_FIELDS = 'benefit_id, benefit_type, benefit_value, configuration';
const PLAN_SELECT = `plan_id, name, description, price, duration_months, active, membership_benefits(${BENEFIT_FIELDS})`;

function badRequest(res: Response, message: string) {
  return res.status(400).json({ error: { message, code: 'validation_error' } });
}
function serverError(res: Response, message: string) {
  return res.status(500).json({ error: { message, code: 'server_error' } });
}
function notFound(res: Response, what: string) {
  return res.status(404).json({ error: { message: `${what} not found.`, code: 'not_found' } });
}

const idSchema = z.guid();
const text = (max: number) => z.string().trim().min(1).max(max);
const isoDateTime = z.iso.datetime({ offset: true, message: 'Use an ISO date-time with a timezone, e.g. 2026-11-14T18:00:00+10:30' });

const money = z
  .number()
  .min(0)
  .max(100000)
  .refine((v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6, { message: 'Price can have at most 2 decimal places.' });

// A discount_percent benefit is the one bookings will use, so its value must be a number from 0 to 100.
function benefitProblem(type: string | undefined, value: string | null | undefined): string | null {
  if (type === 'discount_percent') {
    const n = Number(value);
    if (value == null || value.trim() === '' || !Number.isFinite(n) || n < 0 || n > 100) {
      return 'A discount_percent benefit needs a number from 0 to 100 as its value.';
    }
  }
  return null;
}

const benefitShape = {
  benefit_type: text(50),
  benefit_value: z.string().trim().max(100).nullish(),
  configuration: z.record(z.string(), z.unknown()).nullish(),
};

const benefitInput = z.object(benefitShape).superRefine((b, ctx) => {
  const problem = benefitProblem(b.benefit_type, b.benefit_value);
  if (problem) ctx.addIssue({ code: 'custom', message: problem });
});

const createPlanSchema = z.object({
  name: text(100),
  description: text(1000).optional(),
  price: money,
  duration_months: z.number().int().min(1).max(120),
  active: z.boolean().default(true),
  benefits: z.array(benefitInput).max(20).default([]),
});

const updatePlanSchema = z
  .object({
    name: text(100),
    description: text(1000).nullable(),
    price: money,
    duration_months: z.number().int().min(1).max(120),
    active: z.boolean(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to change.' });

const updateBenefitSchema = z
  .object({
    benefit_type: text(50),
    benefit_value: z.string().trim().max(100).nullable(),
    configuration: z.record(z.string(), z.unknown()).nullable(),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to change.' });

function shapePlan(row: any) {
  const { membership_benefits, ...rest } = row;
  return { ...rest, benefits: membership_benefits ?? [] };
}

// GET /membership/plans — public. Visitors see active plans; staff also see inactive ones.
router.get('/membership/plans', async (req: Request, res: Response) => {
  const db = await readerClient(req, res);
  if (!db) return;
  const { data, error } = await db
    .from('membership_plans')
    .select(PLAN_SELECT)
    .order('price', { ascending: true })
    .order('name', { ascending: true });
  if (error) return serverError(res, 'Could not load the plans.');
  return res.json({ plans: (data ?? []).map(shapePlan) });
});

// GET /membership/plans/:id — public (inactive plans look "not found" to visitors).
router.get('/membership/plans/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Plan');
  const db = await readerClient(req, res);
  if (!db) return;
  const { data, error } = await db.from('membership_plans').select(PLAN_SELECT).eq('plan_id', id).maybeSingle();
  if (error) return serverError(res, 'Could not load the plan.');
  if (!data) return notFound(res, 'Plan');
  return res.json({ plan: shapePlan(data) });
});

// POST /membership/plans — staff only. Can include the plan's benefits.
router.post('/membership/plans', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createPlanSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { benefits, ...fields } = parsed.data;
  const db = userClient(req.auth!.token);

  const { data: created, error } = await db.from('membership_plans').insert(fields).select('plan_id').single();
  if (error || !created) return serverError(res, 'Could not create the plan.');

  if (benefits.length > 0) {
    const { error: benefitError } = await db
      .from('membership_benefits')
      .insert(benefits.map((b) => ({ ...b, plan_id: created.plan_id })));
    if (benefitError) {
      await db.from('membership_plans').delete().eq('plan_id', created.plan_id); // no half-created plan
      return serverError(res, 'Could not create the plan benefits.');
    }
  }

  const { data: full, error: readError } = await db
    .from('membership_plans')
    .select(PLAN_SELECT)
    .eq('plan_id', created.plan_id)
    .single();
  if (readError || !full) return serverError(res, 'The plan was created but could not be read back.');
  return res.status(201).json({ plan: shapePlan(full) });
});

// PATCH /membership/plans/:id — staff only. {"active": false} stops new sales but keeps existing members' benefits.
router.patch('/membership/plans/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Plan');
  const parsed = updatePlanSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const db = userClient(req.auth!.token);

  const { data: updated, error } = await db
    .from('membership_plans')
    .update(parsed.data)
    .eq('plan_id', id)
    .select('plan_id')
    .maybeSingle();
  if (error) return serverError(res, 'Could not update the plan.');
  if (!updated) return notFound(res, 'Plan');

  const { data: full, error: readError } = await db.from('membership_plans').select(PLAN_SELECT).eq('plan_id', id).single();
  if (readError || !full) return serverError(res, 'The plan was updated but could not be read back.');
  return res.json({ plan: shapePlan(full) });
});

// POST /membership/plans/:id/benefits — staff only.
router.post('/membership/plans/:id/benefits', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Plan');
  const parsed = benefitInput.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const db = userClient(req.auth!.token);

  const { data: plan, error: planError } = await db.from('membership_plans').select('plan_id').eq('plan_id', id).maybeSingle();
  if (planError) return serverError(res, 'Could not load the plan.');
  if (!plan) return notFound(res, 'Plan');

  const { data, error } = await db
    .from('membership_benefits')
    .insert({ ...parsed.data, plan_id: id })
    .select(BENEFIT_FIELDS)
    .single();
  if (error || !data) return serverError(res, 'Could not add the benefit.');
  return res.status(201).json({ benefit: data });
});

// PATCH /membership/benefits/:id — staff only.
router.patch('/membership/benefits/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Benefit');
  const parsed = updateBenefitSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const db = userClient(req.auth!.token);

  const { data: existing, error: readError } = await db
    .from('membership_benefits')
    .select(BENEFIT_FIELDS)
    .eq('benefit_id', id)
    .maybeSingle();
  if (readError) return serverError(res, 'Could not load the benefit.');
  if (!existing) return notFound(res, 'Benefit');

  // Check the final combination (e.g. changing only the type to discount_percent).
  const merged = { ...existing, ...parsed.data };
  const problem = benefitProblem(merged.benefit_type, merged.benefit_value);
  if (problem) return badRequest(res, problem);

  const { data, error } = await db
    .from('membership_benefits')
    .update(parsed.data)
    .eq('benefit_id', id)
    .select(BENEFIT_FIELDS)
    .maybeSingle();
  if (error) return serverError(res, 'Could not update the benefit.');
  if (!data) return notFound(res, 'Benefit');
  return res.json({ benefit: data });
});

// DELETE /membership/benefits/:id — staff only.
router.delete('/membership/benefits/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Benefit');
  const { data, error } = await userClient(req.auth!.token)
    .from('membership_benefits')
    .delete()
    .eq('benefit_id', id)
    .select('benefit_id')
    .maybeSingle();
  if (error) return serverError(res, 'Could not delete the benefit.');
  if (!data) return notFound(res, 'Benefit');
  return res.json({ message: 'Benefit deleted.' });
});

// What staff need about a membership: who holds it (user OR visitor — exactly
// one), its plan, status, dates and what was actually paid.
const STAFF_MEMBERSHIP_SELECT = `membership_id, user_id, visitor_id, plan_id, status, starts_at, ends_at, purchase_price, membership_plans(${PLAN_SELECT})`;

function shapeMembership(row: any) {
  const { membership_plans, ...rest } = row;
  return { ...rest, plan: membership_plans ? shapePlan(membership_plans) : null };
}

const membershipStatus = z.enum(['pending', 'active', 'expired', 'cancelled']);

// 23503 = foreign key (plan/user/visitor doesn't exist), 23514 = CHECK
// constraint (in practice: memberships_one_owner — exactly one of
// user_id/visitor_id).
function membershipWriteError(error: { code?: string }): string | null {
  if (error.code === '23503') return 'That plan, user or visitor does not exist.';
  if (error.code === '23514') return 'Send exactly one of user_id or visitor_id.';
  return null;
}

const createMembershipSchema = z
  .object({
    user_id: z.guid().optional(),
    visitor_id: z.guid().optional(),
    plan_id: z.guid(),
    status: membershipStatus.default('active'),
    starts_at: isoDateTime.optional(),
    // Omit to compute starts_at + the plan's duration_months automatically.
    ends_at: isoDateTime.nullish(),
    // Omit to use the plan's current price. Recorded permanently either way —
    // a later change to the plan's price never rewrites this.
    purchase_price: z.number().min(0).max(100000).optional(),
  })
  .refine((v) => (v.user_id ? 1 : 0) + (v.visitor_id ? 1 : 0) === 1, {
    message: 'Send exactly one of user_id or visitor_id.',
  });

// GET /staff/memberships — staff only. ?status=, ?plan_id= (the doc's "type"
// filter — plans are this system's membership types), ?visitor_id=, ?user_id=.
const listMembershipsSchema = z.object({
  status: membershipStatus.optional(),
  plan_id: z.guid().optional(),
  visitor_id: z.guid().optional(),
  user_id: z.guid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

router.get('/staff/memberships', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = listMembershipsSchema.safeParse(req.query);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const { status, plan_id, visitor_id, user_id, limit, offset } = parsed.data;

  let query = userClient(req.auth!.token)
    .from('memberships')
    .select(STAFF_MEMBERSHIP_SELECT, { count: 'exact' })
    .order('starts_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (status) query = query.eq('status', status);
  if (plan_id) query = query.eq('plan_id', plan_id);
  if (visitor_id) query = query.eq('visitor_id', visitor_id);
  if (user_id) query = query.eq('user_id', user_id);

  const { data, error, count } = await query;
  if (error) return serverError(res, 'Could not load the memberships.');
  return res.json({ memberships: (data ?? []).map(shapeMembership), total: count ?? 0, limit, offset });
});

// GET /staff/memberships/:id — staff only.
router.get('/staff/memberships/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Membership');

  const { data, error } = await userClient(req.auth!.token)
    .from('memberships')
    .select(STAFF_MEMBERSHIP_SELECT)
    .eq('membership_id', id)
    .maybeSingle();
  if (error) return serverError(res, 'Could not load the membership.');
  if (!data) return notFound(res, 'Membership');
  return res.json({ membership: shapeMembership(data) });
});

// POST /staff/memberships — staff only. Records a membership directly (for a
// walk-in visitor or an existing account) without going through the
// self-service purchase/payment flow in routes/payments.ts — this is for
// staff recording a membership themselves (comp, phone sign-up, etc.), not a
// replacement for that flow. No overlap/renewal check against the holder's
// other memberships is enforced here; that rule is still an open decision
// (see the handoff doc).
router.post('/staff/memberships', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const parsed = createMembershipSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);
  const db = userClient(req.auth!.token);

  const { data: plan, error: planError } = await db
    .from('membership_plans')
    .select('plan_id, price, duration_months')
    .eq('plan_id', parsed.data.plan_id)
    .maybeSingle();
  if (planError) return serverError(res, 'Could not load the plan.');
  if (!plan) return badRequest(res, 'That plan does not exist.');

  const startsAt = parsed.data.starts_at ? new Date(parsed.data.starts_at) : new Date();
  let endsAt = parsed.data.ends_at;
  if (endsAt === undefined) {
    const computed = new Date(startsAt);
    computed.setUTCMonth(computed.getUTCMonth() + plan.duration_months);
    endsAt = computed.toISOString();
  }

  const { data, error } = await db
    .from('memberships')
    .insert({
      user_id: parsed.data.user_id ?? null,
      visitor_id: parsed.data.visitor_id ?? null,
      plan_id: parsed.data.plan_id,
      status: parsed.data.status,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt,
      purchase_price: parsed.data.purchase_price ?? plan.price,
    })
    .select(STAFF_MEMBERSHIP_SELECT)
    .single();
  if (error || !data) {
    const message = error && membershipWriteError(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not create the membership.');
  }
  return res.status(201).json({ membership: shapeMembership(data) });
});

// For PATCH: status, ends_at and purchase_price only. plan_id, user_id and
// visitor_id are immutable after creation — swapping the plan or the holder
// is a bigger operation (a new membership) than this endpoint is meant for.
const updateMembershipSchema = z
  .object({
    status: membershipStatus,
    ends_at: isoDateTime.nullable(),
    purchase_price: z.number().min(0).max(100000),
  })
  .partial()
  .refine((v) => Object.keys(v).length > 0, { message: 'Send at least one field to change.' });

// PATCH /staff/memberships/:id — staff only.
router.patch('/staff/memberships/:id', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const id = String(req.params.id);
  if (!idSchema.safeParse(id).success) return notFound(res, 'Membership');
  const parsed = updateMembershipSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token)
    .from('memberships')
    .update(parsed.data)
    .eq('membership_id', id)
    .select(STAFF_MEMBERSHIP_SELECT)
    .maybeSingle();
  if (error) {
    const message = membershipWriteError(error);
    return message ? badRequest(res, message) : serverError(res, 'Could not update the membership.');
  }
  if (!data) return notFound(res, 'Membership');
  return res.json({ membership: shapeMembership(data) });
});

// GET /me/membership — signed-in user. The current active, unexpired membership, or null.
router.get('/me/membership', requireAuth, async (req: Request, res: Response) => {
  const auth = req.auth!;
  const { data, error } = await userClient(auth.token)
    .from('memberships')
    .select(`membership_id, status, starts_at, ends_at, membership_plans(${PLAN_SELECT})`)
    .eq('user_id', auth.userId)
    .eq('status', 'active')
    .order('starts_at', { ascending: false });
  if (error) return serverError(res, 'Could not load your membership.');

  const now = Date.now();
  const current: any = (data ?? []).find((m: any) => !m.ends_at || new Date(m.ends_at).getTime() > now);
  if (!current) return res.json({ is_member: false, membership: null });

  const { membership_plans, ...rest } = current;
  return res.json({ is_member: true, membership: { ...rest, plan: membership_plans ? shapePlan(membership_plans) : null } });
});

export default router;