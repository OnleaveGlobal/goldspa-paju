#!/usr/bin/env python3
"""Rewrite HTML/CSS references from converted raster basenames to .webp."""
import os

TARGET_DIRS = ["images", "images/docs", "images/food", "tour/images"]
EXCLUDE_BASENAMES = {"favicon.png", "apple-touch-icon.png"}

TEXT_FILES = [
    "index.html", "facilities.html", "food.html", "guide.html",
    "location.html", "trust.html",
    "en/index.html", "en/facilities.html", "en/food.html", "en/guide.html",
    "en/location.html", "en/trust.html",
    "tour/tour.html",
    "assets/style.css",
    "sitemap.xml",
]

def build_rename_map():
    mapping = {}
    for d in TARGET_DIRS:
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            low = f.lower()
            if not low.endswith((".jpg", ".jpeg", ".png")):
                continue
            if f in EXCLUDE_BASENAMES:
                continue
            base, _ = os.path.splitext(f)
            mapping[f] = base + ".webp"
    return mapping

def main():
    mapping = build_rename_map()
    for path in TEXT_FILES:
        if not os.path.isfile(path):
            continue
        with open(path, "r", encoding="utf-8") as fh:
            content = fh.read()
        original = content
        count = 0
        for old, new in mapping.items():
            n = content.count(old)
            if n:
                content = content.replace(old, new)
                count += n
        if content != original:
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(content)
            print(f"{path}: {count} references updated")

if __name__ == "__main__":
    main()
