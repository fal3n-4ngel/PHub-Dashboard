import React from "react";

interface LandingPageProps {
  onLogin: () => void;
  authError?: string;
  firebaseAuthReady: boolean;
}

/* ─── New logo: bento-grid SVG ─── */
function BentoLogo({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  const gap = size * 0.08;
  const cell = (size - gap * 3) / 2;
  const r = size * 0.12;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* top-left */}
      <rect x={gap} y={gap} width={cell} height={cell} rx={r} fill={color} />
      {/* top-right */}
      <rect x={gap * 2 + cell} y={gap} width={cell} height={cell} rx={r} fill={color} opacity="0.55" />
      {/* bottom-left */}
      <rect x={gap} y={gap * 2 + cell} width={cell} height={cell} rx={r} fill={color} opacity="0.55" />
      {/* bottom-right */}
      <rect x={gap * 2 + cell} y={gap * 2 + cell} width={cell} height={cell} rx={r} fill={color} opacity="0.85" />
    </svg>
  );
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

        /* ─── Header ─── */
        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 80px;
          max-width: 1300px;
          margin: 0 auto;
          position: sticky;
          top: 0;
          background-color: rgba(244, 243, 236, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 1000;
          border-bottom: 1px solid rgba(229, 227, 219, 0.6);
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: -0.4px;
          text-decoration: none;
          color: #1c1b18;
        }

        .landing-nav {
          display: flex;
          gap: 32px;
          align-items: center;
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
          font-family: inherit;
        }

        .login-btn:hover {
          background-color: #31302b;
          transform: translateY(-1px);
        }

        .login-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        /* ─── Hero ─── */
        .hero-section {
          padding: 90px 24px 60px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
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
          border: 1px solid #e5e3db;
        }

        .hero-title {
          font-size: 58px;
          font-weight: 700;
          line-height: 1.04;
          letter-spacing: -2.5px;
          margin-bottom: 16px;
          color: #1c1b18;
        }

        .serif-italic {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 400;
        }

        .hero-subtitle {
          font-size: 16px;
          color: #6e6c64;
          max-width: 580px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }

        .hero-cta-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-cta-primary {
          background-color: #1c1b18;
          color: #fff;
          border: none;
          border-radius: 9999px;
          padding: 13px 28px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-cta-primary:hover {
          background-color: #31302b;
          transform: translateY(-1px);
        }

        .hero-cta-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .hero-cta-secondary {
          background-color: transparent;
          color: #1c1b18;
          border: 1.5px solid #d1cfc7;
          border-radius: 9999px;
          padding: 13px 28px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-cta-secondary:hover {
          border-color: #1c1b18;
          background-color: rgba(28,27,24,0.04);
        }

        /* ─── Feature Pills ─── */
        .hero-pills {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #6e6c64;
          background-color: #fff;
          border: 1px solid #e5e3db;
          border-radius: 9999px;
          padding: 5px 12px;
          font-weight: 500;
        }

        /* ─── How it works diagram ─── */
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
          gap: 14px;
          width: 210px;
          min-width: 0;
        }

        .diagram-node {
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 10px;
          padding: 12px 14px;
          box-shadow: 0 2px 8px -2px rgba(110, 108, 100, 0.07);
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .diagram-node:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px -4px rgba(110, 108, 100, 0.14);
        }

        .node-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .node-text { text-align: left; }

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

        .center-hub {
          width: 96px;
          height: 96px;
          background-color: #1c1b18;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(28, 27, 24, 0.2);
          position: relative;
          gap: 4px;
        }

        .center-hub-ring {
          position: absolute;
          top: -7px; left: -7px; right: -7px; bottom: -7px;
          border: 1.5px dashed rgba(28,27,24,0.25);
          border-radius: 50%;
          animation: spin-clockwise 20s linear infinite;
        }

        .hub-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .connections-svg {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        /* ─── Feature grid ─── */
        .features-section {
          padding: 0 24px 80px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .features-section-label {
          font-family: monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #9c9a92;
          font-weight: 600;
          margin-bottom: 32px;
          display: block;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0;
          border: 1px solid #e5e3db;
          border-radius: 16px;
          overflow: hidden;
          background-color: #ffffff;
        }

        .feature-card {
          padding: 32px;
          border-right: 1px solid #e5e3db;
          border-bottom: 1px solid #e5e3db;
          transition: background-color 0.2s;
        }

        .feature-card:nth-child(2n) {
          border-right: none;
        }

        .feature-card:nth-child(3),
        .feature-card:nth-child(4) {
          border-bottom: none;
        }

        .feature-card:hover {
          background-color: #fafaf8;
        }

        .feature-num {
          font-family: monospace;
          font-size: 11px;
          color: #c4c2ba;
          font-weight: 600;
          display: block;
          margin-bottom: 16px;
        }

        .feature-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background-color: #f4f3ec;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          margin-bottom: 16px;
        }

        .feature-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        .feature-desc {
          font-size: 13px;
          color: #6e6c64;
          line-height: 1.65;
        }

        /* ─── Stats bar ─── */
        .stats-bar {
          background-color: #1c1b18;
          padding: 40px 80px;
          display: flex;
          justify-content: center;
          gap: 80px;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
          color: #ffffff;
        }

        .stat-num {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1.5px;
          display: block;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
          font-family: monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ─── Setup section ─── */
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
          margin-top: 2px;
        }

        .step-title {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .step-desc {
          font-size: 13px;
          color: #6e6c64;
          line-height: 1.55;
        }

        .browser-mockup {
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 12px;
          box-shadow: 0 20px 40px -15px rgba(110, 108, 100, 0.14);
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

        /* ─── Three-way pricing ─── */
        .pricing-section {
          padding: 100px 24px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .pricing-three-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 48px;
          text-align: left;
        }

        .plan-card {
          background-color: #ffffff;
          border: 1px solid #e5e3db;
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          position: relative;
        }

        .plan-card:hover {
          box-shadow: 0 8px 28px -4px rgba(110, 108, 100, 0.12);
          transform: translateY(-2px);
        }

        .plan-card.featured {
          border-color: #1c1b18;
          box-shadow: 0 6px 24px -4px rgba(28, 27, 24, 0.14);
        }

        .plan-badge {
          display: inline-block;
          font-family: monospace;
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6e6c64;
          background-color: #eae8e0;
          padding: 4px 10px;
          border-radius: 9999px;
          font-weight: 600;
          margin-bottom: 20px;
          align-self: flex-start;
        }

        .plan-card.featured .plan-badge {
          background-color: #1c1b18;
          color: #ffffff;
        }

        .plan-name {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
          color: #1c1b18;
        }

        .plan-price {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: -2px;
          color: #1c1b18;
          line-height: 1;
          margin-bottom: 4px;
        }

        .plan-price-note {
          font-size: 13px;
          color: #9c9a92;
          font-weight: 400;
          letter-spacing: 0;
        }

        .plan-desc {
          font-size: 13px;
          color: #6e6c64;
          line-height: 1.65;
          margin: 16px 0 0;
          flex: 1;
        }

        .plan-divider {
          height: 1px;
          background-color: #e5e3db;
          margin: 24px 0;
        }

        .plan-features {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 28px;
        }

        .plan-features li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          color: #1c1b18;
          line-height: 1.4;
        }

        .fi-yes  { color: #22c55e; font-size: 13px; flex-shrink: 0; }
        .fi-warn { color: #f59e0b; font-size: 13px; flex-shrink: 0; }
        .fi-note { color: #9c9a92; font-size: 13px; flex-shrink: 0; }

        .plan-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 20px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1.5px solid #1c1b18;
          background-color: transparent;
          color: #1c1b18;
          text-decoration: none;
          font-family: inherit;
          width: 100%;
        }

        .plan-cta:hover:not(:disabled) {
          background-color: #1c1b18;
          color: #ffffff;
        }

        .plan-cta.plan-primary {
          background-color: #1c1b18;
          color: #ffffff;
        }

        .plan-cta.plan-primary:hover:not(:disabled) {
          background-color: #31302b;
        }

        .plan-cta:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ─── Footer ─── */
        .footer-wrap {
          background-color: #ffffff;
          border-top: 1px solid #e5e3db;
        }

        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 56px 80px 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 60px;
          padding-bottom: 48px;
          border-bottom: 1px solid #e5e3db;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 9px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: -0.4px;
          color: #1c1b18;
          text-decoration: none;
        }

        .footer-desc {
          font-size: 13px;
          color: #6e6c64;
          line-height: 1.65;
          max-width: 290px;
        }

        .footer-byline {
          font-size: 12px;
          color: #9c9a92;
        }

        .footer-byline a {
          color: #6e6c64;
          text-decoration: none;
        }

        .footer-byline a:hover {
          color: #1c1b18;
        }

        .footer-col-label {
          font-family: monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #9c9a92;
          font-weight: 600;
          margin-bottom: 16px;
          display: block;
        }

        .footer-link-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .footer-link-item {
          font-size: 13px;
          color: #6e6c64;
          text-decoration: none;
          transition: color 0.15s;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .footer-link-item:hover {
          color: #1c1b18;
        }

        .footer-bar {
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .footer-bar-text {
          font-size: 11px;
          color: #9c9a92;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .footer-sep { color: #d1cfc7; }

        .footer-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #9c9a92;
        }

        .footer-green-dot {
          width: 6px;
          height: 6px;
          background-color: #22c55e;
          border-radius: 50%;
        }

        /* ─── Animations ─── */
        @keyframes spin-clockwise {
          to { transform: rotate(360deg); }
        }

        /* ─── Responsive ─── */
        @media (max-width: 900px) {
          .landing-header {
            padding: 16px 24px;
          }

          .landing-nav {
            display: none;
          }

          .hero-title {
            font-size: 40px;
            letter-spacing: -1.8px;
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
          }

          .feature-card {
            border-right: none !important;
            border-bottom: 1px solid #e5e3db !important;
          }

          .feature-card:last-child {
            border-bottom: none !important;
          }

          .setup-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .stats-bar {
            padding: 40px 24px;
            gap: 40px;
          }

          .pricing-three-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }

          .plan-card.featured {
            order: -1;
          }

          .footer-inner {
            padding: 48px 24px 0;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
            padding-bottom: 36px;
          }

          .footer-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 32px;
            letter-spacing: -1.5px;
          }

          .hero-section {
            padding: 60px 16px 40px;
          }

          .plan-card {
            padding: 24px;
          }

          .plan-price {
            font-size: 30px;
          }

          .diagram-container {
            padding: 28px 20px;
          }
        }
      `}</style>

      {/* ─── Header ─── */}
      <header className="landing-header">
        <a href="#" className="landing-logo">
          <BentoLogo size={22} color="#1c1b18" />
          <span>Phub Dashboard</span>
        </a>
        <nav className="landing-nav">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#how-it-works" className="landing-nav-link">How It Works</a>
          <a href="#pricing" className="landing-nav-link">Pricing</a>
          <a href="https://github.com/fal3n-4ngel/personal-dashboard" target="_blank" rel="noopener noreferrer" className="landing-nav-link">GitHub ↗</a>
        </nav>
        <button className="login-btn" onClick={onLogin} disabled={!firebaseAuthReady}>
          <span>Get started</span>
          <span style={{ fontSize: "14px" }}>→</span>
        </button>
      </header>

      {/* ─── Hero ─── */}
      <section className="hero-section">
        <span className="hero-badge">
          <BentoLogo size={12} color="#6e6c64" />
          Self-hostable · Open source · Private
        </span>
        <h1 className="hero-title">
          One dashboard.<br />
          <span className="serif-italic">Everything you track.</span>
        </h1>
        <p className="hero-subtitle">
          Consolidate your media watchlists, track daily expenses with custom salary cycles, maintain a book library, and keep a scratchpad — all stored privately in your own database.
        </p>
        <div className="hero-cta-row">
          <button className="hero-cta-primary" onClick={onLogin} disabled={!firebaseAuthReady}>
            Start for free
            <span>→</span>
          </button>
          <a href="https://github.com/fal3n-4ngel/personal-dashboard" target="_blank" rel="noopener noreferrer" className="hero-cta-secondary">
            View on GitHub
          </a>
        </div>
        <div className="hero-pills">
          <span className="hero-pill">💸 Expense Ledger</span>
          <span className="hero-pill">🎬 Media Watchlist</span>
          <span className="hero-pill">📚 Book Library</span>
          <span className="hero-pill">✏️ Quick Notes</span>
          <span className="hero-pill">🌸 AniList sync</span>
          <span className="hero-pill">🎯 Trakt sync</span>
          <span className="hero-pill">🎞️ Letterboxd import</span>
          <span className="hero-pill">🤖 Custom ChatGPT GPT</span>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how-it-works" className="hero-section" style={{ paddingTop: 0 }}>
        <div className="diagram-container">
          {/* Animated connection lines */}
          <svg className="connections-svg" viewBox="0 0 1000 480" preserveAspectRatio="none">
            {/* Left incoming → hub */}
            <path d="M 220 50  Q 375 50,  460 240" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            <path d="M 220 130 Q 360 130, 460 240" stroke="#c4c2ba" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
            <path d="M 220 210 Q 360 210, 460 240" stroke="#c4c2ba" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
            <path d="M 220 290 Q 360 290, 460 240" stroke="#c4c2ba" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
            <path d="M 220 370 Q 375 370, 460 240" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            {/* Hub → right canvas */}
            <path d="M 540 240 Q 625 50,  780 55"  stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            <path d="M 540 240 Q 625 130, 780 135" stroke="#c4c2ba" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
            <path d="M 540 240 Q 625 210, 780 215" stroke="#c4c2ba" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
            <path d="M 540 240 Q 625 290, 780 295" stroke="#c4c2ba" strokeWidth="1.5" strokeDasharray="4 6" fill="none" />
            <path d="M 540 240 Q 625 370, 780 375" stroke="#d1cfc7" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
          </svg>

          <div className="diagram-grid" style={{ minHeight: "440px" }}>
            {/* ── LEFT: Data sources ── */}
            <div className="diagram-column" style={{ gap: "10px" }}>
              <span className="feature-num" style={{ alignSelf: "flex-start", marginBottom: "-4px" }}>INCOMING</span>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#ede9fe", fontSize: "15px" }}>🎯</div>
                <div className="node-text">
                  <div className="node-title">Trakt API</div>
                  <div className="node-desc">Shows & movies — OAuth sync</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#dbeafe", fontSize: "15px" }}>🌸</div>
                <div className="node-text">
                  <div className="node-title">AniList OAuth</div>
                  <div className="node-desc">Anime progress sync</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#dcfce7", fontSize: "15px" }}>🎞️</div>
                <div className="node-text">
                  <div className="node-title">Letterboxd CSV</div>
                  <div className="node-desc">Watch history file import</div>
                </div>
              </div>

              <div className="diagram-node" style={{ border: "1.5px solid #10b981", boxShadow: "0 4px 12px rgba(16,185,129,0.1)" }}>
                <div className="node-icon" style={{ backgroundColor: "#10b981", color: "#fff", fontSize: "15px" }}>💬</div>
                <div className="node-text">
                  <div className="node-title">ChatGPT Mobile</div>
                  <div className="node-desc">Custom GPT integration</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#fef9c3", fontSize: "15px" }}>✏️</div>
                <div className="node-text">
                  <div className="node-title">Manual Entry</div>
                  <div className="node-desc">Expenses, books, notes</div>
                </div>
              </div>
            </div>

            {/* ── CENTER: Hub ── */}
            <div className="center-hub" style={{ alignSelf: "center" }}>
              <div className="center-hub-ring" />
              <BentoLogo size={28} color="#ffffff" />
              <span className="hub-label">Hub</span>
            </div>

            {/* ── RIGHT: Your canvas ── */}
            <div className="diagram-column" style={{ gap: "10px" }}>
              <span className="feature-num" style={{ alignSelf: "flex-start", marginBottom: "-4px" }}>YOUR CANVAS</span>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#d1b89a", fontSize: "15px" }}>🎬</div>
                <div className="node-text">
                  <div className="node-title">Unified Watchlist</div>
                  <div className="node-desc">Anime · movies · shows</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#fde8e4", fontSize: "15px" }}>📊</div>
                <div className="node-text">
                  <div className="node-title">Bento Analytics</div>
                  <div className="node-desc">Spending breakdowns</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#fee2e2", fontSize: "15px" }}>📈</div>
                <div className="node-text">
                  <div className="node-title">Salary Cycle View</div>
                  <div className="node-desc">Custom pay-period trends</div>
                </div>
              </div>

              <div className="diagram-node" style={{ border: "1.5px solid #10b981" }}>
                <div className="node-icon" style={{ backgroundColor: "#10b981", color: "#fff", fontSize: "15px" }}>💡</div>
                <div className="node-text">
                  <div className="node-title">Intelligent AI</div>
                  <div className="node-desc">Recommendations & tips</div>
                </div>
              </div>

              <div className="diagram-node">
                <div className="node-icon" style={{ backgroundColor: "#f0fdf4", fontSize: "15px" }}>📚</div>
                <div className="node-text">
                  <div className="node-title">Book Library & Notes</div>
                  <div className="node-desc">Reading list + scratchpad</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="features-section">
        <span className="features-section-label">What's inside</span>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-num">01</span>
            <div className="feature-icon">💸</div>
            <h3 className="feature-title">Expense Ledger</h3>
            <p className="feature-desc">
              Log daily transactions, tag categories, and instantly see spending breakdowns. Set a custom salary start day and filter analytics to your actual pay period — not just calendar months.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-num">02</span>
            <div className="feature-icon">🎬</div>
            <h3 className="feature-title">Unified Watchlist</h3>
            <p className="feature-desc">
              Sync your AniList anime library and Trakt movie/show history in one tap. Track episode progress, update status, and push changes back to the source — bidirectional sync, no duplicates.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-num">03</span>
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Book Library & Notes</h3>
            <p className="feature-desc">
              Search OpenLibrary/Google Books to add items, track reading progress, and maintain a Markdown scratchpad. Everything auto-saves to your private Firestore.
            </p>
          </div>
          <div className="feature-card" style={{ backgroundColor: "#f0fdf4" }}>
            <span className="feature-num" style={{ color: "#10b981" }}>04</span>
            <div className="feature-icon" style={{ backgroundColor: "#10b981", color: "#fff" }}>💬</div>
            <h3 className="feature-title">ChatGPT Mobile Integration</h3>
            <p className="feature-desc">
              Sync a custom GPT directly with your dashboard API (OpenAPI spec included). Log expenses, update watchlist items, request detailed spending analytics, and get personalized movie or book recommendations on the go for free.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">4</span>
          <span className="stat-label">Core modules</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">3</span>
          <span className="stat-label">API integrations</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">₹0</span>
          <span className="stat-label">Self-host cost</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">MIT</span>
          <span className="stat-label">License</span>
        </div>
      </div>

      {/* ─── Setup section ─── */}
      <section id="setup" className="setup-section">
        <div className="setup-container">
          <div>
            <span className="hero-badge" style={{ backgroundColor: "#f4f3ec", marginBottom: "28px" }}>Minimal Setup</span>
            <h2 className="hero-title" style={{ fontSize: "40px", textAlign: "left", marginBottom: "40px" }}>
              If you can clone a repo,<br />
              <span className="serif-italic">you can self-host this.</span>
            </h2>
            <div className="setup-step">
              <span className="step-number">1</span>
              <div>
                <h4 className="step-title">Fork & deploy to Vercel</h4>
                <p className="step-desc">Click the deploy button in the GitHub README. Vercel sets up CI/CD automatically in under 2 minutes.</p>
              </div>
            </div>
            <div className="setup-step">
              <span className="step-number">2</span>
              <div>
                <h4 className="step-title">Create a Firebase project</h4>
                <p className="step-desc">Add your Firebase config as Vercel env vars. Firestore and Auth initialize on first login — no manual schema setup.</p>
              </div>
            </div>
            <div className="setup-step">
              <span className="step-number">3</span>
              <div>
                <h4 className="step-title">Connect your API keys</h4>
                <p className="step-desc">Optionally add AniList, Trakt, and TMDb keys to unlock full sync. Everything else works without them.</p>
              </div>
            </div>
          </div>

          <div className="browser-mockup">
            <div className="browser-header">
              <div className="browser-dot" style={{ backgroundColor: "#ff5f56" }} />
              <div className="browser-dot" style={{ backgroundColor: "#ffbd2e" }} />
              <div className="browser-dot" style={{ backgroundColor: "#27c93f" }} />
            </div>
            <div className="browser-body">
              <div className="mock-sidebar">
                <div style={{ height: "14px", backgroundColor: "#1c1b18", borderRadius: "4px" }} />
                <div style={{ height: "8px", width: "80%", backgroundColor: "#eae8e0", borderRadius: "4px", marginTop: "10px" }} />
                <div style={{ height: "8px", width: "65%", backgroundColor: "#eae8e0", borderRadius: "4px" }} />
                <div style={{ height: "8px", width: "70%", backgroundColor: "#eae8e0", borderRadius: "4px" }} />
              </div>
              <div className="mock-main">
                <div className="mock-grid">
                  <div className="mock-card">
                    <div style={{ height: "6px", width: "40px", backgroundColor: "#eae8e0", marginBottom: "6px", borderRadius: "3px" }} />
                    <div style={{ height: "14px", width: "70px", backgroundColor: "#1c1b18", borderRadius: "3px" }} />
                  </div>
                  <div className="mock-card">
                    <div style={{ height: "6px", width: "30px", backgroundColor: "#eae8e0", marginBottom: "6px", borderRadius: "3px" }} />
                    <div style={{ height: "14px", width: "50px", backgroundColor: "#b3666b", borderRadius: "3px" }} />
                  </div>
                  <div className="mock-card">
                    <div style={{ height: "6px", width: "40px", backgroundColor: "#eae8e0", marginBottom: "6px", borderRadius: "3px" }} />
                    <div style={{ height: "14px", width: "60px", backgroundColor: "#e39282", borderRadius: "3px" }} />
                  </div>
                </div>
                <div className="mock-chart">
                  <div style={{ height: "8px", width: "80px", backgroundColor: "#eae8e0", alignSelf: "flex-start", marginBottom: "8px", borderRadius: "3px" }} />
                  <div className="mock-bar-container">
                    <div className="mock-bar" style={{ height: "40px" }} />
                    <div className="mock-bar" style={{ height: "70px", backgroundColor: "#1c1b18" }} />
                    <div className="mock-bar" style={{ height: "55px", backgroundColor: "#d1b89a" }} />
                    <div className="mock-bar" style={{ height: "20px" }} />
                    <div className="mock-bar" style={{ height: "85px", backgroundColor: "#1c1b18" }} />
                    <div className="mock-bar" style={{ height: "60px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Three-way pricing ─── */}
      <section id="pricing" className="pricing-section">
        <span className="hero-badge">Three ways in</span>
        <h2 className="hero-title" style={{ fontSize: "44px", marginBottom: "12px" }}>
          Pick your setup.<br />
          <span className="serif-italic">All are welcome.</span>
        </h2>
        <p className="hero-subtitle" style={{ marginBottom: 0 }}>
          No feature gates. No paywalls on your own data. Use the hosted version, self-deploy for full privacy, or fork and make it yours.
        </p>

        <div className="pricing-three-grid">
          {/* ── Card 1: Cloud hosted ── */}
          <div className="plan-card">
            <span className="plan-badge">Free · Now</span>
            <p className="plan-name">Cloud Hosted</p>
            <p className="plan-price">₹0 <span className="plan-price-note">/ now</span></p>
            <p className="plan-desc">
              Sign in instantly and use my shared Vercel + Firebase instance. No setup, no downloads. Free right now — if traffic grows I may add ads or a small fee to cover hosting.
            </p>
            <div className="plan-divider" />
            <ul className="plan-features">
              <li><span className="fi-yes">✓</span> Instant access, zero setup</li>
              <li><span className="fi-yes">✓</span> Google sign-in</li>
              <li><span className="fi-yes">✓</span> Always updated</li>
              <li><span className="fi-warn">○</span> Shared hosting instance</li>
              <li><span className="fi-warn">○</span> May add ads / fee later</li>
            </ul>
            {authError && (
              <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "8px 12px", fontSize: "12px", color: "#dc2626", marginBottom: "12px" }}>
                {authError}
              </div>
            )}
            <button className="plan-cta" onClick={onLogin} disabled={!firebaseAuthReady}>
              Sign in with Google →
            </button>
          </div>

          {/* ── Card 2: Self-hosted (featured) ── */}
          <div className="plan-card featured">
            <span className="plan-badge">Recommended · Free Forever</span>
            <p className="plan-name">Self-Hosted</p>
            <p className="plan-price">₹0 <span className="plan-price-note">forever</span></p>
            <p className="plan-desc">
              Deploy your own instance on Vercel + Firebase in ~5 minutes. Your expenses, watchlist, and notes stay entirely in your private database — never shared, never monetised.
            </p>
            <div className="plan-divider" />
            <ul className="plan-features">
              <li><span className="fi-yes">✓</span> Your data, your servers</li>
              <li><span className="fi-yes">✓</span> Private Firebase database</li>
              <li><span className="fi-yes">✓</span> Zero ads, forever</li>
              <li><span className="fi-yes">✓</span> Free on Firebase Spark plan</li>
              <li><span className="fi-yes">✓</span> Full env control</li>
            </ul>
            <a href="https://github.com/fal3n-4ngel/personal-dashboard#readme" target="_blank" rel="noopener noreferrer" className="plan-cta plan-primary">
              View Setup Guide →
            </a>
          </div>

          {/* ── Card 3: Fork & build ── */}
          <div className="plan-card">
            <span className="plan-badge">MIT License</span>
            <p className="plan-name">Fork & Build</p>
            <p className="plan-price" style={{ fontSize: "26px", letterSpacing: "-0.5px" }}>Open Source</p>
            <p className="plan-desc">
              Clone the full repo, gut it, add your own modules, redesign it. Built on Next.js + Firebase — a solid base for any personal dashboard or productivity app.
            </p>
            <div className="plan-divider" />
            <ul className="plan-features">
              <li><span className="fi-yes">✓</span> Full codebase access</li>
              <li><span className="fi-yes">✓</span> MIT licensed</li>
              <li><span className="fi-yes">✓</span> Next.js + Firebase stack</li>
              <li><span className="fi-note">→</span> PRs & feedback welcome</li>
              <li><span className="fi-note">→</span> ⭐ Star if it helped you</li>
            </ul>
            <a href="https://github.com/fal3n-4ngel/personal-dashboard" target="_blank" rel="noopener noreferrer" className="plan-cta">
              View on GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer-wrap">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="footer-logo">
                <BentoLogo size={18} color="#1c1b18" />
                Phub Dashboard
              </a>
              <p className="footer-desc">
                A private tracking dashboard for media watchlists, daily expenses, book reading, and notes. Built for self-hosters and privacy-first users.
              </p>
              <p className="footer-byline">
                Built by <a href="https://github.com/fal3n-4ngel" target="_blank" rel="noopener noreferrer">@fal3n-4ngel</a>
              </p>
            </div>

            <div>
              <span className="footer-col-label">Dashboard</span>
              <ul className="footer-link-list">
                <li><span className="footer-link-item" onClick={onLogin}>Expense Ledger</span></li>
                <li><span className="footer-link-item" onClick={onLogin}>Media Watchlist</span></li>
                <li><span className="footer-link-item" onClick={onLogin}>Book Library</span></li>
                <li><span className="footer-link-item" onClick={onLogin}>Quick Notes</span></li>
                <li><a href="/gpt" className="footer-link-item">ChatGPT Plugin</a></li>
              </ul>
            </div>

            <div>
              <span className="footer-col-label">Resources</span>
              <ul className="footer-link-list">
                <li>
                  <a href="https://github.com/fal3n-4ngel/personal-dashboard" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                    GitHub Repo ↗
                  </a>
                </li>
                <li>
                  <a href="https://github.com/fal3n-4ngel/personal-dashboard#readme" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                    Self-Host Guide ↗
                  </a>
                </li>
                <li>
                  <a href="/api/openapi.json" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                    OpenAPI Spec ↗
                  </a>
                </li>
                <li>
                  <a href="https://github.com/fal3n-4ngel/personal-dashboard/issues" target="_blank" rel="noopener noreferrer" className="footer-link-item">
                    Report an Issue ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bar">
            <div className="footer-bar-text">
              <span>© {new Date().getFullYear()} Personal Hub</span>
              <span className="footer-sep">·</span>
              <span>MIT License</span>
              <span className="footer-sep">·</span>
              <a href="https://github.com/fal3n-4ngel" target="_blank" rel="noopener noreferrer" style={{ color: "#9c9a92", textDecoration: "none" }}>@fal3n-4ngel</a>
            </div>
            <div className="footer-status">
              <div className="footer-green-dot" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
