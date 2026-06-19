#!/usr/bin/env python3
"""
provision_client.py — stamp out one isolated Hermes profile (one AI employee)
from a client manifest. This is the core of the AMTECH AI Employee MVP. It is
orchestration around Hermes, not custom agent logic.

What it does, given a manifest:
  1. Decide the profile name, workspace dir, webhook host, and a unique port.
  2. Claim a Twilio number from the pool (scripts/claim_number.py).
  3. Create the Hermes profile.
  4. Render the template files (SOUL, USER, MEMORY, config, .env, skills,
     workspace AGENTS + brain) with the manifest values and copy them into place.
  5. Register the two daily check-in cron jobs.
  6. Emit a reverse-proxy (Caddy) snippet mapping the client subdomain to the port.
  7. Install + start the per-client gateway as a service.

Run with --dry-run first. It prints every action and changes nothing.

Usage:
    python3 provision_client.py --manifest ../schema/client-manifest.example.json \
        [--base-domain agents.amtechai.com] [--dry-run]

Env:
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, ANTHROPIC_API_KEY
"""
import argparse
import json
import os
import re
import shlex
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "template"
CRON_TEMPLATE = ROOT / "cron" / "jobs.template.json"
STATE = ROOT / "state"
HERMES_HOME = Path(os.environ.get("HERMES_ROOT", Path.home() / ".hermes"))
WORKSPACES = Path(os.environ.get("AMTECH_WORKSPACES", Path.home() / "amtech" / "clients"))
BASE_PORT = 8100


def log(msg):
    print(f"[provision] {msg}")


def run(cmd, dry_run):
    log("run: " + " ".join(str(c) for c in cmd))
    if dry_run:
        return ""
    out = subprocess.run(cmd, capture_output=True, text=True)
    if out.returncode != 0:
        log(f"  ! exited {out.returncode}: {out.stderr.strip()}")
        raise SystemExit(out.returncode)
    return out.stdout.strip()


def run_optional(command, dry_run):
    if not command:
        return
    cmd = shlex.split(command)
    log("run: " + " ".join(str(c) for c in cmd))
    if dry_run:
        return
    out = subprocess.run(cmd, capture_output=True, text=True)
    if out.returncode != 0:
        log(f"  ! optional command exited {out.returncode}: {out.stderr.strip()}")


def render(text, ctx):
    """Replace {{TOKEN}} with ctx values. Unknown tokens are left visible on purpose."""
    def sub(m):
        key = m.group(1).strip()
        return str(ctx.get(key, m.group(0)))
    return re.sub(r"\{\{\s*([A-Z0-9_]+)\s*\}\}", sub, text)


def render_file(src, dst, ctx, dry_run):
    content = render(src.read_text(), ctx)
    log(f"render: {src.name} -> {dst}")
    if not dry_run:
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(content)


def next_port():
    """Assign the next free port by counting existing client workspaces."""
    if not WORKSPACES.exists():
        return BASE_PORT
    return BASE_PORT + len([p for p in WORKSPACES.iterdir() if p.is_dir()])


# Maps onboarding question ids to manifest fields. The first field is the
# primary one (gets the raw answer in the no-AI path). Mirrors the deployed
# Netlify claim handler so the web form and the host agree on the contract.
ANSWER_FIELD_MAP = {
    "q1_business": ["business_name", "business_type"],
    "q2_team": ["team_size", "team_structure"],
    "q3_office_work": ["top_office_work", "workloads"],
    "q4_tools": ["tools"],
    "q5_money": ["revenue_band", "avg_customer"],
    "q6_ideal_customer": ["ideal_customer"],
    "q7_friction_customer": ["friction_customer"],
}


