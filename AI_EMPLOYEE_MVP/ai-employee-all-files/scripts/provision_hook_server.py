#!/usr/bin/env python3
"""
provision_hook_server.py - authenticated local HTTP hook for Netlify claims.

Run this on the PC/host that owns Hermes. Netlify posts a verified manifest to
this endpoint with `Authorization: Bearer $PROVISION_HOOK_TOKEN`; the hook writes
the manifest into state/provision-requests/ and starts provision_client.py.

Default behavior is asynchronous: the HTTP response returns after the provision
process is started, and logs are written under state/provision-logs/.

Example:
    PROVISION_HOOK_TOKEN=replace-me \
    python3 scripts/provision_hook_server.py --host 127.0.0.1 --port 8787

Expose it through Caddy, cloudflared, or another HTTPS tunnel, then set
PROVISION_HOOK_URL and PROVISION_HOOK_TOKEN in Netlify.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import threading
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent
STATE = ROOT / "state"
REQUESTS = STATE / "provision-requests"
LOGS = STATE / "provision-logs"
PROVISION = ROOT / "scripts" / "provision_client.py"


def now_stamp():
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def clean_client_id(value):
    client_id = str(value or "").strip().lower()
    client_id = re.sub(r"[^a-z0-9_-]+", "-", client_id).strip("-")
    if not client_id:
        raise ValueError("manifest.client_id is required")
    return client_id[:64]


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n")


def supabase_claim_patch(client_id, data):
    url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return

    endpoint = (
        f"{url.rstrip('/')}/rest/v1/ai_employee_claims"
        f"?client_id=eq.{quote(client_id, safe='')}"
    )
    payload = json.dumps({
        **data,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).encode("utf-8")
    req = Request(
        endpoint,
        data=payload,
        method="PATCH",
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
    )
    try:
        with urlopen(req, timeout=20) as res:
            if res.status >= 400:
                raise RuntimeError(f"Supabase status update failed: {res.status}")
    except (HTTPError, URLError, TimeoutError) as exc:
        print(f"[provision-hook] status update failed for {client_id}: {exc}", file=sys.stderr)


def run_provision(client_id, manifest_path, log_path, base_domain, enrich, dry_run):
    cmd = [sys.executable, str(PROVISION), "--manifest", str(manifest_path), "--base-domain", base_domain]
    if enrich:
        cmd.append("--enrich")
    if dry_run:
        cmd.append("--dry-run")

    log_path.parent.mkdir(parents=True, exist_ok=True)
    supabase_claim_patch(client_id, {"provision_status": "running", "provision_error": None})
    with log_path.open("a") as log_file:
        log_file.write(f"[provision-hook] start {datetime.now(timezone.utc).isoformat()}\n")
        log_file.write("[provision-hook] run: " + " ".join(cmd) + "\n")
        process = subprocess.run(
            cmd,
            cwd=str(ROOT),
            stdout=log_file,
            stderr=subprocess.STDOUT,
            text=True,
        )
        log_file.write(f"[provision-hook] exit={process.returncode} {datetime.now(timezone.utc).isoformat()}\n")

    if process.returncode == 0 and dry_run:
        supabase_claim_patch(
            client_id,
            {
                "provision_status": "accepted",
                "provision_error": f"dry-run completed successfully; real provisioning was not run; see {log_path}",
            },
        )
    elif process.returncode == 0:
        supabase_claim_patch(client_id, {"provision_status": "provisioned", "provision_error": None})
    else:
        supabase_claim_patch(
            client_id,
            {
                "provision_status": "failed",
                "provision_error": f"provision_client.py exited {process.returncode}; see {log_path}",
            },
        )


def start_provision_thread(client_id, manifest_path, log_path, base_domain, enrich, dry_run):
    thread = threading.Thread(
        target=run_provision,
        args=(client_id, manifest_path, log_path, base_domain, enrich, dry_run),
        daemon=True,
    )
    thread.start()
    return thread.name


class ProvisionHandler(BaseHTTPRequestHandler):
    server_version = "AMTECHProvisionHook/1.0"

    def do_POST(self):
        if self.path not in ("/", "/provision", "/provision-client"):
            self.send_json({"error": "not found"}, 404)
            return

        expected = self.server.hook_token
        auth = self.headers.get("Authorization", "")
        if not expected or auth != f"Bearer {expected}":
            self.send_json({"error": "unauthorized"}, 401)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            manifest = json.loads(self.rfile.read(length).decode("utf-8"))
            client_id = clean_client_id(manifest.get("client_id"))
            stamp = now_stamp()
            manifest_path = REQUESTS / f"{stamp}-{client_id}.json"
            log_path = LOGS / f"{stamp}-{client_id}.log"
            write_json(manifest_path, manifest)
            worker = start_provision_thread(
                client_id,
                manifest_path,
                log_path,
                self.server.base_domain,
                self.server.enrich,
                self.server.dry_run,
            )
            self.send_json({
                "ok": True,
                "accepted": True,
                "client_id": client_id,
                "worker": worker,
                "manifest_path": str(manifest_path),
                "log_path": str(log_path),
            }, 202)
        except Exception as exc:  # noqa: BLE001 - hook must return useful failure details
            self.send_json({"error": str(exc)}, 400)

    def do_GET(self):
        if self.path == "/health":
            self.send_json({"ok": True})
            return
        self.send_json({"error": "not found"}, 404)

    def log_message(self, fmt, *args):
        print(f"[provision-hook] {self.address_string()} {fmt % args}", file=sys.stderr)

    def send_json(self, body, status=200):
        data = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default=os.environ.get("PROVISION_HOOK_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PROVISION_HOOK_PORT", "8787")))
    parser.add_argument("--base-domain", default=os.environ.get("AI_EMPLOYEE_BASE_DOMAIN", "agents.amtechai.com"))
    parser.add_argument("--enrich", action="store_true", default=os.environ.get("AI_EMPLOYEE_ENRICH") == "1")
    parser.add_argument("--dry-run-provision", action="store_true", default=os.environ.get("PROVISION_HOOK_DRY_RUN") == "1")
    args = parser.parse_args()

    token = os.environ.get("PROVISION_HOOK_TOKEN", "")
    if not token:
        raise SystemExit("PROVISION_HOOK_TOKEN is required")

    server = ThreadingHTTPServer((args.host, args.port), ProvisionHandler)
    server.hook_token = token
    server.base_domain = args.base_domain
    server.enrich = args.enrich
    server.dry_run = args.dry_run_provision

    print(f"[provision-hook] listening on http://{args.host}:{args.port}")
    print(f"[provision-hook] base domain: {args.base_domain}")
    if args.dry_run_provision:
        print("[provision-hook] dry-run provisioning is ON")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[provision-hook] stopped")


if __name__ == "__main__":
    main()
