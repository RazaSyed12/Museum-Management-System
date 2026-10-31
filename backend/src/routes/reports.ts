import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { userClient } from '../lib/supabaseClients';
import { requireAuth, requireStaff, requireAdminOrManager } from '../middleware/auth';

// Full paths (/admin/dashboard, /admin/reports/:kind, ...), so this router
// is mounted without a prefix.
const router = Router();

function send(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}
const badRequest = (res: Response, message: string) => send(res, 400, 'validation_error', message);
const serverError = (res: Response, message: string) => send(res, 500, 'server_error', message);

function rpcFailure(res: Response, error: { message?: string }, fallback: string) {
  switch (error.message) {
    case 'forbidden':
      return send(res, 403, 'forbidden', 'Staff access required.');
    case 'invalid_date_range':
      return badRequest(res, 'date_to must not be before date_from.');
    case 'invalid_group':
      return badRequest(res, 'Invalid group_by value.');
    default:
      return serverError(res, fallback);
  }
}

// GET /admin/dashboard — any staff tier ("View reports": yes for every tier).
router.get('/admin/dashboard', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const { data, error } = await userClient(req.auth!.token).rpc('admin_dashboard');
  if (error) return rpcFailure(res, error, 'Could not load the dashboard.');
  return res.json(data);
});

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');

const REPORT_KINDS = ['visitors', 'tickets', 'memberships', 'events', 'collections'] as const;
type ReportKind = (typeof REPORT_KINDS)[number];

// Each report kind's own query schema and the RPC call it maps to. collections
// is the one exception that takes no date range (see its migration comment:
// a current snapshot, independent of report date bounds).
const reportQuerySchemas = {
  visitors: z.object({ date_from: dateSchema, date_to: dateSchema, group: z.enum(['day', 'month', 'year']).default('day') }),
  tickets: z.object({ date_from: dateSchema, date_to: dateSchema }),
  memberships: z.object({ date_from: dateSchema, date_to: dateSchema }),
  events: z.object({ date_from: dateSchema, date_to: dateSchema }),
  collections: z.object({ group: z.enum(['category', 'period']).default('category') }),
};

function runReport(db: ReturnType<typeof userClient>, kind: ReportKind, query: unknown) {
  switch (kind) {
    case 'visitors': {
      const parsed = reportQuerySchemas.visitors.safeParse(query);
      if (!parsed.success) return { error: parsed.error.issues[0].message };
      return {
        rpc: db.rpc('report_visitors', {
          p_date_from: parsed.data.date_from,
          p_date_to: parsed.data.date_to,
          p_group: parsed.data.group,
        }),
      };
    }
    case 'tickets': {
      const parsed = reportQuerySchemas.tickets.safeParse(query);
      if (!parsed.success) return { error: parsed.error.issues[0].message };
      return { rpc: db.rpc('report_tickets', { p_date_from: parsed.data.date_from, p_date_to: parsed.data.date_to }) };
    }
    case 'memberships': {
      const parsed = reportQuerySchemas.memberships.safeParse(query);
      if (!parsed.success) return { error: parsed.error.issues[0].message };
      return { rpc: db.rpc('report_memberships', { p_date_from: parsed.data.date_from, p_date_to: parsed.data.date_to }) };
    }
    case 'events': {
      const parsed = reportQuerySchemas.events.safeParse(query);
      if (!parsed.success) return { error: parsed.error.issues[0].message };
      return { rpc: db.rpc('report_events', { p_date_from: parsed.data.date_from, p_date_to: parsed.data.date_to }) };
    }
    case 'collections': {
      const parsed = reportQuerySchemas.collections.safeParse(query);
      if (!parsed.success) return { error: parsed.error.issues[0].message };
      return { rpc: db.rpc('report_collections', { p_group: parsed.data.group }) };
    }
  }
}

const kindParamSchema = z.object({ kind: z.enum(REPORT_KINDS) });

// GET /admin/reports/:kind — any staff tier. ?date_from=&date_to= (YYYY-MM-DD,
// inclusive Adelaide calendar days) for every kind except collections, which
// takes ?group=category|period instead. visitors also takes ?group=day|month|year.
router.get('/admin/reports/:kind', requireAuth, requireStaff, async (req: Request, res: Response) => {
  const kindParsed = kindParamSchema.safeParse(req.params);
  if (!kindParsed.success) {
    return badRequest(res, `kind must be one of: ${REPORT_KINDS.join(', ')}`);
  }
  const db = userClient(req.auth!.token);
  const result = runReport(db, kindParsed.data.kind, req.query);
  if ('error' in result) return badRequest(res, result.error);

  const { data, error } = await result.rpc;
  if (error) return rpcFailure(res, error, 'Could not load the report.');
  return res.json(data);
});

// Flattens one report's { rows, ... } into a CSV. Nested values (e.g. a row
// that is itself an object) are JSON-stringified rather than spread into
// further columns, since the five report shapes differ enough that a single
// fixed column set isn't meaningful across all of them.
function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown): string => {
    const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))];
  return lines.join('\n');
}

// GET /admin/reports/:kind/export — admin/manager only ("Export reports":
// Admin/Manager yes, Staff no — distinct from viewing the report itself,
// which every tier can do). Runs the exact same report as above and
// streams its rows back as a CSV file.
router.get(
  '/admin/reports/:kind/export',
  requireAuth,
  requireStaff,
  requireAdminOrManager,
  async (req: Request, res: Response) => {
    const kindParsed = kindParamSchema.safeParse(req.params);
    if (!kindParsed.success) {
      return badRequest(res, `kind must be one of: ${REPORT_KINDS.join(', ')}`);
    }
    const kind = kindParsed.data.kind;
    const db = userClient(req.auth!.token);
    const result = runReport(db, kind, req.query);
    if ('error' in result) return badRequest(res, result.error);

    const { data, error } = await result.rpc;
    if (error) return rpcFailure(res, error, 'Could not load the report.');

    const rows = Array.isArray(data?.rows) ? data.rows : [];
    const csv = rowsToCsv(rows);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${kind}-report.csv"`);
    return res.status(200).send(csv);
  },
);

export default router;
