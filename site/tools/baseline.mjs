// What an origin answers for every URL amtechai.com has ever promised, recorded so that a move between hosts (Netlify
// to Vercel, 2026-10-20, or any later one) is judged by measurement: status, Location, Content-Type, Cache-Control and
// a hash of each body, fetched with no redirect following.
//
//   node site/tools/baseline.mjs capture <origin> [--resolve <ip>] [--out file.json]
//   node site/tools/baseline.mjs diff <before.json> <after.json>     # exits 1 on any difference
//
// The URLs: every <loc> in the origin's /sitemap.xml; every redirect source in vercel.json (a splat as its bare
// prefix, prefix/ and a path under it); the Markdown the site serves to AI readers (/llms.txt, /okf/*, article twins);
// robots.txt, the sitemap, the verification files; a trailing-slash, .html and /index.html variant of three pages;
// a query string through a redirect; a 404. On https://amtechai.com it also fetches www and plain http.
// --resolve connects to <ip> while still asking for the origin's own name: the host's own answer, without the
// Cloudflare proxy in front of it. Bodies are fetched uncompressed so the hash is of the bytes a reader gets.
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import crypto from 'node:crypto';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const STATIC = path.join(ROOT, 'site', 'static');
const PAGES_VARIED = ['/about', '/contractors', '/articles'];

function get(url, resolve) {
  return new Promise((done) => {
    const u = new URL(url);
    const mod = u.protocol === 'http:' ? http : https;
    const opts = { method: 'GET', headers: { 'accept-encoding': 'identity', 'user-agent': 'amtechai-baseline/1' } };
    if (resolve) opts.lookup = (host, o, cb) => (o && o.all ? cb(null, [{ address: resolve, family: 4 }]) : cb(null, resolve, 4));
    const req = mod.request(u, opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        done({ status: res.statusCode, location: res.headers.location ?? null, content_type: res.headers['content-type'] ?? null,
          cache_control: res.headers['cache-control'] ?? null, server: res.headers.server ?? null,
          bytes: body.length, sha256: crypto.createHash('sha256').update(body).digest('hex').slice(0, 16), body });
      });
    });
    req.on('error', (e) => done({ error: e.message }));
    req.setTimeout(30000, () => req.destroy(new Error('timeout after 30 s')));
    req.end();
  });
}

// Redirect sources: vercel.json once it holds them; site/static/_redirects (Netlify's file) before that.
function redirectSources() {
  const vj = path.join(ROOT, 'vercel.json');
  const froms = fs.existsSync(vj) && JSON.parse(fs.readFileSync(vj, 'utf8')).redirects
    ? JSON.parse(fs.readFileSync(vj, 'utf8')).redirects.map((r) => r.source.replace(/\(\/\.\*\)\?$/, '/*'))
    : fs.readFileSync(path.join(STATIC, '_redirects'), 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/)[0]);
  return froms.flatMap((f) => (f.endsWith('/*') ? [f.slice(0, -2), f.slice(0, -1), f.slice(0, -1) + 'some/page'] : [f]));
}

