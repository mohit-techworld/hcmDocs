/**
 * Product registry — the single source of truth for this docs site.
 *
 * Adding a product means adding ONE entry here. Everything else is generated
 * from it: the docs plugin instance, the navbar "Products" dropdown, the
 * homepage hub cards, the footer column, and the per-product search context.
 *
 * Before this file those lived in three separate hand-maintained places, which
 * is how the entire API section once ended up with no sidebar — it was added
 * to the navbar and nobody updated sidebars.js.
 *
 * `status`:
 *   'live'    — has a docs folder and gets its own plugin instance + routes
 *   'planned' — listed in the UI so the roadmap is visible, but no instance is
 *               created (Docusaurus fails on an empty docs directory)
 *
 * Two icon fields, because the two contexts cannot share one mechanism:
 *   navClass — a CSS-mask class from src/css/sidebar-icons.css, for the navbar
 *              and sidebar, which accept only a className
 *   icon     — a name from src/components/Icon, for React surfaces
 */

/** @type {Array<{
 *   id: string, label: string, blurb: string, status: 'live'|'planned',
 *   path?: string, sidebar?: string, navClass: string, icon: string,
 *   entry?: string, repo?: string
 * }>} */
export const PRODUCTS = [
  {
    id: "platform",
    label: "Platform",
    blurb:
      "Multi-tenancy, request contract, query scoping and edge routing — the rules every panel obeys.",
    status: "live",
    path: "docs/platform",
    sidebar: "./sidebars/platform.js",
    entry: "/platform/",
    navClass: "si-tenancy",
    icon: "building",
  },
  {
    id: "hcm",
    label: "Human Maximizer",
    blurb:
      "The HRMS itself — employees, attendance, payroll, recruitment, performance, and the full API reference.",
    status: "live",
    path: "docs/hcm",
    sidebar: "./sidebars/hcm.js",
    entry: "/hcm/intro",
    navClass: "si-modules",
    icon: "box",
    repo: "https://github.com/Razor-Infotech/hcmFrontend",
  },
  {
    id: "ms1",
    label: "MS1 Control Plane",
    blurb:
      "Tenant provisioning, plans, billing, backups and admin users — the server that creates tenants.",
    status: "live",
    path: "docs/ms1",
    sidebar: "./sidebars/ms1.js",
    entry: "/ms1/",
    navClass: "si-ms1",
    icon: "shield",
  },
  {
    id: "mobile",
    label: "Mobile App",
    blurb:
      "The Expo / React Native app. Workspace bootstrap, offline punch, push. Documentation not written yet.",
    status: "planned",
    navClass: "si-frontend",
    icon: "code",
  },
  {
    id: "biometric",
    label: "Biometric Agent",
    blurb:
      "The on-premise agent that polls ESSL and Hikvision devices and posts punches. Documentation not written yet.",
    status: "planned",
    navClass: "si-backend",
    icon: "server",
  },
];

/** Products that have docs, and therefore a plugin instance and routes. */
export const LIVE_PRODUCTS = PRODUCTS.filter((p) => p.status === "live");

/** One `plugin-content-docs` instance per live product. */
export const docsPlugins = () =>
  LIVE_PRODUCTS.map((p) => [
    "@docusaurus/plugin-content-docs",
    {
      id: p.id,
      path: p.path,
      routeBasePath: p.id,
      sidebarPath: p.sidebar,
      editUrl: "https://github.com/Razor-Infotech/hcmDoc/tree/main/",
      showLastUpdateTime: true,
      showLastUpdateAuthor: true,
    },
  ]);

/**
 * The navbar "Products" dropdown. Live products link straight into their docs;
 * planned ones point at the homepage hub, where they render as "Planned"
 * cards — visible on the roadmap without being a destination that 404s.
 */
export const navbarProductItems = () =>
  PRODUCTS.map((p) =>
    p.status === "live"
      ? { to: p.entry, label: p.label, className: p.navClass }
      : { to: "/", label: `${p.label} — soon`, className: p.navClass }
  );

/** Search is scoped per product, so a reader in /hcm does not get MS1 hits. */
export const searchContexts = () => LIVE_PRODUCTS.map((p) => p.id);
