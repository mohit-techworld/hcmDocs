/**
 * Regenerates the raster brand assets from the single source SVG.
 *
 *   node scripts/build-brand-assets.cjs
 *
 * Produces:
 *   static/img/favicon-32.png    browser tab
 *   static/img/favicon-180.png   iOS home screen
 *   static/img/favicon-512.png   PWA / high-DPI
 *   static/img/og-card.png       1200x630 social card (SVG is not supported
 *                                as an og:image by any major platform)
 */
const sharp = require("sharp");
const fs = require("fs");

const LOGO = "static/img/logo-human-maximizer.svg";

(async () => {
  for (const size of [32, 180, 512]) {
    await sharp(LOGO, { density: 400 })
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(`static/img/favicon-${size}.png`);
  }

  const logo = await sharp(LOGO, { density: 400 })
    .resize(300, 300, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const card = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b2a3f"/>
      <stop offset="100%" stop-color="#0f4b71"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="0" width="1200" height="6" fill="#1cbaf6"/>
  <text x="80" y="330" font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="68" font-weight="700" fill="#ffffff">HCM Documentation</text>
  <text x="80" y="392" font-family="Segoe UI, Helvetica, Arial, sans-serif"
        font-size="30" font-weight="400" fill="#9ec9e4">Human Capital Management Platform</text>
  <text x="80" y="470" font-family="Consolas, monospace"
        font-size="22" fill="#63a8cf">humanmaximizer.com</text>
</svg>`);

  await sharp(card)
    .composite([{ input: logo, top: 165, left: 830 }])
    .png({ compressionLevel: 9 })
    .toFile("static/img/og-card.png");

  for (const f of [
    "favicon-32.png",
    "favicon-180.png",
    "favicon-512.png",
    "og-card.png",
  ]) {
    console.log(
      "  " + f.padEnd(20),
      (fs.statSync("static/img/" + f).size / 1024).toFixed(1) + " KB"
    );
  }
})();
