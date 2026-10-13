// After a deploy: tell IndexNow (Bing, which feeds ChatGPT search and Copilot; Yandex; others) every URL in the
// live sitemap. Google is not in IndexNow; its side is the sitemap in Search Console. The key is public by design:
// it proves we own the host because https://amtechai.com/<key>.txt answers with it.
//   node scripts/seo/indexnow.mjs
const KEY = 'a79c80db6f168a98ee85c58d20b54973';
const HOST = 'amtechai.com';
const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(JSON.stringify({ status: r.status, urls: urlList.length }));
process.exit(r.status === 200 || r.status === 202 ? 0 : 1);
