#!/usr/bin/env python3
"""Bump Chi NAV's semantic version and update managed references."""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "data" / "version.json"

def die(message):
    print(f"ERROR: {message}")
    sys.exit(1)

if len(sys.argv) != 2:
    die("usage: python scripts/bump-version.py X.Y.Z")

new = sys.argv[1].lstrip("v")
if not re.fullmatch(r"\d+\.\d+\.\d+", new):
    die("version must be X.Y.Z")

old = json.loads(VERSION_FILE.read_text(encoding="utf-8"))["version"]
new_tag = f"v{new}"
old_tag = old
old_plain = old_tag[1:]

# Files that contain explicit managed version references.
paths = [
    ROOT / "index.html",
    ROOT / "js" / "app.js",
    ROOT / "js" / "bootstrap.js",
    ROOT / "sw.js",
    ROOT / "manifest.json",
]

for path in paths:
    if not path.exists():
        die(f"missing managed file: {path.relative_to(ROOT)}")
    text = path.read_text(encoding="utf-8")
    text = text.replace(old_tag, new_tag).replace(old_plain, new)
    path.write_text(text, encoding="utf-8")

VERSION_FILE.write_text(json.dumps({"version": new_tag}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Bumped {old_tag} -> {new_tag}")
print("Run scripts/verify-version.py before committing.")
