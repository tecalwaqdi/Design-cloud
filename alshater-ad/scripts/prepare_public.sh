#!/usr/bin/env bash
# Copies production assets into remotion/public (Remotion serves files from there).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
P="$ROOT/remotion/public"
mkdir -p "$P/img"
cp "$ROOT"/assets/images/* "$P/img/"
echo "public/ ready"
