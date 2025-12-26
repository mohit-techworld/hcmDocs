import React from "react";
import styles from "./AnimatedCards.module.css";

export default function CrudCard() {
  return (
    <div className={styles.crudCard}>
      <div className={styles.crudSection}>
        <div className={styles.crudHeader}>
          <button className={styles.addButton}>
            <span className={styles.addIcon}>+</span>
            Add new employee
          </button>
        </div>
        <div className={styles.recordList}>
          <div className={styles.recordItem}>
            <span>Employee #1</span>
            <div className={styles.recordMenu}>
              <div className={styles.menuItem}>
                <span className={styles.menuIcon} style={{ color: "#f97316" }}>
                  👁️
                </span>
                View
              </div>
              <div className={styles.menuItem}>
                <span className={styles.menuIcon} style={{ color: "#3b82f6" }}>
                  ✏️
                </span>
                Edit
              </div>
              <div className={styles.menuItem}>
                <span className={styles.menuIcon} style={{ color: "#ef4444" }}>
                  🗑️
                </span>
                Delete
              </div>
            </div>
          </div>
          <div className={styles.recordItem}>
            <span>Employee #2</span>
            <span className={styles.moreDots}>⋯</span>
          </div>
          <div className={styles.recordItem}>
            <span>Employee #3</span>
            <span className={styles.moreDots}>⋯</span>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div>
          <h3 className={styles.cardTitle}>Wheel? Already invented.</h3>
          <p className={styles.cardDescription}>
            Start with a well-structured HCM platform, built around industry's
            best practices for HR management. Pre-built CRUD operations, data
            validation, error handling, and security features are all included
            out of the box. Focus on your business logic, not boilerplate code.
          </p>
        </div>
        <a
          href="/docs/getting-started/project-setup"
          className={styles.cardButton}
        >
          Learn more →
        </a>
      </div>
    </div>
  );
}
