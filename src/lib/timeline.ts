import { marked, type Tokens } from 'marked';
import { renderFragment } from './markdown';
import { mediaView, musicCategory } from './music';
import { additionalMediaMilestones } from '../data/timeline';
import { entryUrl, heading, plain, section, type Library, type WikiEntry } from './wiki';

export const timelineCategories = {
  debut: { label: '正式出道', code: 'DEBUT' },
  release: { label: '正式發行', code: 'RELEASE' },
  performance: { label: '演出', code: 'LIVE' },
  'award-ceremony': { label: '頒獎典禮', code: 'AWARDS' },
  'music-show-win': { label: '音樂節目一位', code: 'ON AIR' },
  'official-media': { label: '影音公開／合作節點', code: 'MEDIA' },
} as const;
export type TimelineCategory = keyof typeof timelineCategories;
type Precision = 'day' | 'month' | 'year' | 'unknown';
const datePattern = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/;

function precisionOf(date: string): Precision {
  if (!date) return 'unknown';
  const match = date.match(datePattern);
  if (!match) throw new Error(`Unrecognized timeline date: ${date}`);
  const [, year, month, day] = match;
  if (month && (+month < 1 || +month > 12)) throw new Error(`Invalid month: ${date}`);
  if (day && (+day < 1 || +day > new Date(Date.UTC(+year, +month, 0)).getUTCDate())) throw new Error(`Invalid day: ${date}`);
  return day ? 'day' : month ? 'month' : 'year';
}
const dateBasis: Record<string, string> = {
  'performance-date': '實際演出日期／期間',
  'ceremony-date': '典禮日；事前公布另見日期辨識',
  'broadcast-award-date': '音樂節目當集結果日',
};
const eventTitle = (entry: WikiEntry) => heading(entry).replace(/^\d{4}(?:-\d{2}){0,2}(?:[～~]\d{4}(?:-\d{2}){0,2})?｜/, '');
export const cleanEvent = (markdown: string) => markdown
  .replace(/\r\n?/g, '\n')
  .replace(/^來源紀錄：.*$/gm, '')
  .replace(/^相關頁面：.*$/gm, '')
  .replace(/^本頁為使用者確認收錄項目的整理草稿；.*$/gm, '')
  .replace(/^`checked` 表示.*$/gm, '')
  .replace(/^\*\*日期與排序來源：\*\*.*$/gm, '')
  .replace(/^\[發展時間線\].*$/gm, '')
  .replace('下列只列已確認收錄曲', '作品頁列出已確認收錄曲')
  .trim();
