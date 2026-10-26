#!/usr/bin/env python3
"""blind.py - a blind critics' round for the website: copies (never links) of each candidate's shots under letters,
one board per size, and the key kept OUTSIDE the critics' folder (DP-200's lesson: symlinks and folder listings showed
critics every real name).

    python3 blind.py <round> <name>=<shot prefix> [<name>=<shot prefix> ...]
        e.g. python3 blind.py r2a hero-a=shots/r2/hero-a-v3 naive=/path/to/sheets/RIVALS/usenaive-ai

For each candidate it takes <prefix>-desktop-first.png and <prefix>-phone-first.png (the shoot.mjs names), or
<prefix>-1440.png and <prefix>-390.png (the research pageshot names), cropped to the first screen.
Writes  /tmp/amtech-critics/<round>/<LETTER>-desktop.png, <LETTER>-phone.png, board-desktop.jpg, board-phone.jpg
and     keys/KEY-<round>.json   (never inside critics/)
"""
import json, random, subprocess, sys
from pathlib import Path

H = Path(__file__).resolve().parent
rnd, pairs = sys.argv[1], [a.split("=", 1) for a in sys.argv[2:]]
order = pairs[:]; random.Random(rnd).shuffle(order)
key = {chr(65 + i): name for i, (name, _) in enumerate(order)}
out = Path("/tmp/amtech-critics") / rnd   # outside every repo: a critic who lists folders finds no key
out.mkdir(parents=True, exist_ok=True)
for p in out.iterdir():
    p.unlink()
SIZES = {"desktop": ("-desktop-first.png", "-1440.png", "1440x900+0+0"), "phone": ("-phone-first.png", "-390.png", "780x1688+0+0")}
for letter, (name, prefix) in zip(key, order):
    pre = Path(prefix) if Path(prefix).is_absolute() else (H.parent / prefix)
    for size, (a, b, crop) in SIZES.items():
        src = next((Path(str(pre) + s) for s in (a, b) if Path(str(pre) + s).exists()), None)
        if not src:
            print(json.dumps({"missing": f"{name} {size}"})); continue
        subprocess.run(["magick", str(src), "-crop", crop, "+repage", str(out / f"{letter}-{size}.png")], check=True)
for size, geo, tile in (("desktop", "720x450+8+8", "2x"), ("phone", "260x563+8+8", f"{len(key)}x")):
    files = sorted(str(p) for p in out.glob(f"*-{size}.png"))
    if files:
        subprocess.run(["montage", *files, "-geometry", geo, "-tile", tile, "-background", "#2b2b2b", "-fill", "#ddd",
                        "-pointsize", "16", "-label", "%t", str(out / f"board-{size}.jpg")], capture_output=True)
(H / "keys").mkdir(exist_ok=True)
(H / "keys" / f"KEY-{rnd}.json").write_text(json.dumps(key, indent=1))
print(json.dumps({"round": rnd, "letters": len(key), "dir": str(out), "boards": sorted(p.name for p in out.glob("board-*.jpg"))}))
