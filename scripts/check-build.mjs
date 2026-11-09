import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';

const root = path.resolve(process.argv[2] || 'dist-preview');
const base = process.argv[3] || '/';
const offline = process.argv.includes('--offline');
const isPublic = process.argv.includes('--public');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(path.join(dir, item.name)) : [path.join(dir, item.name)]);
const manifest = process.argv.includes('--manifest') ? JSON.parse(fs.readFileSync(path.join(root,'.site-files.json'),'utf8')).files : null;
const files = manifest ? Object.keys(manifest).map(file=>path.join(root,file)) : walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const errors = [];
let links = 0;
const read = file => fs.readFileSync(file, 'utf8');
if (manifest) for (const [name, expected] of Object.entries(manifest)) {
  const file = path.resolve(root, name);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) errors.push(`Missing or unsafe generated file: ${name}`);
  else if (createHash('sha256').update(fs.readFileSync(file)).digest('hex') !== expected) errors.push(`Generated file changed: ${name}`);
}
const check = (href, file) => {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) return;
  const url = new URL(href.replaceAll('&amp;', '&'), `https://preview.local${base}${path.relative(root, file).replaceAll('\\', '/')}`);
  if (!url.pathname.startsWith(base)) { errors.push(`Outside base: ${href} in ${file}`); return; }
  let target = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
  if (!target.startsWith(root + path.sep) && target !== root) { errors.push(`Outside build: ${href}`); return; }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) errors.push(`Missing target: ${href} in ${file}`);
  else if (url.hash && target.endsWith('.html')) {
    const id = decodeURIComponent(url.hash.slice(1));
    if (!read(target).includes(`id="${id}"`)) errors.push(`Missing anchor ${href} in ${file}`);
  }
  links++;
};
for (const file of htmlFiles) {
  const html = read(file);
  if (isPublic ? html.includes('noindex, nofollow, noarchive') : !html.includes('noindex, nofollow, noarchive')) errors.push(`Incorrect public/preview indexing state: ${file}`);
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) errors.push(`Expected one h1: ${file}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`Duplicate anchor: ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) check(match[1], file);
  if (offline && /<script[^>]*\bsrc=/.test(html)) errors.push(`External script in offline preview: ${file}`);
  if (offline) for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\btype=["']application\//.test(match[1])) continue;
    try { new Script(match[2], { filename: file }); }
    catch (error) { errors.push(`Inline script syntax: ${error.message}`); }
  }
}
for (const file of files.filter(file => file.endsWith('.css'))) {
  for (const match of read(file).matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) check(match[1], file);
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`PASS: ${htmlFiles.length} HTML pages; ${links} internal links/assets; anchors, headings and ${isPublic ? 'public' : 'preview'} indexing. Base ${base}${offline ? ' (portable)' : ''}`);
