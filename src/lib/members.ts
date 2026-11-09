import { marked, type Tokens } from 'marked';
import { memberInfo, section, type WikiEntry, type Library } from './wiki';
import { renderFragment } from './markdown';

// All career text stays in the Wiki. Only presentation labels belong in the view.
export function memberProfile(entry: WikiEntry, library: Library) {
  if (entry.data.type !== 'member') throw new Error(`${entry.id}: expected a member`);
  const allowed = ['組團前做什麼', '如何走向 QWER', '樂團中的角色', '已能確認的時間節點', '時間資訊的限制', '下一輪待查'];
  for (const match of (entry.body ?? '').matchAll(/^## (.+)$/gm)) {
    if (!allowed.includes(match[1].trim())) throw new Error(`${entry.id}: new member chapter needs a presentation mapping: ${match[1]}`);
  }
  const clean = (text: string) => text.replace(/^(?:相關頁面|來源紀錄)：.*$/gm, '')
    .replace(/^- 本頁為職涯草稿；使用者確認寫法，不代表已核准公開整頁。\r?\n?/gm, '')
    .replace('本頁依使用者確認的呈現方式，', '本頁').trim();
  const html = (text: string, inline = false) => renderFragment(clean(text), entry, library, inline);
  const table = marked.lexer(section(entry, '已能確認的時間節點')).find((token): token is Tokens.Table => token.type === 'table');
  if (!table || table.type !== 'table' || table.header.map(cell => cell.text).join('|') !== '時間|內容|日期的意義') {
    throw new Error(`${entry.id}: expected career timeline columns 時間 / 內容 / 日期的意義`);
  }
  const opening = (entry.body ?? '').replace(/^# .+\r?\n/, '').split(/^## /m)[0];
  const hasLimits = /^## 時間資訊的限制\s*$/m.test(entry.body ?? '');
  return {
    ...memberInfo(entry),
    opening: html(opening),
    before: html(section(entry, '組團前做什麼')),
    joining: html(section(entry, '如何走向 QWER')),
    roleHtml: html(section(entry, '樂團中的角色')),
    timeline: table.rows.map(cells => ({
      when: html(cells[0].text, true),
      what: html(cells[1].text, true),
      meaning: html(cells[2].text, true),
    })),
    limits: hasLimits ? html(section(entry, '時間資訊的限制')) : '',
    pending: html(section(entry, '下一輪待查')),
    sources: entry.data.sources.map(id => library.bySource.get(id)!),
  };
}
