/**
 * Platform docs — rules that apply to every panel, so they live in their own
 * instance rather than inside one product's tree.
 */
const sidebars = {
  platformSidebar: [
    {
      type: "category",
      label: "Multi-Tenancy",
      className: "si-tenancy",
      collapsible: true,
      collapsed: false,
      link: { type: "doc", id: "index" },
      items: [
        "request-headers",
        "errors",
        "query-scoping",
        "edge-routing",
        "device-auth",
      ],
    },
  ],
};

export default sidebars;
