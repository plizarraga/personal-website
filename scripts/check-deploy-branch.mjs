// Runs first in `pnpm run deploy`: production must be exactly what is merged on `main`. Fails on another branch,
// on uncommitted changes, and on a local `main` that is behind or ahead of `origin/main`. Exits 1 with the fix.
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const stop = (problem, fix) => {
  console.error(`check-deploy-branch: ${problem}\n  ${fix}`);
  process.exit(1);
};

// GitHub Actions checks out a detached HEAD; its branch is in GITHUB_REF_NAME.
const branch = process.env.GITHUB_REF_NAME || git('branch', '--show-current');
if (branch !== 'main') stop(`deploying from "${branch || 'a detached HEAD'}", not main.`, 'Merge the PR, then: git checkout main && git pull');

const dirty = git('status', '--porcelain');
if (dirty) stop('uncommitted changes would ship without being merged:\n' + dirty, 'Commit them through a PR, or stash them: git stash');

if (!process.env.GITHUB_ACTIONS) {
  git('fetch', '--quiet', 'origin', 'main');
  const [ahead, behind] = git('rev-list', '--left-right', '--count', 'HEAD...origin/main').split(/\s+/).map(Number);
  if (behind) stop(`main is ${behind} commit(s) behind origin/main.`, 'git pull');
  if (ahead) stop(`main has ${ahead} commit(s) not on origin/main.`, 'Open a PR for them; production only ships what is merged.');
}

console.log('check-deploy-branch: main, clean, and up to date with origin/main');
