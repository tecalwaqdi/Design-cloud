#!/usr/bin/env bash
# Copies the stills the edit uses from assets/img into remotion/public/img.
set -e
cd "$(dirname "$0")/.."
mkdir -p remotion/public/img
cp assets/img/{struggle_1,struggle_2,living_1,living_2,kitchen_1,kitchen_2,docs_1,hand_2,family_1}.png remotion/public/img/
