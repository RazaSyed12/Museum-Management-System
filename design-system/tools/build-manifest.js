const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/HP/Documents/GitHub/Museum-Management-System/design-system';
const NS = 'HeritageMuseumDesignSystem_5a5154';

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/* ---- components: every exported function, ordered by source path ---- */
const components = [];
for (const f of walk(path.join(ROOT, 'components')).filter(f => f.endsWith('.jsx')).sort()) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/export\s+function\s+(\w+)/g)) {
    components.push({ name: m[1], sourcePath: rel(f) });
  }
}

/* ---- cards: from each preview file's first-line @dsCard marker ---- */
const attr = (s, k) => { const m = new RegExp(k + '="([^"]*)"').exec(s); return m ? m[1] : undefined; };
const cards = [];
for (const f of walk(ROOT).filter(f => /\.html$/.test(f)).sort()) {
  const first = fs.readFileSync(f, 'utf8').split('\n')[0];
  if (!first.includes('@dsCard')) continue;
  const c = { path: rel(f), group: attr(first, 'group'), viewport: attr(first, 'viewport'),
              subtitle: attr(first, 'subtitle'), name: attr(first, 'name') };
  cards.push(c);
}
cards.sort((a, b) => a.group.localeCompare(b.group) || a.path.localeCompare(b.path));

/* ---- tokens: parsed from the token stylesheets, last definition wins ---- */
const CSS_ORDER = ['colors.css', 'typography.css', 'spacing.css', 'elevation.css', 'motion.css'];
const FONT_ALIASES = new Set(['--text-heading', '--text-body', '--text-muted', '--text-inverse',
  '--text-accent', '--text-link', '--text-link-hover', '--action-disabled-text']);
function kindFor(file, name) {
  if (file === 'colors.css') return FONT_ALIASES.has(name) ? 'font' : 'color';
  if (file === 'typography.css') return 'font';
  if (file === 'spacing.css') return name.startsWith('--radius-') ? 'radius' : 'spacing';
  if (file === 'elevation.css') return name.startsWith('--scrim-') ? 'other' : 'shadow';
  if (file === 'motion.css') return name.startsWith('--transition-') ? 'color' : 'other';
  return 'other';
}
const tokens = [];
const seen = new Map();
for (const file of CSS_ORDER) {
  const src = fs.readFileSync(path.join(ROOT, 'tokens', file), 'utf8');
  for (const m of src.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)) {
    const name = m[1];
    const value = m[2].replace(/\/\*.*?\*\//g, '').trim();
    const kind = kindFor(file, name);
    const tok = { name, value, kind, definedIn: 'tokens/' + file };
    if (kind === 'other') tok.annotation = 'other';
    if (seen.has(name)) { Object.assign(seen.get(name), tok); }   // last definition wins
    else { seen.set(name, tok); tokens.push(tok); }
  }
}

const manifest = {
  namespace: NS,
  components,
  startingPoints: [
    { name: 'Button', path: 'components/forms/Button.jsx', previewPath: 'components/forms/buttons.card.html',
      kind: 'component', section: 'Forms', subtitle: 'Primary, secondary, accent, ghost and danger actions', viewport: '700x220' },
    { name: 'SiteHeader', path: 'components/navigation/SiteHeader.jsx', previewPath: 'components/navigation/navigation.card.html',
      kind: 'component', section: 'Navigation', subtitle: 'Responsive visitor header, signed-out and signed-in', viewport: '1440x120' },
  ],
  cards,
  templates: [],
  hasThumbnailHtml: fs.existsSync(path.join(ROOT, 'thumbnail.html')),
  globalCssPaths: ['tokens/fonts.css', 'tokens/colors.css', 'tokens/typography.css', 'tokens/spacing.css',
    'tokens/elevation.css', 'tokens/motion.css', 'tokens/base.css', 'styles.css'],
  tokens,
  themes: [],
  fonts: [],
  brandFonts: [
    { family: 'Cormorant Garamond', status: 'ok', tokens: ['--font-display'], path: 'tokens/typography.css' },
    { family: 'Source Sans 3', status: 'ok', tokens: ['--font-body'], path: 'tokens/typography.css' },
  ],
  source: 'spa',
};
fs.writeFileSync(path.join(ROOT, '_ds_manifest.json'), JSON.stringify(manifest), 'utf8');

/* ---- inject the token index into the adherence config ---- */
const adhPath = path.join(ROOT, '_adherence.oxlintrc.json');
const adh = JSON.parse(fs.readFileSync(adhPath, 'utf8'));
adh['x-omelette'].tokens = tokens.map(t => t.name).sort();
adh['x-omelette'].tokenKinds = Object.fromEntries(tokens.map(t => [t.name, t.kind]));
// keep fontFamilies last, matching the original key order
const { fontFamilies, ...restX } = adh['x-omelette'];
adh['x-omelette'] = { ...restX, fontFamilies };
fs.writeFileSync(adhPath, JSON.stringify(adh, null, 2) + '\n', 'utf8');

console.log('components:', components.length, '| cards:', cards.length, '| tokens:', tokens.length);
console.log('card groups:', [...new Set(cards.map(c => c.group))].join(', '));
