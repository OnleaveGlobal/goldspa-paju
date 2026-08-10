#!/usr/bin/env python3
"""Re-derive WebP files at a display-appropriate max dimension, sourcing
full-quality pixels from the pre-webp git commit instead of double-compressing
the already-converted .webp (avoids a second lossy generation)."""
import io
import os
import subprocess
from PIL import Image, ImageOps

SOURCE_COMMIT = "859dcc6"
MAX_SIDE = 1600  # longest side cap; safe 2x-retina ceiling for this site's ~717-760px max display width

TARGETS = subprocess.run(
    ["git", "ls-tree", "-r", SOURCE_COMMIT, "--name-only"],
    capture_output=True, text=True, check=True,
).stdout.splitlines()

SKIP_BASENAMES = {"favicon.png", "apple-touch-icon.png", "logo-white.png", "logo-black.png", "logo-gold.png"}
SCOPE_DIRS = ("images/", "images/docs/", "images/food/")

def in_scope(path):
    if not path.lower().endswith((".jpg", ".jpeg", ".png")):
        return False
    if os.path.basename(path) in SKIP_BASENAMES:
        return False
    if path.startswith("tour/images/"):
        return False
    return any(path == d.rstrip("/") or path.startswith(d) for d in ("images/",)) and \
        (path.count("/") <= 2)

def main():
    paths = sorted(p for p in TARGETS if in_scope(p))
    total_before = total_after = 0
    for path in paths:
        blob = subprocess.run(
            ["git", "show", f"{SOURCE_COMMIT}:{path}"],
            capture_output=True, check=True,
        ).stdout
        im = Image.open(io.BytesIO(blob))
        im = ImageOps.exif_transpose(im)
        w, h = im.size
        scale = MAX_SIDE / max(w, h)
        out_path = os.path.splitext(path)[0] + ".webp"
        before = os.path.getsize(out_path) if os.path.isfile(out_path) else 0

        if scale < 1:
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

        has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        if has_alpha:
            im = im.convert("RGBA")
            im.save(out_path, "WEBP", quality=90, method=6)
        else:
            im = im.convert("RGB")
            im.save(out_path, "WEBP", quality=82, method=6)

        after = os.path.getsize(out_path)
        total_before += before
        total_after += after
        tag = f"{w}x{h} -> {im.size[0]}x{im.size[1]}" if scale < 1 else f"{w}x{h} (no resize needed)"
        print(f"{out_path}: {tag}, {before/1024:.0f}KB -> {after/1024:.0f}KB")

    print(f"\n{len(paths)} files reprocessed")
    print(f"Total: {total_before/1e6:.2f}MB -> {total_after/1e6:.2f}MB "
          f"({100*(1-total_after/total_before):.1f}% additional reduction)")

if __name__ == "__main__":
    main()
