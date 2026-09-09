// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import {
  docsPlugins,
  navbarProductItems,
  searchContexts,
  LIVE_PRODUCTS,
} from "./products.mjs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "HCM Documentation",
  tagline: "Human Resource Management System",
  favicon: "img/favicon-32.png",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    // Improve compatibility with the upcoming Docusaurus v4.
    // NOTE: the `v4: true` shorthand also enables `fasterByDefault`, which
    // switches the bundler to Rspack and requires the separate
    // `@docusaurus/faster` package. We opt out of that one flag and keep the
    // rest, so the site builds with the standard webpack bundler.
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
      useCssCascadeLayers: true,
      siteStorageNamespacing: true,
      mdx1CompatDisabledByDefault: true,
      fasterByDefault: false,
    },
  },

  // Where this build will be served from. Defaults to the production home,
  // and CI overrides both when publishing a preview to GitHub Pages, which
  // serves from https://<owner>.github.io/<repo>/ rather than a domain root.
  // Docusaurus bakes these into every generated link, so they must match the
  // real location or the whole site 404s on its own navigation.
  url: process.env.DOCS_URL || "https://humanmaximizer.com",
  baseUrl: process.env.DOCS_BASE_URL || "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Human Maximizer", // Usually your GitHub org/user name.
  projectName: "HCM", // Usually your repo name.

  onBrokenLinks: "throw",

  markdown: {
    // The docs carry 60+ Mermaid diagrams. Without this flag (and the
    // theme registered below) every one of them renders as a plain code
    // block instead of a diagram.
    mermaid: true,
    hooks: {
      // Moved out of the deprecated top-level `onBrokenMarkdownLinks` option,
      // which is removed in Docusaurus v4.
      onBrokenMarkdownLinks: "warn",
    },
  },

  themes: ["@docusaurus/theme-mermaid"],

  // The favicon above covers the browser tab. These cover the home-screen
  // and high-DPI cases, which fall back to a blurry 32px icon otherwise.
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/img/favicon-180.png",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/img/favicon-512.png",
      },
    },
  ],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    // One docs instance per live product (see products.js).
    ...docsPlugins(),

    // The docs used to live under /docs/*. Everything moved under its
    // product, so keep the old URLs working rather than breaking bookmarks.
    [
      "@docusaurus/plugin-client-redirects",
      {
        createRedirects(existingPath) {
          const map = [
            ["/platform/", "/docs/tenancy/"],
            ["/ms1/", "/docs/ms1/"],
            ["/hcm/", "/docs/"],
          ];
          for (const [to, from] of map) {
            if (existingPath.startsWith(to)) {
              return [from + existingPath.slice(to.length)];
            }
          }
          return undefined;
        },
        redirects: [{ from: "/docs", to: "/" }],
      },
    ],

    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        // Show the full doc path on each hit — with 118 pages and repeated
        // section names ("Overview", "Setup"), the title alone is ambiguous.
        explicitSearchResultPath: true,
        indexBlog: false,
        indexPages: true,
        // There is no "default" docs instance any more (the preset no longer
        // owns docs), so the version-preference hook has to be pointed at a
        // real instance or every page fails to render.
        docsPluginIdForPreferredVersion: "hcm",
        // Every product's route base, so all instances are indexed.
        docsRouteBasePath: LIVE_PRODUCTS.map((p) => p.id),
        // Scope results to the product the reader is already in — a search
        // from /hcm should not be competing with 46 MS1 pages.
        searchContextByPaths: searchContexts(),
        useAllContextsWithNoSearchContext: true,

        // Cmd/Ctrl+K to focus the search box, with the hint badge rendered
        // inside it. On by default, but there was no search box to bind to
        // until now.
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        searchBarPosition: "right",

        // The default 8 is thin for a reference this size — an API term can
        // legitimately match a dozen endpoint pages.
        searchResultLimits: 12,
        searchResultContextMaxLength: 80,
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // Docs are no longer owned by the preset: each product gets its own
        // plugin-content-docs instance, generated from products.js. That is
        // what gives every product its own route space, its own sidebar and —
        // the reason it matters here — its own versioning timeline.
        docs: false,
        blog: false,
        theme: {
          customCss: ["./src/css/custom.css", "./src/css/sidebar-icons.css"],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card. Must be a raster image at 1200x630 — SVG is not
      // rendered as an og:image by any major platform.
      image: "img/og-card.png",
      navbar: {
        title: "HCM",
        logo: {
          alt: "Human Maximizer Logo",
          src: "img/logo-human-maximizer.svg",
          srcDark: "img/logo-human-maximizer.svg",
        },
        hideOnScroll: true,
        items: [
          // Straight into whichever product the reader needs. Generated from
          // products.js, so a new product appears here automatically.
          {
            type: "dropdown",
            label: "Products",
            position: "left",
            className: "si-modules",
            items: navbarProductItems(),
          },
          // Deep links for the product currently being read.
          {
            type: "docSidebar",
            docsPluginId: "hcm",
            sidebarId: "hcmApiSidebar",
            position: "left",
            label: "API Reference",
            className: "si-api",
          },
          {
            type: "doc",
            docsPluginId: "platform",
            docId: "index",
            position: "left",
            label: "Multi-Tenancy",
            className: "si-tenancy",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Products",
            items: LIVE_PRODUCTS.map((p) => ({ label: p.label, to: p.entry })),
          },
          {
            title: "Resources",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/Razor-Infotech/hcmFrontend",
              },
              {
                label: "Company Website",
                href: "https://humanmaximizer.com/",
              },
              {
                label: "Privacy Policy",
                href: "https://humanmaximizer.com/privacy-policy",
              },
              {
                label: "Terms of Service",
                href: "https://humanmaximizer.com/terms-of-service",
              },
            ],
          },
          {
            title: "Support",
            items: [
              {
                label: "Contact Us",
                href: "https://humanmaximizer.com/contact",
              },
              {
                label: "Help Center",
                to: "/hcm/intro",
              },
              {
                label: "Report Issue",
                href: "https://github.com/Razor-Infotech/hcmFrontend/issues",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Human Maximizer. All rights reserved. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      mermaid: {
        theme: { light: "neutral", dark: "dark" },
      },
    }),
};

export default config;
