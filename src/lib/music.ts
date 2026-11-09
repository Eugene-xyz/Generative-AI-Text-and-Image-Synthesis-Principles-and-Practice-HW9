import { marked, type Tokens } from 'marked';
import { renderFragment } from './markdown';
import { entryUrl, heading, plain, type WikiEntry, type Library } from './wiki';

interface Chapter { title: string; body: string; }
const chapters = (entry: WikiEntry): Chapter[] => (entry.body ?? '').replace(/\r\n?/g, '\n').split(/^## /m).slice(1).map(chunk => ({
  title: chunk.slice(0, chunk.indexOf('\n')).trim(), body: chunk.slice(chunk.indexOf('\n')).trim(),
}));
const required = (entry: WikiEntry, choices: string[]) => {
  const result = chapters(entry).find(chapter => choices.includes(chapter.title));
  if (!result) throw new Error(`${entry.id}: expected music chapter ${choices.join(' / ')}`);
  return result.body;
};

function tableIn(markdown: string, entry: WikiEntry) {
  // Marked normalizes line endings; offsets must use that same input.
  markdown = markdown.replace(/\r\n?/g, '\n');
  const tokens = marked.lexer(markdown);
  const tables = tokens.filter((token): token is Tokens.Table => token.type === 'table');
  if (tables.length !== 1) throw new Error(`${entry.id}: expected one table in music section`);
  const table = tables[0];
  const position = markdown.indexOf(table.raw);
  if (position < 0) throw new Error(`${entry.id}: music table could not be located`);
  return { table, before: markdown.slice(0, position), after: markdown.slice(position + table.raw.length) };
}

// Remove workflow-only wording, never the musical/version/date limitations.
export const cleanMusic = (text: string) => text
  .replace(/\r\n?/g, '\n')
  .replace(/^來源紀錄：.*$/gm, '')
  .replace(/^相關頁面：.*$/gm, '')
  .replace(/^\[本分類索引\].*$/gm, '')
  .replace(/^本頁保持 draft；.*$/gm, '')
  .replace('本頁格式已獲使用者確認，後續作品依相同格式按發行時間整理。', '')
  .replace('依使用者決定維持', '維持')
  .replace('依使用者決定放在', '收錄在')
  .replace('published_date 保持 null', '確切影音公開日仍待查')
  .replace('本作品的發行日期以本頁 `release_date` 為主要紀錄。', '')
  .replace('以作品 ID 引用；', '；')
  .replace('發行日期由本頁維護；', '')
  .replace(' 以 `release_id` 引用，不另外保存另一個日期。', '。')
  .trim();

