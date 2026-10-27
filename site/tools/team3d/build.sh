#!/usr/bin/env bash
# Build the team3d harness page into a destination (default /tmp/t3d-public) with the site's pinned Hugo.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-/tmp/t3d-public}"
HUGO="$(bash "$HERE/../hugo.sh")"
cd "$HERE" && "$HUGO" build --quiet --cleanDestinationDir --destination "$OUT"
