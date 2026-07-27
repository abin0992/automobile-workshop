# Neon preview-branch workflow

`neon-preview-branch.yml` is the GitHub Actions workflow that gives every pull
request its own isolated Neon database branch.

## Why it lives here instead of `.github/workflows/`

The GitHub App used to push this branch does not hold the `workflows`
permission, so GitHub rejects any push that creates or edits a file under
`.github/workflows/`. The workflow is therefore parked here, ready to install.

## Installing it

Either copy it into place locally and push with your own credentials:

```bash
mkdir -p .github/workflows
git mv .neon/neon-preview-branch.yml .github/workflows/
git commit -m "Add Neon preview-branch workflow"
git push
```

…or paste the file's contents into **Actions → New workflow → set up a
workflow yourself** in the GitHub web UI, which is not subject to the same
restriction.

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