const publicHtml = (text: string, entry: WikiEntry, library: Library, inline = false) => renderFragment(cleanMusic(text), entry, library, inline);
const opening = (entry: WikiEntry) => cleanMusic((entry.body ?? '').replace(/^# .+\r?\n/, '').split(/^## /m)[0]);

export function musicTitle(entry: WikiEntry) {
  const full = heading(entry);
  const parts = full.split('／');
  return parts.length === 2 ? { main: parts[1], original: parts[0], full } : { main: full, original: '', full };
}

export const musicDate = (entry: WikiEntry) => entry.data.release_date ?? entry.data.published_date ?? entry.data.reference_date ?? '';
export const musicDateBasis = (entry: WikiEntry) => entry.data.type === 'release' ? '正式發行' : entry.data.date_basis ?? '日期性質待查';
export const musicCategory = (entry: WikiEntry) => entry.data.type === 'release' ? '正式發行' : entry.data.category === 'collaboration' ? '官方合作影音' : '其他官方公開歌曲';
export const compareMusic = (a: WikiEntry, b: WikiEntry) => (musicDate(a) || '9999').localeCompare(musicDate(b) || '9999') || a.id.localeCompare(b.id);
const typeLabels: Record<string, string> = { 'single-album': '單曲專輯', 'mini-album': '迷你專輯', 'digital-single': '數位單曲', 'special-lp': '特別黑膠', 'digital-release': '數位作品・細分類待查' };
export const releaseType = (entry: WikiEntry) => {
  const label = typeLabels[entry.data.release_type ?? ''];
  if (!label) throw new Error(`${entry.id}: unknown release type`);
  return label;
};

export function releaseView(entry: WikiEntry, library: Library) {
  const allowed = ['發行資料', '作品背景', '曲目表', '曲目與收錄版本', '已確認收錄曲（曲序待查）', '逐曲簡介', '每首歌曲的簡介', '時間與相關作品', '時間與後續銜接', '來源與待查', '歌曲推薦入口'];
  for (const chapter of chapters(entry)) if (!allowed.includes(chapter.title) && !chapter.title.startsWith('編輯用')) throw new Error(`${entry.id}: unmapped music chapter ${chapter.title}`);
  if (!entry.data.release_date || !entry.data.formats || entry.data.digital_track_count == null) throw new Error(`${entry.id}: missing release metadata`);
  const data = tableIn(required(entry, ['發行資料']), entry);
  const values = data.table.rows.map(cells => ({ label: plain(cells[0].text), value: publicHtml(cells[1].text, entry, library, true) }));
  const value = (key: string) => {
    const row = data.table.rows.find(cells => plain(cells[0].text) === key);
    if (!row) throw new Error(`${entry.id}: missing release field ${key}`);
    return plain(row[1].text);
  };
  const trackData = tableIn(required(entry, ['曲目表', '曲目與收錄版本', '已確認收錄曲（曲序待查）']), entry);
  const labels = trackData.table.header.map(cell => plain(cell.text));
  const firstFormat = labels.join('|') === '曲序|正式曲名／官方平台英文名|版本與語言|收錄範圍|官方平台入口';
  if (!firstFormat && labels.join('|') !== '曲序|原名／官方英文顯示名稱|語言|版本／收錄說明|官方平台入口') throw new Error(`${entry.id}: unknown track columns`);
  const versionChapter = chapters(entry).find(chapter => chapter.title.startsWith('編輯用'));
  if (!versionChapter) throw new Error(`${entry.id}: missing stable version mapping`);
  const versionData = tableIn(versionChapter.body, entry);
  const descriptions = required(entry, ['逐曲簡介', '每首歌曲的簡介']).split(/^### /m).slice(1).map(chunk => ({
    title: chunk.slice(0, chunk.indexOf('\n')).replace(/^(?:\d+\.\s*|曲序待查｜)/, '').trim(),
    body: chunk.slice(chunk.indexOf('\n')).trim(),
  }));
  if (trackData.table.rows.length !== versionData.table.rows.length || descriptions.length !== trackData.table.rows.length) throw new Error(`${entry.id}: tracks, versions and descriptions differ`);
  const tracks = trackData.table.rows.map((cells, i) => {
    const title = plain(cells[1].text);
    if (title !== plain(descriptions[i].title)) throw new Error(`${entry.id}: description does not match track ${title}`);
    const versionId = plain(versionData.table.rows[i][1].text);
    const songId = plain(versionData.table.rows[i][0].text);
    if (!/^(?:track|appearance)-[a-z0-9-]+$/.test(versionId) || !/^song-[a-z0-9-]+$/.test(songId)) throw new Error(`${entry.id}: invalid version mapping`);
    const order = plain(cells[0].text);
    if (entry.data.release_type === 'special-lp' && order !== '待查') throw new Error(`${entry.id}: LP order must stay unknown`);
    const anchor = `version-${versionId}`;
    return {
      title, order, anchor, songId, versionId, work: entry,
      href: `${entryUrl(entry)}#${anchor}`,
      language: firstFormat ? '' : plain(cells[2].text),
      version: plain(cells[firstFormat ? 2 : 3].text),
      scope: firstFormat ? plain(cells[3].text) : entry.data.release_type === 'special-lp' ? '黑膠；曲序待查' : '數位曲序',
      entryHtml: publicHtml(cells[4].text, entry, library, true),
      description: publicHtml(descriptions[i].body, entry, library),
      referenceOnly: entry.data.release_type === 'special-lp',
    };
  });
  if (new Set(tracks.map(track => track.anchor)).size !== tracks.length) throw new Error(`${entry.id}: duplicate track anchor`);
  const notes = chapters(entry).find(chapter => chapter.title === '來源與待查')?.body
    ?? versionData.after.split(/核心發行資料/)[0];
  return {
    entry, ...musicTitle(entry), date: entry.data.release_date, type: releaseType(entry),
    subtitle: value('發行類型'), intro: publicHtml(opening(entry), entry, library),
    values, metadataNotes: publicHtml(data.before + '\n' + data.after, entry, library),
    background: publicHtml(required(entry, ['作品背景']), entry, library),
    trackNotesBefore: publicHtml(trackData.before, entry, library), trackNotesAfter: publicHtml(trackData.after, entry, library),
    tracks, notes: publicHtml(notes, entry, library),
    connections: publicHtml(required(entry, ['時間與相關作品', '時間與後續銜接']), entry, library),
    recommendations: publicHtml(chapters(entry).find(chapter => chapter.title === '歌曲推薦入口')?.body ?? '', entry, library),
    digitalCount: entry.data.digital_track_count,
  };
}
export type ReleaseView = ReturnType<typeof releaseView>;
export type MusicTrack = ReleaseView['tracks'][number];

