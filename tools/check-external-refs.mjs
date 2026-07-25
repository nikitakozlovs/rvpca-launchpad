#!/usr/bin/env node
/* ============================================================
   Statiska pārbaude: vai avota failos nav palikusi atsauce, kuras
   dēļ pārlūks ietu uz internetu.

   Playwright tests (test/offline.spec.mjs) to pašu pārbauda izpildes
   laikā un ir galvenais spriedums. Šī pārbaude ir ātrāka un noķer
   atsauci jau kodā — piemēram, ja `brand/` tiek pārkopēts no jauna
   un līdzi atgriežas Google Fonts imports.

   Komentāri tiek izmesti pirms meklēšanas: gan komplekta failos, gan
   mūsu pašu piezīmēs CDN adreses ir pieminētas kā dokumentācija, un
   naiva grep tās uzskatītu par kļūdām.

   Lietotāja klikšķināmas saites (<a href="https://...">) nav
   pieprasījumi, tāpēc tās ir atļautas.
   ============================================================ */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const SKIP_DIRS = new Set(['node_modules', '.git', 'test-results', 'playwright-report']);
const EXTS = new Set(['.html', '.css', '.js', '.mjs']);

/* vendor/ ir apzināti lokalizētas trešo pušu bibliotēkas — to iekšējie
   komentāri un avotu kartes nav mūsu atsauces. */
const SKIP_PATHS = ['vendor/', 'test/', 'tools/'];

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (EXTS.has(extname(full))) yield full;
  }
}

function stripComments(source, ext) {
  let out = source;
  if (ext === '.html') out = out.replace(/<!--[\s\S]*?-->/g, ' ');
  /* /* ... *​/ un // ... abās CSS/JS/HTML-iekļautajās vietās */
  out = out.replace(/\/\*[\s\S]*?\*\//g, ' ');
  out = out.replace(/^[ \t]*\/\/.*$/gm, ' ');
  return out;
}

/* Atsauce, kuras dēļ pārlūks pats ietu uz tīklu. */
const FETCHING = [
  { re: /@import\s+(?:url\()?["']?\s*(https?:\/\/[^"')\s;]+)/gi, what: '@import' },
  { re: /url\(\s*["']?\s*(https?:\/\/[^"')\s]+)/gi,              what: 'url()' },
  { re: /<script[^>]+src\s*=\s*["'](https?:\/\/[^"']+)/gi,       what: '<script src>' },
  { re: /<link[^>]+href\s*=\s*["'](https?:\/\/[^"']+)/gi,        what: '<link href>' },
  { re: /<img[^>]+src\s*=\s*["'](https?:\/\/[^"']+)/gi,          what: '<img src>' },
  { re: /\bfetch\(\s*["'](https?:\/\/[^"']+)/gi,                 what: 'fetch()' },
];

const findings = [];

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file);
  if (SKIP_PATHS.some(p => rel.startsWith(p))) continue;

  const clean = stripComments(readFileSync(file, 'utf8'), extname(file));

  for (const { re, what } of FETCHING) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(clean)) !== null) {
      findings.push(`${rel}: ${what} → ${m[1]}`);
    }
  }
}

if (findings.length) {
  console.error('Atrastas ārējas atsauces — darbvirsmai jāstrādā slēgtā tīklā:\n');
  findings.forEach(f => console.error('  ' + f));
  console.error('\nJa tas ir apzināti, atjaunini docs/lv/izstrade.md un šo pārbaudi.');
  process.exit(1);
}

console.log('Tīrs: nevienas ārējas atsauces, kuras dēļ pārlūks ietu uz tīklu.');
