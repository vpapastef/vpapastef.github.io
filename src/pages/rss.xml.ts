import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { bookSlugOf, entrySlugOf, previewOf } from '../lib/reading';

export async function GET(context: APIContext) {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  return rss({
    title: 'Vasilis Papastefanopoulos — Reading diary',
    description: 'Notes on books, kept as I read them.',
    site: context.site!,
    items: notes
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((note) => ({
        title: note.data.title,
        description: previewOf(note),
        pubDate: note.data.date,
        link: `/reading/${bookSlugOf(note)}/${entrySlugOf(note)}/`,
      })),
  });
}
