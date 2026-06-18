#!/usr/bin/env python3
"""
claim_number.py — claim a Twilio number from the pool for a client, lazily.

Model: we keep a small pool of SMS-capable Twilio numbers always provisioned.
A number is "free" if its inbound SmsUrl is not yet pointed at a client webhook.
To claim, we point its SmsUrl at the client's webhook and record it locally.
After claiming, if fewer than MIN_FREE numbers remain, we buy more so the next
provision never blocks. The assumption (per spec) is that there are always >= 2
free numbers on hand; the top-up keeps that true without us thinking about it.

Usage:
    python3 claim_number.py --client-id scoopdogg \
        --webhook-url https://scoopdogg.agents.amtechai.com/webhooks/twilio \
        [--area-code 805] [--dry-run]

Prints the claimed E.164 number to stdout (last line) so the provisioner can capture it.

Env:
    TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

Requires: pip install twilio
"""
import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from twilio.rest import Client

MIN_FREE = 2          # keep at least this many unassigned numbers on hand
TOP_UP_TO = 4         # when low, refill the free pool up to this many
DEFAULT_COUNTRY = "US"
REGISTRY = Path(__file__).resolve().parent.parent / "state" / "number-pool.json"


def log(msg):
    print(f"[claim_number] {msg}", file=sys.stderr)


def load_registry():
    if REGISTRY.exists():
        reg = json.loads(REGISTRY.read_text())
        reg.setdefault("assigned", {})  # e164 -> {client_id, webhook_url, claimed_iso}
        reg.setdefault("reserved", [])  # e164 numbers the pool must never claim
        return reg
    return {"assigned": {}, "reserved": []}


def save_registry(reg):
    REGISTRY.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY.write_text(json.dumps(reg, indent=2))


def reserved_numbers(reg):
    """Numbers the pool must never claim or re-point. The SMS onboarding
    front-door number lives here: its SmsUrl points at /sms-entry, not a client
    webhook, so it would otherwise look 'free' and get recycled. Sourced from the
    registry's `reserved` list and the RESERVED_NUMBERS env (comma-separated)."""
    env = os.environ.get("RESERVED_NUMBERS", "")
    nums = {n.strip() for n in env.split(",") if n.strip()}
    nums |= {str(n).strip() for n in reg.get("reserved", []) if str(n).strip()}
    return nums


def is_free(num, reg, reserved):
    """Free = SMS-capable, not reserved, not pointed at a client webhook, not in our registry."""
    if not getattr(num.capabilities, "get", None):
        sms_ok = True
    else:
        sms_ok = num.capabilities.get("sms", True)
    assigned_locally = num.phone_number in reg["assigned"]
    is_reserved = num.phone_number in reserved
    has_webhook = bool(num.sms_url) and "/webhooks/twilio" in (num.sms_url or "")
    return sms_ok and not assigned_locally and not is_reserved and not has_webhook


def free_numbers(client, reg):
    reserved = reserved_numbers(reg)
    return [n for n in client.incoming_phone_numbers.list(limit=1000) if is_free(n, reg, reserved)]


def buy_numbers(client, count, area_code, dry_run):
    """Best-effort top-up. Logs and continues on failure rather than blocking a claim."""
    bought = []
    for _ in range(count):
        try:
            search = client.available_phone_numbers(DEFAULT_COUNTRY).local.list(
                sms_enabled=True, area_code=area_code, limit=1
            ) if area_code else client.available_phone_numbers(DEFAULT_COUNTRY).local.list(
                sms_enabled=True, limit=1
            )
            if not search:
                log("no available numbers found to buy; stopping top-up")
                break
            candidate = search[0].phone_number
            if dry_run:
                log(f"[dry-run] would buy {candidate}")
                bought.append(candidate)
                continue
            num = client.incoming_phone_numbers.create(phone_number=candidate)
            log(f"bought {num.phone_number}")
            bought.append(num.phone_number)
        except Exception as e:  # noqa: BLE001 - top-up must never break a claim
            log(f"top-up purchase failed (non-fatal): {e}")
            break
    return bought


def claim(client_id, webhook_url, area_code, dry_run):
    sid = os.environ["TWILIO_ACCOUNT_SID"]
    token = os.environ["TWILIO_AUTH_TOKEN"]
    twilio = Client(sid, token)
    reg = load_registry()

    free = free_numbers(twilio, reg)
    if not free:
        log("pool empty, buying one now")
        buy_numbers(twilio, 1, area_code, dry_run)
        free = free_numbers(twilio, reg)
        if not free and not dry_run:
            log("FATAL: could not obtain a number")
            sys.exit(2)

    chosen = free[0]
    e164 = chosen.phone_number if not dry_run else (free[0].phone_number if free else "+10000000000")

    if not dry_run:
        twilio.incoming_phone_numbers(chosen.sid).update(
            sms_url=webhook_url, sms_method="POST"
        )
        reg["assigned"][e164] = {
            "client_id": client_id,
            "webhook_url": webhook_url,
            "claimed_iso": datetime.now(timezone.utc).isoformat(),
        }
        save_registry(reg)
    log(f"claimed {e164} for {client_id} -> {webhook_url}")

    remaining = len(free) - 1
    if remaining < MIN_FREE:
        need = TOP_UP_TO - remaining
        log(f"only {remaining} free left, topping up by {need}")
        buy_numbers(twilio, need, area_code, dry_run)

    print(e164)  # stdout: the provisioner captures this
    return e164


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--client-id", required=True)
    ap.add_argument("--webhook-url", required=True)
    ap.add_argument("--area-code", default=None)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    claim(args.client_id, args.webhook_url, args.area_code, args.dry_run)


if __name__ == "__main__":
    main()
