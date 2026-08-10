#!/usr/bin/env python3
"""Generate small gallery-dock thumbnails for tour scenes.

tour/tour.html's bottom scene dock (.thumb img, displayed at 120x68px max)
was reusing the full equirectangular panorama files (4096x2048, 300KB-1.4MB
each) as thumbnail sources, so all 28 scenes loaded on initial page view
instead of just the current one. This generates real small thumbnails so
pannellum's built-in per-scene lazy loading (only fetch a panorama when the
user actually navigates to it) is no longer defeated by the dock UI.
"""
import os
from PIL import Image

SRC_DIR = "tour/images"
OUT_DIR = "tour/images/thumb"
THUMB_WIDTH = 480  # retina-safe for a 120px CSS-wide dock thumbnail

os.makedirs(OUT_DIR, exist_ok=True)

total_before = total_after = 0
for f in sorted(os.listdir(SRC_DIR)):
    if not f.lower().endswith(".webp"):
        continue
    if f in ("logo.webp", "brandmark.webp"):
        continue
    src_path = os.path.join(SRC_DIR, f)
    im = Image.open(src_path).convert("RGB")
    w, h = im.size
    scale = THUMB_WIDTH / w
    im = im.resize((THUMB_WIDTH, round(h * scale)), Image.LANCZOS)
    out_path = os.path.join(OUT_DIR, f)
    im.save(out_path, "WEBP", quality=78, method=6)
    before = os.path.getsize(src_path)
    after = os.path.getsize(out_path)
    total_before += before
    total_after += after
    print(f"{out_path}: {after/1024:.1f}KB (full scene is {before/1024:.0f}KB)")

print(f"\nThumbnails total: {total_after/1e6:.2f}MB (vs {total_before/1e6:.2f}MB if full scenes were reused)")
