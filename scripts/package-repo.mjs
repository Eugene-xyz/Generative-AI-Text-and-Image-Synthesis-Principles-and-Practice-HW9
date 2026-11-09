import fs from 'node:fs';
import path from 'node:path';
import { sha256 } from './publication.mjs';
const root=path.resolve('.');
const target=path.resolve(process.argv[2] || 'github-ready');
if(target===root || !target.startsWith(root+path.sep)) throw new Error('Package destination must be a new child folder of the project.');
if(fs.existsSync(target) && fs.readdirSync(target).length) throw new Error('Package destination is not empty. Preserve the previous package and choose a new destination.');
const generated=JSON.parse(fs.readFileSync('.site-files.json','utf8')).files;
const names=new Set(Object.keys(generated));
const top=['AGENTS.md','README.md','SUBMISSION.md','.gitignore','.gitattributes','.site-files.json','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','astro.config.mjs','tsconfig.json'];
top.forEach(name=>names.add(name));
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(item=>item.isDirectory()?walk(path.join(dir,item.name)):[path.join(dir,item.name)]);
for(const dir of ['src','wiki','raw','public','scripts','docs']) for(const file of walk(dir)) names.add(file.replaceAll('\\','/'));
for(const rel of names){
  const source=path.resolve(root,rel),dest=path.resolve(target,rel);
  if(!source.startsWith(root+path.sep) || !dest.startsWith(target+path.sep) || rel.split('/').includes('..')) throw new Error(`Unsafe package path: ${rel}`);
  if(fs.lstatSync(source).isSymbolicLink()) throw new Error(`Symlink cannot be packaged: ${rel}`);
  if(generated[rel] && sha256(fs.readFileSync(source))!==generated[rel]) throw new Error(`Generated file changed: ${rel}`);
  if(fs.statSync(source).size>25*1024*1024) throw new Error(`File exceeds browser upload size: ${rel}`);
}
for(const rel of names){const dest=path.join(target,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,rel),dest);}
console.log(`GitHub-ready package: ${target}; ${names.size} files. Dependencies, caches and old review copies excluded.`);
