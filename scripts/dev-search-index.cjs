/**
 * Makes search work on the dev server.
 *
 *   pnpm search:index      # build the index, then `pnpm start` as usual
 *
 * The search plugin only generates its index during `docusaurus build`, so on
 * the dev server the client's request for /search-index.json falls through to
 * the SPA and comes back as HTML — which parses to zero results, and the
 * plugin then shows "The search index is only available when you run
 * docusaurus build!".
 *
 * Docusaurus copies static/ verbatim and the dev server serves it, so dropping
 * the built index there gives dev a real one to fetch. The copy is a build
 * artefact: it is gitignored, and a later `docusaurus build` regenerates the
 * canonical index in build/ afterwards (postBuild runs last), so this never
 * ships a stale index to production.
 *
 * The index is a snapshot — re-run this after adding or renaming pages.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SRC = path.join("build", "search-index.json");
const DEST = path.join("static", "search-index.json");

function human(bytes) {
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

if (!fs.existsSync(SRC) || process.argv.includes("--rebuild")) {
  console.log("Building the site to generate the search index…");
  execFileSync(process.platform === "win32" ? "npx.cmd" : "npx",
    ["docusaurus", "build"], { stdio: "inherit" });
}

if (!fs.existsSync(SRC)) {
  console.error(`Expected ${SRC} after the build, but it is missing.`);
  process.exit(1);
}

fs.copyFileSync(SRC, DEST);
console.log(`${DEST}  ${human(fs.statSync(DEST).size)}`);
console.log("Search now works under `pnpm start`. Re-run after adding pages.");
