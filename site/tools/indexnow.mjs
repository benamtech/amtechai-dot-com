// After a production deploy: tell IndexNow (Bing, which feeds ChatGPT search and Copilot; Yandex; others) the URLs
// whose words changed, not the whole sitemap. Google is not in IndexNow; its side is the sitemap in Search Console.
// The key is public by design: https://amtechai.com/<key>.txt answers with it, which proves we own the host.
//
// How it knows what changed: every build writes /content-hashes.json (layouts/home.okfindex.md): for each indexable
// page, a SHA-256 of its title, description and visible words, and its lastmod. This script reads that file FROM THE
// LIVE SITE (so it only ever submits what is really deployed), compares it with site/tools/indexnow-sent.json (what
// was last submitted, committed with the site), submits the URLs that are new or whose hash changed, and on a 200/202
// rewrites indexnow-sent.json. Commit that file after a run, so the next deploy compares against it.
//
//   node site/tools/indexnow.mjs --dry-run   # print what would be submitted; send nothing, write nothing
//   node site/tools/indexnow.mjs             # submit the changed URLs (outward: run only after a production deploy)
//   node site/tools/indexnow.mjs --all       # submit every URL in the live hashes file (first run, or a re-crawl)
//   node site/tools/indexnow.mjs --dry-run --from site/public/content-hashes.json   # test against a local build
import fs from 'node:fs';
import path from 'node:path';

const KEY = 'a79c80db6f168a98ee85c58d20b54973';
const HOST = 'amtechai.com';
const STATE = path.join(path.dirname(new URL(import.meta.url).pathname), 'indexnow-sent.json');
const dry = process.argv.includes('--dry-run');
const all = process.argv.includes('--all');

const fromAt = process.argv.indexOf('--from');
if (fromAt > 0 && !dry) { console.error('indexnow: --from reads a local build and is for --dry-run only; a submission reads the live site'); process.exit(1); }
let live;
if (fromAt > 0) live = JSON.parse(fs.readFileSync(process.argv[fromAt + 1], 'utf8'));
else {
  const res = await fetch(`https://${HOST}/content-hashes.json`, { headers: { 'cache-control': 'no-cache' } });
  if (!res.ok) { console.error(`indexnow: https://${HOST}/content-hashes.json answered ${res.status}; is this deploy live?`); process.exit(1); }
  live = await res.json();
}
const sent = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
const urlList = Object.keys(live).filter((u) => all || !sent[u] || sent[u].hash !== live[u].hash).sort();
const gone = Object.keys(sent).filter((u) => !live[u]).sort();   // removed pages: IndexNow also takes these (they 404 or 301 now)
const submit = [...urlList, ...gone];

if (!submit.length) { console.log(JSON.stringify({ changed: 0, live: Object.keys(live).length, note: 'nothing changed since the last submission' })); process.exit(0); }
if (dry) { console.log(JSON.stringify({ dry_run: true, would_submit: submit.length, changed_or_new: urlList, removed: gone }, null, 1)); process.exit(0); }

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: submit }),
});
const ok = r.status === 200 || r.status === 202;
if (ok) fs.writeFileSync(STATE, JSON.stringify(live, null, 1) + '\n');
console.log(JSON.stringify({ status: r.status, submitted: submit.length, changed_or_new: urlList.length, removed: gone.length, state_written: ok }));
process.exit(ok ? 0 : 1);
