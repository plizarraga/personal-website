# AGENTS.md

Read [`README.md`](README.md) before changing the site: its "Content rules" section says where every fact comes from, and [`GLOSSARY.md`](GLOSSARY.md) defines the terms used in code and content.

To write or schedule a blog post, follow README "Publishing a post": drafts stay on their own branch, and `published` is the day the post goes live, in Pacific time.

Cloudflare and search-console settings live outside the repo. Read the live zone state through the Cloudflare MCP before advising on it, and record every change in the table under README "Deployment" in the same change.

## Dependabot

[`.github/dependabot.yml`](.github/dependabot.yml) opens PRs every Monday: one group for production minor and patch updates, one for development minor and patch updates, one PR per major update, and one per GitHub Action. CI (`pnpm build`) is the merge gate.

- **Merge order:** small single-dependency PRs first, the grouped PRs last, one at a time. After each merge the next PR may need a rebase; comment `@dependabot rebase` on it.
- **Lockfile conflicts:** when Dependabot cannot rebase, regenerate the lockfile on the PR branch:

  ```bash
  git fetch origin && git merge origin/main        # pnpm-lock.yaml will conflict
  git checkout origin/main -- pnpm-lock.yaml
  pnpm install --no-frozen-lockfile
  pnpm install --frozen-lockfile && pnpm build
  git add pnpm-lock.yaml && git commit -m "chore(deps): merge main and regenerate lockfile" && git push
  ```

- **Re-run, do not investigate:** `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` (a transitive package is younger than pnpm's 1-day `minimumReleaseAge`; re-run CI the next day) and network timeouts during install (`gh run rerun <id> --failed`).

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `plizarraga/personal-website`, managed with `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` at the root and `docs/adr/`. See `docs/agents/domain.md`.
