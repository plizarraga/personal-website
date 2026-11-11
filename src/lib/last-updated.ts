import { execFileSync } from 'node:child_process';

/**
 * Commit date, in strict ISO 8601 with its UTC offset, of the last commit that touched the site's content or assets.
 * Read at build time; falls back to the build time when git history is unavailable.
 */
function readLastModified(): string {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cI', '--', 'src', 'public'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(date)) return date;
  } catch {
    // Not a git checkout or git is missing.
  }
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/** Date and time with offset, for JSON-LD `dateModified`: Google flags a bare date as invalid. */
export const lastModified = readLastModified();

/** Calendar date (`YYYY-MM-DD`) of {@link lastModified}, as written in the commit's own time zone, for the footer. */
export const lastUpdated = lastModified.slice(0, 10);