def resolve_fields(manifest, use_enrich):
    """Ensure the flat per-field values exist on the manifest.

    Three cases:
      - manifest already carries flat fields (e.g. the example) -> leave them.
      - raw `answers` present and --enrich -> LLM structures them into fields.
      - raw `answers` present, no enrich -> deterministic map: raw answer into
        the primary field; secondary fields stay blank for the agent to learn.
    Nothing is ever lost: the raw answers also go verbatim into the brain.
    """
    answers = manifest.get("answers") or {}
    if not answers:
        return  # provisioning from a flat manifest

    if use_enrich:
        try:
            sys.path.insert(0, str(ROOT / "scripts"))
            from enrich import enrich as ai_enrich
            structured = ai_enrich(answers)
            for k, v in structured.items():
                if v and not manifest.get(k):
                    manifest[k] = v
            log("enrichment: applied AI-structured fields")
            return
        except Exception as e:  # noqa: BLE001 - enrichment must never block provisioning
            log(f"enrichment failed, falling back to deterministic map: {e}")

    for qid, fields in ANSWER_FIELD_MAP.items():
        if answers.get(qid) and not manifest.get(fields[0]):
            manifest[fields[0]] = answers[qid]


def intake_raw(manifest):
    """Format raw answers for the brain so the agent always has the source text."""
    answers = manifest.get("answers") or {}
    if not answers:
        return "(provisioned from a structured manifest)"
    return "\n".join(f"- {qid}: {text}" for qid, text in answers.items())


