#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="$ROOT/public/teaching"
[ -d "$BASE" ] || exit 0

if ! command -v zip >/dev/null 2>&1; then
  echo "zip-lectures: 'zip' not on PATH, skipping archives" >&2
  exit 0
fi

# the week PDFs need python3 with pypdf (pymupdf makes them smaller)
merge=1
if ! python3 -c 'import pypdf' >/dev/null 2>&1; then
  echo "zip-lectures: python3 with pypdf not found, skipping the week PDFs" >&2
  merge=0
fi

shopt -s nullglob
for dir in "$BASE"/*/; do
  slug=$(basename "$dir")
  target="$dir$slug.zip"
  # what an earlier run wrote, before globbing the PDFs that are ours to pack
  rm -f "$target" "$dir$slug"-*.zip "$dir$slug"-week-*.pdf
  pdfs=("$dir"*.pdf)
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

  # and one per week: *-01.pdf -> $slug-week-01.zip, and the same PDFs merged
  # into $slug-week-01.pdf, when there are two or more
  for nn in $(for f in "${pdfs[@]}"; do b=$(basename "$f" .pdf); [[ $b =~ -([0-9]+)$ ]] && echo "${BASH_REMATCH[1]}"; done | sort -u); do
    some=("$dir"*-"$nn".pdf)
    [ ${#some[@]} -ge 2 ] || continue
    ( cd "$dir" && zip -q -j "$slug-week-$nn.zip" *-"$nn".pdf )
    echo "zip-lectures: $slug -> $slug-week-$nn.zip (${#some[@]} PDFs)"
    if [ $merge -eq 1 ]; then
      python3 "$ROOT/scripts/merge-week.py" "$dir$slug-week-$nn.pdf" "${some[@]}"
      echo "zip-lectures: $slug -> $slug-week-$nn.pdf ($(du -h "$dir$slug-week-$nn.pdf" | cut -f1 | tr -d ' '))"
    fi
  done
done
