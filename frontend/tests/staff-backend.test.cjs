const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

// Load the browser-independent API adapter with the project's TypeScript compiler.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
const { createStaffBackendApi, StaffBackendError } = require('../src/lib/api/staff-backend.ts');
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

test('empty backend lists remain empty', async () => {
  const paths = [];
  const api = createStaffBackendApi(async (path) => {
    paths.push(path);
    return json({ collections: [], total: 0 });
  });
  assert.deepEqual(await api.list('collections'), { rows: [], total: 0, page: 1, pageSize: 10 });
  assert.match(paths[0], /^\/collections\?/);
});

test('staff records use exactly the backend response', async () => {
  const record = { collection_id: 'backend-only', name: 'Backend collection' };
  const api = createStaffBackendApi(async () => json({ collection: record }));
  assert.deepEqual(await api.get('collections', 'backend-only'), record);
});

test('backend outages propagate instead of returning sample records', async () => {
  const offline = new TypeError('Failed to fetch');
  const api = createStaffBackendApi(async () => { throw offline; });
  await assert.rejects(api.list('events'), (error) => error === offline);
});

test('backend authorization failures are retained', async () => {
  for (const status of [401, 403]) {
    const api = createStaffBackendApi(async () => json({
      error: { message: 'Access denied', code: 'forbidden' },
    }, status));
    await assert.rejects(api.request('/staff/me'), (error) =>
      error instanceof StaffBackendError && error.status === status && error.code === 'forbidden');
  }
});

test('dashboard, report, settings and notification failures never return demo data', async () => {
  const api = createStaffBackendApi(async () => json({
    error: { message: 'Backend unavailable', code: 'unavailable' },
  }, 503));
  for (const path of ['/admin/dashboard', '/admin/reports/events', '/admin/notifications']) {
    await assert.rejects(api.request(path), (error) => error.status === 503);
  }
  await assert.rejects(api.request('/me/profile', {
    method: 'PATCH', body: JSON.stringify({ full_name: 'Staff member' }),
  }), (error) => error.status === 503);
});

test('catalogue and operational search results both come from the backend', async () => {
  const api = createStaffBackendApi(async (path) => path.startsWith('/admin/search?')
    ? json({ results: [{ kind: 'booking', id: 'booking-1', label: 'Backend booking' }] })
    : json({ collections: [{ collection_id: 'collection-1', name: 'Backend collection' }] }));
  assert.deepEqual((await api.search('Backend')).map((row) => row.label),
    ['Backend collection', 'Backend booking']);
});
