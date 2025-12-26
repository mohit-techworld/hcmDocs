// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "HCM Documentation",
  tagline: "Human Resource Management System",
  favicon: "img/human maximizer.svg",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://humanmaximizer.com/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "Human Maximizer", // Usually your GitHub org/user name.
  projectName: "HCM", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        // `hashed` is recommended as long-term-cache of index file is possible.
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: "/docs",
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/Razor-Infotech/hcmFrontend",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/human maximizer.svg",
      navbar: {
        title: "HCM",
        logo: {
          alt: "Human Maximizer Logo",
          src: "img/human maximizer.svg",
          srcDark: "img/human maximizer.svg",
        },
        hideOnScroll: true,
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Documentation",
          },
          {
            type: "dropdown",
            label: "API",
            position: "left",
            items: [
              {
                type: "doc",
                docId: "API/Authentication/auth-setup",
                label: "🔐 Authentication",
              },
              {
                type: "doc",
                docId: "API/user-management/user-management",
                label: "👤 User Management",
              },
              {
                type: "doc",
                docId: "API/employee-onboarding/employee-onboarding",
                label: "👥 Employee Onboarding",
              },
              {
                type: "doc",
                docId: "API/attendance-management/attendance-management",
                label: "⏰ Attendance",
              },
              {
                type: "doc",
                docId: "API/leave-management/leave-management",
                label: "📅 Leave Management",
              },
              {
                type: "doc",
                docId: "API/task-management/task-management",
                label: "✅ Task Management",
              },
              {
                type: "doc",
                docId: "API/tickets-management/tickets-management",
                label: "🎫 Tickets Management",
              },
              {
                type: "doc",
                docId: "API/recruitment-management/recruitment-management",
                label: "🔍 Recruitment",
              },
              {
                type: "doc",
                docId: "API/performance-management/kpi-management",
                label: "🎯 Performance & KPI",
              },
              {
                type: "doc",
                docId: "API/company-settings/company-settings",
                label: "⚙️ Company Settings",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Modules",
            position: "left",
            items: [
              {
                type: "doc",
                docId: "modules/employee-management",
                label: "Employee Management",
              },
              {
                type: "doc",
                docId: "modules/attendance-leave",
                label: "Attendance & Leave",
              },
              {
                type: "doc",
                docId: "modules/payroll",
                label: "Payroll",
              },
              {
                type: "doc",
                docId: "modules/performance",
                label: "Performance",
              },
              {
                type: "doc",
                docId: "modules/recruitment",
                label: "Recruitment",
              },
              {
                type: "doc",
                docId: "modules/task-management",
                label: "Task Management",
              },
            ],
          },
          {
            type: "search",
            position: "right",
          },
          {
            href: "https://github.com/Razor-Infotech/hcmFrontend",
            label: "GitHub",
            position: "right",
            className: "navbar__item--github",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "Getting Started",
                to: "/docs/intro",
              },
              {
                label: "Installation",
                to: "/docs/getting-started/installation",
              },
              {
                label: "API Reference",
                to: "/docs/API",
              },
              {
                label: "Modules",
                to: "/docs/modules",
              },
            ],
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
                to: "/docs",
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
    }),
};

export default config;
