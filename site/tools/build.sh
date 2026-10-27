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
# The new pages' characters, drawn once into data/characters.json (site/tools/kit/characters-data.mjs).
node "$SITE/tools/kit/characters-data.mjs"
# Each page's lastmod is its content file's last commit (hugo.toml enableGitInfo). A shallow clone (Vercel's Git
# builds are shallow) would date every file older than its history to the oldest commit it has, so deepen it; where
# that is not possible, or there is no .git at all, turn git dates off and let front matter (then reviewed.date) stand.
if ! git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
  echo "build: no git history here; lastmod comes from front matter" >&2; export HUGO_ENABLEGITINFO=false
elif [ "$(git -C "$ROOT" rev-parse --is-shallow-repository)" = "true" ]; then
  git -C "$ROOT" fetch --unshallow --quiet 2>/dev/null || { echo "build: shallow clone that cannot be deepened; lastmod comes from front matter" >&2; export HUGO_ENABLEGITINFO=false; }
fi
HUGO="$("$SITE/tools/hugo.sh")"
cd "$SITE"
if [ "${1:-}" = "server" ]; then shift; exec "$HUGO" server "$@"; fi
exec "$HUGO" build --cleanDestinationDir "$@"
