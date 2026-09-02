/**
 * Fails when a file in static/ is referenced by nothing.
 *
 * The repo accumulated ~140 KB of Docusaurus template art plus an unused
 * logo and favicon this way. Run in CI so it cannot happen again.
 *
 *   node scripts/check-unused-assets.cjs
 */
const fs = require("fs"), path = require("path");

const SEARCH_DIRS = ["docs", "src", "."];
const SEARCH_EXT = [".md", ".mdx", ".js", ".jsx", ".ts", ".tsx", ".css", ".json", ".html"];
// Files served directly by convention rather than by reference.
const ALLOWED = new Set([
  ".nojekyll", "robots.txt", "sitemap.xml", "favicon.ico",
  "search-index.json", // dev-only copy, see scripts/dev-search-index.cjs
]);

function walk(dir, filter, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "build", ".docusaurus", ".git", "static"].includes(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}

function walkStatic(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walkStatic(p, out); else out.push(p);
  }
  return out;
}

const haystack = [...new Set(SEARCH_DIRS.flatMap((d) =>
  walk(d, (p) => SEARCH_EXT.includes(path.extname(p)))
))].map((f) => fs.readFileSync(f, "utf8")).join("\n");

const assets = walkStatic("static");
const orphans = assets.filter((a) => {
  const name = path.basename(a);
  if (ALLOWED.has(name)) return false;
  return !haystack.includes(name);
});

console.log(`static assets : ${assets.length}`);
console.log(`unreferenced  : ${orphans.length}`);
orphans.forEach((o) => console.log("  " + o));

if (orphans.length) {
  console.log("\nDelete these, or reference them. Conventionally-served files "
    + "belong in the ALLOWED set in this script.");
  process.exit(1);
}
