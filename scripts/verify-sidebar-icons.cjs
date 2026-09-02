/**
 * Renders the built site in a real browser and asserts every sidebar and
 * navbar icon actually paints.
 *
 *   pnpm serve &            # or npm run serve
 *   node scripts/verify-sidebar-icons.cjs http://localhost:3000
 *
 * Checks the COMPUTED style of each `si-*` item's ::before — a CSS mask can
 * be silently defeated by another rule claiming the same pseudo-element, and
 * that is exactly what happened here twice. Static markup inspection cannot
 * catch it; this can.
 */
let puppeteer;
try {
  puppeteer = require("puppeteer");
} catch {
  console.error(
    [
      "This check needs a real browser, and puppeteer is not installed.",
      "",
      "  pnpm add -D puppeteer    # ~150 MB browser download",
      "",
      "It is deliberately kept out of the default install so CI stays fast.",
      "Skipping.",
    ].join("\n")
  );
  process.exit(0);
}

const BASE = process.argv[2] || "http://localhost:3000";
const PAGES = ["/docs/tenancy/", "/docs/API/", "/docs/ms1/", "/docs/modules/"];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 180000,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  const results = [];

  for (const path of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle0" });

    // Expand every collapsed category so nested icons are in the DOM.
    await page.$$eval(".menu__link--sublist", (els) =>
      els.forEach((e) => {
        if (e.getAttribute("aria-expanded") === "false") e.click();
      })
    );
    await new Promise((r) => setTimeout(r, 400));

    const found = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('[class*="si-"]')) {
        const cls = [...el.classList].find((c) => c.startsWith("si-"));
        // the element the ::before actually hangs off
        const target =
          el.querySelector(":scope > .menu__list-item-collapsible > .menu__link") ||
          el.querySelector(":scope > .menu__link") ||
          el;
        const cs = getComputedStyle(target, "::before");
        const rect = target.getBoundingClientRect();
        out.push({
          cls,
          mask: (cs.maskImage || cs.webkitMaskImage || "none").slice(0, 24),
          bg: cs.backgroundColor,
          position: cs.position,
          width: cs.width,
          height: cs.height,
          content: cs.content,
          visible: rect.width > 0 && rect.height > 0,
        });
      }
      return out;
    });

    for (const f of found) results.push({ page: path, ...f });
  }

  await browser.close();

  const seen = new Map();
  for (const r of results) if (!seen.has(r.cls)) seen.set(r.cls, r);

  let fail = 0;
  console.log("class".padEnd(16), "mask".padEnd(26), "pos".padEnd(9), "size".padEnd(12), "paint");
  console.log("-".repeat(78));
  for (const [cls, r] of [...seen].sort()) {
    const hasMask = r.mask.startsWith("url(");
    const sized = r.width !== "0px" && r.height !== "0px" && r.width !== "auto";
    const painted = r.bg !== "rgba(0, 0, 0, 0)" && r.bg !== "transparent";
    const ok = hasMask && sized && painted && r.position === "static" && r.visible;
    if (!ok) fail++;
    console.log(
      cls.padEnd(16),
      (hasMask ? r.mask + "…" : "NO MASK").padEnd(26),
      r.position.padEnd(9),
      `${r.width}x${r.height}`.padEnd(12),
      ok ? "OK" : `FAIL bg=${r.bg}`
    );
  }
  console.log("-".repeat(78));
  console.log(`${seen.size} icons checked, ${fail} failing`);
  process.exit(fail ? 1 : 0);
})();
