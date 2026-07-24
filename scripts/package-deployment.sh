#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/out"
ZIP_FILE="$ROOT_DIR/deployment.zip"

if [ ! -d "$OUT_DIR" ]; then
  echo "Missing out/ directory. Run npm run build first."
  exit 1
fi

rm -f "$ZIP_FILE"

cd "$OUT_DIR"

# Keep runtime data out of deployment.zip. These files/folders are owned by the
# live server after first install and must not be overwritten on app updates.
zip -r "$ZIP_FILE" . \
  -x "uploads/*" \
  -x "uploads/**" \
  -x "api/database.db" \
  -x "api/database.sqlite" \
  -x "api/db.php" \
  -x "api/*.db" \
  -x "api/*.sqlite" \
  -x "api/*.log" \
  -x "api/error_log.txt" \
  -x "api/status-events.log" \
  -x "db_schema.sql"

if command -v unzip >/dev/null 2>&1; then
  if unzip -Z1 "$ZIP_FILE" | grep -E '^(uploads/|api/db\.php$|api/database\.(db|sqlite)$|api/.*\.(db|sqlite|log)$|db_schema\.sql$)' >/dev/null; then
    echo "deployment.zip contains runtime data. Aborting."
    exit 1
  fi
fi

echo "Created $ZIP_FILE without runtime data."
