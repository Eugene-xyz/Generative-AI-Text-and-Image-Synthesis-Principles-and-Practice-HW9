import { marked, type Tokens } from 'marked';
import { categories, home } from '../data/home';
import { musicEmbeds } from '../data/music-embeds';
import { releaseView } from './music';
import { renderFragment } from './markdown';
import { entryUrl, heading, plain, section, type Library, type WikiEntry } from './wiki';

const expected = ['適合誰聽','推薦理由（網站導聆）','歌曲背景與來源','推薦版本與官方收聽','選曲與查核紀錄','相關頁面'];
export function recommendationView(entry: WikiEntry, library: Library) {
  if (entry.data.type !== 'recommendation') throw new Error(`${entry.id}: expected recommendation`);
  const names = (entry.body ?? '').split(/^## /m).slice(1).map(chunk=>chunk.split('\n')[0].trim());
  if (names.length!==expected.length || expected.some(name=>!names.includes(name))) throw new Error(`${entry.id}: unexpected recommendation chapters`);
  const category = entry.data.category!;
  if (!(category in categories) || !entry.data.order_in_category || !entry.data.song_id || !entry.data.version_id || !entry.data.work_id || !entry.data.listen_url) throw new Error(`${entry.id}: missing recommendation metadata`);
  const work = library.requireEntry(entry.data.work_id);
  let versionHref = entryUrl(work);
  let locator = entry.data.listen_locator!;
  if (work.data.type === 'release') {
    const track = releaseView(work, library).tracks.find(item=>item.versionId===entry.data.version_id && item.songId===entry.data.song_id);
    if (!track || track.referenceOnly) throw new Error(`${entry.id}: recommended recording is not an identified listenable release track`);
    versionHref = track.href;
    locator = `第 ${track.order} 軌：${track.title}`;
  } else if (work.data.type === 'official-media') {
    const table = marked.lexer(section(work,'編輯用歌曲／版本對照')).find((token):token is Tokens.Table=>token.type==='table');
    if (!table?.rows.some(row=>plain(row[0].text)===entry.data.song_id && plain(row[1].text)===entry.data.version_id)) throw new Error(`${entry.id}: official-media version missing`);
  } else throw new Error(`${entry.id}: unsupported work type`);
  const version = section(entry,'推薦版本與官方收聽');
  const tables = marked.lexer(version).filter((token):token is Tokens.Table=>token.type==='table');
  if (tables.length!==1 || tables[0].header.map(cell=>plain(cell.text)).join('|')!=='項目|內容') throw new Error(`${entry.id}: expected recommendation version table`);
  const table = tables[0];
  const versionRow = table.rows.find(row=>plain(row[0].text)==='推薦版本');
  if (!versionRow) throw new Error(`${entry.id}: missing version description`);
  const title = heading(entry);
  const name = title.split('（')[0];
  const original = title.match(/（(.+?)）/)?.[1] ?? '';
  const embed = musicEmbeds[work.id];
  const render = (text:string, inline=false)=>renderFragment(text,entry,library,inline);
  const clean = (text:string)=>text.replace(/檔名 youth-pledge 只是編輯識別，不作官方譯名，/g,'').replace(/^來源紀錄：.*$/gm,'').trim();
  return {
    entry, work, category, categoryLabel:categories[category], name, original,
    href:entryUrl(entry), versionHref, locator,
    order:entry.data.order_in_category, featured:entry.data.featured_order,
    audience:plain(section(entry,'適合誰聽')),
    reason:render(section(entry,'推薦理由（網站導聆）')),
    shortReason:plain(section(entry,'推薦理由（網站導聆）')),
    background:render(section(entry,'歌曲背景與來源')),
    version:plain(versionRow[1].text),
    versionFields:table.rows.map(row=>({label:plain(row[0].text),value:render(row[1].text,true)})),
    versionNotes:render(clean(version.replace(table.raw,''))),
    listenUrl:embed?.source ?? entry.data.listen_url,
    listenLabel:embed ? '前往 Spotify 收聽' : '前往官方影片',
    related:render(section(entry,'相關頁面')),
  };
}
export type RecommendationView = ReturnType<typeof recommendationView>;
export function recommendationCatalogue(library:Library) {
  const picks = library.all.filter(entry=>entry.data.type==='recommendation').map(entry=>recommendationView(entry,library));
  const groups = Object.entries(categories).map(([id,label])=>({id,label,picks:picks.filter(item=>item.category===id).sort((a,b)=>a.order-b.order)}));
  for (const group of groups) {
    if (new Set(group.picks.map(item=>item.order)).size!==group.picks.length) throw new Error(`Duplicate recommendation order: ${group.id}`);
  }
  const featured = picks.filter(item=>item.featured).sort((a,b)=>a.featured!-b.featured!);
  if (featured.map(item=>item.entry.id).join('|')!==home.recommendations.join('|') || featured.some((item,i)=>item.featured!==i+1)) throw new Error('Featured recommendations disagree with confirmed selection');
  if (new Set(picks.map(item=>`${item.entry.data.work_id}/${item.entry.data.version_id}`)).size!==picks.length) throw new Error('Duplicate recommended version');
  return {picks,groups,featured};
}
