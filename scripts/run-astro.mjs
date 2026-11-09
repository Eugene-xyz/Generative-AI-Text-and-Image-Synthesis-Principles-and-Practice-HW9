import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const [command, ...args] = process.argv.slice(2);
if (!['dev', 'build', 'preview'].includes(command)) throw new Error('Unknown Astro command');
const drafts = command === 'dev' || args.includes('--drafts');
const astro = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const child = spawn(process.execPath, [astro, command, ...args.filter(arg => arg !== '--drafts')], {
  stdio: 'inherit',
  env: { ...process.env, PREVIEW_CONTENT: drafts ? '1' : '0', ASTRO_TELEMETRY_DISABLED: '1' },
});
child.on('exit', code => { process.exitCode = code ?? 1; });
child.on('error', error => { console.error(error); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
