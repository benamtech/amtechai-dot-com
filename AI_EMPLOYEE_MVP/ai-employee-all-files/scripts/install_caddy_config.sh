#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f .env.provision-hook ]]; then
  set -a
  source .env.provision-hook
  set +a
fi

caddyfile="$(python3 scripts/render_caddy_config.py)"
echo "Rendered $caddyfile"
echo
echo "To install it as the system Caddyfile on this host:"
echo "  sudo cp '$caddyfile' /etc/caddy/Caddyfile"
echo "  sudo caddy validate --config /etc/caddy/Caddyfile"
echo "  sudo systemctl reload caddy"
echo
echo "For automatic per-client reloads, set this in .env.provision-hook:"
echo "  CADDY_RELOAD_COMMAND=sudo systemctl reload caddy"
