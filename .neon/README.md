# Neon preview-branch workflow

`neon-preview-branch.yml` is the GitHub Actions workflow that gives every pull
request its own isolated Neon database branch.

## Why it lives here instead of `.github/workflows/`

The GitHub App used to push this branch does not hold the `workflows`
permission, so GitHub rejects any push that creates or edits a file under
`.github/workflows/`. The workflow is therefore parked here, ready to install.

This is a GitHub platform restriction, not a repository setting — it applies
to `git push` and to every REST write path alike, so it cannot be worked
around from here. It takes one command from you.

## Installing it

Run this from a clone where you are authenticated as yourself:

```bash
./.neon/install-workflow.sh
```

That moves the file into `.github/workflows/`, commits it and pushes. Use
`--no-push` to stop after the commit.

If your own credential also lacks the `workflows` permission, paste the file's
contents into **Actions → New workflow → set up a workflow yourself** in the
GitHub web UI instead — the web editor is not subject to the restriction.

## Required repository configuration

Set these once under **Settings → Secrets and variables → Actions**:

| Kind     | Name              | Value                                      |
| -------- | ----------------- | ------------------------------------------ |
| Variable | `NEON_PROJECT_ID` | Your Neon project ID                       |
| Secret   | `NEON_API_KEY`    | A Neon API key with access to that project |

## What it does

- **PR opened / reopened / updated** — creates the Neon branch
  `preview/pr-<number>-<branch>`, applies `src/db/schema.ts` to it with
  `drizzle-kit push`, and posts the schema diff as a PR comment.
- **PR closed** — deletes the branch.

Branches expire after 14 days, so an abandoned PR cannot quietly consume the
project's branch quota.

Migrations deliberately use the **unpooled** connection string: Neon's
transaction pooler does not support every statement a migration issues. The
connection string contains credentials, so it must never be echoed into the
build log.
