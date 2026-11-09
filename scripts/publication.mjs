import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const sha256 = content => createHash('sha256').update(content).digest('hex');
export function validatePublication(entries, root = process.cwd()) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/publication-review.json'), 'utf8'));
  if (manifest.version !== 1) throw new Error('PUBLIC_CONTENT_NOT_READY: unsupported review manifest');
  for (const entry of entries) {
    const file = entry.filePath.replaceAll('\\','/').replace(/^.*\/(?=wiki\/)/,'');
    const record = manifest.pages[entry.id];
    if (entry.data.status !== 'ready' || entry.data.verification === 'conflict' || !entry.data.verified_at) throw new Error(`PUBLIC_CONTENT_NOT_READY: ${entry.id} needs content review`);
    if (!record || record.file !== file || !record.note || record.verification !== entry.data.verification || record.sha256 !== sha256(fs.readFileSync(path.join(root,file)))) throw new Error(`PUBLIC_CONTENT_NOT_READY: ${entry.id} changed since its recorded review`);
    if (entry.data.verification === 'partial' && !record.limitations?.length) throw new Error(`PUBLIC_CONTENT_NOT_READY: ${entry.id} needs explicit visible limitations`);
  }
}
