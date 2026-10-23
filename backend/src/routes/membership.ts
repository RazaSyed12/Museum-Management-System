import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { readerClient } from '../lib/readerClient';
import { requireAuth, requireStaff } from '../middleware/auth';

// Paths are written in full (/membership/..., /me/membership), so this router is mounted without a prefix.
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

// POST /membership/purchase — signed-in user. Simulated payment: no real money moves.
// The database function creates the membership and its payment together, or neither.
router.post('/membership/purchase', requireAuth, async (req: Request, res: Response) => {
  const parsed = z.object({ plan_id: z.guid() }).safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error.issues[0].message);

  const { data, error } = await userClient(req.auth!.token).rpc('purchase_membership', { p_plan_id: parsed.data.plan_id });
  if (error) {
    switch (error.message) {
      case 'already_member':
        return res.status(409).json({ error: { message: 'You already have an active membership.', code: 'already_member' } });
      case 'plan_not_found':
        return notFound(res, 'Plan');
      case 'account_not_active':
        return res.status(403).json({ error: { message: 'Your account cannot buy a membership.', code: 'forbidden' } });
      default:
        return serverError(res, 'Could not complete the purchase.');
    }
  }
  return res.status(201).json(data);
});

export default router;