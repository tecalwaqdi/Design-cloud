#!/usr/bin/env bash
# Copies the production assets into remotion/public (Remotion serves files from there).
# Run from anywhere: bash lufy-store-ad/scripts/prepare_public.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
P="$ROOT/remotion/public"
mkdir -p "$P/video" "$P/rec" "$P/store/products" "$P/brand" "$P/stills"
cp "$ROOT"/assets/video/*.mp4 "$P/video/"
cp "$ROOT"/recordings/*.mp4 "$P/rec/"
cp "$ROOT"/assets/store/products/* "$P/store/products/"
cp "$ROOT"/assets/store/*_mobile_full.png "$P/store/"
cp "$ROOT/assets/brand/lufy_logo_upload.png" "$P/brand/lufy_logo.png"
ffmpeg -loglevel error -y -ss 4.0 -i "$ROOT/assets/video/stadium.mp4" -frames:v 1 -q:v 2 "$P/stills/stadium_freeze.jpg"
echo "public/ ready"
