import fs from 'node:fs';
import path from 'node:path';
import { sha256 } from './publication.mjs';

const source = path.resolve('dist');
const target = path.resolve('.');
const manifestPath=path.join(target,'.site-files.json');
const allowed = rel => /^(?:index\.html|favicon\.svg|\.nojekyll)$/.test(rel) || /^(?:_astro|images|licenses|band|members|recommendations|discography|collaborations|other-songs|timeline|read|library|sources)\/[a-zA-Z0-9_./%\-]+$/.test(rel);
const checkedPath = rel => {
  const result=path.resolve(target,rel);
  if (!allowed(rel) || rel.split('/').includes('..') || !result.startsWith(target+path.sep)) throw new Error(`Unsafe generated path: ${rel}`);
  return result;
};
const walk = folder => fs.readdirSync(folder,{withFileTypes:true}).flatMap(item=>item.isDirectory()?walk(path.join(folder,item.name)):[path.join(folder,item.name)]);
const relativeUrl = (url,relativeFile,isRoute) => {
  if (!url.startsWith('/') || url.startsWith('//')) return url;
  const parsed=new URL(url,'https://build.local');
  let dest=decodeURIComponent(parsed.pathname.slice(1));
  if(isRoute && (!path.posix.extname(dest) || dest.endsWith('/'))) dest=path.posix.join(dest,'index.html');
  return `${path.posix.relative(path.posix.dirname(relativeFile),dest) || path.posix.basename(relativeFile)}${parsed.search}${parsed.hash}`;
};
if (!fs.existsSync(path.join(source,'index.html'))) throw new Error('Run the public build before exporting.');
const planned=new Map();
for (const file of walk(source)) {
  const rel=path.relative(source,file).replaceAll('\\','/');
  checkedPath(rel);
  let content=fs.readFileSync(file);
  if (rel.endsWith('.html')) {
    let html=content.toString('utf8');
    if (html.includes('noindex, nofollow, noarchive')) throw new Error('Refusing to publish a preview build.');
    html=html.replace(/<script\b([^>]*?)src="([^"]+)"([^>]*)><\/script>/g,(_match,_before,src)=>{
      if (!src.startsWith('/_astro/')) throw new Error(`Unexpected script: ${src}`);
      const script=fs.readFileSync(path.join(source,src.slice(1)),'utf8');
      if (/\b(?:import\s*[{("']|export\s)/.test(script)) throw new Error('New module dependencies need an updated portable exporter.');
      return `<script>(()=>{${script.replaceAll('</script','<\\/script')}\n})();</script>`;
    });
    html=html.replace(/\b(href|src)="([^"]+)"/g,(_match,attribute,url)=>`${attribute}="${relativeUrl(url,rel,attribute==='href')}"`);
    content=Buffer.from(html);
  } else if (rel.endsWith('.css')) {
    content=Buffer.from(content.toString('utf8').replace(/url\((["']?)([^\s"')]+)\1\)/g,(_match,quote,url)=>`url(${quote}${relativeUrl(url,rel,false)}${quote})`));
  }
  planned.set(rel,content);
}
planned.set('.nojekyll',Buffer.from(''));
const prior=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{version:1,files:{}};
if(prior.version!==1) throw new Error('Unsupported generated-file manifest.');
// Complete the collision check before any write or removal.
for(const [rel,digest] of Object.entries(prior.files)){
  const file=checkedPath(rel);
  if(fs.existsSync(file) && sha256(fs.readFileSync(file))!==digest) throw new Error(`Generated file was edited manually: ${rel}. Preserve the edit before rebuilding.`);
}
for(const [rel,content] of planned){
  const file=checkedPath(rel);
  if(fs.existsSync(file) && !(rel in prior.files) && sha256(fs.readFileSync(file))!==sha256(content)) throw new Error(`Unowned file collision: ${rel}`);
}
const files={};
for(const [rel,content] of planned){const file=checkedPath(rel);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);files[rel]=sha256(content);}
// Remove only unchanged files owned by the prior generated-file manifest, never source folders.
for(const rel of Object.keys(prior.files)) if(!planned.has(rel) && fs.existsSync(checkedPath(rel))) fs.unlinkSync(checkedPath(rel));
fs.writeFileSync(manifestPath,JSON.stringify({version:1,files:Object.fromEntries(Object.entries(files).sort(([a],[b])=>a.localeCompare(b)))},null,2)+'\n');
console.log(`Exported ${planned.size} owned static files. Root index.html is ready for local opening and branch-based GitHub Pages.`);
