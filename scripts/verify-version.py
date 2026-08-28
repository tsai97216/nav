#!/usr/bin/env python3
"""Verify that all managed NAV version references match data/version.json."""
from pathlib import Path
import re
import sys
import json

ROOT = Path(__file__).resolve().parents[1]
VERSION_FILE = ROOT / "data" / "version.json"

try:
    version = json.loads(VERSION_FILE.read_text(encoding="utf-8"))["version"]
except Exception as exc:
    print(f"VERSION CHECK FAILED: cannot read {VERSION_FILE}: {exc}")
    sys.exit(1)

if not re.fullmatch(r"v\d+\.\d+\.\d+\.\d+", version):
    print(f"VERSION CHECK FAILED: invalid version format: {version}")
    sys.exit(1)

plain = version[1:]
errors = []

checks = {
    "index.html": [
        (r'manifest\.json\?v=' + re.escape(plain), "manifest version"),
        (r'\.(?:css|js)\?v=' + re.escape(plain), "asset versions"),
        (r'id=["\']site-version["\'][^>]*>v' + re.escape(plain), "footer version"),
    ],
    "js/app.js": [(r"const\s+VERSION\s*=\s*['\"]" + re.escape(version), "app VERSION")],
    "js/bootstrap.js": [(r'sw\.js\?v=' + re.escape(plain), "bootstrap service-worker version")],
    "sw.js": [
        (r'CACHE_NAME\s*=\s*[\"\'][^\"\']*' + re.escape(version), "CACHE_NAME"),
        (r'\?v=' + re.escape(plain), "CORE_ASSETS version"),
    ],
    "manifest.json": [(r'\?v=' + re.escape(plain), "manifest assets")],
}

for rel, patterns in checks.items():
    path = ROOT / rel
    if not path.exists():
        errors.append(f"✗ {rel}: file not found")
        continue
    text = path.read_text(encoding="utf-8")
    for pattern, label in patterns:
        if not re.search(pattern, text):
            errors.append(f"✗ {rel}: missing {label} for {version}")

# Scan source/config files for old four-part semantic versions.
ignore_dirs = {".git", "node_modules", "dist", "build", "__pycache__"}
old_versions = set()
all_files = []
for path in ROOT.rglob("*"):
    if not path.is_file() or any(part in ignore_dirs for part in path.parts):
        continue
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    all_files.append((path, text))
    for found in re.findall(r"v\d+\.\d+\.\d+\.\d+", text):
        if found != version:
            old_versions.add(found)

if old_versions:
    for old in sorted(old_versions):
        locations = []
        for path, text in all_files:
            if old in text:
                locations.append(str(path.relative_to(ROOT)))
        errors.append(f"✗ old version {old} found in: {', '.join(locations)}")

print(f"Chi NAV Version Check: {version}")
print("=" * 40)
if errors:
    print("\n".join(errors))
    print("\nVERSION CHECK FAILED")
    sys.exit(1)

print("✓ version.json")
print("✓ index.html managed references")
print("✓ app.js VERSION")
print("✓ bootstrap.js")
print("✓ sw.js CACHE_NAME / CORE_ASSETS")
print("✓ manifest.json")
print("✓ no old four-part semantic versions found")
print("\nVERSION CHECK PASSED")
