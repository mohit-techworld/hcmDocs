
const sidebars = {
  tutorialSidebar: [
    "intro",
    {
      type: "category",
      label: "🏗️ Architecture",
      items: ["architecture/overview"],
    },
    {
      type: "category",
      label: "⚙️ Backend",
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
      label: "📦 Modules",
      collapsible: true,
      collapsed: true,
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
      label: "🖥️ MS1 (Central Server)",
      collapsible: true,
      collapsed: false,
      items: [
        "ms1/README",
        {
          type: "category",
          label: "🖥️ MS1 Server",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/ms1-server/folder-structure",
              label: "1. Folder Structure",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/setup",
              label: "2. Setup & Installation",
            },
          ],
        },
        {
          type: "category",
          label: "💻 MS1 Client",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/ms1-client/folder-structure",
              label: "1. Folder Structure",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/setup",
              label: "2. Setup & Installation",
            },
          ],
        },
        {
          type: "category",
          label: "1. 🎯 Demo Management",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/demo-management-overview",
              label: "1.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/demo-management",
              label: "1.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/demo-management",
              label: "1.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "2. 📋 Plan Management",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/plan-management-overview",
              label: "2.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/plan-management",
              label: "2.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/plan-management",
              label: "2.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "3. 💾 Backup & Restore",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/backup-restore-overview",
              label: "3.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/backup-restore",
              label: "3.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/backup-restore",
              label: "3.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "4. 👤 Admin User Management",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/admin-user-management-overview",
              label: "4.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/admin-user-management",
              label: "4.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/admin-user-management",
              label: "4.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "5. 🔐 Permissions Management",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/permissions-management-overview",
              label: "5.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/permissions-management",
              label: "5.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/permissions-management",
              label: "5.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "6. 🏢 Authentication (Company/Tenant)",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/authentication-overview",
              label: "6.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/authentication",
              label: "6.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/authentication",
              label: "6.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "7. 💰 Billing",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/billing-overview",
              label: "7.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/billing",
              label: "7.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/billing",
              label: "7.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "8. 📧 Contact",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/contact-overview",
              label: "8.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/contact",
              label: "8.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/contact",
              label: "8.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "9. 💾 Database Management",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/database-management-overview",
              label: "9.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/database-management",
              label: "9.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/database-management",
              label: "9.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "10. 🌐 Landing Demo",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/landing-demo-overview",
              label: "10.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/landing-demo",
              label: "10.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/landing-demo",
              label: "10.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "11. 📊 Login History",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/login-history-overview",
              label: "11.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/login-history",
              label: "11.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/login-history",
              label: "11.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "12. 📬 Notification Email",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/notification-email-overview",
              label: "12.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/notification-email",
              label: "12.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/notification-email",
              label: "12.3 Client Component",
            },
          ],
        },
        {
          type: "category",
          label: "13. 🔒 Login Restrictions",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "ms1/modules/login-restrictions-overview",
              label: "13.1 Overview",
            },
            {
              type: "doc",
              id: "ms1/ms1-server/modules/login-restrictions",
              label: "13.2 Server API",
            },
            {
              type: "doc",
              id: "ms1/ms1-client/components/login-restrictions",
              label: "13.3 Client Component",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "💻 Frontend",
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
      label: "📚 Developer Guide",
      items: ["getting-started/project-setup"],
    },
    {
      type: "category",
      label: "🚀 Operations",
      items: ["devops/deployment"],
    },
  ],
};

export default sidebars;
