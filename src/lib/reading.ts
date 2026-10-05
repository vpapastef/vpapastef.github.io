import type { CollectionEntry } from 'astro:content';

export function bookSlugOf(note: CollectionEntry<'notes'>): string {
  return note.id.split('/')[0];
}

export function entrySlugOf(note: CollectionEntry<'notes'>): string {
  return note.id.split('/').slice(1).join('/');
}

export function previewOf(note: CollectionEntry<'notes'>, limit = 200): string {
  if (note.data.preview) return note.data.preview;

  const plain = (note.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (plain.length <= limit) return plain;
  return plain.slice(0, plain.lastIndexOf(' ', limit)).trimEnd() + '…';
}

export function isShort(note: CollectionEntry<'notes'>, limit = 200): boolean {
  return !note.data.preview && previewOf(note, limit).slice(-1) !== '…';
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function byline(authors: string[]): string {
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
}

export function chapterNumOf(note: CollectionEntry<'notes'>): number {
  const m = (note.data.chapter ?? '').match(/Ch\.\s*(\d+)/);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

export function firstPageOf(note: CollectionEntry<'notes'>): number {
  const m = (note.data.pages ?? '').match(/\d+/);
  return m ? Number(m[0]) : Number.MAX_SAFE_INTEGER;
}
