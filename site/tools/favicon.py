#!/usr/bin/env python3
"""The site's favicon, drawn from the wordmark's own letters (lane SEARCH, 2026-10-27).

The nav's logo is "AMTECH." in Geist 700, ink #0A0A0A, the period in red #E11D2A (assets/css/w/white.css). The mark
is its first letter and its period, "A.", cut from the same font at the same weight, on white. Google Search shows
only raster favicons (BMP, GIF, ICO, PNG, JPEG...; SVG is not in its list) at a multiple of 48 px, so this writes:

  site/static/favicon-mark.svg      the mark as paths (no font needed to show it)
  site/static/favicon-48.png        48 x 48   (Google's base size)
  site/static/favicon-96.png        96 x 96
  site/static/favicon-192.png       192 x 192 (Android, and Google at 4x)
  site/static/apple-touch-icon.png  180 x 180
  site/static/favicon.ico           16, 32, 48
  site/static/logo.png              512 x 512 (the Organization's logo in structured data: >= 112 px, on white)

Needs fontTools + brotli (to read the WOFF2), rsvg-convert and ImageMagick. Run it when the mark changes, and commit
the files it writes; the build does not run it.
  python3 site/tools/favicon.py      (in a venv with `pip install fonttools brotli`)
"""
import subprocess
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SITE = Path(__file__).resolve().parent.parent
STATIC = SITE / "static"
INK, RED = "#0A0A0A", "#E11D2A"

font = instantiateVariableFont(TTFont(SITE / "static/fonts/w/Geist-latin.woff2"), {"wght": 700})
gs, cmap = font.getGlyphSet(), font.getBestCmap()


def glyph(ch, dx):
    """(svg path in font units, y up, shifted right by dx; bounds; advance)."""
    name = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    gs[name].draw(TransformPen(pen, (1, 0, 0, 1, dx, 0)))
    b = BoundsPen(gs)
    gs[name].draw(TransformPen(b, (1, 0, 0, 1, dx, 0)))
    return pen.getCommands(), b.bounds, gs[name].width


a_path, a_box, a_adv = glyph("A", 0)
d_path, d_box, _ = glyph(".", a_adv - 40)   # the period close in, as the logo's -0.03em tracking sets it
x0, y0 = a_box[0], min(a_box[1], d_box[1])
x1, y1 = max(a_box[2], d_box[2]), max(a_box[3], d_box[3])
w, h = x1 - x0, y1 - y0
S = 100                                     # the square, in its own units
pad = 14
k = (S - 2 * pad) / max(w, h)
tx = (S - w * k) / 2 - x0 * k
ty = (S + h * k) / 2 + y0 * k               # the font's y runs up; the SVG's runs down
tf = f"matrix({k:.5f} 0 0 {-k:.5f} {tx:.3f} {ty:.3f})"
svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}">
<title>AMTECH AI</title>
<rect width="{S}" height="{S}" rx="18" fill="#FFFFFF"/>
<g transform="{tf}"><path fill="{INK}" d="{a_path}"/><path fill="{RED}" d="{d_path}"/></g>
</svg>
"""
mark = STATIC / "favicon-mark.svg"
mark.write_text(svg)
for name, px in (("favicon-48.png", 48), ("favicon-96.png", 96), ("favicon-192.png", 192), ("apple-touch-icon.png", 180), ("logo.png", 512)):
    subprocess.run(["rsvg-convert", "-w", str(px), "-h", str(px), "-o", str(STATIC / name), str(mark)], check=True)
subprocess.run(["magick", str(STATIC / "favicon-48.png"), "-define", "icon:auto-resize=48,32,16", str(STATIC / "favicon.ico")], check=True)
print("favicon: wrote", mark.name, "favicon-48/96/192.png apple-touch-icon.png favicon.ico")
