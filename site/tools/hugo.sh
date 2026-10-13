#!/usr/bin/env bash
# The site's Hugo, pinned. Prints the binary's path; downloads and checks it once if it is missing.
# Usage: "$(tools/hugo.sh)" build      Version and checksum are from the official release's checksums file.
set -euo pipefail
VERSION=0.167.0
SHA256=0163f5c3deddac1f494a1629ddc40c65d18de9d5794facd98f7f96ac2c7d8957   # hugo_extended_0.167.0_linux-amd64.tar.gz
DIR="${XDG_CACHE_HOME:-$HOME/.cache}/amtech-hugo/$VERSION"
BIN="$DIR/hugo"
if [ ! -x "$BIN" ]; then
  mkdir -p "$DIR"
  TGZ="$DIR/hugo.tgz"
  curl -fsSL -o "$TGZ" "https://github.com/gohugoio/hugo/releases/download/v$VERSION/hugo_extended_${VERSION}_linux-amd64.tar.gz"
  echo "$SHA256  $TGZ" | sha256sum -c --quiet - >&2
  tar -xzf "$TGZ" -C "$DIR" hugo
  rm -f "$TGZ"
fi
echo "$BIN"
