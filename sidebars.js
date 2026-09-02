/**
 * Sidebars.
 *
 * Three sidebars, so each audience gets a lane:
 *   tutorialSidebar — guides: architecture, tenancy, backend, frontend, modules
 *   apiSidebar      — the endpoint reference (previously had NO sidebar at all)
 *   ms1Sidebar      — the MS1 control plane, server + client + overviews
 */
const sidebars = {
  // ───────────────────────────── Guides ─────────────────────────────
  tutorialSidebar: [
    "intro",
    {
      type: "category",
      label: "Getting Started",
      className: "si-rocket",
      collapsible: true,
      collapsed: false,
      items: [
        "getting-started/project-setup",
        "getting-started/installation",
        "getting-started/environment-setup",
      ],
    },
    {
      type: "category",
      label: "Architecture",
      className: "si-layers",
      collapsible: true,
      collapsed: false,
      items: ["architecture/overview"],
    },
    {
      type: "category",
      label: "Multi-Tenancy",
      className: "si-tenancy",
      collapsible: true,
      collapsed: false,
      link: { type: "doc", id: "tenancy/index" },
      items: [
        "tenancy/request-headers",
        "tenancy/errors",
        "tenancy/query-scoping",
        "tenancy/edge-routing",
        "tenancy/device-auth",
      ],
    },
    {
      type: "category",
      label: "Backend",
      className: "si-backend",
      collapsible: true,
      collapsed: true,
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
      label: "Frontend",
      className: "si-frontend",
      collapsible: true,
      collapsed: true,
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
      label: "Modules",
      className: "si-modules",
      collapsible: true,
      collapsed: true,
      link: { type: "doc", id: "modules/index" },
      items: [
        {
          type: "category",
          label: "Core HR",
          className: "si-people",
          collapsed: true,
          items: [
            "modules/employee-management",
            "modules/onboarding",
            "modules/registration",
            "modules/resignation-fnf",
            "modules/company-settings",
          ],
        },
        {
          type: "category",
          label: "Time & Attendance",
          className: "si-time",
          collapsed: true,
          items: [
            "modules/attendance-leave",
            "modules/roster-management",
            "modules/geolocation",
          ],
        },
        {
          type: "category",
          label: "Payroll",
          className: "si-payroll",
          collapsed: true,
          items: ["modules/payroll"],
        },
        {
          type: "category",
          label: "Talent",
          className: "si-talent",
          collapsed: true,
          items: [
            "modules/recruitment",
            "modules/performance",
            "modules/performance-management-part1-overview",
            "modules/performance-management-part2-kpi-management",
            "modules/performance-management-part3-rating-management",
            "modules/performance-management-part4-bulk-operations",
            "modules/performance-management-part5-dashboards-analytics",
            "modules/performance-management-part6-api-reference",
            "modules/employee-engagement-detailed",
          ],
        },
        {
          type: "category",
          label: "Work Management",
          className: "si-work",
          collapsed: true,
          items: [
            "modules/task-management",
            "modules/ticket-management",
            "modules/document-center",
            "modules/asset-inventory",
          ],
        },
        {
          type: "category",
          label: "Analytics",
          className: "si-analytics",
          collapsed: true,
          items: [
            "modules/dashboard-analytics",
            "modules/productivity",
            "modules/raci-analytics",
          ],
        },
        {
          type: "category",
          label: "Platform",
          className: "si-platform",
          collapsed: true,
          items: ["modules/notifications", "modules/compliance"],
        },
      ],
    },
    {
      type: "category",
      label: "Operations",
      className: "si-ops",
      collapsible: true,
      collapsed: true,
      items: ["devops/deployment"],
    },
  ],

  // ─────────────────────────── API reference ───────────────────────────
  apiSidebar: [
    "API/index",
    {
      type: "category",
      label: "Identity & Access",
      className: "si-identity",
      collapsed: false,
      items: [
        "API/Authentication/auth-setup",
        "API/user-management/user-management",
        "API/subordinates-management/subordinates-management",
      ],
    },
    {
      type: "category",
      label: "People Operations",
      className: "si-peopleops",
      collapsed: false,
      items: [
        "API/employee-onboarding/employee-onboarding",
        "API/department-management/department-management",
        "API/designation-management/designation-management",
        "API/company-settings/company-settings",
      ],
    },
    {
      type: "category",
      label: "Time & Attendance",
      className: "si-time",
      collapsed: false,
      items: [
        "API/attendance-management/attendance-management",
        "API/leave-management/leave-management",
        "API/holiday-management/holiday-management",
      ],
    },
    {
      type: "category",
      label: "Work & Delivery",
      className: "si-delivery",
      collapsed: false,
      items: [
        "API/task-management/task-management",
        "API/tickets-management/tickets-management",
        "API/raci-management/raci-management",
      ],
    },
    {
      type: "category",
      label: "Talent",
      className: "si-talent",
      collapsed: false,
      items: [
        "API/recruitment-management/recruitment-management",
        "API/performance-management/kpi-management",
        "API/performance-management/performance-ratings-managemenet",
        "API/employee-engagement/employee-engagement",
      ],
    },
    {
      type: "category",
      label: "Compliance",
      className: "si-compliance",
      collapsed: false,
      items: ["API/posh-management/posh-management"],
    },
  ],

  // ──────────────────────── MS1 (control plane) ────────────────────────
  ms1Sidebar: [
    "ms1/README",
    {
      type: "category",
      label: "MS1 Server",
      className: "si-backend",
      collapsible: true,
      collapsed: true,
      link: { type: "doc", id: "ms1/ms1-server/modules/index" },
      items: [
        { type: "doc", id: "ms1/ms1-server/folder-structure", label: "Folder Structure" },
        { type: "doc", id: "ms1/ms1-server/setup", label: "Setup & Installation" },
      ],
    },
    {
      type: "category",
      label: "MS1 Client",
      className: "si-frontend",
      collapsible: true,
      collapsed: true,
      link: { type: "doc", id: "ms1/ms1-client/components/index" },
      items: [
        { type: "doc", id: "ms1/ms1-client/folder-structure", label: "Folder Structure" },
        { type: "doc", id: "ms1/ms1-client/setup", label: "Setup & Installation" },
      ],
    },
    ...[
      ["Demo Management", "demo-management"],
      ["Plan Management", "plan-management"],
      ["Backup & Restore", "backup-restore"],
      ["Admin User Management", "admin-user-management"],
      ["Permissions Management", "permissions-management"],
      ["Authentication", "authentication"],
      ["Billing", "billing"],
      ["Contact", "contact"],
      ["Database Management", "database-management"],
      ["Landing Demo", "landing-demo"],
      ["Login History", "login-history"],
      ["Notification Email", "notification-email"],
      ["Login Restrictions", "login-restrictions"],
    ].map(([label, slug]) => ({
      type: "category",
      label,
      collapsible: true,
      collapsed: true,
      items: [
        { type: "doc", id: `ms1/modules/${slug}-overview`, label: "Overview" },
        { type: "doc", id: `ms1/ms1-server/modules/${slug}`, label: "Server API" },
        { type: "doc", id: `ms1/ms1-client/components/${slug}`, label: "Client Component" },
      ],
    })),
  ],
};

export default sidebars;
