#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements-local.txt

if [[ ! -f .env.provision-hook ]]; then
  cp .env.provision-hook.example .env.provision-hook
  echo "Created .env.provision-hook from the example. Fill in secrets before real provisioning."
fi

set -a
source .env.provision-hook
set +a

python scripts/check_local_setup.py
