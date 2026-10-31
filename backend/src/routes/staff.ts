import { Router, Request, Response } from 'express';
import { userClient } from '../lib/supabaseClients';
import { requireAuth } from '../middleware/auth';

// Full path (/staff/me), so this router is mounted without a prefix.
const router = Router();

function send(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { message, code } });
}

// GET /staff/me — any signed-in, active account (requireAuth only, not
// requireStaff), so a non-staff or not-yet-tiered caller gets a specific,
// actionable reason rather than a generic 403. Returns the authenticated
// identity's own staff profile: id, email, name, phone, role, tier,
// account status and last login. See BE-01.
router.get('/staff/me', requireAuth, async (req: Request, res: Response) => {
  const a = req.auth!;

  if (a.role !== 'staff') {
    return send(res, 403, 'not_staff', 'This account does not have staff access.');
  }
  if (!a.tier) {
    return send(
      res,
      403,
      'tier_not_assigned',
      'Your staff account has not been assigned a tier yet. Ask an admin to set one.',
    );
  }

  const { data, error } = await userClient(a.token).rpc('staff_me');
  if (error || !data) {
    return send(res, 500, 'server_error', 'Could not load your staff profile.');
  }
  return res.status(200).json({ staff: data });
});

export default router;
