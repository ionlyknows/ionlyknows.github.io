import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

let failed = false;
const fail = (msg) => { console.error(`✗ ${msg}`); failed = true; };
const ok = (msg) => console.log(`✓ ${msg}`);

const html = readFileSync('index.html', 'utf8');
if (/src=["']\/assets\/index-[a-zA-Z0-9_-]+\.js["']/.test(html)) {
  fail('index.html references a hashed /assets/*.js bundle directly. ' +
       'It must point to /src/main.js — Vite generates the hashed bundle at build time.');
} else if (!html.includes('/src/main.js')) {
  fail('index.html does not reference /src/main.js. Is this still a valid Vite entry point?');
} else {
  ok('index.html is a valid Vite source entry');
}

const tracked = execSync('git ls-files', { encoding: 'utf8' }).split('\n');
const builtFilesTracked = tracked.filter(f => f.startsWith('dist/') || f.startsWith('assets/'));
if (builtFilesTracked.length > 0) {
  fail(`Build output is tracked in git (should be CI-generated only): ${builtFilesTracked.join(', ')}`);
} else {
  ok('No build output tracked in git');
}

execSync('npm run build', { stdio: 'inherit' });
if (!existsSync('dist/index.html')) {
  fail('vite build did not produce dist/index.html');
} else {
  const distHtml = readFileSync('dist/index.html', 'utf8');
  if (!/src="\/assets\/index-[a-zA-Z0-9_-]+\.js"/.test(distHtml)) {
    fail('dist/index.html does not reference a hashed bundle — build may not have run correctly');
  } else {
    ok('Build produced a valid hashed bundle');
  }
}

if (failed) {
  console.error('\nRelease verification failed. See above.');
  process.exit(1);
} else {
  console.log('\nAll release checks passed.');
}
