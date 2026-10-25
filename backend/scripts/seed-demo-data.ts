// Demo data for a fresh database: ticket types, membership plans, collection items,
// placeholder images and ready-made demo accounts, so every screen has something to show.
// Safe to run more than once: anything that already exists is skipped.
// Run from the backend folder:  node scripts\seed-demo-data.ts
// Needs: the backend running on port 4000, the events/collection from supabase/seed.sql,
// and the staff account staff-test@museum.local (role staff).

const { deflateSync } = require('node:zlib') as typeof import('node:zlib');

type Reply = { status: number; json: any };

const SEED_BASE: string = process.env.BASE_URL || 'http://127.0.0.1:4000';
const SEED_STAFF = { email: 'staff-test@museum.local', password: 'StaffPassword123' };
const DEMO_PASSWORD = 'TestPassword123';
const LOCATION_ID = '11111111-1111-1111-1111-111111111111';
const COLLECTION_ID = '33333333-3333-3333-3333-333333333333'; // Ancient Fossils
const EVENT_FOSSIL = '66666666-6666-6666-6666-666666666601'; // free, capacity 120
const EVENT_GOLD = '66666666-6666-6666-6666-666666666602'; // $14, capacity 200
const EVENT_TALK = '66666666-6666-6666-6666-666666666603'; // $8, capacity 40

let problems = 0;

function say(kind: 'created' | 'skipped' | 'FAILED', what: string, extra = ''): void {
  if (kind === 'FAILED') problems++;
  console.log(`${kind.padEnd(8)} ${what}${extra ? '  ' + extra : ''}`);
}

