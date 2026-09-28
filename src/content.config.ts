import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['data-ml', 'software']),
    tech: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    paper: z.string().url().optional(),
    venue: z.string().optional(),
    featured: z.boolean().default(false),
    sortOrder: z.number().default(0),
    year: z.union([z.number(), z.string()]).optional(),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    authors: z.array(z.string()),
    year: z.number().optional(),
    publisher: z.string().optional(),
    status: z.enum(['reading', 'finished']).default('reading'),
    started: z.coerce.date().optional(),
    finished: z.coerce.date().optional(),
    link: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    order: z.number().optional(),
    preview: z.string().optional(),
    chapter: z.string().optional(),
    pages: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const teaching = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/teaching' }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    institution: z.string(),
    department: z.string().optional(),
    role: z.string(),
    semester: z.string().optional(),
    term: z.string(),
    summary: z.string().optional(),
    syllabus: z.array(z.string()).default([]),
    el: z.object({
      title: z.string().optional(),
      code: z.string().optional(),
      department: z.string().optional(),
      institution: z.string().optional(),
      semester: z.string().optional(),
      summary: z.string().optional(),
      syllabus: z.array(z.string()).default([]),
    }).optional(),
    ects: z.number().optional(),
    url: z.string().url().optional(),
    lectures: z.array(z.object({
      n: z.number(),
      title: z.string(),
      titleEn: z.string().optional(),
      file: z.string().optional(),
      week: z.number().optional(),
    })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, books, notes, teaching };
