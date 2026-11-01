// Load test: 100 users fight over a limited number of seats on one event.
// Run from the backend folder:  node scripts\load-test.ts
// Against a cloud project, sign users up in groups:  $env:SIGNUP_BATCH="20"; $env:SIGNUP_PAUSE_MS="20000"
// Needs the backend running on port 4000 and the staff test account.

type CallResult = { status: number; json: any; ms: number };

const BASE: string = process.env.BASE_URL || 'http://127.0.0.1:4000';
const USERS: number = Number(process.env.USERS || 100);
const MAX_SEATS = 50;
const EVENT_ID = '66666666-6666-6666-6666-666666666602'; // Gold Rush Weekend ($14)
const STAFF = { email: 'staff-test@museum.local', password: 'StaffPassword123' };
const PASSWORD = 'TestPassword123';
const RUN_ID: string = Date.now().toString(36);
// Cloud projects limit how many sign-ups one connection may make in a burst.
// SIGNUP_BATCH = users per group, SIGNUP_PAUSE_MS = wait between groups (and before retrying refused ones).
// Defaults (all at once, no retry) are right for the local database.
const SIGNUP_BATCH: number = Number(process.env.SIGNUP_BATCH || USERS);
const SIGNUP_PAUSE_MS: number = Number(process.env.SIGNUP_PAUSE_MS || 0);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function call(
  method: string,
  path: string,
  opts: { token?: string; body?: unknown } = {},
): Promise<CallResult> {
  const { token, body } = opts;
  const started = performance.now();
  let status = 0;
  let json: any = null;
  try {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    status = res.status;
    json = await res.json().catch(() => null);
  } catch (e) {
    json = { error: { message: String(e), code: 'network_error' } };
  }
  return { status, json, ms: performance.now() - started };
}

function percentile(sortedMs: number[], p: number): number {
  if (sortedMs.length === 0) return 0;
  const idx = Math.min(sortedMs.length - 1, Math.ceil((p / 100) * sortedMs.length) - 1);
  return sortedMs[Math.max(0, idx)];
}

function report(name: string, results: CallResult[], wallMs: number): void {
  const times = results.map((r) => r.ms).sort((a, b) => a - b);
  const statuses: Record<string, number> = {};
  const codes: Record<string, number> = {};
  for (const r of results) {
    statuses[r.status] = (statuses[r.status] || 0) + 1;
    const code: string | undefined = r.json?.error?.code;
    if (code) codes[code] = (codes[code] || 0) + 1;
  }
  console.log(`\n=== ${name} ===`);
  console.log(`requests: ${results.length}   total time: ${Math.round(wallMs)} ms`);
  console.log(
    `response time ms -> median ${Math.round(percentile(times, 50))}, ` +
      `95th ${Math.round(percentile(times, 95))}, slowest ${Math.round(times[times.length - 1] || 0)}`,
  );
  console.log('status codes:', JSON.stringify(statuses));
  if (Object.keys(codes).length) console.log('error codes :', JSON.stringify(codes));
}

const checks: { name: string; ok: boolean }[] = [];
function check(name: string, ok: boolean, detail = ''): void {
  checks.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  (' + detail + ')' : ''}`);
}

async function timed(fn: () => Promise<CallResult[]>): Promise<{ results: CallResult[]; wall: number }> {
  const t0 = performance.now();
  const results = await fn();
  return { results, wall: performance.now() - t0 };
}

