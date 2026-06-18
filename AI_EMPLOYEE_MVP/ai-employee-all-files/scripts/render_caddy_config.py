#!/usr/bin/env python3
"""
Render a Caddyfile for the AMTECH AI Employee host.

The generated Caddyfile exposes the authenticated provision hook and imports
per-client snippets written by provision_client.py into state/caddy/.
"""
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "host" / "Caddyfile.template"
OUT = ROOT / "state" / "caddy" / "Caddyfile"
PLACEHOLDER = ROOT / "state" / "caddy" / "00-placeholder.caddy"


def render(text, ctx):
    for key, value in ctx.items():
        text = text.replace("{{" + key + "}}", str(value))
    return text


def main():
    snippet_dir = os.environ.get("CADDY_SNIPPET_DIR") or str(ROOT / "state" / "caddy")
    ctx = {
        "ADMIN_EMAIL": os.environ.get("ADMIN_EMAIL") or "admin@amtechai.com",
        "PROVISION_HOOK_HOST": os.environ.get("PROVISION_HOOK_PUBLIC_HOST") or "hook.agents.amtechai.com",
        "PROVISION_HOOK_PORT": os.environ.get("PROVISION_HOOK_PORT") or "8787",
        "AI_EMPLOYEE_BASE_DOMAIN": os.environ.get("AI_EMPLOYEE_BASE_DOMAIN") or "agents.amtechai.com",
        "CADDY_SNIPPET_DIR": snippet_dir,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    if not PLACEHOLDER.exists():
        PLACEHOLDER.write_text("# Placeholder so Caddy import has at least one .caddy file before first client.\n")
    OUT.write_text(render(TEMPLATE.read_text(), ctx))
    print(OUT)


if __name__ == "__main__":
    main()
