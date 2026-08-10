#!/usr/bin/env python3
"""Convert site photos to WebP. Run once, then delete via cleanup step."""
import os
from PIL import Image, ImageOps

TARGET_DIRS = ["images", "images/docs", "images/food", "tour/images"]
EXCLUDE_BASENAMES = {"favicon.png", "apple-touch-icon.png"}

def find_targets():
    for d in TARGET_DIRS:
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            low = f.lower()
            if not low.endswith((".jpg", ".jpeg", ".png")):
                continue
            if f in EXCLUDE_BASENAMES:
                continue
            yield os.path.join(d, f)

def convert(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    out_path = os.path.splitext(path)[0] + ".webp"
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    if has_alpha:
        im = im.convert("RGBA")
        im.save(out_path, "WEBP", quality=90, method=6)
    else:
        im = im.convert("RGB")
        im.save(out_path, "WEBP", quality=82, method=6)
    return out_path

def main():
    total_before = 0
    total_after = 0
    converted = []
    for path in find_targets():
        before = os.path.getsize(path)
        out_path = convert(path)
        after = os.path.getsize(out_path)
        total_before += before
        total_after += after
        converted.append((path, out_path, before, after))
        print(f"{path} ({before/1024:.0f}KB) -> {out_path} ({after/1024:.0f}KB)")

    print(f"\n{len(converted)} files converted")
    print(f"Total: {total_before/1e6:.1f}MB -> {total_after/1e6:.1f}MB "
          f"({100*(1-total_after/total_before):.1f}% reduction)")

if __name__ == "__main__":
    main()
