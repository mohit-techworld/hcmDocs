import React from "react";
import styles from "./AnimatedCards.module.css";

const modules = [
  { name: "Employee Management", icon: "👥", color: "#3b82f6" },
  { name: "Attendance & Time", icon: "⏰", color: "#10b981" },
  { name: "Payroll", icon: "💰", color: "#f59e0b" },
  { name: "Leave Management", icon: "📅", color: "#8b5cf6" },
  { name: "Task Management", icon: "✅", color: "#ec4899" },
  { name: "Performance", icon: "🎯", color: "#06b6d4" },
  { name: "Recruitment", icon: "🔍", color: "#14b8a6" },
  { name: "Roster", icon: "📋", color: "#6366f1" },
  { name: "Engagement", icon: "💬", color: "#f97316" },
  { name: "Productivity", icon: "📊", color: "#22c55e" },
  { name: "RACI Analytics", icon: "🏢", color: "#a855f7" },
  { name: "Document Center", icon: "📄", color: "#0ea5e9" },
  { name: "Inventory", icon: "📦", color: "#eab308" },
  { name: "Resignation & F&F", icon: "👋", color: "#ef4444" },
  { name: "Geolocation", icon: "📍", color: "#06b6d4" },
  { name: "Company Settings", icon: "⚙️", color: "#64748b" },
];

// Duplicate items for seamless loop
const duplicatedModules = [...modules, ...modules, ...modules];

export default function SeamlessConnectivityCard() {
  return (
    <div className={styles.seamlessCard}>
      <div className={styles.scrollingContainer}>
        <div className={styles.scrollingRow}>
          {duplicatedModules.map((module, index) => (
            <div
              key={`row1-${index}`}
              className={styles.moduleChip}
              style={{ "--chip-color": module.color }}
            >
              <span className={styles.moduleIcon}>{module.icon}</span>
              <span className={styles.moduleName}>{module.name}</span>
            </div>
          ))}
        </div>
        <div className={`${styles.scrollingRow} ${styles.scrollingRowReverse}`}>
          {duplicatedModules.map((module, index) => (
            <div
              key={`row2-${index}`}
              className={styles.moduleChip}
              style={{ "--chip-color": module.color }}
            >
              <span className={styles.moduleIcon}>{module.icon}</span>
              <span className={styles.moduleName}>{module.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.cardContent}>
        <div>
          <h3 className={styles.cardTitle}>Seamless Integration</h3>
          <p className={styles.cardDescription}>
            Out-of-the-box modules for 18+ HCM features including employee
            management, payroll, attendance, and performance tracking. All
            modules are pre-configured and ready to use, with comprehensive
            documentation and support for customization. Each module integrates
            seamlessly with others, sharing data and workflows automatically.
            Built-in APIs enable third-party integrations, and our modular
            architecture allows you to enable or disable features based on your
            organization's needs. Real-time synchronization ensures data
            consistency across all modules, while role-based access control
            provides granular permissions for each feature.
          </p>
        </div>
        <a href="/docs/modules" className={styles.cardButton}>
          All Modules →
        </a>
      </div>
    </div>
  );
}
