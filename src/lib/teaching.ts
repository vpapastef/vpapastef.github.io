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

export function archive(slug: string): { href: string; size: number } | null {
  const name = `${slug}.zip`;
  const size = fileSize(slug, name);
  return size === null ? null : { href: `/teaching/${slug}/${name}`, size };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
