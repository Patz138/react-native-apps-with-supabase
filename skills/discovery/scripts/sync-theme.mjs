#!/usr/bin/env node
/**
 * Sync the canonical theme.json into every skill's assets/ folder.
 *
 * Canonical source: packages/shared-components/src/theme.json
 * Targets:          skills/<skill>/assets/theme.json (every skill folder containing a SKILL.md)
 *
 * Usage: node skills/discovery/scripts/sync-theme.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..', '..');

const canonicalPath = join(repoRoot, 'packages/shared-components/src/theme.json');
const skillsRoot = join(repoRoot, 'skills');

const canonical = readFileSync(canonicalPath, 'utf-8');

const skillDirs = readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) => existsSync(join(skillsRoot, entry.name, 'SKILL.md')))
  .map((entry) => entry.name);

let updated = 0;
let unchanged = 0;

for (const skill of skillDirs) {
  const assetsDir = join(skillsRoot, skill, 'assets');
  const target = join(assetsDir, 'theme.json');

  if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true });
  }

  const current = existsSync(target) ? readFileSync(target, 'utf-8') : null;
  if (current === canonical) {
    unchanged++;
    continue;
  }

  writeFileSync(target, canonical, 'utf-8');
  updated++;
  console.log(`updated: skills/${skill}/assets/theme.json`);
}

console.log(`\nTheme sync done — ${updated} updated, ${unchanged} already up to date.`);
console.log(`Canonical source: packages/shared-components/src/theme.json`);
