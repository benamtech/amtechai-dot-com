#!/usr/bin/env bash
# Build site/ : the characters' data, then Hugo, into site/public/.
# Usage: site/tools/build.sh [hugo args...]   e.g. site/tools/build.sh server --port 1314
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SITE="$ROOT/site"
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
