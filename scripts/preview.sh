#!/usr/bin/env bash
# Start a local preview of the site: embedded Postgres (PGlite) + Next.js.
#
#   ./scripts/preview.sh          # production build preview on :3000
#   ./scripts/preview.sh dev      # hot-reloading dev server on :3000
#
# Stop with Ctrl-C — both processes shut down together.
set -euo pipefail
cd "$(dirname "$0")/.."

MODE="${1:-start}"
PORT="${PORT:-3000}"
DB_PORT="${PREVIEW_DB_PORT:-5432}"
export DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@127.0.0.1:${DB_PORT}/app_db}"

[ -d node_modules ] || npm install

echo "[preview] starting embedded postgres on 127.0.0.1:${DB_PORT} ..."
PREVIEW_DB_PORT="$DB_PORT" node scripts/preview-db.mjs &
DB_PID=$!
trap 'kill $DB_PID 2>/dev/null || true' EXIT INT TERM

for _ in $(seq 1 40); do
  node -e "require('net').connect($DB_PORT,'127.0.0.1').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))" \
    2>/dev/null && break
  sleep 0.5
done

if [ "$MODE" = "dev" ]; then
  npx next dev -p "$PORT"
else
  npx next build
  npx next start -p "$PORT"
fi
