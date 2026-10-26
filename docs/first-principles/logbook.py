#!/usr/bin/env python3
"""logbook.py - append one entry to WS-001-LOGBOOK.md, stamped by the clock, never by the writer.

    python3 logbook.py "<title>" "<body>"     # body may hold *Falsifier:* ...

Written 2026-10-26 after three entries were stamped from memory and ran ahead of the clock: a notebook whose times are
guessed is not a record. The stamp is UTC from the machine at the moment of writing.
"""
import sys
import time
from pathlib import Path

LOG = Path(__file__).resolve().parent / "WS-001-LOGBOOK.md"
title, body = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else ""
stamp = time.strftime("%H:%M", time.gmtime())
text = LOG.read_text()
sep = "" if text.endswith("\n\n") else ("\n" if text.endswith("\n") else "\n\n")
LOG.write_text(text + sep + f"**{stamp}. {title}** {body}".rstrip() + "\n")
print(f"logged at {stamp} UTC")