export function mediaView(entry: WikiEntry, library: Library) {
  const allowed = ['作品與分類', '版本、時間與官方入口', '逐公開版本簡介', '逐版本簡介', '來源與待查', '歌曲推薦入口'];
  for (const chapter of chapters(entry)) if (!allowed.includes(chapter.title) && !chapter.title.startsWith('編輯用')) throw new Error(`${entry.id}: unmapped media chapter ${chapter.title}`);
  const data = tableIn(required(entry, ['作品與分類']), entry);
  const versions = tableIn(required(entry, ['版本、時間與官方入口']), entry);
  if (versions.table.header.map(cell => plain(cell.text)).join('|') !== '日期或範圍|性質|已確認內容|入口與限制') throw new Error(`${entry.id}: unknown media columns`);
  const rows = versions.table.rows.map(cells => {
    const kind = plain(cells[1].text);
    const anchor = `media-${kind.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')}`;
    return { anchor, date: plain(cells[0].text), kind,
      detail: publicHtml(cells[2].text, entry, library, true), entryHtml: publicHtml(cells[3].text, entry, library, true),
      href: `${entryUrl(entry)}#${encodeURIComponent(anchor)}`,
    };
  });
  if (new Set(rows.map(row => row.anchor)).size !== rows.length) throw new Error(`${entry.id}: duplicate media entry labels`);
  return {
    entry, ...musicTitle(entry), date: musicDate(entry), basis: musicDateBasis(entry),
    intro: publicHtml(opening(entry), entry, library),
    values: data.table.rows.map(cells => ({ label: plain(cells[0].text), value: publicHtml(cells[1].text, entry, library, true) })),
    versions: rows, versionNotes: publicHtml(versions.before + '\n' + versions.after, entry, library),
    descriptions: publicHtml(chapters(entry).find(chapter => ['逐公開版本簡介', '逐版本簡介'].includes(chapter.title))?.body ?? '', entry, library),
    notes: publicHtml(required(entry, ['來源與待查']), entry, library),
    recommendations: publicHtml(chapters(entry).find(chapter => chapter.title === '歌曲推薦入口')?.body ?? '', entry, library),
  };
}

export function musicCatalogue(library: Library) {
  const releases = library.all.filter(entry => entry.data.type === 'release').sort(compareMusic).map(entry => releaseView(entry, library));
  const media = library.all.filter(entry => entry.data.type === 'official-media').sort(compareMusic).map(entry => mediaView(entry, library));
  return { releases, tracks: releases.flatMap(release => release.tracks),
    collaborations: media.filter(item => item.entry.data.category === 'collaboration'),
    otherSongs: media.filter(item => item.entry.data.category === 'original-publication'),
  };
}
