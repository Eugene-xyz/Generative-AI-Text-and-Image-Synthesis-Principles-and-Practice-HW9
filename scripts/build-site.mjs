import { spawnSync } from 'node:child_process';
const run=(script,args=[])=>{
  const result=spawnSync(process.execPath,[script,...args],{stdio:'inherit',env:{...process.env,SITE_BASE:'/',ASTRO_TELEMETRY_DISABLED:'1'}});
  if(result.error) throw result.error;
  if(result.status!==0) process.exit(result.status??1);
};
run('scripts/run-astro.mjs',['build']);
run('scripts/check-build.mjs',['dist','/','--public']);
run('scripts/export-site.mjs');
run('scripts/check-build.mjs',['.','/','--public','--offline','--manifest']);
