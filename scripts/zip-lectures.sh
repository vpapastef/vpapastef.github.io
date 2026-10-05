#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="$ROOT/public/teaching"
[ -d "$BASE" ] || exit 0

if ! command -v zip >/dev/null 2>&1; then
  echo "zip-lectures: 'zip' not on PATH, skipping archives" >&2
  exit 0
fi

shopt -s nullglob
for dir in "$BASE"/*/; do
  slug=$(basename "$dir")
  pdfs=("$dir"*.pdf)
  target="$dir$slug.zip"
  rm -f "$target"
  if [ ${#pdfs[@]} -eq 0 ]; then
    echo "zip-lectures: $slug has no PDFs, no archive written"
    continue
  fi
  ( cd "$dir" && zip -q -j "$slug.zip" *.pdf )
  echo "zip-lectures: $slug -> $slug.zip (${#pdfs[@]} lecture(s), $(du -h "$target" | cut -f1 | tr -d ' '))"
done
