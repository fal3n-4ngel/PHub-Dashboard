import React from "react";

interface LandingPageProps {
  onLogin: () => void;
  authError?: string;
  firebaseAuthReady: boolean;
}

export default function LandingPage({ onLogin, authError, firebaseAuthReady }: LandingPageProps) {
  return (
    <div className="landing-container">
      <style>{`
        .landing-container {
          background-color: #f4f3ec;
          color: #1c1b18;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
          min-height: 100vh;
          padding: 0;
          margin: 0;
          overflow-x: hidden;
          position: relative;
        }

        /* Header Navigation */
        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 80px;
          max-width: 1300px;
          margin: 0 auto;
          position: sticky;
          top: 0;
          background-color: rgba(244, 243, 236, 0.9);
          backdrop-filter: blur(8px);
          z-index: 1000;
          border-bottom: 1px solid rgba(229, 227, 219, 0.5);
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: -0.5px;
          text-decoration: none;
          color: #1c1b18;
        }

        .landing-nav {
          display: flex;
          gap: 32px;
        }

        .landing-nav-link {
          font-size: 13px;
          font-weight: 500;
          color: #6e6c64;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .landing-nav-link:hover {
          color: #1c1b18;
        }

        .login-btn {
          background-color: #1c1b18;
          color: #ffffff;
          border-radius: 9999px;
          padding: 10px 22px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s, background-color 0.2s;
        }

        .login-btn:hover {
          background-color: #31302b;
          transform: translateY(-1px);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          font-size: 10px;
        }

        /* Hero Section */
        .hero-section {
          padding: 80px 24px 60px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-badge {
          display: inline-block;
          font-family: monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #6e6c64;
          background-color: #eae8e0;
          padding: 6px 14px;
          border-radius: 9999px;
          margin-bottom: 28px;
          font-weight: 600;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 12px;
        }

        .serif-italic {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 400;
        }

        .hero-subtitle {
          font-size: 16px;
          color: #6e6c64;
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.5;
        }

        /* Diagram Block */
        .diagram-container {
          max-width: 1000px;
          margin: 0 auto 80px;
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 16px;
          padding: 48px;
          position: relative;
          box-shadow: 0 10px 30px -10px rgba(110, 108, 100, 0.08);
          background-image: radial-gradient(#eae8e0 1.5px, transparent 1.5px);
          background-size: 20px 20px;
        }

        .diagram-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .diagram-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 220px;
        }

        .diagram-node {
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 12px -2px rgba(110, 108, 100, 0.04);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .diagram-node:hover {
          transform: translateY(-2px);
          border-color: #c4c2ba;
        }

        .node-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .node-text {
          text-align: left;
        }

        .node-title {
          font-size: 12px;
          font-weight: 700;
          color: #1c1b18;
          margin-bottom: 2px;
        }

        .node-desc {
          font-size: 10px;
          color: #6e6c64;
        }

        /* Center Hub Node */
        .center-hub {
          width: 100px;
          height: 100px;
          background-color: #1c1b18;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(28, 27, 24, 0.2);
          position: relative;
        }

        .center-hub-ring {
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border: 1.5px dashed #1c1b18;
          border-radius: 50%;
          animation: spin-clockwise 20s linear infinite;
        }

        .hub-title {
          font-size: 11px;
          font-weight: 700;
          margin-top: 6px;
          letter-spacing: 0.5px;
        }

        /* Dotted Connections SVG */
        .connections-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        /* Feature Grid Section */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto 100px;
          padding: 0 24px;
        }

        .feature-card {
          border-top: 1px solid #e5e3db;
          padding-top: 24px;
          text-align: left;
        }

        .feature-card-num {
          font-family: monospace;
          font-size: 11px;
          color: #6e6c64;
          font-weight: 600;
          display: block;
          margin-bottom: 12px;
        }

        .feature-card-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .feature-card-desc {
          font-size: 13.5px;
          color: #6e6c64;
          line-height: 1.6;
        }

        /* Setup Flow Section */
        .setup-section {
          background-color: #eae8e0;
          padding: 100px 24px;
          border-top: 1px solid #e5e3db;
          border-bottom: 1px solid #e5e3db;
        }

        .setup-container {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .setup-content {
          text-align: left;
        }

        .setup-step {
          display: flex;
          gap: 20px;
          margin-bottom: 36px;
        }

        .step-number {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #1c1b18;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .step-desc {
          font-size: 13px;
          color: #6e6c64;
          line-height: 1.5;
        }

        /* Browser Mockup */
        .browser-mockup {
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 12px;
          box-shadow: 0 20px 40px -15px rgba(110, 108, 100, 0.12);
          overflow: hidden;
        }

        .browser-header {
          height: 36px;
          background-color: #f4f3ec;
          border-bottom: 1px solid #e5e3db;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 6px;
        }

        .browser-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .browser-body {
          padding: 20px;
          background-color: #f4f3ec;
          display: flex;
          gap: 12px;
          height: 280px;
        }

        .mock-sidebar {
          width: 60px;
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mock-sidebar-line {
          height: 8px;
          background-color: #eae8e0;
          border-radius: 4px;
        }

        .mock-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mock-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .mock-card {
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 8px;
          padding: 12px;
          height: 70px;
        }

        .mock-chart {
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 8px;
          padding: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 6px;
        }

        .mock-bar-container {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          height: 80px;
        }

        .mock-bar {
          width: 14px;
          background-color: #e39282;
          border-radius: 2px 2px 0 0;
        }

        /* Pricing/CTA Section */
        .pricing-section {
          padding: 100px 24px;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .pricing-card {
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 16px;
          padding: 48px;
          margin-top: 40px;
          box-shadow: 0 10px 30px -10px rgba(110, 108, 100, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .pricing-title {
          font-size: 20px;
          font-weight: 700;
        }

        .pricing-price {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .pricing-desc {
          font-size: 13.5px;
          color: #6e6c64;
          max-width: 420px;
          line-height: 1.5;
        }

        /* Footer */
        .landing-footer {
          padding: 40px 24px;
          border-top: 1px solid #e5e3db;
          font-size: 12px;
          color: #9c9a92;
          text-align: center;
        }

        @keyframes spin-clockwise {
          to { transform: rotate(360deg); }
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .landing-header {
            padding: 20px 24px;
          }
          
          .landing-nav {
            display: none;
          }

          .hero-title {
            font-size: 40px;
          }

          .diagram-grid {
            flex-direction: column;
            gap: 40px;
          }

          .diagram-column {
            width: 100%;
          }

          .connections-svg {
            display: none;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .setup-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="landing-header">
        <a href="#" className="landing-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 22H22L12 2ZM12 6L18.8 19.6H5.2L12 6Z" fill="currentColor" />
          </svg>
          <span>Personal Hub</span>
        </a>
        <nav className="landing-nav">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How It Works</a>
          <a href="#setup" className="landing-nav-link">Setup</a>
          <a href="#pricing" className="landing-nav-link">Pricing</a>
        </nav>
        <button className="login-btn" onClick={onLogin} disabled={!firebaseAuthReady}>
          <span>Log in</span>
          <span className="login-arrow">↗</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <span className="hero-badge">All-in-One Personal Hub</span>
        <h1 className="hero-title">
          Everything you track.<br />
          <span className="serif-italic">Unified in one space.</span>
        </h1>
        <p className="hero-subtitle">
          Consolidate your media watchlists, track daily expenses, set custom salary cycles, and view bento analytics—stored completely privately in your personal Google Cloud database.
        </p>
      </section>

      {/* Diagram Block */}
      <section id="how-it-works" className="hero-section" style={{ paddingTop: 0 }}>
        <div className="diagram-container">
          <svg className="connections-svg" viewBox="0 0 1000 350" preserveAspectRatio="none">
            {/* Left to Center paths */}
            <path d="M 220 75 Q 360 75, 450 175" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            <path d="M 220 175 L 450 175" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            <path d="M 220 275 Q 360 275, 450 175" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            
            {/* Center to Right paths */}
            <path d="M 550 175 Q 640 75, 780 75" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            <path d="M 550 175 L 780 175" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            <path d="M 550 175 Q 640 275, 780 275" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
          </svg>

          <div className="diagram-grid">
            {/* Incoming Column */}
            <div className="diagram-column">
              <span className="label-mono" style={{ alignSelf: "flex-start", marginBottom: "-10px" }}>Incoming</span>
              
              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#eae8e0", color: "#1c1b18" }}>🎬</div>
                <div className="node-text">
                  <div className="node-title">Trakt watched API</div>
                  <div className="node-desc">Movies & Series</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#eae8e0", color: "#1c1b18" }}>🌸</div>
                <div className="node-text">
                  <div className="node-title">AniList OAuth</div>
                  <div className="node-desc">Anime tracker</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#eae8e0", color: "#1c1b18" }}>💵</div>
                <div className="node-text">
                  <div className="node-title">Expenses Form</div>
                  <div className="node-desc">Manual ledger</div>
                </div>
              </div>
            </div>

            {/* Center Hub Column */}
            <div className="center-hub">
              <div className="center-hub-ring"></div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 22H22L12 2ZM12 6L18.8 19.6H5.2L12 6Z" fill="#ffffff" />
              </svg>
              <span className="hub-title">Hub Engine</span>
            </div>

            {/* Results Column */}
            <div className="diagram-column">
              <span className="label-mono" style={{ alignSelf: "flex-start", marginBottom: "-10px" }}>Active Canvas</span>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#d1b89a", color: "#ffffff" }}>✓</div>
                <div className="node-text">
                  <div className="node-title">Unified Watchlist</div>
                  <div className="node-desc">Consolidated cards</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#e39282", color: "#ffffff" }}>📊</div>
                <div className="node-text">
                  <div className="node-title">Bento Analytics</div>
                  <div className="node-desc">Expenses categories</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#b3666b", color: "#ffffff" }}>📈</div>
                <div className="node-text">
                  <div className="node-title">Daily Trends</div>
                  <div className="node-desc">Salary cycle charts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="features-grid">
        <div className="feature-card">
          <span className="feature-card-num">01</span>
          <h3 className="feature-card-title">Clean Aggregated Sync</h3>
          <p className="feature-card-desc">
            Connect your external trackers seamlessly. Our Trakt engine syncs watched history and consolidates separate episodes into structured show records with covers via TVmaze, avoiding database bloat.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-card-num">02</span>
          <h3 className="feature-card-title">Bento Ledger Analytics</h3>
          <p className="feature-card-desc">
            Log your daily expenses, tag categories, and instantly analyze spending distributions. Dynamic, custom styling ensures high scannability and visual appeal for your ledger entries.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-card-num">03</span>
          <h3 className="feature-card-title">Custom Salary Cycle</h3>
          <p className="feature-card-desc">
            Ditch strict calendar timeframes. Set your monthly payday as your start index and filter analytics across custom cycles that accurately align with your personal cash flow.
          </p>
        </div>
      </section>

      {/* Setup Flow Section */}
      <section id="setup" className="setup-section">
        <div className="setup-container">
          <div className="setup-content">
            <span className="hero-badge" style={{ backgroundColor: "#f4f3ec" }}>Minimalist Setup</span>
            <h2 className="hero-title" style={{ fontSize: "38px", marginBottom: "40px" }}>
              If you can log in,<br />
              <span className="serif-italic">you can track.</span>
            </h2>

            <div className="setup-step">
              <span className="step-number">1</span>
              <div>
                <h4 className="step-title">Secure Google Authentication</h4>
                <p className="step-desc">Log in in seconds. Your database structure initializes automatically upon your first auth transaction.</p>
              </div>
            </div>

            <div className="setup-step">
              <span className="step-number">2</span>
              <div>
                <h4 className="step-title">Connect API Credentials</h4>
                <p className="step-desc">Save your personal AniList and Trakt Client OAuth credentials right inside the settings card to fetch libraries securely.</p>
              </div>
            </div>

            <div className="setup-step">
              <span className="step-number">3</span>
              <div>
                <h4 className="step-title">Full Dashboard Access</h4>
                <p className="step-desc">Categorize, toggle anime vs general media watchlist filters, and review daily trend graphs in one fluid bento board.</p>
              </div>
            </div>
          </div>

          {/* Browser Mockup */}
          <div className="browser-mockup">
            <div className="browser-header">
              <div className="browser-dot" style={{ backgroundColor: "#ff5f56" }}></div>
              <div className="browser-dot" style={{ backgroundColor: "#ffbd2e" }}></div>
              <div className="browser-dot" style={{ backgroundColor: "#27c93f" }}></div>
            </div>
            <div className="browser-body">
              <div className="mock-sidebar">
                <div className="mock-sidebar-line" style={{ width: "100%", height: "14px", backgroundColor: "#1c1b18" }}></div>
                <div className="mock-sidebar-line" style={{ width: "80%", marginTop: "10px" }}></div>
                <div className="mock-sidebar-line" style={{ width: "65%" }}></div>
                <div className="mock-sidebar-line" style={{ width: "70%" }}></div>
              </div>
              <div className="mock-main">
                <div className="mock-grid">
                  <div className="mock-card">
                    <div style={{ height: "6px", width: "40px", backgroundColor: "#eae8e0", marginBottom: "6px" }}></div>
                    <div style={{ height: "14px", width: "70px", backgroundColor: "#1c1b18" }}></div>
                  </div>
                  <div className="mock-card">
                    <div style={{ height: "6px", width: "30px", backgroundColor: "#eae8e0", marginBottom: "6px" }}></div>
                    <div style={{ height: "14px", width: "50px", backgroundColor: "#b3666b" }}></div>
                  </div>
                  <div className="mock-card">
                    <div style={{ height: "6px", width: "40px", backgroundColor: "#eae8e0", marginBottom: "6px" }}></div>
                    <div style={{ height: "14px", width: "60px", backgroundColor: "#e39282" }}></div>
                  </div>
                </div>
                <div className="mock-chart">
                  <div style={{ height: "8px", width: "80px", backgroundColor: "#eae8e0", alignSelf: "flex-start", marginBottom: "8px" }}></div>
                  <div className="mock-bar-container">
                    <div className="mock-bar" style={{ height: "40px" }}></div>
                    <div className="mock-bar" style={{ height: "70px", backgroundColor: "#1c1b18" }}></div>
                    <div className="mock-bar" style={{ height: "55px", backgroundColor: "#d1b89a" }}></div>
                    <div className="mock-bar" style={{ height: "20px" }}></div>
                    <div className="mock-bar" style={{ height: "85px", backgroundColor: "#1c1b18" }}></div>
                    <div className="mock-bar" style={{ height: "60px" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section id="pricing" className="pricing-section">
        <span className="hero-badge">Completely Free</span>
        <h2 className="hero-title" style={{ fontSize: "38px" }}>
          Three ways to track.<br />
          <span className="serif-italic">One is the ultimate.</span>
        </h2>
        
        <div className="pricing-card">
          <span className="pricing-title">Self-Hosted Instance</span>
          <span className="pricing-price">₹0</span>
          <p className="pricing-desc">
            Free forever. We do not store or process your data on any central servers. Everything resides in your private Firebase storage.
          </p>
          
          {authError && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", width: "100%", maxWidth: "340px", fontSize: "12px", color: "#dc2626", margin: "10px 0" }}>
              {authError}
            </div>
          )}

          <button className="login-btn" style={{ padding: "14px 32px", fontSize: "14px" }} onClick={onLogin} disabled={!firebaseAuthReady}>
            <span>Sign in with Google</span>
            <span className="login-arrow" style={{ width: "18px", height: "18px", fontSize: "11px" }}>↗</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Personal Hub. Private client application. Built for self-hosting.</p>
      </footer>
    </div>
  );
}
