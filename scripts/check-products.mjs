/**
 * Sanity-checks products.js — the registry every docs instance, the navbar
 * dropdown, the homepage hub and the footer are generated from.
 *
 *   node scripts/check-products.mjs
 */
import fs from "node:fs";
import { PRODUCTS, LIVE_PRODUCTS } from "../products.mjs";

const errors = [];
const ids = new Set();

for (const p of PRODUCTS) {
  if (!p.id || !p.label || !p.blurb) errors.push(`${p.id ?? "?"}: id, label and blurb are required`);
  if (ids.has(p.id)) errors.push(`${p.id}: duplicate id`);
  ids.add(p.id);
  if (!p.navClass?.startsWith("si-")) errors.push(`${p.id}: navClass must be an si-* class`);
  if (!p.icon) errors.push(`${p.id}: icon (an src/components/Icon name) is required`);

  if (p.status === "live") {
    if (!p.path || !fs.existsSync(p.path)) errors.push(`${p.id}: path "${p.path}" does not exist`);
    if (!p.sidebar || !fs.existsSync(p.sidebar.replace("./", ""))) {
      errors.push(`${p.id}: sidebar "${p.sidebar}" does not exist`);
    }
    if (!p.entry) errors.push(`${p.id}: live products need an entry route`);
  } else if (p.status !== "planned") {
    errors.push(`${p.id}: status must be "live" or "planned"`);
  }
}

console.log(`${PRODUCTS.length} products, ${LIVE_PRODUCTS.length} live`);
for (const p of PRODUCTS) {
  console.log(`  ${p.status === "live" ? "live   " : "planned"}  ${p.id.padEnd(10)} ${p.entry ?? "-"}`);
}

if (errors.length) {
  console.error("\nproducts.js problems:");
  errors.forEach((e) => console.error("  " + e));
  process.exit(1);
}
