import fs from 'node:fs';
import path from 'node:path';
import { sha256 } from './publication.mjs';

// Run only after reading the page, its sources, rendered limitations and dependencies.
const args = process.argv.slice(2).filter(arg=>arg!=='--');
const option = name => { const i=args.indexOf(name); return i<0 ? '' : args[i+1] || ''; };
const file = args[0]?.replaceAll('\\','/');
const note = option('--note');
const date = option('--date');
const limits = option('--limits').split(',').filter(Boolean);
if (!file || !/^wiki\/[a-z0-9-]+\/[a-z0-9-]+\.md$/.test(file) || !note || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Usage: node scripts/record-review.mjs wiki/<category>/<slug>.md --date YYYY-MM-DD --note "actual review scope" [--limits F001,F002]');
const content = fs.readFileSync(file);
const fm = content.toString('utf8').split('---')[1];
const field = key => fm?.match(new RegExp(`^${key}: (.+)$`,'m'))?.[1].trim().replace(/^"|"$/g,'');
if (field('status')!=='ready' || !['partial','checked'].includes(field('verification'))) throw new Error('The reviewed page must be ready and checked/partial; this command never changes content status.');
if (field('verification')==='partial' && !limits.length) throw new Error('Keep partial verification and provide the visible limitations as --limits.');
const target = path.resolve('docs/publication-review.json');
const manifest = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target,'utf8')) : {version:1,pages:{}};
manifest.pages[field('id')] = {file,sha256:sha256(content),verification:field('verification'),reviewed_at:date,note,limitations:limits};
fs.writeFileSync(target,JSON.stringify(manifest,null,2)+'\n');
console.log(`Recorded publication review for ${field('id')}; source-check dates unchanged.`);
