#!/usr/bin/env bash
# Netlify's build, second half: after `npm run build` has made the React app and pre-rendered every route into
# dist/, build site/ (Hugo) and lay its pages over dist/ so Hugo serves them and React serves the rest.
#   1. The React shell is kept as dist/spa.html, and the SPA catch-all points there: Hugo's Home becomes
#      dist/index.html, and an unknown URL must still get the React app, never a 200 copy of Home.
#   2. Hugo's pages and assets are copied over dist/ (its /css/ and /js/ never collide with Vite's /assets/).
# Usage (repo root): bash site/tools/overlay.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIST="$ROOT/dist"
[ -f "$DIST/index.html" ] || { echo "overlay: no dist/index.html; run npm run build first" >&2; exit 1; }
cp -f "$DIST/index.html" "$DIST/spa.html"
grep -qx '/\*  /index.html  200' "$DIST/_redirects" || { echo "overlay: the SPA catch-all line in _redirects has changed; update this script" >&2; exit 1; }
sed -i 's#^/\*  /index.html  200$#/*  /spa.html  200#' "$DIST/_redirects"
"$ROOT/site/tools/build.sh"
cp -rf "$ROOT/site/public/." "$DIST/"
n=$(cd "$ROOT/site/public" && find . -name index.html | wc -l)
echo "overlay: $n Hugo page(s) laid over dist/; SPA catch-all -> /spa.html"
