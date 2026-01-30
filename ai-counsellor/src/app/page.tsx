import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/">
            <span className={styles.logo}>AI Counsellor</span>
          </Link>
          <div>
            <Link href="/dashboard" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className="animate-fade-in">
            <h1 className={styles.heroTitle}>
              From <span className={styles.textGradient}>Confusion</span> to <span className={styles.textGradient}>Clarity</span>
              <br /> in Your Study-Abroad Journey
            </h1>
            <p className={styles.heroSubtitle}>
              Not just a chatbot. A guided, discipline-driven system to execute your study abroad plans.
              We guide you from onboarding to application submission, step by step.
            </p>
            <div className={styles.buttonGroup}>
              <Link href="/dashboard" className="btn btn-primary">
                Get Started
              </Link>
              <Link href="/dashboard" className="btn btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Process Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <div className={styles.grid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📝</div>
              <h3 className={styles.featureTitle}>1. Onboarding</h3>
              <p className={styles.featureDesc}>Build your profile. We assess your grades, interests, and budget to tailor your path.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏫</div>
              <h3 className={styles.featureTitle}>2. University Shortlisting</h3>
              <p className={styles.featureDesc}>AI-driven recommendations. Shortlist your favorites and compare options.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚀</div>
              <h3 className={styles.featureTitle}>3. Application Execution</h3>
              <p className={styles.featureDesc}>Lock your choices and follow a strict application timeline with AI guidance.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          © {new Date().getFullYear()} AI Counsellor. Built for Students.
        </div>
      </footer>
    </div>
  );
}