const bodyWithoutTitle = (entry: WikiEntry) => cleanEvent((entry.body ?? '').replace(/^# .+\r?\n/, ''));
const firstParagraph = (entry: WikiEntry) => bodyWithoutTitle(entry).split(/\r?\n\s*\r?\n/)[0];
const html = (text: string, entry: WikiEntry, library: Library, inline = false) => renderFragment(cleanEvent(text), entry, library, inline);

export interface TimelineNode {
  id: string;
  anchor: string;
  entry: WikiEntry;
  category: TimelineCategory;
  title: string;
  start: string;
  end: string;
  precision: Precision;
  dateLabel: string;
  basis: string;
  context: string;
  summary: string;
  href: string;
  work?: WikiEntry;
}
function nodeDate(start: string, end = '', declared?: string) {
  const precision = precisionOf(start);
  if (declared && precision !== declared) throw new Error(`Timeline date precision mismatch: ${start} / ${declared}`);
  if (end && (precisionOf(end) !== precision || end < start)) throw new Error(`Invalid event period: ${start} / ${end}`);
  return { start, end, precision, dateLabel: start ? `${start}${end ? ` ～ ${end}` : ''}` : '日期待查' };
}

export function eventNode(entry: WikiEntry, library: Library): TimelineNode {
  if (entry.data.type !== 'event') throw new Error(`${entry.id}: expected event`);
  const category = entry.data.category as TimelineCategory;
  if (!category || !(category in timelineCategories) || category === 'official-media') throw new Error(`${entry.id}: unknown event category`);
  const work = entry.data.release_id ? library.requireEntry(entry.data.release_id) : undefined;
  if (category === 'release') {
    if (!work || work.data.type !== 'release' || entry.data.date || entry.data.date_end) throw new Error(`${entry.id}: release event must reference a release without storing its own date`);
  } else if (work) throw new Error(`${entry.id}: non-release event cannot use release_id`);
  const date = nodeDate(work?.data.release_date ?? entry.data.date ?? '', work ? '' : entry.data.date_end ?? '', work?.data.date_precision ?? entry.data.date_precision);
  let basis = category === 'debut' ? '樂團正式出道日；不推定成立或加入日期' : category === 'release' ? work?.data.release_type === 'special-lp' ? '特別黑膠首次官方販售日' : '作品正式發行日' : dateBasis[entry.data.date_basis ?? ''];
  if (!basis) throw new Error(`${entry.id}: missing event date basis`);
  return { id: entry.id, anchor: `node-${entry.id}`, entry, category, title: eventTitle(entry), ...date,
    basis, context: '', summary: html(firstParagraph(entry), entry, library), href: entryUrl(entry), work };
}

export function timelineCatalogue(library: Library) {
  const events = library.all.filter(entry => entry.data.type === 'event').map(entry => eventNode(entry, library));
  const media = library.all.filter(entry => entry.data.type === 'official-media').map(entry => mediaView(entry, library));
  const mediaNodes: TimelineNode[] = media.map(work => ({
    id: work.entry.id, anchor: `node-${work.entry.id}`, entry: work.entry, category: 'official-media', title: work.full,
    ...nodeDate(work.date), basis: work.basis, context: musicCategory(work.entry), summary: work.intro, href: entryUrl(work.entry),
  }));
  for (const selected of additionalMediaMilestones) {
    const work = media.find(item => item.entry.id === selected.workId);
    const version = work?.versions.find(item => item.kind === selected.versionLabel);
    if (!work || !version) throw new Error(`Missing selected media milestone: ${selected.workId} / ${selected.versionLabel}`);
    // Only read the explicitly dated version cell; never extract a date from prose or a URL.
    const match = version.date.match(/^(?:截至 )?(\d{4}(?:-\d{2}){0,2})(?: 已公開)?$/);
    if (!match || match[1] === work.date) throw new Error(`${selected.workId}: additional milestone needs a distinct, interpretable date`);
    mediaNodes.push({ id: `${work.entry.id}-${version.anchor}`, anchor: `node-${work.entry.id}-${version.anchor}`,
      entry: work.entry, category: 'official-media', title: `${work.full} — ${version.kind}`,
      ...nodeDate(match[1]), basis: version.date.startsWith('截至 ') ? '截至此日已公開；首次上線日待查' : '已核對的版本公開日',
      context: musicCategory(work.entry), summary: `<p>${version.detail}</p><p>${version.entryHtml}</p>`, href: version.href,
    });
  }
  const nodes = [...events, ...mediaNodes].sort((a,b) => (a.start || '9999').localeCompare(b.start || '9999') || a.id.localeCompare(b.id));
  if (new Set(nodes.map(item=>item.id)).size !== nodes.length) throw new Error('Duplicate timeline node');
  const releaseIds = events.filter(item=>item.category==='release').map(item=>item.work!.id);
  if (new Set(releaseIds).size !== releaseIds.length) throw new Error('Duplicate release event');
  for (const entry of library.all.filter(entry=>entry.data.type==='release')) if (!releaseIds.includes(entry.id)) throw new Error(`${entry.id}: missing release event`);
  const years = [...new Set(nodes.filter(item=>item.start).map(item=>item.start.slice(0,4)))];
  const groups = years.map(year => ({year, exact: nodes.filter(item=>item.start.startsWith(year) && item.precision==='day'), partial: nodes.filter(item=>item.start.startsWith(year) && item.precision!=='day')}));
  const undated = nodes.filter(item=>!item.start);
  const counts = Object.fromEntries(Object.keys(timelineCategories).map(category=>[category,nodes.filter(item=>item.category===category).length])) as Record<TimelineCategory,number>;
  const cutoff = nodes.map(item=>item.entry.data.verified_at ?? '').sort().at(-1);
  return { nodes, events, mediaNodes, groups, undated, counts, cutoff };
}

export function eventRecords(markdown: string, entry: WikiEntry, library: Library) {
  const text = cleanEvent(markdown);
  const tables = marked.lexer(text).filter((token): token is Tokens.Table => token.type==='table');
  if (tables.length > 1) throw new Error(`${entry.id}: split multiple event tables into named sections`);
  const table = tables[0];
  if (!table) return { before: html(text,entry,library), after: '', records: [] };
  const position = text.indexOf(table.raw);
  if (position < 0) throw new Error(`${entry.id}: event table could not be located`);
  return { before: html(text.slice(0,position),entry,library), after: html(text.slice(position+table.raw.length),entry,library),
    records: table.rows.map(cells => ({ title: html(cells[0].text,entry,library,true),
      fields: cells.slice(1).map((cell,index)=>({ label: plain(table.header[index+1].text), value: html(cell.text,entry,library,true) })),
    })),
  };
}
export type EventRecordsView = ReturnType<typeof eventRecords>;

export function eventView(entry: WikiEntry, library: Library) {
  const node = eventNode(entry,library);
  const detailed = ['performance','award-ceremony','music-show-win'].includes(node.category);
  const chapterNames = (entry.body ?? '').split(/^## /m).slice(1).map(chunk=>chunk.split('\n')[0].trim());
  const expected = ['事件資料','事件內容','日期辨識','收錄理由','範圍與待查','相關頁面'];
  if (detailed && (chapterNames.length!==expected.length || expected.some(name=>!chapterNames.includes(name)))) throw new Error(`${entry.id}: unexpected event chapters`);
  if (!detailed && chapterNames.length) throw new Error(`${entry.id}: simple event needs an explicit chapter mapping`);
  let facts: { label: string; value: string }[] = [];
  if (detailed) {
    const tokens = marked.lexer(cleanEvent(section(entry,'事件資料')));
    const tables = tokens.filter((token): token is Tokens.Table=>token.type==='table');
    if (tables.length!==1 || tokens.some(token=>!['table','space'].includes(token.type)) || tables[0].header.map(cell=>plain(cell.text)).join('|')!=='欄位|內容') throw new Error(`${entry.id}: expected only an event metadata table; move prose into 事件內容`);
    facts = tables[0].rows.map(cells=>({label:plain(cells[0].text),value:html(cells[1].text,entry,library,true)}));
  }
  const simpleBody = bodyWithoutTitle(entry).slice(firstParagraph(entry).length).trim();
  return { ...node, detailed, facts,
    body: detailed ? '' : html(simpleBody,entry,library),
    content: eventRecords(detailed ? section(entry,'事件內容') : '',entry,library),
    dates: eventRecords(detailed ? section(entry,'日期辨識') : '',entry,library),
    reason: detailed ? html(section(entry,'收錄理由'),entry,library) : '',
    limits: detailed ? html(section(entry,'範圍與待查'),entry,library) : '',
    relatedHtml: detailed ? html(section(entry,'相關頁面'),entry,library) : '',
  };
}
