#!/usr/bin/env bash
# Build site/ : Tailwind (the app's own theme and index.css, over the Hugo templates), then Hugo.
# Usage: site/tools/build.sh [hugo args...]   e.g. site/tools/build.sh server --port 1314
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SITE="$ROOT/site"
cat "$ROOT/src/index.css" "$SITE/assets/css/port.css" "$SITE/assets/css/article.css" > "$SITE/.tw-input.css"
(cd "$ROOT" && node_modules/.bin/tailwindcss -c site/tailwind.config.js -i site/.tw-input.css -o site/assets/css/site.css --postcss postcss.config.js 2>&1 | grep -v "^$" | grep -v "Browserslist" || true)
HUGO="$("$SITE/tools/hugo.sh")"
cd "$SITE"
if [ "${1:-}" = "server" ]; then shift; exec "$HUGO" server "$@"; fi
exec "$HUGO" build --cleanDestinationDir "$@"
