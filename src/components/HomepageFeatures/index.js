import clsx from "clsx";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Employee Management",
    icon: "👥",
    description: (
      <>
        Complete employee lifecycle from onboarding to exit. Manage profiles,
        subordinates, asset assignments, disciplinary actions, and
        organizational hierarchy with comprehensive employee data management.
      </>
    ),
    link: "/docs/modules/employee-management",
  },
  {
    title: "Attendance & Time Tracking",
    icon: "⏰",
    description: (
      <>
        Real-time attendance tracking with biometric integration, geofencing,
        regularization requests, overtime management, and detailed attendance
        analytics for accurate time monitoring.
      </>
    ),
    link: "/docs/modules/attendance-leave",
  },
  {
    title: "Payroll Management",
    icon: "💰",
    description: (
      <>
        Comprehensive payroll processing with statutory compliance
        (EPF/ESI/PT/LWF/TDS), loan & advance management, bonus calculations,
        claims processing, and full & final settlement automation.
      </>
    ),
    link: "/docs/modules/payroll",
  },
  {
    title: "Leave Management",
    icon: "📅",
    description: (
      <>
        Flexible leave management system with configurable leave types, approval
        workflows, leave bank management, and comprehensive leave history
        tracking for employees and managers.
      </>
    ),
    link: "/docs/modules/attendance-leave",
  },
  {
    title: "Task Management",
    icon: "✅",
    description: (
      <>
        Efficient task assignment and tracking with daily task management,
        assigned task monitoring, task analytics, and team productivity insights
        to ensure timely project completion.
      </>
    ),
    link: "/docs/modules/task-management",
  },
  {
    title: "Ticket & POSH Management",
    icon: "🎫",
    description: (
      <>
        Streamlined ticket management system for issue tracking, resolution
        workflows, and POSH (Prevention of Sexual Harassment) case management
        with proper compliance and reporting mechanisms.
      </>
    ),
    link: "/docs/modules/ticket-management",
  },
  {
    title: "Performance Management",
    icon: "🎯",
    description: (
      <>
        Advanced performance evaluation with KPI/KRA setting, quantitative &
        qualitative ratings, team performance analytics, top performer
        recognition, and comprehensive performance dashboards.
      </>
    ),
    link: "/docs/modules/performance",
  },
  {
    title: "Recruitment Management",
    icon: "🔍",
    description: (
      <>
        End-to-end recruitment process from MRF creation to candidate
        onboarding. Manage job postings, candidate pipeline, interview
        scheduling, and recruitment analytics.
      </>
    ),
    link: "/docs/modules/recruitment",
  },
  {
    title: "Roster Management",
    icon: "📋",
    description: (
      <>
        Intelligent shift scheduling and roster management with swap request
        handling, shift calendar management, and roster history tracking for
        optimal workforce planning.
      </>
    ),
    link: "/docs/modules/roster-management",
  },
  {
    title: "Engagement & Synergy",
    icon: "💬",
    description: (
      <>
        Foster collaboration with engagement feeds, real-time chat,
        announcements, polls, and social features that boost employee
        interaction and team synergy across the organization.
      </>
    ),
    link: "/docs/modules/engagement-chat",
  },
  {
    title: "Productivity Analytics",
    icon: "📊",
    description: (
      <>
        Advanced productivity tracking with productivity lenses, team
        productivity dashboards, subordinate analytics, and data-driven insights
        to optimize workforce efficiency.
      </>
    ),
    link: "/docs/modules/productivity",
  },
  {
    title: "RACI Analytics",
    icon: "🏢",
    description: (
      <>
        Comprehensive RACI (Responsible, Accountable, Consulted, Informed)
        analytics with business and operations dashboards for clear
        accountability mapping and organizational clarity.
      </>
    ),
    link: "/docs/modules/raci-analytics",
  },
  {
    title: "Document Center",
    icon: "📄",
    description: (
      <>
        Centralized document management with secure sharing, letterhead
        management, document preview, and organized document vaults for easy
        access and compliance.
      </>
    ),
    link: "/docs/modules/document-center",
  },
  {
    title: "Inventory & Assets",
    icon: "📦",
    description: (
      <>
        Complete asset inventory management with category management, vendor
        tracking, stock adjustments, asset assignment, and comprehensive
        inventory reporting for efficient resource management.
      </>
    ),
    link: "/docs/modules/asset-inventory",
  },
  {
    title: "Resignation & F&F",
    icon: "👋",
    description: (
      <>
        Streamlined resignation workflow with submission, approval chains, full
        & final settlement processing, and comprehensive resignation history
        tracking for smooth employee exits.
      </>
    ),
    link: "/docs/modules/resignation-fnf",
  },
  {
    title: "Geolocation Tracking",
    icon: "📍",
    description: (
      <>
        Real-time location tracking for field workers with visit management,
        location history, geofencing capabilities, and location-based analytics
        for mobile workforce management.
      </>
    ),
    link: "/docs/modules/geolocation",
  },
  {
    title: "Company Settings",
    icon: "⚙️",
    description: (
      <>
        Comprehensive company configuration including hierarchy management,
        policies, induction programs, training materials, break settings, and
        organizational structure setup.
      </>
    ),
    link: "/docs/modules/company-settings",
  },
  {
    title: "Role-Based Dashboards",
    icon: "📈",
    description: (
      <>
        Customized dashboards for different roles - Super Admin, HR, Manager,
        Employee, and Mid-Level Management with role-specific analytics, KPIs,
        and actionable insights.
      </>
    ),
    link: "/docs/modules/dashboard-analytics",
  },
];

function Feature({ icon, title, description, link }) {
  return (
    <div className={clsx("col col--4", styles.featureCard)}>
      <Link to={link} className={styles.featureLink}>
        <div className={styles.featureIcon}>{icon}</div>
        <div className={styles.featureContent}>
          <Heading as="h3" className={styles.featureTitle}>
            {title}
          </Heading>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <Heading as="h2" className={styles.sectionTitle}>
            Core Capabilities
          </Heading>
          <p className={styles.sectionSubtitle}>
            Discover 18+ integrated modules covering every aspect of human
            resource management—from core HR operations to advanced analytics
            and engagement tools
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