async function main(): Promise<void> {
  console.log(`Load test ${RUN_ID}: ${USERS} users against ${BASE}`);

  // --- Setup: staff creates a limited ticket type -------------------------------
  const staffLogin = await call('POST', '/auth/sign-in', { body: STAFF });
  if (staffLogin.status !== 200) {
    console.log('Could not sign in as staff:', JSON.stringify(staffLogin.json));
    process.exitCode = 1;
    return;
  }
  const staffToken: string = staffLogin.json.session.access_token;

  const before = await call('GET', `/events/${EVENT_ID}/allocations`, { token: staffToken });
  if (before.status !== 200) {
    console.log('Could not read allocations:', JSON.stringify(before.json));
    process.exitCode = 1;
    return;
  }
  const unallocated: number = before.json.unallocated;
  const seats = Math.min(MAX_SEATS, unallocated);
  if (seats < 10) {
    console.log(
      `Only ${unallocated} unallocated seats left on this event (earlier runs used them). ` +
        'Reset with: supabase db reset  (then recreate the staff user).',
    );
    process.exitCode = 1;
    return;
  }

  const created = await call('POST', `/events/${EVENT_ID}/allocations`, {
    token: staffToken,
    body: { allocation_name: `Load Test ${RUN_ID}`, quantity: seats },
  });
  if (created.status !== 201) {
    console.log('Could not create the ticket type:', JSON.stringify(created.json));
    process.exitCode = 1;
    return;
  }
  const allocationId: string = created.json.allocation.allocation_id;
  console.log(`Ticket type created with exactly ${seats} seats.`);

  // --- Phase 1: sign up all users (in groups if the cloud limits bursts) ---------
  const tokens: (string | undefined)[] = new Array(USERS).fill(undefined);
  const attempts: CallResult[] = [];
  const signupStart = performance.now();
  const maxRounds = SIGNUP_PAUSE_MS > 0 ? 40 : 1;
  for (let round = 1; round <= maxRounds; round++) {
    const pending: number[] = [];
    for (let i = 0; i < USERS; i++) if (!tokens[i]) pending.push(i);
    if (pending.length === 0) break;
    const group = pending.slice(0, SIGNUP_BATCH);
    const answers = await Promise.all(
      group.map((i) =>
        call('POST', '/auth/sign-up', {
          body: { email: `load${RUN_ID}-${i}-${round}@museum.local`, password: PASSWORD, full_name: `Load User ${i}` },
        }),
      ),
    );
    answers.forEach((r, k) => {
      attempts.push(r);
      const t: string | undefined = r.json?.session?.access_token;
      if ((r.status === 201 || r.status === 200) && t) tokens[group[k]] = t;
    });
    if (SIGNUP_PAUSE_MS > 0 && tokens.some((t) => !t)) await sleep(SIGNUP_PAUSE_MS);
  }
  report('Phase 1: sign up', attempts, performance.now() - signupStart);
  const users: { token: string }[] = [];
  for (const t of tokens) if (t) users.push({ token: t });
  check(`all ${USERS} users signed up`, users.length === USERS, `${users.length} ok`);
  if (users.length === 0) {
    process.exitCode = 1;
    return;
  }

  // --- Phase 2: everyone books 1 ticket at the same moment ----------------------
  const books = await timed(() =>
    Promise.all(
      users.map((u) => call('POST', '/bookings', { token: u.token, body: { allocation_id: allocationId, quantity: 1 } })),
    ),
  );
  report(`Phase 2: ${users.length} users book 1 ticket each (only ${seats} exist)`, books.results, books.wall);
  const winners: { token: string; bookingId: string }[] = [];
  books.results.forEach((r, i) => {
    if (r.status === 201) winners.push({ token: users[i].token, bookingId: r.json.booking.booking_id });
  });
  const losers = books.results.filter((r) => r.status !== 201);
  check(`exactly ${seats} bookings succeeded (no overselling)`, winners.length === seats, `${winners.length} succeeded`);
  check(
    'every other user was told "sold_out" (no crashes)',
    losers.every((r) => r.status === 409 && r.json?.error?.code === 'sold_out'),
    `${losers.length} refused`,
  );

  // --- Phase 3: every winner pays, each sending the payment TWICE at once --------
  const pays = await timed(() =>
    Promise.all(
      winners.flatMap((w) => {
        const send = () => call('POST', `/bookings/${w.bookingId}/pay`, { token: w.token, body: {} });
        return [send(), send()];
      }),
    ),
  );
  report(`Phase 3: ${winners.length} winners pay (every payment sent twice at once)`, pays.results, pays.wall);
  check(
    'no payment request crashed (only 200 or 409 answers)',
    pays.results.every((r) => r.status === 200 || r.status === 409),
    JSON.stringify(pays.results.filter((r) => r.status !== 200 && r.status !== 409).slice(0, 2).map((r) => r.json)),
  );

  // --- Phase 4: check the final state of every winning booking ------------------
  const reads = await timed(() => Promise.all(winners.map((w) => call('GET', `/bookings/${w.bookingId}`, { token: w.token }))));
  report('Phase 4: read back every winning booking', reads.results, reads.wall);
  let confirmed = 0;
  let oneCompletedPayment = 0;
  let oneValidTicket = 0;
  for (const r of reads.results) {
    const b = r.json?.booking;
    if (!b) continue;
    if (b.booking_status === 'confirmed') confirmed++;
    if ((b.payments || []).filter((p: any) => p.payment_status === 'completed').length === 1) oneCompletedPayment++;
    if ((b.tickets || []).filter((t: any) => t.ticket_status === 'valid' && t.ticket_code).length === 1) oneValidTicket++;
  }
  check(`all ${winners.length} bookings are confirmed`, confirmed === winners.length, `${confirmed}`);
  check('every booking has exactly ONE completed payment (no double charge)', oneCompletedPayment === winners.length, `${oneCompletedPayment}`);
  check('every booking has exactly one valid ticket with a code', oneValidTicket === winners.length, `${oneValidTicket}`);

  // --- Final: seat count on the ticket type -------------------------------------
  const after = await call('GET', `/events/${EVENT_ID}/allocations`, { token: staffToken });
  const alloc = after.json?.allocations?.find((a: any) => a.allocation_id === allocationId);
  check(
    `ticket type shows ${seats} reserved and 0 available`,
    !!alloc && alloc.reserved_quantity === seats && alloc.available === 0,
    alloc ? `reserved ${alloc.reserved_quantity}, available ${alloc.available}` : 'allocation not found',
  );

  const failed = checks.filter((c) => !c.ok).length;
  console.log(`\n${failed === 0 ? 'ALL CHECKS PASSED' : failed + ' CHECK(S) FAILED'} (${checks.length} checks)`);
  if (failed) process.exitCode = 1;
}

main();