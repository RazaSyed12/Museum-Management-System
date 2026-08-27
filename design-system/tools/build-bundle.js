const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const ROOT = 'c:/Users/HP/Documents/GitHub/Museum-Management-System/design-system';
const NS = 'HeritageMuseumDesignSystem_5a5154';

// Topological order: a module appears after everything it imports.
const ORDER = [
  'foundation/Icon', 'foundation/Logo', 'foundation/Media',
  'forms/Field', 'forms/Input', 'forms/Textarea', 'forms/Select', 'forms/RadioGroup',
  'forms/Button', 'forms/IconButton', 'forms/Checkbox', 'forms/SearchField',
  'forms/DateTimeField', 'forms/QuantityStepper', 'forms/ImageUpload',
  'feedback/StatusBadge', 'feedback/Alert', 'feedback/EmptyState', 'feedback/Skeleton',
  'feedback/Modal', 'feedback/Drawer',
  'cards/Card', 'cards/CollectionCard', 'cards/EventCard', 'cards/ItemCard',
  'cards/RecommendationCard', 'cards/StatCard',
  'data/DataTable', 'data/FilterPanel',
  'navigation/Tabs', 'navigation/Breadcrumbs', 'navigation/Pagination',
  'navigation/SiteHeader', 'navigation/SiteFooter', 'navigation/StaffSidebar',
  'navigation/StaffTopBar',
];

const IMPORT_RE = /^import\s+(?:\{([^}]*)\}|\w+)\s+from\s+['"][^'"]+['"];?\s*$/gm;

const parts = [];
const allExports = [];
const componentsMeta = [];

for (const rel of ORDER) {
  const file = path.join(ROOT, 'components', rel + '.jsx');
  let src = fs.readFileSync(file, 'utf8');

  // Collect the named imports this module pulls from sibling components.
  const needed = [];
  src = src.replace(IMPORT_RE, (m, named) => {
    if (named) named.split(',').map(s => s.trim()).filter(Boolean).forEach(n => needed.push(n));
    return '';
  });

  const exported = [...src.matchAll(/export\s+function\s+(\w+)/g)].map(m => m[1]);
  if (!exported.length) throw new Error('no exports found in ' + rel);
  src = src.replace(/export\s+function/g, 'function');

  const { code } = babel.transformSync(src, {
    presets: [[require.resolve('@babel/preset-react'), { runtime: 'classic', pragma: 'React.createElement', pragmaFrag: 'React.Fragment' }]],
    filename: file,
    compact: false,
    comments: true,
    babelrc: false,
    configFile: false,
  });

  const pre = needed.length ? '  var ' + needed.map(n => `${n} = NS.${n}`).join(', ') + ';\n' : '';
  parts.push(
    `/* ---- components/${rel}.jsx ---- */\n` +
    `(function () {\n${pre}${code.split('\n').map(l => l ? '  ' + l : l).join('\n')}\n` +
    `  ${exported.map(n => `NS.${n} = ${n};`).join(' ')}\n})();\n`
  );
  exported.forEach(n => { allExports.push(n); componentsMeta.push({ name: n, sourcePath: `components/${rel}.jsx` }); });
}

const header = '/* @ds-bundle: ' + JSON.stringify({ format: 4, namespace: NS, components: componentsMeta }) + ' */';

const out = [
  header,
  '/* Rebuilt locally from the component sources with @babel/preset-react.',
  '   The copy served by the design MCP was truncated at its 192 KB read cap,',
  '   so this bundle is regenerated rather than imported. Re-run',
  '   tools/build-bundle.js after editing any component source to refresh it. */',
  'window.' + NS + ' = window.' + NS + ' || {};',
  '(function () {',
  '  "use strict";',
  '  var NS = window.' + NS + ';',
  ...parts.map(p => p.split('\n').map(l => l ? '  ' + l : l).join('\n')),
  '})();',
  '',
].join('\n');

fs.writeFileSync(path.join(ROOT, '_ds_bundle.js'), out, 'utf8');
console.log('wrote _ds_bundle.js:', out.length, 'bytes,', allExports.length, 'exports');
console.log('exports:', allExports.join(', '));