def build_context(manifest, agent_phone, webhook_url, webhook_port, workspace_dir):
    return {
        "CLIENT_ID": manifest["client_id"],
        "AGENT_NAME": manifest.get("agent_name", "your AI employee"),
        "SUPERVISOR_NAME": manifest["supervisor_name"],
        "BUSINESS_NAME": manifest["business_name"],
        "BUSINESS_TYPE": manifest["business_type"],
        "TEAM_SIZE": manifest.get("team_size", ""),
        "TEAM_STRUCTURE": manifest.get("team_structure", ""),
        "TOP_OFFICE_WORK": manifest.get("top_office_work", ""),
        "TOOLS": manifest.get("tools", ""),
        "REVENUE_BAND": manifest.get("revenue_band", ""),
        "AVG_CUSTOMER": manifest.get("avg_customer", ""),
        "IDEAL_CUSTOMER": manifest.get("ideal_customer", ""),
        "FRICTION_CUSTOMER": manifest.get("friction_customer", ""),
        "WORKLOADS": manifest.get("workloads", ""),
        "TIMEZONE": manifest.get("timezone", "America/Los_Angeles"),
        "CLIENT_PHONE": manifest["supervisor_phone"],
        "AGENT_PHONE": agent_phone,
        "WEBHOOK_URL": webhook_url,
        "WEBHOOK_PORT": str(webhook_port),
        "WORKSPACE_DIR": str(workspace_dir),
        "INTAKE_RAW": intake_raw(manifest),
        "ANTHROPIC_API_KEY": os.environ.get("ANTHROPIC_API_KEY", "REPLACE_ME"),
        "TWILIO_ACCOUNT_SID": os.environ.get("TWILIO_ACCOUNT_SID", "REPLACE_ME"),
        "TWILIO_AUTH_TOKEN": os.environ.get("TWILIO_AUTH_TOKEN", "REPLACE_ME"),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--base-domain", default="agents.amtechai.com")
    ap.add_argument("--enrich", action="store_true",
                    help="OPTIONAL: structure raw form answers with an LLM before rendering. Off by default.")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    dry = args.dry_run

    manifest = json.loads(Path(args.manifest).read_text())
    resolve_fields(manifest, use_enrich=args.enrich)
    cid = manifest["client_id"]
    profile = f"client_{cid}"
    workspace_dir = WORKSPACES / cid / "workspace"
    profile_dir = HERMES_HOME / "profiles" / profile
    host = f"{cid}.{args.base_domain}"
    webhook_url = f"https://{host}/webhooks/twilio"
    webhook_port = next_port()

    log(f"client={cid} profile={profile} host={host} port={webhook_port}")

    # 1. Claim a number from the pool
    area = manifest.get("area_code_preference")
    claim_cmd = [sys.executable, str(ROOT / "scripts" / "claim_number.py"),
                 "--client-id", cid, "--webhook-url", webhook_url]
    if area:
        claim_cmd += ["--area-code", str(area)]
    if dry:
        claim_cmd.append("--dry-run")
    agent_phone = run(claim_cmd, dry).splitlines()[-1] if not dry else "+1XXXXXXXXXX"
    log(f"agent number: {agent_phone}")

    ctx = build_context(manifest, agent_phone, webhook_url, webhook_port, workspace_dir)

    # 2. Create the Hermes profile
    run(["hermes", "profile", "create", profile], dry)

    # 3. Render identity + memory + config + env into the profile home
    render_file(TEMPLATE / "SOUL.md", profile_dir / "SOUL.md", ctx, dry)
    render_file(TEMPLATE / "memories" / "USER.md", profile_dir / "memories" / "USER.md", ctx, dry)
    render_file(TEMPLATE / "memories" / "MEMORY.md", profile_dir / "memories" / "MEMORY.md", ctx, dry)
    render_file(TEMPLATE / "config.yaml", profile_dir / "config.yaml", ctx, dry)
    render_file(TEMPLATE / ".env.template", profile_dir / ".env", ctx, dry)

    # 4. Render skills into the profile's skills/ dir
    for skill_dir in (TEMPLATE / "skills").iterdir():
        if skill_dir.is_dir():
            render_file(skill_dir / "SKILL.md",
                        profile_dir / "skills" / skill_dir.name / "SKILL.md", ctx, dry)

    # 5. Render the workspace (AGENTS.md + brain) into the client's working dir
    render_file(TEMPLATE / "workspace" / "AGENTS.md", workspace_dir / "AGENTS.md", ctx, dry)
    for brain_file in (TEMPLATE / "workspace" / "brain").glob("*.md"):
        render_file(brain_file, workspace_dir / "brain" / brain_file.name, ctx, dry)
    if not dry:
        (workspace_dir / "output" / "estimates").mkdir(parents=True, exist_ok=True)
        (workspace_dir / "output" / "invoices").mkdir(parents=True, exist_ok=True)

    # 6. Register the two daily check-in cron jobs
    cron_spec = json.loads(render(CRON_TEMPLATE.read_text(), ctx))
    for job in cron_spec["jobs"]:
        run(["hermes", "-p", profile, "cron", "create", job["schedule"], job["prompt"],
             "--skill", job["skill"], "--name", job["name"]], dry)

    # 7. Emit a Caddy reverse-proxy snippet for this client
    caddy_snippet = f"{host} {{\n    reverse_proxy 127.0.0.1:{webhook_port}\n}}\n"
    snippet_path = STATE / "caddy" / f"{cid}.caddy"
    log(f"caddy snippet -> {snippet_path}")
    if not dry:
        snippet_path.parent.mkdir(parents=True, exist_ok=True)
        snippet_path.write_text(caddy_snippet)
    run_optional(os.environ.get("CADDY_RELOAD_COMMAND", ""), dry)

    # 8. Install + start the per-client gateway as a service (TZ for local-time crons)
    #    `hermes gateway install --profile` registers a service; TZ is set on it.
    run(["env", f"TZ={ctx['TIMEZONE']}", "hermes", "gateway", "install", "--profile", profile], dry)
    run(["hermes", "-p", profile, "gateway", "start"], dry)

    log("")
    log(f"DONE. {ctx['AGENT_NAME']} for {ctx['BUSINESS_NAME']} is provisioned.")
    log(f"  agent number : {agent_phone}")
    log(f"  supervisor   : {ctx['SUPERVISOR_NAME']} ({ctx['CLIENT_PHONE']})")
    log(f"  webhook      : {webhook_url}  (local :{webhook_port})")
    log(f"  workspace    : {workspace_dir}")
    log("Next: point the Twilio number's inbound webhook at the URL above (claim_number")
    log("already set SmsUrl), reload Caddy to publish the subdomain, and text the agent.")


if __name__ == "__main__":
    main()