async function capture(origin, resolve, out) {
  origin = origin.replace(/\/$/, '');
  const sitemap = await get(origin + '/sitemap.xml', resolve);
  const locs = [...sitemap.body.toString().matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const okf = (await get(origin + '/okf/index.md', resolve)).body.toString();
  const okfFiles = [...okf.matchAll(/\]\((\/[^)]+\.md)\)/g)].map((m) => '/okf' + m[1]).slice(0, 4);
  const articles = locs.filter((p) => p.startsWith('/articles/')).slice(0, 3);
  const verification = fs.readdirSync(STATIC).filter((f) => /^google.*\.html$|^[0-9a-f]{32}\.txt$/.test(f)).map((f) => '/' + f);
  const paths = new Set([
    ...locs, ...redirectSources(), ...okfFiles, ...articles.map((a) => a + '.md'),
    '/llms.txt', '/okf/index.md', '/robots.txt', '/sitemap.xml', ...verification,
    ...PAGES_VARIED.flatMap((p) => [p + '/', p + '.html', p + '/index.html']),
    '/schedule-call?utm_source=baseline', '/this-page-does-not-exist', '/sms-entry', '/404.html',
  ]);
  const urls = [...paths].map((p) => origin + p);
  if (!resolve && new URL(origin).host === 'amtechai.com') urls.push('https://www.amtechai.com/', 'https://www.amtechai.com/about', 'http://amtechai.com/', 'http://amtechai.com/about');
  const results = {};
  for (let i = 0; i < urls.length; i += 8) {
    const batch = urls.slice(i, i + 8);
    const got = await Promise.all(batch.map((u) => get(u, resolve)));
    batch.forEach((u, j) => { const { body, ...r } = got[j]; results[u.startsWith(origin) ? u.slice(origin.length) : u] = r; });
  }
  const rec = { origin, resolve: resolve ?? null, taken: new Date().toISOString(), count: urls.length, results };
  fs.writeFileSync(out, JSON.stringify(rec, null, 1));
  const byStatus = Object.values(results).reduce((m, r) => ((m[r.status ?? r.error] = (m[r.status ?? r.error] || 0) + 1), m), {});
  console.log(`baseline: ${urls.length} URLs from ${origin}${resolve ? ` via ${resolve}` : ''} -> ${out}  ${JSON.stringify(byStatus)}`);
}

// Compared as a reader sees them: a Location relative to its own origin, header values without case or spacing.
const norm = (origin) => ({
  location: (v) => (v ? v.replace(origin, '').replace('https://amtechai.com', '') || '/' : null),
  content_type: (v) => (v ? v.toLowerCase().replace(/\s+/g, '') : null),
  cache_control: (v) => (v ? v.toLowerCase().replace(/\s+/g, '').split(',').sort().join(',') : null),
});

function diff(aFile, bFile) {
  const a = JSON.parse(fs.readFileSync(aFile, 'utf8'));
  const b = JSON.parse(fs.readFileSync(bFile, 'utf8'));
  const na = norm(a.origin), nb = norm(b.origin);
  const lines = [];
  for (const k of new Set([...Object.keys(a.results), ...Object.keys(b.results)])) {
    const x = a.results[k], y = b.results[k];
    if (!x || !y) { lines.push(`${k}: only in ${x ? 'before' : 'after'}`); continue; }
    // A redirect's body and its type are the host's own words ("Redirecting to ..."): its status, Location and cache
    // rules are what a reader acts on.
    const redirect = x.status >= 300 && x.status < 400 && y.status >= 300 && y.status < 400;
    for (const f of redirect ? ['status', 'location', 'cache_control'] : ['status', 'location', 'content_type', 'cache_control', 'sha256']) {
      const vx = na[f] ? na[f](x[f]) : x[f], vy = nb[f] ? nb[f](y[f]) : y[f];
      if (vx !== vy) lines.push(`${k}: ${f} ${JSON.stringify(vx)} -> ${JSON.stringify(vy)}${f === 'sha256' ? ` (${x.bytes} -> ${y.bytes} bytes)` : ''}`);
    }
  }
  console.log(`diff: ${a.origin}${a.resolve ? ` via ${a.resolve}` : ''} (${a.taken}) -> ${b.origin}${b.resolve ? ` via ${b.resolve}` : ''} (${b.taken})`);
  console.log(lines.length ? `${lines.length} difference(s)\n  ` + lines.join('\n  ') : 'no difference');
  process.exit(lines.length ? 1 : 0);
}

const [cmd, ...rest] = process.argv.slice(2);
const flag = (n) => { const i = rest.indexOf(n); return i >= 0 ? rest.splice(i, 2)[1] : undefined; };
if (cmd === 'capture' && rest[0]) {
  const resolve = flag('--resolve');
  const out = flag('--out') ?? `baseline-${new URL(rest[0]).host}${resolve ? '-' + resolve : ''}.json`;
  await capture(rest[0], resolve, out);
} else if (cmd === 'diff' && rest.length === 2) diff(rest[0], rest[1]);
else { console.error('usage: baseline.mjs capture <origin> [--resolve <ip>] [--out f.json] | diff <before.json> <after.json>'); process.exit(2); }
