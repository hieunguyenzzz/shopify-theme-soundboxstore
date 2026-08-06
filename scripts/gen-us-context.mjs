// Generates the US market contextual templates (templates/*.context.us.json) by converting
// metric measurements in the parent templates to imperial. SBS-369.
//
//   node scripts/gen-us-context.mjs --report   # print every conversion, write nothing
//   node scripts/gen-us-context.mjs --check    # report overrides that no longer match the parent
//   node scripts/gen-us-context.mjs --resync   # additionally rebuild those stale overrides
//   node scripts/gen-us-context.mjs            # write/patch the context files
//
// Parent templates stay metric and remain the source of truth. Blocks already present in a
// context file are left alone, so hand edits made in the theme editor survive a re-run — except
// under --resync, which rebuilds the ones that have fallen out of step with their parent.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const TEMPLATES = 'templates';
const MARKET = 'us';

// Lengths and weights only — the scope of SBS-369.
//
// Area/volume (m², m³, m³/hr) are deliberately NOT converted: they are sustainability
// denominators and airflow ratings rather than product dimensions, the existing hand-made US
// overrides leave them metric, and a bare m²/m³ pattern also matches the `!1m2!3m2!` segments
// inside the Google Maps embed URLs stored in page templates.
//
// Emissions figures stay metric — they are the internationally quoted unit. The lookahead is
// case-insensitive and accepts the Unicode subscript because the source spells the same figure
// four ways: "kg CO2e", "kg Co2e", "kg CO₂e" and "kg SO2e".
const EMISSIONS = '(?:[cs]o[2₂]e|po[4₄])';

const RULES = [
  { re: /(\d+(?:\.\d+)?)\s?cm\b/g, to: (n) => `${fmt(n / 2.54)}in` },
  { re: /(\d+(?:\.\d+)?)\s?mm\b/g, to: (n) => `${fmt(n / 25.4)}in` },
  {
    re: new RegExp(`(\\d+(?:\\.\\d+)?)\\s?kg\\b(?!\\s*${EMISSIONS})`, 'gi'),
    to: (n) => `${fmt(n * 2.20462)} lb`,
  },
];

const fmt = (n) => n.toFixed(2);

// Shopify writes JSON templates with a leading /* ... */ comment block.
function parse(file) {
  return JSON.parse(readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//, ''));
}

function header(file) {
  const match = existsSync(file) && readFileSync(file, 'utf8').match(/^\/\*[\s\S]*?\*\/\s*/);
  return match ? match[0] : '';
}

// Match Shopify's own serialisation so re-running produces a minimal diff: forward slashes are
// escaped, and empty objects are expanded across two lines.
function serialize(obj) {
  return JSON.stringify(obj, null, 2)
    .replace(/\//g, '\\/')
    .replace(/^(\s*)("[^"]+": )\{\}/gm, (_, indent, key) => `${indent}${key}{\n${indent}}`);
}

function convert(str) {
  let out = str;
  for (const { re, to } of RULES) {
    out = out.replace(re, (_, n) => to(parseFloat(n)));
  }
  return out;
}

const check = process.argv.includes('--check');
const resync = process.argv.includes('--resync');
const report = process.argv.includes('--report') || check;
const drift = [];
const parents = readdirSync(TEMPLATES)
  .filter((f) => f.endsWith('.json') && !f.includes('.context.'))
  .sort();

let templatesWritten = 0;
let blocksAdded = 0;
let valuesConverted = 0;
let blocksSkipped = 0;
let blocksResynced = 0;

for (const name of parents) {
  const parentPath = join(TEMPLATES, name);
  let parent;
  try {
    parent = parse(parentPath);
  } catch (err) {
    console.error(`SKIP ${name}: ${err.message}`);
    continue;
  }
  if (!parent.sections) continue;

  const ctxPath = join(TEMPLATES, name.replace(/\.json$/, `.context.${MARKET}.json`));
  const existing = existsSync(ctxPath) ? parse(ctxPath) : null;
  const sections = {};
  const lines = [];

  for (const [sectionId, section] of Object.entries(parent.sections)) {
    for (const [blockId, block] of Object.entries(section.blocks || {})) {
      // Already overridden by hand or by a previous run — leave it alone. In --check mode,
      // flag it when it no longer matches a fresh conversion of the parent: either the parent
      // was edited after the override was written, or the override was wrong to begin with.
      const override = existing?.sections?.[sectionId]?.blocks?.[blockId];
      let drifted = false;
      if (override) {
        for (const [key, value] of Object.entries(block.settings || {})) {
          if (typeof value !== 'string') continue;
          const expected = convert(value);
          const actual = override.settings?.[key];
          if (typeof actual !== 'string' || expected === value || actual === expected) continue;
          drifted = true;
          if (check) drift.push({ file: ctxPath, blockId, key, expected, actual });
        }
        // --resync rebuilds drifted blocks from the parent, which is the maintained source of
        // truth; without it an override that predates a parent edit silently keeps stale specs.
        if (!drifted || !resync) {
          blocksSkipped++;
          continue;
        }
        blocksResynced++;
      }

      const settings = {};
      for (const [key, value] of Object.entries(block.settings || {})) {
        if (typeof value !== 'string') continue;
        const converted = convert(value);
        if (converted === value) continue;
        settings[key] = converted;
        for (const { re } of RULES) {
          valuesConverted += (value.match(re) || []).length;
        }
        if (report) {
          lines.push(`    [${blockId.slice(0, 8)}] ${key}`);
          lines.push(`      - ${strip(value)}`);
          lines.push(`      + ${strip(converted)}`);
        }
      }

      if (Object.keys(settings).length) {
        sections[sectionId] ??= { settings: {}, blocks: {} };
        sections[sectionId].blocks[blockId] = { settings };
        if (!override) blocksAdded++;
      }
    }
  }

  if (!Object.keys(sections).length) continue;

  // Merge on top of the existing context file so untouched overrides survive.
  const merged = {
    parent: name,
    context: { market: MARKET },
    sections: existing?.sections ? structuredClone(existing.sections) : {},
  };
  for (const [sectionId, section] of Object.entries(sections)) {
    merged.sections[sectionId] ??= { settings: {}, blocks: {} };
    merged.sections[sectionId].blocks ??= {};
    Object.assign(merged.sections[sectionId].blocks, section.blocks);
  }

  templatesWritten++;
  if (report) {
    console.log(`\n${existing ? 'PATCH' : 'NEW  '} ${ctxPath}`);
    console.log(lines.join('\n'));
  } else {
    writeFileSync(ctxPath, header(ctxPath) + serialize(merged) + '\n');
  }
}

if (check) {
  console.log(`\n=== ${drift.length} existing override(s) out of sync with the parent template`);
  for (const d of drift) {
    console.log(`\n${d.file} [${d.blockId.slice(0, 8)}] ${d.key}`);
    console.log(`  live     ${strip(d.actual)}`);
    console.log(`  expected ${strip(d.expected)}`);
  }
}

console.log(
  `\n${report ? 'Would write' : 'Wrote'} ${templatesWritten} context templates | ` +
    `${blocksAdded} blocks added, ${blocksResynced} resynced, ` +
    `${blocksSkipped} existing blocks left untouched, ` +
    `${valuesConverted} values converted`
);

function strip(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
