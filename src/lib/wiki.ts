import { getCollection, type CollectionEntry } from 'astro:content';
import path from 'node:path';
import { validatePublication } from '../../scripts/publication.mjs';
import { home } from '../data/home';

export type WikiEntry = CollectionEntry<'wiki'>;
export type SourceEntry = CollectionEntry<'sources'>;
export const isPreview = process.env.PREVIEW_CONTENT === '1' || import.meta.env.DEV;
export const withBase = (route = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${route.replace(/^\//, '')}`;

export function fileOf(entry: WikiEntry | SourceEntry): string {
  if (!entry.filePath) throw new Error(`Missing source file for ${entry.id}`);
  const normalized = entry.filePath.replaceAll('\\', '/');
  return normalized.replace(/^.*\/(?=(?:wiki|raw)\/)/, '');
}
export const slugOf = (entry: WikiEntry) => fileOf(entry).replace(/^wiki\//, '').replace(/\.md$/, '');
export const entryUrl = (entry: WikiEntry) => {
  const slug = slugOf(entry);
  if (entry.data.type === 'band') return withBase('band/');
  if (['member', 'official-media', 'event', 'recommendation'].includes(entry.data.type)) return withBase(`${slug}/`);
  if (entry.data.type === 'release') return withBase(`${slug.replace(/^releases\//, 'discography/')}/`);
  return withBase(`read/${slug}/`);
};

export async function getLibrary() {
  const [all, sources] = await Promise.all([getCollection('wiki'), getCollection('sources')]);
  const byId = new Map(all.map(entry => [entry.id, entry]));
  const bySource = new Map(sources.map(entry => [entry.id, entry]));
  for (const entry of all) {
    for (const id of entry.data.sources) if (!bySource.has(id)) throw new Error(`${entry.id}: missing source ${id}`);
    for (const id of [...entry.data.related, entry.data.release_id, entry.data.work_id].filter(Boolean)) {
      if (!byId.has(id!)) throw new Error(`${entry.id}: missing relation ${id}`);
    }
    if (entry.data.type === 'recommendation' && (!entry.data.listen_url || !entry.data.work_id)) {
      throw new Error(`${entry.id}: recommendation needs a version and listening entry`);
    }
  }
  const required = [home.band, ...home.members, ...home.recommendations, ...home.releases, ...home.events];
  for (const id of required) if (!byId.has(id)) throw new Error(`Homepage entry missing: ${id}`);
  if (!isPreview) {
    // Every page and dependency must match a deliberate publication review.
    // Partial verification remains partial; reviewed limitations must be explicit.
    validatePublication(all);
  }
  const requireEntry = (id: string) => {
    const entry = byId.get(id);
    if (!entry) throw new Error(`Unknown Wiki id ${id}`);
    return entry;
  };
  return { all, sources, byId, bySource, requireEntry };
}
export type Library = Awaited<ReturnType<typeof getLibrary>>;

export function heading(entry: WikiEntry): string {
  return entry.body?.match(/^# (.+)$/m)?.[1] ?? entry.data.title;
}
export function section(entry: WikiEntry, name: string): string {
  const chunks = (entry.body ?? '').replace(/\r\n?/g, '\n').split(/^## /m);
  const chunk = chunks.find(value => value.split('\n')[0].trim() === name);
  if (!chunk) throw new Error(`${entry.id}: expected section “${name}”`);
  return chunk.slice(chunk.indexOf('\n')).trim();
}
export function plain(markdown: string): string {
  return markdown.replace(/\[([^\]]*)\]\([^\n]*?\)/g, '$1').replace(/[*_`]/g, '').replace(/<[^>]+>/g, '').trim();
}
export function memberInfo(entry: WikiEntry) {
  const career = section(entry, '組團前做什麼').match(/^### (.+)$/m)?.[1];
  const roleText = section(entry, '樂團中的角色');
  const role = roleText.match(/\*\*(.+?)\*\*/)?.[1] ?? roleText.match(/QWER 的([^。]+)。/)?.[1];
  if (!career || !role) throw new Error(`${entry.id}: member summary cannot be read`);
  const title = heading(entry);
  return { name: title.split('（')[0], korean: title.match(/（(.+?)）/)?.[1], career: plain(career), role: plain(role) };
}
export function tableValue(entry: WikiEntry, key: string): string {
  for (const row of (entry.body ?? '').split('\n')) {
    const cells = row.split('|').map(cell => cell.trim());
    if (cells[1] === key) return plain(cells[2] ?? '');
  }
  throw new Error(`${entry.id}: missing table row ${key}`);
}
export const eventCategory = (value?: string) => ({
  debut: '正式出道', release: '正式發行', performance: '演出',
  'award-ceremony': '頒獎典禮', 'music-show-win': '音樂節目一位',
}[value ?? ''] ?? '其他節點');

export function entryDate(entry: WikiEntry, library: Library): string {
  const d = entry.data;
  if (d.release_id) return library.requireEntry(d.release_id).data.release_date ?? '';
  return d.release_date ?? d.date ?? d.published_date ?? d.reference_date ?? '';
}
export function dateLabel(entry: WikiEntry, library: Library): string {
  const start = entryDate(entry, library);
  return entry.data.date_end ? `${start} ～ ${entry.data.date_end}` : start || '日期待查';
}

export function rewriteWikiLink(href: string, entry: WikiEntry, library: Library): string {
  if (/^(https?:|mailto:|#)/i.test(href)) return href;
  const [rawPath, hash] = href.split('#', 2);
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(fileOf(entry)), decodeURIComponent(rawPath)));
  const match = library.all.find(value => fileOf(value) === target);
  if (match) return `${entryUrl(match)}${hash ? `#${hash}` : ''}`;
  const source = library.sources.find(value => fileOf(value) === target);
  if (source) return withBase(`sources/#${source.id}`);
  if (target === 'wiki/timeline/index.md') return withBase('timeline/');
  if (target === 'wiki/recommendations/index.md') return withBase('recommendations/');
  const musicIndexes: Record<string, string> = {
    'wiki/releases/index.md': 'discography/',
    'wiki/collaborations/index.md': 'discography/#collaborations',
    'wiki/other-songs/index.md': 'discography/#other-songs',
    'wiki/releases/coverage.md': 'discography/#scope',
  };
  if (target in musicIndexes) return withBase(musicIndexes[target]);
  const indexes: Record<string, string> = {
    'wiki/index.md': '', 'wiki/releases/index.md': 'releases', 'wiki/recommendations/index.md': 'recommendations',
    'wiki/timeline/index.md': 'timeline', 'wiki/collaborations/index.md': 'collaborations', 'wiki/other-songs/index.md': 'other-songs',
  };
  if (target in indexes) return withBase(`library/${indexes[target] ? `#${indexes[target]}` : ''}`);
  if (['wiki/questions.md', 'wiki/releases/coverage.md'].includes(target)) return withBase('sources/#scope');
  if (target.startsWith('docs/') || ['AGENTS.md', 'wiki/log.md'].includes(target)) return withBase('sources/#method');
  throw new Error(`${fileOf(entry)} contains an unmapped link: ${href}`);
}
