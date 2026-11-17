#!/usr/bin/env bash
# Rebuilds remotion/public from assets/ (images as JPEG, fonts, brand mark).
set -e
cd "$(dirname "$0")/.."
rm -rf remotion/public && mkdir -p remotion/public/{img,fonts,brand}
cp assets/fonts/{DINNextLTArabic-Light,DINNextLTArabic-Regular,DINNextLTArabic-Medium,DINNextLTArabic-Bold,DINNextLTArabic-Black,IBMPlexArabic-Text}.ttf remotion/public/fonts/
cp assets/brand/mark.svg remotion/public/brand/
for f in struggle_a living_a living_b kitchen_a kitchen_b hood_a hood_b docs_a hand_a family_b; do ffmpeg -loglevel error -y -i assets/img/$f.png -q:v 2 remotion/public/img/$f.jpg; done
for f in kitchen_1 living_2 struggle_2 living_1; do ffmpeg -loglevel error -y -i assets/img/v1/$f.png -q:v 3 remotion/public/img/v1_$f.jpg; done
