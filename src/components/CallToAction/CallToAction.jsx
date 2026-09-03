import React from "react";
import Link from "@docusaurus/Link";
import styles from "./CallToAction.module.css";

export default function CallToAction() {
    return (
        <section className={styles.ctaSection}>
            <div className="container">
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
                    <p className={styles.ctaDescription}>
                        Explore the documentation to learn how to deploy, customize, and
                        extend the HCM platform for your organization.
                    </p>
                    <div className={styles.ctaButtons}>
                        <Link to="/hcm/intro" className={styles.ctaButtonPrimary}>
                            Explore Documentation
                        </Link>
                        <Link
                            to="/hcm/getting-started/installation"
                            className={styles.ctaButtonSecondary}
                        >
                            Installation Guide
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.ctaBackground}></div>
        </section>
    );
}
