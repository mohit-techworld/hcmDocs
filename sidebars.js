// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    "intro",
    {
      type: "category",
      label: "Architecture",
      collapsible: false,
      items: ["architecture/overview"],
    },
    {
      type: "category",
      label: "Backend",
      collapsible: false,
      items: [
        "backend/service-map",
        "backend/authentication",
        "backend/payroll-lifecycle",
        "backend/error-handling",
        "backend/services",
        "backend/middlewares",
        "backend/utils",
      ],
    },
    {
      type: "category",
      label: "Modules",
      collapsible: false,
      items: [
        "modules/dashboard-analytics",
        "modules/task-management",
        "modules/payroll",
        "modules/attendance-leave",
        "modules/roster-management",
        "modules/employee-management",
        "modules/recruitment",
        "modules/onboarding",
        "modules/registration",
        "modules/employee-engagement-detailed",
        "modules/ticket-management",
        "modules/compliance",
        "modules/asset-inventory",
        "modules/performance-management-part1-overview",
        "modules/performance-management-part2-kpi-management",
        "modules/performance-management-part3-rating-management",
        "modules/performance-management-part4-bulk-operations",
        "modules/performance-management-part5-dashboards-analytics",
        "modules/performance-management-part6-api-reference",
        "modules/performance",
        "modules/productivity",
        "modules/company-settings",
        "modules/raci-analytics",
        "modules/notifications",
        "modules/geolocation",
        "modules/resignation-fnf",
        "modules/document-center",
      ],
    },
    {
      type: "category",
      label: "MS1 Server",
      collapsible: false,
      items: [
        "modules/demo-management",
      ],
    },
    {
      type: "category",
      label: "Frontend",
      collapsible: false,
      items: [
        "frontend/overview",
        "frontend/modules",
        "frontend/contexts",
        "frontend/stores",
        "frontend/services",
        "frontend/utils",
      ],
    },
    {
      type: "category",
      label: "Developer Guide",
      collapsible: false,
      items: ["getting-started/project-setup"],
    },
    {
      type: "category",
      label: "Operations",
      collapsible: false,
      items: ["devops/deployment"],
    },
  ],
};

export default sidebars;
