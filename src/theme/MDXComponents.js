import MDXComponents from "@theme-original/MDXComponents";
import Icon from "@site/src/components/Icon";
import Status from "@site/src/components/Status";
import Table from "./MDXComponents/Table";

/**
 * Components available in every .md / .mdx page without an import.
 * See src/components/Icon for the icon vocabulary.
 */
export default {
  ...MDXComponents,
  Icon,
  Status,
  // Every markdown table gets a horizontal scroll container.
  table: Table,
};
