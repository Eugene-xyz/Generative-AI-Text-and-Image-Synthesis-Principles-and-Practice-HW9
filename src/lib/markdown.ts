import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { rewriteWikiLink, type WikiEntry, type Library } from './wiki';

export function renderWiki(entry: WikiEntry, library: Library) {
  const chunks = (entry.body ?? '').replace(/^# .+\r?\n/, '').split(/(?=^## )/m);
  const markdown = chunks.filter(chunk => !/^## (?:編輯用|選曲與查核紀錄)/.test(chunk))
    .join('').replace(/^來源紀錄：.*$/gm, '');
  return renderFragment(markdown, entry, library);
}

export function renderFragment(markdown: string, entry: WikiEntry, library: Library, inline = false) {
  const parsed = inline ? marked.parseInline(markdown, { async: false, gfm: true }) : marked.parse(markdown, { async: false, gfm: true });
  return sanitizeHtml(parsed, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags],
    allowedAttributes: { a: ['href', 'rel'], th: ['align'], td: ['align'], code: ['class'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (_tag, attributes) => ({ tagName: 'a', attribs: { ...attributes,
        href: rewriteWikiLink(attributes.href ?? '', entry, library),
        rel: 'noreferrer',
      } }),
    },
  }).replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>');
}
