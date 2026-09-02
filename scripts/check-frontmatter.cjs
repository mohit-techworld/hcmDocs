/**
 * Reports docs pages missing `title` or `description` front matter.
 * Run with --list to print every offending file.
 *
 *   node scripts/check-frontmatter.cjs
 */
const fs = require("fs"), path = require("path");

function walk(d, o = []) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p, o);
    else if (p.endsWith(".md") || p.endsWith(".mdx")) o.push(p);
  }
  return o;
}

const files = walk("docs");
const missing = { title: [], description: [] };

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = m ? m[1] : "";
  if (!/^title:/m.test(fm)) missing.title.push(f);
  if (!/^description:/m.test(fm)) missing.description.push(f);
}

console.log(`pages            : ${files.length}`);
console.log(`missing title    : ${missing.title.length}`);
console.log(`missing descript.: ${missing.description.length}`);

if (process.argv.includes("--list")) {
  for (const k of ["title", "description"]) {
    if (!missing[k].length) continue;
    console.log(`\n-- missing ${k} --`);
    missing[k].forEach((f) => console.log("  " + f));
  }
}

process.exit(missing.title.length + missing.description.length ? 1 : 0);
