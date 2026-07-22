import React from "react";

interface OnboardingModalProps {
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  showInvestmentsTab: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  showOnboarding,
  setShowOnboarding,
  showInvestmentsTab,
}) => {
  if (!showOnboarding) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={() => setShowOnboarding(false)}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[540px] flex-col gap-[22px] overflow-y-auto rounded-card border border-border-subtle bg-bg-card p-8 shadow-subtle animate-[fadeInScale_0.15s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <svg width="34" height="34" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <rect x="1.6" y="1.6" width="7.2" height="7.2" rx="1.8" fill="var(--text-primary)" />
              <rect x="11.2" y="1.6" width="7.2" height="7.2" rx="1.8" fill="var(--text-primary)" opacity="0.55" />
              <rect x="1.6" y="11.2" width="7.2" height="7.2" rx="1.8" fill="var(--text-primary)" opacity="0.55" />
              <rect x="11.2" y="11.2" width="7.2" height="7.2" rx="1.8" fill="var(--text-primary)" opacity="0.85" />
            </svg>
            <div>
              <p className="text-lg leading-[1.2] font-bold tracking-[-0.3px]">Welcome to PHub</p>
              <p className="mt-0.5 font-mono text-[10px] font-semibold tracking-[0.8px] text-text-secondary uppercase">Personal Hub</p>
            </div>
          </div>
          <button
            onClick={() => setShowOnboarding(false)}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-bg-secondary p-2 text-text-muted"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <p className="-mt-2.5 text-[13px] text-text-secondary">Here's everything you've got in one place:</p>

        <div className="flex flex-col gap-3.5">
          {[
            { icon: "💸", bg: "#fde8e4", title: "Expense Ledger", desc: "Log transactions, tag categories, and set a custom salary-cycle day to see spending by pay period instead of calendar month." },
            ...(showInvestmentsTab ? [{ icon: "📈", bg: "#dcfce7", title: "Investments", desc: "Track equities, crypto, mutual funds, gold, and cash in one portfolio view." }] : []),
            { icon: "🎬", bg: "#ede9fe", title: "Watchlist", desc: "Movies, shows, and anime in one place — sync bidirectionally with AniList & Trakt, or import a Letterboxd CSV export." },
            { icon: "📚", bg: "#fef9c3", title: "Book Library", desc: "Search OpenLibrary to add books and track your reading progress." },
            { icon: "🔄", bg: "#dbeafe", title: "Subscriptions", desc: "Keep tabs on recurring monthly/yearly costs and your true effective monthly spend." },
            { icon: "📝", bg: "#f4f3ec", title: "Notes", desc: "A lightweight, auto-saving scratchpad for quick thoughts." },
            { icon: "🤖", bg: "#d1fae5", title: "AI Assistant", desc: "Connect ChatGPT, Claude, or Gemini via Permanent API Key & OpenAPI — log expenses or update your watchlist by chatting." },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-base"
                style={{ backgroundColor: f.bg }}
              >
                {f.icon}
              </div>
              <div>
                <p className="text-[13.5px] font-semibold">{f.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-normal text-text-secondary">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="/assistant"
            className="flex-[1_1_200px] rounded-md border border-border-subtle bg-transparent px-4 py-2 text-center text-[13px] font-medium text-text-primary no-underline transition-all duration-200 hover:bg-bg-primary"
          >
            Connect AI Agent →
          </a>
          <button
            onClick={() => setShowOnboarding(false)}
            className="flex-[1_1_200px] rounded-md border border-text-primary bg-text-primary px-4 py-2 text-[13px] font-medium text-white transition-all duration-200 hover:border-[#2e2d27] hover:bg-[#2e2d27]"
          >
            Let's go
          </button>
        </div>
      </div>
    </div>
  );
};
