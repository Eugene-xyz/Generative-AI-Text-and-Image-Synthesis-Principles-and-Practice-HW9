import { defineConfig } from 'astro/config';

const preview = process.env.PREVIEW_CONTENT === '1';
const base = process.env.SITE_BASE || '/';
if (!base.startsWith('/') || !base.endsWith('/')) {
  throw new Error('SITE_BASE must begin and end with /, e.g. /qwer-stage-notes/');
}

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || undefined,
  base,
  trailingSlash: 'always',
  outDir: preview ? './dist-preview' : './dist',
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 4321 },
});
