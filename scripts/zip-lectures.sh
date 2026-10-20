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
  rm -f "$target" "$dir$slug"-*.zip
  if [ ${#pdfs[@]} -eq 0 ]; then
    echo "zip-lectures: $slug has no PDFs, no archive written"
    continue
  fi
  ( cd "$dir" && zip -q -j "$slug.zip" *.pdf )
  echo "zip-lectures: $slug -> $slug.zip (${#pdfs[@]} PDF(s), $(du -h "$target" | cut -f1 | tr -d ' '))"

  # one archive per type: lecture-01.pdf, lecture-02.pdf, ... -> $slug-lecture.zip,
  # when there are two or more
  for part in $(for f in "${pdfs[@]}"; do b=$(basename "$f" .pdf); [[ $b =~ ^(.+)-[0-9]+$ ]] && echo "${BASH_REMATCH[1]}"; done | sort -u); do
    some=("$dir$part"-[0-9]*.pdf)
    [ ${#some[@]} -ge 2 ] || continue
    ( cd "$dir" && zip -q -j "$slug-$part.zip" "$part"-[0-9]*.pdf )
    echo "zip-lectures: $slug -> $slug-$part.zip (${#some[@]} PDFs)"
  done

  # and one per week: *-01.pdf -> $slug-week-01.zip, when there are two or more
  for nn in $(for f in "${pdfs[@]}"; do b=$(basename "$f" .pdf); [[ $b =~ -([0-9]+)$ ]] && echo "${BASH_REMATCH[1]}"; done | sort -u); do
    some=("$dir"*-"$nn".pdf)
    [ ${#some[@]} -ge 2 ] || continue
    ( cd "$dir" && zip -q -j "$slug-week-$nn.zip" *-"$nn".pdf )
    echo "zip-lectures: $slug -> $slug-week-$nn.zip (${#some[@]} PDFs)"
  done
done