async function api(
  method: string,
  path: string,
  opts: { token?: string; body?: unknown; raw?: { data: Buffer; type: string } } = {},
): Promise<Reply> {
  const headers: Record<string, string> = {};
  let body: any = undefined;
  if (opts.raw) {
    headers['Content-Type'] = opts.raw.type;
    body = opts.raw.data;
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  try {
    const res = await fetch(SEED_BASE + path, { method, headers, body });
    return { status: res.status, json: await res.json().catch(() => null) };
  } catch (e) {
    return { status: 0, json: { error: { message: String(e), code: 'network_error' } } };
  }
}

function fail(what: string, r: Reply): void {
  say('FAILED', what, `status ${r.status} ${JSON.stringify(r.json?.error ?? r.json)}`);
}

// ---- tiny PNG maker (a plain two-tone picture, so images show up without any file to upload) ----
const crcTable: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function makePng(w: number, h: number, top: [number, number, number], bottom: [number, number, number]): Buffer {
  const rows: Buffer[] = [];
  for (let y = 0; y < h; y++) {
    const t = y / (h - 1);
    const px = [0, 1, 2].map((i) => Math.round(top[i] + (bottom[i] - top[i]) * t));
    const row = Buffer.alloc(1 + w * 3);
    for (let x = 0; x < w; x++) {
      row[1 + x * 3] = px[0];
      row[2 + x * 3] = px[1];
      row[3 + x * 3] = px[2];
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

async function signInOrUp(email: string, fullName: string): Promise<string | null> {
  const body = { email, password: DEMO_PASSWORD };
  let r = await api('POST', '/auth/sign-in', { body });
  if (r.status === 200) return r.json.session.access_token;
  r = await api('POST', '/auth/sign-up', { body: { ...body, full_name: fullName } });
  if ((r.status === 201 || r.status === 200) && r.json?.session?.access_token) {
    say('created', `account ${email}`);
    return r.json.session.access_token;
  }
  fail(`account ${email}`, r);
  return null;
}

async function seedMain(): Promise<void> {
  console.log(`Filling demo data into ${SEED_BASE}\n`);

  const staffLogin = await api('POST', '/auth/sign-in', { body: SEED_STAFF });
  if (staffLogin.status !== 200 || staffLogin.json?.user?.role !== 'staff') {
    console.log('Cannot continue: sign in as staff-test@museum.local (with role staff) failed.');
    console.log(JSON.stringify(staffLogin.json));
    process.exitCode = 1;
    return;
  }
  const staff: string = staffLogin.json.session.access_token;

  // ---- ticket types ------------------------------------------------------------------
  const ticketTypes: [string, string, { name: string; qty: number; members: boolean }[]][] = [
    [EVENT_FOSSIL, 'Fossil Hunters Family Day', [
      { name: 'General Admission', qty: 100, members: false },
      { name: 'Members', qty: 20, members: true },
    ]],
    [EVENT_GOLD, 'Gold Rush Weekend', [
      { name: 'General Admission', qty: 150, members: false },
      { name: 'Members', qty: 50, members: true },
    ]],
    [EVENT_TALK, 'Talk: Women of the Mines', [
      { name: 'General Admission', qty: 30, members: false },
      { name: 'Members', qty: 10, members: true },
    ]],
  ];
  const allocationIds: Record<string, string> = {};
  for (const [eventId, eventName, types] of ticketTypes) {
    const existing = await api('GET', `/events/${eventId}/allocations`, { token: staff });
    if (existing.status !== 200) { fail(`ticket types for ${eventName}`, existing); continue; }
    const have: any[] = existing.json.allocations;
    for (const t of types) {
      const found = have.find((a) => a.allocation_name === t.name);
      if (found) {
        say('skipped', `ticket type "${t.name}" for ${eventName}`);
        allocationIds[`${eventId}|${t.name}`] = found.allocation_id;
        continue;
      }
      const r = await api('POST', `/events/${eventId}/allocations`, {
        token: staff,
        body: { allocation_name: t.name, quantity: t.qty, membership_required: t.members },
      });
      if (r.status === 201) {
        say('created', `ticket type "${t.name}" (${t.qty}) for ${eventName}`);
        allocationIds[`${eventId}|${t.name}`] = r.json.allocation.allocation_id;
      } else fail(`ticket type "${t.name}" for ${eventName}`, r);
    }
  }

  // ---- membership plans ----------------------------------------------------------------
  const plans = [
    {
      name: 'Friends of the Museum',
      description: 'Annual membership: 10% off every ticket and access to members-only sessions.',
      price: 49, duration_months: 12,
      benefits: [
        { benefit_type: 'discount_percent', benefit_value: '10' },
        { benefit_type: 'members_only_sessions', benefit_value: 'Access to members-only ticket types' },
      ],
    },
    {
      name: 'Family Membership',
      description: 'Annual membership for families: 15% off every ticket and access to members-only sessions.',
      price: 89, duration_months: 12,
      benefits: [
        { benefit_type: 'discount_percent', benefit_value: '15' },
        { benefit_type: 'members_only_sessions', benefit_value: 'Access to members-only ticket types' },
      ],
    },
  ];
  const planList = await api('GET', '/membership/plans', { token: staff });
  const planIds: Record<string, string> = {};
  if (planList.status !== 200) fail('membership plans list', planList);
  else {
    for (const p of plans) {
      const found = planList.json.plans.find((x: any) => x.name === p.name);
      if (found) { say('skipped', `plan "${p.name}"`); planIds[p.name] = found.plan_id; continue; }
      const r = await api('POST', '/membership/plans', { token: staff, body: { ...p, active: true } });
      if (r.status === 201) { say('created', `plan "${p.name}" ($${p.price})`); planIds[p.name] = r.json.plan.plan_id; }
      else fail(`plan "${p.name}"`, r);
    }
  }

  // ---- collection items ----------------------------------------------------------------
  const items = [
    { name: 'Trilobite (Phacops)', description: 'A well-preserved Devonian trilobite, one of the best-known extinct sea creatures.', historical_period: 'Devonian', year_label: 'about 400 million years old', origin: 'Morocco' },
    { name: 'Ammonite shell', description: 'A coiled shell of an extinct relative of squid and octopus, found in marine rock.', historical_period: 'Jurassic', year_label: 'about 180 million years old', origin: 'Dorset, England' },
    { name: 'Dickinsonia impression', description: 'An imprint of one of the oldest known large animals, from the Flinders Ranges.', historical_period: 'Ediacaran', year_label: 'about 550 million years old', origin: 'Flinders Ranges, South Australia' },
    { name: 'Diprotodon jaw fragment', description: 'Part of the jaw of the largest marsupial that ever lived, found at Lake Callabonna.', historical_period: 'Pleistocene', year_label: 'about 50,000 years old', origin: 'Lake Callabonna, South Australia' },
  ];
  const itemList = await api('GET', `/collections/${COLLECTION_ID}/items?limit=100`, { token: staff });
  if (itemList.status !== 200) fail('collection items list', itemList);
  else {
    for (const it of items) {
      if (itemList.json.items.some((x: any) => x.name === it.name)) { say('skipped', `item "${it.name}"`); continue; }
      const r = await api('POST', `/collections/${COLLECTION_ID}/items`, { token: staff, body: { ...it, location_id: LOCATION_ID } });
      if (r.status === 201) say('created', `item "${it.name}"`);
      else fail(`item "${it.name}"`, r);
    }
  }

  // ---- images ----------------------------------------------------------------------------
  const pictures: [string, string, string, [number, number, number], [number, number, number]][] = [
    ['events', EVENT_FOSSIL, 'Fossil Hunters Family Day', [64, 122, 108], [20, 60, 52]],
    ['events', EVENT_GOLD, 'Gold Rush Weekend', [222, 178, 58], [140, 96, 20]],
    ['events', EVENT_TALK, 'Talk: Women of the Mines', [92, 112, 150], [34, 44, 74]],
    ['collections', COLLECTION_ID, 'Ancient Fossils', [196, 160, 120], [110, 80, 52]],
  ];
  for (const [kind, id, label, top, bottom] of pictures) {
    const have = await api('GET', `/${kind}/${id}/media`, { token: staff });
    if (have.status === 200 && have.json.media.length > 0) { say('skipped', `image for ${label}`); continue; }
    const up = await api('POST', `/media?alt_text=${encodeURIComponent(label + ' (placeholder image)')}`, {
      token: staff, raw: { data: makePng(640, 360, top, bottom), type: 'image/png' },
    });
    if (up.status !== 201) { fail(`image upload for ${label}`, up); continue; }
    const attach = await api('PUT', `/${kind}/${id}/media`, { token: staff, body: { media_ids: [up.json.media.media_id] } });
    if (attach.status === 200) say('created', `image for ${label}`);
    else fail(`image attach for ${label}`, attach);
  }

  // ---- demo accounts ---------------------------------------------------------------------
  const visitor = await signInOrUp('visitor-demo@museum.local', 'Demo Visitor');
  const member = await signInOrUp('member-demo@museum.local', 'Demo Member');

  if (member && planIds['Friends of the Museum']) {
    const mine = await api('GET', '/me/membership', { token: member });
    if (mine.status === 200 && mine.json.is_member) say('skipped', 'membership for member-demo');
    else {
      const r = await api('POST', '/membership/purchase', { token: member, body: { plan_id: planIds['Friends of the Museum'] } });
      if (r.status === 200 || r.status === 201) say('created', 'membership "Friends of the Museum" for member-demo (paid)');
      else fail('membership for member-demo', r);
    }
  }

  const general = allocationIds[`${EVENT_GOLD}|General Admission`];
  if (visitor && general) {
    const mine = await api('GET', '/me/bookings?limit=1', { token: visitor });
    if (mine.status === 200 && mine.json.total > 0) say('skipped', 'booking for visitor-demo');
    else {
      const b = await api('POST', '/bookings', { token: visitor, body: { allocation_id: general, quantity: 2 } });
      if (b.status !== 201) fail('booking for visitor-demo', b);
      else {
        const p = await api('POST', `/bookings/${b.json.booking.booking_id}/pay`, { token: visitor, body: {} });
        if (p.status === 200) say('created', '2 paid tickets to Gold Rush Weekend for visitor-demo');
        else fail('payment for visitor-demo', p);
      }
    }
  }

  console.log('\nReady-made accounts (password for the demo ones: ' + DEMO_PASSWORD + '):');
  console.log('  staff    staff-test@museum.local   (password StaffPassword123)');
  console.log('  visitor  visitor-demo@museum.local (has 2 paid tickets)');
  console.log('  member   member-demo@museum.local  (active "Friends of the Museum" member)');
  console.log(problems === 0 ? '\nDONE, no problems.' : `\n${problems} step(s) FAILED, see lines above.`);
  if (problems) process.exitCode = 1;
}

seedMain();