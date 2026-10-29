import fs from 'node:fs';
import path from 'node:path';

function moduleDir(slug: string): string {
  return path.join(process.cwd(), 'public', 'teaching', slug);
}

export function fileSize(slug: string, file: string): number | null {
  try {
    return fs.statSync(path.join(moduleDir(slug), file)).size;
  } catch {
    return null;
  }
}

function built(slug: string, name: string): { href: string; size: number } | null {
  const size = fileSize(slug, name);
  return size === null ? null : { href: `/teaching/${slug}/${name}`, size };
}

// Written by scripts/zip-lectures.sh before each build: slug.zip holds every
// PDF, slug-<part>.zip the PDFs of one type (lecture-01.pdf, lecture-02.pdf, ...).
export function archive(slug: string, part?: string) {
  return built(slug, part ? `${slug}-${part}.zip` : `${slug}.zip`);
}

// Written next to slug-week-NN.zip: the same PDFs merged into one.
export function merged(slug: string, week: string) {
  return built(slug, `${slug}-${week}.pdf`);
}

// Rounded to 0.1 MB: a student only needs the order of magnitude.
export function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb < 0.1 ? '<0.1 MB' : `${mb.toFixed(1)} MB`;
}
