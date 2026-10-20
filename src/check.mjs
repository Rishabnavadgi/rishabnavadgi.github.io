// Static checks on the built site: local files exist, in-page anchors resolve, ids are unique,
// images have alt text and dimensions, and no fabricated-content markers slipped in.
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const html = await readFile(path.join(DIST, "index.html"), "utf8");
const errors = [];
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const seen = new Set();
for (const id of ids) { if (seen.has(id)) errors.push(`Duplicate id: ${id}`); seen.add(id); }
for (const [, ref] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
  if (ref.startsWith("#")) { if (ref.length > 1 && !seen.has(ref.slice(1))) errors.push(`Broken anchor: ${ref}`); continue; }
  if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
  try { await access(path.join(DIST, ref)); } catch { errors.push(`Missing file: ${ref}`); }
}
for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\salt="/.test(tag)) errors.push(`Image without alt: ${tag.slice(0, 80)}`);
  if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) errors.push(`Image without dimensions: ${tag.slice(0, 80)}`);
}
if (/lorem ipsum/i.test(html)) errors.push("Lorem ipsum found");
const ph = (html.match(/class="ph"/g) || []).length;
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`OK. ${seen.size} ids, all links and files resolve. ${ph} placeholder boxes still to fill.`);
