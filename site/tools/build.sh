#!/usr/bin/env bash
# Build site/ : Tailwind (site/tailwind.config.js over the templates and content), then Hugo, into site/public/.
# Usage: site/tools/build.sh [hugo args...]   e.g. site/tools/build.sh server --port 1314
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SITE="$ROOT/site"
cat "$SITE/assets/css/fonts.css" "$SITE/assets/css/base.css" "$SITE/assets/css/port.css" "$SITE/assets/css/article.css" > "$SITE/.tw-input.css"
rm -f "$SITE/assets/css/site.css"
# A Tailwind failure stops the build: without site.css Hugo would publish every page unstyled.
(cd "$ROOT" && node_modules/.bin/tailwindcss -c site/tailwind.config.js -i site/.tw-input.css -o site/assets/css/site.css --postcss site/postcss.config.js) 2>&1 | grep -v -e "^$" -e "Browserslist" -e "update-browserslist" -e "Why you should do it" || true
[ -s "$SITE/assets/css/site.css" ] || { echo "build: Tailwind did not write site.css" >&2; exit 1; }
HUGO="$("$SITE/tools/hugo.sh")"
cd "$SITE"
if [ "${1:-}" = "server" ]; then shift; exec "$HUGO" server "$@"; fi
exec "$HUGO" build --cleanDestinationDir "$@"
