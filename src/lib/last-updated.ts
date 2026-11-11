import { execFileSync } from 'node:child_process';

/**
 * Date (`YYYY-MM-DD`) of the last commit that touched the site's content or assets.
 * Read at build time; falls back to today's date when git history is unavailable.
 */
function readLastUpdated(): string {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', 'src', 'public'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  } catch {
    // Not a git checkout or git is missing.
  }
  return new Date().toISOString().slice(0, 10);
}

export const lastUpdated = readLastUpdated();
