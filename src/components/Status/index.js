import React from "react";
import Icon from "@site/src/components/Icon";
import styles from "./styles.module.css";

/**
 * Pass / fail / partial state, carried by a glyph AND a word.
 *
 * The docs previously used bare check and cross emoji for this, which encodes
 * meaning in colour and shape alone. Every variant here ships a text label, so
 * the state survives screen readers, greyscale printing and colour blindness.
 *
 *   <Status yes />                 -> ✓ Supported
 *   <Status no>Not implemented</Status>
 *   <Status partial>Behind a flag</Status>
 */
const VARIANTS = {
  yes: { icon: "check", cls: "yes", text: "Supported" },
  no: { icon: "cross", cls: "no", text: "Not supported" },
  partial: { icon: "warning", cls: "partial", text: "Partial" },
  info: { icon: "info", cls: "info", text: "Note" },
};

export default function Status({ yes, no, partial, info, children }) {
  const key = (yes && "yes") || (no && "no") || (partial && "partial") || "info";
  const v = VARIANTS[key];
  const text = children || v.text;

  return (
    <span className={`${styles.status} ${styles[v.cls]}`}>
      <Icon name={v.icon} size={15} />
      <span>{text}</span>
    </span>
  );
}
