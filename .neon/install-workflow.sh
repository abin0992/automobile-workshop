#!/usr/bin/env bash
#
# Installs the Neon preview-branch workflow into .github/workflows/.
#
# Why this script exists
# ----------------------
# GitHub refuses any push or API write that creates a file under
# .github/workflows/ unless the credential holds the `workflows` permission.
# The GitHub App that produced this branch does not, so the workflow ships in
# .neon/ instead. Run this once with your own credentials to activate it.
#
#   ./.neon/install-workflow.sh          # move, commit and push
#   ./.neon/install-workflow.sh --no-push  # move and commit only
#
set -euo pipefail

cd "$(dirname "$0")/.."

SRC=".neon/neon-preview-branch.yml"
DEST_DIR=".github/workflows"
DEST="$DEST_DIR/neon-preview-branch.yml"

if [ ! -f "$SRC" ]; then
  if [ -f "$DEST" ]; then
    echo "✓ Already installed at $DEST — nothing to do."
    exit 0
  fi
  echo "✗ $SRC not found." >&2
  exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "Installing the Neon workflow on branch '$BRANCH'…"

mkdir -p "$DEST_DIR"
git mv "$SRC" "$DEST"

git commit -q -m "Add Neon preview-branch workflow

Creates an isolated Neon database branch for every pull request, applies the
Drizzle schema to it and deletes the branch when the PR closes.

Moved out of .neon/ now that it is being pushed with a credential holding the
\`workflows\` permission."

echo "✓ Committed $DEST"

if [ "${1:-}" = "--no-push" ]; then
  echo
  echo "Skipping push (--no-push). Push it yourself with:"
  echo "    git push origin $BRANCH"
else
  echo "Pushing to origin/$BRANCH…"
  if git push origin "$BRANCH"; then
    echo "✓ Pushed."
  else
    echo
    echo "✗ Push rejected." >&2
    echo "  Your credential also lacks the 'workflows' permission." >&2
    echo "  Either push from a personal account with the 'workflow' scope," >&2
    echo "  or paste the file into GitHub → Actions → New workflow." >&2
    exit 1
  fi
fi

cat <<'NEXT'

────────────────────────────────────────────────────────────────────────
One more step — the workflow needs two values to run.

In GitHub → Settings → Secrets and variables → Actions:

  Variable  NEON_PROJECT_ID   your Neon project ID
  Secret    NEON_API_KEY      a Neon API key with access to that project

Until both are set, the workflow will run and fail on the first Neon step.
────────────────────────────────────────────────────────────────────────
NEXT
