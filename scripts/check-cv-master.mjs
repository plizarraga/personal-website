// Runs in `pnpm run deploy`: the CV Master is the only source of the CV, so every bullet in `src/data/cv.ts`
// must appear word for word in `CV_MASTER.md`. Skipped when the private career repo is not next to this one
// (CI). Exits 1 with the bullets the master lacks.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { roles } from '../src/data/cv.ts';

const masterPath = fileURLToPath(new URL('../../career/master/CV_MASTER.md', import.meta.url));
if (!existsSync(masterPath)) {
  console.log('check-cv-master: ../career not found, skipped');
  process.exit(0);
}

const normalize = (text) => text.replace(/\s+/g, ' ').trim();
const master = normalize(readFileSync(masterPath, 'utf8'));

const bullets = roles.flatMap((role) => [
  ...role.bullets,
  ...role.projects.flatMap((project) => project.bullets),
]);
const missing = bullets.filter((bullet) => !master.includes(normalize(bullet)));

if (missing.length) {
  console.error(`check-cv-master: ${missing.length} bullet(s) in src/data/cv.ts are not in CV_MASTER.md:`);
  for (const bullet of missing) console.error(`  - ${bullet}`);
  console.error('  Add them to the master first (see README "Syncing the CV Master"), or revert them here.');
  process.exit(1);
}

console.log(`check-cv-master: ${bullets.length} bullets match the CV Master`);
