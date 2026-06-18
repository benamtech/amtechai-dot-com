#!/usr/bin/env python3
"""
Check the local Hermes PC prerequisites without provisioning a real client.
"""
import importlib.util
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXAMPLE_MANIFEST = ROOT / "schema" / "client-manifest.example.json"
PROVISION = ROOT / "scripts" / "provision_client.py"
RENDER_CADDY = ROOT / "scripts" / "render_caddy_config.py"

REQUIRED_ENV = [
    "PROVISION_HOOK_TOKEN",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "ANTHROPIC_API_KEY",
]

OPTIONAL_ENV = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "XAI_API_KEY",
]


def ok(message):
    print(f"[ok] {message}")


def warn(message):
    print(f"[warn] {message}")


def fail(message):
    print(f"[fail] {message}")


def has_module(name):
    return importlib.util.find_spec(name) is not None


def main():
    failures = 0

    for module in ["twilio", "openai"]:
        if has_module(module):
            ok(f"python module available: {module}")
        else:
            warn(f"python module missing: {module} (run scripts/setup_local_pc.sh)")

    if shutil.which("hermes"):
        ok("hermes command found")
    else:
        warn("hermes command not found in PATH; real provisioning cannot run until Hermes is installed")

    if shutil.which("caddy"):
        ok("caddy command found")
    else:
        warn("caddy command not found in PATH; install Caddy or use an equivalent reverse proxy/tunnel")

    if shutil.which("supabase"):
        ok("supabase command found")
    else:
        warn("supabase command not found in PATH; needed for npm run ai:supabase:push")

    for key in REQUIRED_ENV:
        if os.environ.get(key):
            ok(f"env set: {key}")
        else:
            warn(f"env missing: {key}")

    for key in OPTIONAL_ENV:
        if os.environ.get(key):
            ok(f"optional env set: {key}")
        else:
            warn(f"optional env missing: {key}")

    result = subprocess.run(
        [sys.executable, str(PROVISION), "--manifest", str(EXAMPLE_MANIFEST), "--dry-run"],
        cwd=str(ROOT),
        text=True,
        capture_output=True,
    )
    if result.returncode == 0:
        ok("provision_client.py dry-run passed")
    else:
        failures += 1
        fail("provision_client.py dry-run failed")
        print(result.stdout)
        print(result.stderr)

    caddy = subprocess.run(
        [sys.executable, str(RENDER_CADDY)],
        cwd=str(ROOT),
        text=True,
        capture_output=True,
    )
    if caddy.returncode == 0:
        ok(f"Caddyfile render passed: {caddy.stdout.strip()}")
    else:
        failures += 1
        fail("Caddyfile render failed")
        print(caddy.stdout)
        print(caddy.stderr)

    return failures


if __name__ == "__main__":
    raise SystemExit(main())
