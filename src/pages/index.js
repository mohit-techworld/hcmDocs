import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import SeamlessConnectivityCard from "@site/src/components/AnimatedCards/SeamlessConnectivityCard";
import CodeCard from "@site/src/components/AnimatedCards/CodeCard";
import CrudCard from "@site/src/components/AnimatedCards/CrudCard";
import MobileCodeCard from "@site/src/components/AnimatedCards/MobileCodeCard";
import AnalyticsCard from "@site/src/components/AnimatedCards/AnalyticsCard";
import ApiCard from "@site/src/components/AnimatedCards/ApiCard";
import StatsSection from "@site/src/components/StatsSection";
import TechStackSection from "@site/src/components/TechStackSection";
import CallToAction from "@site/src/components/CallToAction";
import ProductHub from "@site/src/components/ProductHub";

import Icon from "@site/src/components/Icon";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

function VersionBadge() {
  return (
    <div className={styles.versionBadge}>
      <span className={styles.badgeDot}></span>
      <span>v2.0 — Latest Release</span>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <VersionBadge />
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <p className={styles.heroDescription}>
            A comprehensive Human Capital Management platform that digitizes the
            complete employee lifecycle. From employee onboarding to payroll
            processing, attendance tracking to performance management,
            recruitment to resignation— manage your entire workforce with
            powerful, integrated modules.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/hcm/intro"
            >
              Get Started →
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="/hcm/getting-started/installation"
            >
              Installation Guide
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.heroBackground}></div>
      <div className={styles.heroGlow}></div>
    </header>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Quick Navigation
        </Heading>
        <p className={styles.quickLinksSubtitle}>
          Get started quickly with these essential resources
        </p>
        <div className={styles.linksGrid}>
          <Link
            to="/hcm/getting-started/project-setup"
            className={styles.quickLinkCard}
          >
            <div className={styles.quickLinkIcon}>
              <Icon name="rocket" size={24} />
            </div>
            <h3>Getting Started</h3>
            <p>Set up your development environment and start building</p>
          </Link>
          <Link
            to="/hcm/API/Authentication/auth-setup"
            className={styles.quickLinkCard}
          >
            <div className={styles.quickLinkIcon}>
              <Icon name="plug" size={24} />
            </div>
            <h3>API Reference</h3>
            <p>Complete API documentation for all endpoints and integrations</p>
          </Link>
          <Link
            to="/hcm/architecture/overview"
            className={styles.quickLinkCard}
          >
            <div className={styles.quickLinkIcon}>
              <Icon name="layers" size={24} />
            </div>
            <h3>System Architecture</h3>
            <p>Understand the architecture, design patterns, and data flow</p>
          </Link>
          <Link to="/hcm/backend/services" className={styles.quickLinkCard}>
            <div className={styles.quickLinkIcon}>
              <Icon name="server" size={24} />
            </div>
            <h3>Backend Services</h3>
            <p>
              Explore backend modules, controllers, and service architecture
            </p>
          </Link>
          <Link to="/hcm/frontend/overview" className={styles.quickLinkCard}>
            <div className={styles.quickLinkIcon}>
              <Icon name="code" size={24} />
            </div>
            <h3>Frontend Guide</h3>
            <p>Learn about React components, routing, and state management</p>
          </Link>
          <Link to="/hcm/devops/deployment" className={styles.quickLinkCard}>
            <div className={styles.quickLinkIcon}>
              <Icon name="cloud" size={24} />
            </div>
            <h3>Deployment</h3>
            <p>Deploy and configure the HCM platform in production</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Comprehensive Human Capital Management platform documentation. Learn how to use, deploy, and extend the HCM system."
    >
      <HomepageHeader />
      <main>
        <ProductHub />
        <section className={styles.animatedCardsSection}>
          <div className="container">
            <div className={styles.animatedCardsGrid}>
              <SeamlessConnectivityCard />
              <CodeCard />
              <MobileCodeCard />
              <AnalyticsCard />
              <CrudCard />
              <ApiCard />
            </div>
          </div>
        </section>
        <StatsSection />
        <HomepageFeatures />
        <TechStackSection />
        <QuickLinks />
        <CallToAction />
      </main>
    </Layout>
  );
}
