/**
 * MS1 control plane. Doc ids are relative to docs/ms1, so the old
 * "ms1/..." prefix is gone.
 */
const sidebars = {
  ms1Sidebar: [
    "README",
    {
      type: "category",
      label: "MS1 Server",
      className: "si-backend",
      collapsible: true,
      collapsed: true,
      link: { type: "doc", id: "ms1-server/modules/index" },
      items: [
        { type: "doc", id: "ms1-server/folder-structure", label: "Folder Structure" },
        { type: "doc", id: "ms1-server/setup", label: "Setup & Installation" },
      ],
    },
    {
      type: "category",
      label: "MS1 Client",
      className: "si-frontend",
      collapsible: true,
      collapsed: true,
      link: { type: "doc", id: "ms1-client/components/index" },
      items: [
        { type: "doc", id: "ms1-client/folder-structure", label: "Folder Structure" },
        { type: "doc", id: "ms1-client/setup", label: "Setup & Installation" },
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
        { type: "doc", id: `modules/${slug}-overview`, label: "Overview" },
        { type: "doc", id: `ms1-server/modules/${slug}`, label: "Server API" },
        { type: "doc", id: `ms1-client/components/${slug}`, label: "Client Component" },
      ],
    })),
  ],
};

export default sidebars;
