import React from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import Icon from "@site/src/components/Icon";
// products.json, not products.mjs: the .mjs module reads the registry
// with node:fs, which only exists server-side. Webpack imports the JSON
// natively, so the client bundle stays Node-free.
import PRODUCTS from "@site/products.json";
import styles from "./styles.module.css";

/**
 * The product hub. Rendered from products.js, so a new product shows up here,
 * in the navbar dropdown and in the footer from one registry entry — the
 * three used to be maintained by hand and drifted apart.
 */
export default function ProductHub() {
  return (
    <section className={styles.hub} id="products">
      <div className="container">
        <div className={styles.header}>
          <Heading as="h2" className={styles.title}>
            Choose a product
          </Heading>
          <p className={styles.subtitle}>
            Each product has its own documentation, its own navigation and its
            own version history. Start with Platform if you are writing a client
            — the tenancy rules apply to all of them.
          </p>
        </div>

        <div className={styles.grid}>
          {PRODUCTS.map((p) => {
            const planned = p.status !== "live";
            const Card = planned ? "div" : Link;
            return (
              <Card
                key={p.id}
                {...(planned ? {} : { to: p.entry })}
                className={`${styles.card} ${planned ? styles.planned : ""}`}
              >
                <div className={styles.cardTop}>
                  <Icon name={p.icon} size={20} className={styles.icon} />
                  <Heading as="h3" className={styles.cardTitle}>
                    {p.label}
                  </Heading>
                  {planned && <span className={styles.badge}>Planned</span>}
                </div>
                <p className={styles.blurb}>{p.blurb}</p>
                {!planned && <span className={styles.cta}>Open docs →</span>}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
