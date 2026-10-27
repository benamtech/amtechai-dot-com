// The prebuild build.sh runs before Hugo: the application's characters (lane ART's port, ./characters.js), drawn once
// into data/characters.json, so layouts/_partials/w/ print them with no script. Only the six team members' shapes and
// hues are drawn (data/team.json). A drawing does not change with its size (viewBox 40x40, eyes drawn the same above
// 28 px), so each is stored once as the inside of a <symbol>: a page prints each character it uses once
// (_partials/w/sprite.html) and every appearance is a <use>.
//   node site/tools/kit/characters-data.mjs
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
import { characterSVG } from "./characters.js";
const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const team = JSON.parse(fs.readFileSync(path.join(SITE, "data/team.json"), "utf8"));
const D = {};
for (const t of team) for (const p of [false, true])
  D[t.id + (p ? "-p" : "")] = characterSVG({ shape: t.shape, hue: t.hue, size: 64, plinth: p }).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
fs.writeFileSync(path.join(SITE, "data/characters.json"), JSON.stringify(D));
