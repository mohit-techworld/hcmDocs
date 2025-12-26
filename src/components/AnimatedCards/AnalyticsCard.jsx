import styles from "./AnimatedCards.module.css";

const chartData = [
  { label: "Jan", value: 85, color: "#10b981" },
  { label: "Feb", value: 92, color: "#3b82f6" },
  { label: "Mar", value: 78, color: "#f59e0b" },
  { label: "Apr", value: 95, color: "#8b5cf6" },
  { label: "May", value: 88, color: "#ec4899" },
  { label: "Jun", value: 90, color: "#06b6d4" },
];

export default function AnalyticsCard() {
  return (
    <div className={styles.analyticsCard}>
      <div className={styles.analyticsSection}>
        <div className={styles.analyticsHeader}>
          <div className={styles.analyticsTitle}>Productivity Analytics</div>
          <div className={styles.analyticsPeriod}>Last 6 Months</div>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.chartBars}>
            {chartData.map((item, index) => (
              <div key={index} className={styles.chartBarWrapper}>
                <div
                  className={styles.chartBar}
                  style={{
                    "--bar-height": `${item.value}%`,
                    height: `${item.value}%`,
                    backgroundColor: item.color,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <span className={styles.chartValue}>{item.value}%</span>
                </div>
                <div className={styles.chartLabel}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.metricsRow}>
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>1,234</div>
            <div className={styles.metricLabel}>Employees</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>94%</div>
            <div className={styles.metricLabel}>Attendance</div>
          </div>
          <div className={styles.metricItem}>
            <div className={styles.metricValue}>156</div>
            <div className={styles.metricLabel}>Active Tasks</div>
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div>
          <h3 className={styles.cardTitle}>Real-Time Analytics</h3>
          <p className={styles.cardDescription}>
            Comprehensive dashboards with productivity metrics, attendance
            tracking, performance insights, and RACI analytics—all in real-time.
            Export reports, schedule automated insights, and make data-driven
            decisions with powerful visualization tools and customizable
            widgets.
          </p>
        </div>
        <a href="/docs/analytics" className={styles.cardButton}>
          View Analytics →
        </a>
      </div>
    </div>
  );
}                                                      