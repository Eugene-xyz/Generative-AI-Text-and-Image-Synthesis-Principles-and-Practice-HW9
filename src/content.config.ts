import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const date = z.string().regex(/^\d{4}(?:-\d{2})?(?:-\d{2})?$/);
const wiki = defineCollection({
  loader: glob({
    base: './wiki',
    pattern: ['**/*.md', '!**/index.md', '!log.md', '!questions.md', '!releases/coverage.md'],
    generateId: ({ data }) => String(data.id),
  }),
  schema: z.object({
    id: z.string().min(1),
    type: z.enum(['band', 'member', 'release', 'official-media', 'track', 'event', 'recommendation']),
    title: z.string(),
    status: z.enum(['draft', 'ready']),
    verification: z.enum(['partial', 'checked', 'conflict']),
    updated_at: date,
    verified_at: date.nullable(),
    sources: z.array(z.string()).min(1),
    related: z.array(z.string()),
    release_date: date.nullable().optional(),
    release_type: z.string().optional(),
    release_status: z.enum(['announced', 'released', 'unknown']).optional(),
    release_id: z.string().optional(),
    formats: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    contexts: z.array(z.string()).optional(),
    digital_track_count: z.number().int().nonnegative().nullable().optional(),
    date: date.nullable().optional(),
    date_end: date.nullable().optional(),
    date_precision: z.string().optional(),
    published_date: date.nullable().optional(),
    reference_date: date.nullable().optional(),
    date_basis: z.string().optional(),
    category: z.string().optional(),
    work_id: z.string().optional(),
    song_id: z.string().optional(),
    version_id: z.string().optional(),
    order_in_category: z.number().int().positive().optional(),
    featured_order: z.number().int().positive().nullable().optional(),
    listen_url: z.url().optional(),
    listen_kind: z.string().optional(),
    listen_locator: z.string().optional(),
  }),
});

const sources = defineCollection({
  loader: glob({ base: './raw/sources', pattern: '*.md', generateId: ({ data }) => String(data.id) }),
  schema: z.object({
    id: z.string(), title: z.string(), publisher: z.string(), url: z.url(),
    accessed_at: date, access_status: z.string(), scope: z.string(),
  }),
});
export const collections = { wiki, sources };
