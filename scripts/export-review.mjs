import fs from 'node:fs';
import path from 'node:path';

// A disposable, file://-friendly review copy. Edit src/ and wiki/, never this output.
const source = path.resolve('dist-preview');
const target = path.resolve('review');
if (!fs.existsSync(path.join(source, 'index.html'))) throw new Error('Run pnpm build:preview first');
const base = process.env.SITE_BASE || '/';
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => item.isDirectory() ? walk(path.join(dir, item.name)) : [path.join(dir, item.name)]);
const files = walk(source);
const rewrite = (value, relativeFile, route) => {
  if (!value.startsWith(base) || value.startsWith('//')) return value;
  const parsed = new URL(value, 'https://preview.local');
  let destination = decodeURIComponent(parsed.pathname.slice(base.length));
  if (route && (!path.extname(destination) || destination.endsWith('/'))) destination = path.posix.join(destination, 'index.html');
  const relative = path.posix.relative(path.posix.dirname(relativeFile), destination);
  return `${relative || path.posix.basename(relativeFile)}${parsed.search}${parsed.hash}`;
};
for (const file of files) {
  const relativeFile = path.relative(source, file).replaceAll('\\', '/');
  const destination = path.join(target, relativeFile);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (file.endsWith('.html')) {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<script\b([^>]*?)src="([^"]+)"([^>]*)><\/script>/g, (_match, _before, src) => {
      if (!src.startsWith(base) || src.startsWith('//')) throw new Error(`Unexpected script ${src}`);
      const script = fs.readFileSync(path.join(source, src.slice(base.length)), 'utf8');
      if (/\b(?:import\s*[{("']|export\s)/.test(script)) throw new Error('Review script now needs a server; update this exporter before using it.');
      return `<script>${script.replaceAll('</script', '<\\/script')}</script>`;
    });
    html = html.replace(/\b(href|src)="([^"]+)"/g, (_match, attribute, value) => `${attribute}="${rewrite(value, relativeFile, attribute === 'href')}"`);
    fs.writeFileSync(destination, html);
  } else if (file.endsWith('.css')) {
    const css = fs.readFileSync(file, 'utf8').replace(/url\((["']?)([^\s"')]+)\1\)/g, (_match, quote, value) => `url(${quote}${rewrite(value, relativeFile, false)}${quote})`);
    fs.writeFileSync(destination, css);
  } else fs.copyFileSync(file, destination);
}
console.log(`Review copy written: ${target} (${files.length} files). Open review/index.html directly.`);
