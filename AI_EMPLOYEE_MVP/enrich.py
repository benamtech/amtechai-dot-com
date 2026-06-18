#!/usr/bin/env python3
"""
enrich.py — OPTIONAL. Turn raw, free-text onboarding answers into clean,
per-field manifest values using an LLM with a structured (JSON) response.

This is an enhancement, not a requirement. The default provisioning path does
not call it: a deterministic mapping drops each answer into its primary field
and the agent refines the rest from its brain over time. Turn this on
(provision_client.py --enrich) when you want the form's messy answers split
cleanly up front, for example "Scoop Dogg, dog waste pickup, 3 yrs" becoming
business_name="Scoop Dogg", business_type="dog waste removal service".

Default model is xAI Grok 4.3 (OpenAI-compatible endpoint). Swap freely; any
model that returns JSON works.

Standalone:
    python3 enrich.py --answers answers.json

Env: XAI_API_KEY  (or set --base-url / --model for another provider)
Requires: pip install openai
"""
import argparse
import json
import os
import sys

FIELDS = [
    "business_name", "business_type", "team_size", "team_structure",
    "top_office_work", "workloads", "tools", "revenue_band",
    "avg_customer", "ideal_customer", "friction_customer",
]

SYSTEM = (
    "You normalize small-business onboarding answers into structured fields. "
    "You receive a JSON object of raw answers keyed by question id. Return ONLY "
    "a JSON object with exactly these keys: " + ", ".join(FIELDS) + ". "
    "Each value is a short, clean string drawn strictly from the answers. Do not "
    "invent facts. If an answer does not cover a field, return an empty string "
    "for that field. No prose, no markdown, no code fences, JSON object only."
)


def enrich(answers: dict, base_url=None, model=None, api_key=None) -> dict:
    """Return a dict of the FIELDS, normalized. Raises on hard failure; caller
    should fall back to deterministic mapping if it wants resilience."""
    from openai import OpenAI

    client = OpenAI(
        api_key=api_key or os.environ["XAI_API_KEY"],
        base_url=base_url or "https://api.x.ai/v1",
    )
    resp = client.chat.completions.create(
        model=model or "grok-4.3",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": json.dumps(answers)},
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )
    text = resp.choices[0].message.content.strip()
    text = text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    data = json.loads(text)
    return {k: str(data.get(k, "")).strip() for k in FIELDS}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--answers", required=True, help="path to JSON of raw answers")
    ap.add_argument("--base-url", default=None)
    ap.add_argument("--model", default=None)
    args = ap.parse_args()
    answers = json.loads(open(args.answers).read())
    print(json.dumps(enrich(answers, args.base_url, args.model), indent=2))


if __name__ == "__main__":
    main()
