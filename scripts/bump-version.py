#!/usr/bin/env python3
"""Set the single source-of-truth NAV version."""
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "data" / "version.json"

if len(sys.argv) != 2:
    print("usage: python scripts/bump-version.py X.Y.Z.W")
    sys.exit(1)

value = sys.argv[1].lstrip("v")
if not re.fullmatch(r"\d+\.\d+\.\d+\.\d+", value):
    print("ERROR: version must be X.Y.Z.W")
    sys.exit(1)

new_tag = f"v{value}"
VERSION_FILE.write_text(
    json.dumps({"version": new_tag}, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
print(f"Version source updated to {new_tag}.")
print("GitHub Actions will synchronize managed references and run verification.")
