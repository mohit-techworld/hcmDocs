import styles from "./AnimatedCards.module.css";

const apiEndpoints = [
  { method: "GET", path: "/api/employees", description: "List all employees" },
  { method: "POST", path: "/api/employees", description: "Create employee" },
  { method: "GET", path: "/api/attendance", description: "Get attendance" },
  { method: "POST", path: "/api/attendance/checkin", description: "Check in" },
  { method: "GET", path: "/api/payroll", description: "Get payroll data" },
  { method: "POST", path: "/api/leaves", description: "Apply for leave" },
  { method: "GET", path: "/api/tasks", description: "List tasks" },
  { method: "PUT", path: "/api/tasks/:id", description: "Update task" },
  { method: "GET", path: "/api/performance", description: "Get KPIs" },
  { method: "POST", path: "/api/tickets", description: "Raise ticket" },
];

const duplicatedEndpoints = [...apiEndpoints, ...apiEndpoints, ...apiEndpoints];

export default function ApiCard() {
  return (
    <div className={styles.apiCard}>
      <div className={styles.apiSection}>
        <div className={styles.apiScrollingContainer}>
          <div className={styles.apiScrollingRow}>
            {duplicatedEndpoints.map((endpoint, index) => (
              <div
                key={`api-${index}`}
                className={styles.apiEndpoint}
                style={{
                  "--method-color":
                    endpoint.method === "GET"
                      ? "#10b981"
                      : endpoint.method === "POST"
                      ? "#3b82f6"
                      : endpoint.method === "PUT"
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                <span className={styles.apiMethod}>{endpoint.method}</span>
                <span className={styles.apiPath}>{endpoint.path}</span>
                <span className={styles.apiDescription}>
                  {endpoint.description}
                </span>
              </div>
            ))}                                                               
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div>
          <h3 className={styles.cardTitle}>RESTful API</h3>
          <p className={styles.cardDescription}>
            Well-documented REST API with comprehensive endpoints for all HCM
            operations. Easy integration with any frontend or third-party
            system. Includes authentication, rate limiting, webhooks, and
            OpenAPI specification for seamless developer experience.
          </p>
        </div>
        <a href="/hcm/API/" className={styles.cardButton}>
          API Reference →
        </a>
      </div>
    </div>                                       
  );
}                                                                                        