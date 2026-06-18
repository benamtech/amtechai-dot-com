#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f .env.provision-hook ]]; then
  set -a
  source .env.provision-hook
  set +a
fi

if [[ -d .venv ]]; then
  source .venv/bin/activate
fi

exec python3 scripts/provision_hook_server.py "$@"
