import React from "react";
import styles from "./Table.module.css";

/**
 * Wraps every markdown table in a horizontal scroll container.
 *
 * Docusaurus ships tables as bare <table> and Infima makes them
 * `display: block; overflow: auto` so a wide one scrolls. That works, but a
 * block-level table sizes its inner rows to content rather than to the block,
 * so narrow tables stop short of the container and the rounded border/header
 * no longer line up.
 *
 * Putting the scroll on a wrapper instead lets the table stay a real
 * `display: table` at `width: 100%`: narrow tables fill the column, and a
 * table whose minimum content width exceeds the column grows and the wrapper
 * scrolls. tabindex + role make it reachable by keyboard, which a scroll
 * container otherwise is not.
 */
export default function Table(props) {
  return (
    <div className={styles.tableWrapper} tabIndex={0} role="region" aria-label="Table">
      <table {...props} />
    </div>
  );
}
