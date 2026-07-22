"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Auth, GoogleAuthProvider as GoogleAuthProviderClass, signInWithPopup as signInWithPopupFn } from "firebase/auth";
import { SITE_URL } from "@/lib/site";
import { useOrigin } from "@/hooks/useOrigin";

/* ─── AI Assistant Integration Guide ───
 * Walks through connecting the dashboard API to a Custom Agent (ChatGPT Custom GPT, Gemini Gems, Claude Projects, etc.) via Actions:
 * Import the OpenAPI schema, then authenticate with a Firebase ID token.
 * Requires sign-in so the user can copy a fresh token straight from here. */

interface AgentUser {
  displayName: string | null;
  email: string;
}

interface AuthApi {
  auth: Auth;
  GoogleAuthProvider: typeof GoogleAuthProviderClass;
  signInWithPopup: typeof signInWithPopupFn;
}

export default function AssistantIntegrationPage() {
  const [authApi, setAuthApi] = useState<AuthApi | null>(null);
  const [user, setUser] = useState<AgentUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const origin = useOrigin();
  const [copied, setCopied] = useState<string>("");
  const [tokenBusy, setTokenBusy] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    (async () => {
      try {
        const res = await fetch("/api/auth/config");
        if (!res.ok) throw new Error("Could not load Firebase configuration.");
        const config = await res.json();

        const { initializeApp, getApps } = await import("firebase/app");
        const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } = await import("firebase/auth");

        const appName = "dashboard-client";
        const apps = getApps();
        const app = apps.find((a) => a.name === appName) || initializeApp(config, appName);
        const auth = getAuth(app);
        setAuthApi({ auth, GoogleAuthProvider, signInWithPopup });

        unsubscribe = onAuthStateChanged(auth, (fbUser) => {
          setUser(fbUser ? { displayName: fbUser.displayName, email: fbUser.email || "" } : null);
          setAuthLoading(false);
        });
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : "Could not load Firebase configuration.");
        setAuthLoading(false);
      }
    })();

    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const schemaUrl = `${origin || SITE_URL}/api/openapi.json`;

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((prev) => (prev === key ? "" : prev)), 2500);
    } catch {
      setAuthError("Clipboard access was blocked — copy manually instead.");
    }
  }

  // Always mint a fresh token (force refresh) so the full ~1h lifetime is
  // available after pasting it into the Agent's auth settings.
  async function copyToken() {
    if (!authApi?.auth?.currentUser) return;
    setTokenBusy(true);
    try {
      const token = await authApi.auth.currentUser.getIdToken(true);
      await copyText("token", token);
    } catch {
      setAuthError("Could not refresh the token. Try signing in again.");
    } finally {
      setTokenBusy(false);
    }
  }

  async function copyPermanentKey() {
    if (!authApi?.auth?.currentUser) return;
    setTokenBusy(true);
    try {
      const key = authApi.auth.currentUser.refreshToken;
      await copyText("perm_key", key);
    } catch {
      setAuthError("Could not retrieve key. Try signing in again.");
    } finally {
      setTokenBusy(false);
    }
  }

  async function signIn() {
    if (!authApi) return;
    try {
      await authApi.signInWithPopup(authApi.auth, new authApi.GoogleAuthProvider());
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : "Sign-in failed.");
    }
  }

  const agentInstructions = `You are my personal dashboard assistant. You manage two things through the API actions:

1. Expenses — when I mention spending money ("spent 450 on lunch", "uber was 320"), log it with createExpense. Infer a sensible category (Food, Transport, Rent, Shopping, Entertainment, Health, Other) and reuse existing ones from listExpenseCategories when they fit. Amounts are INR. Use today's date unless I say otherwise. When I ask about my spending, use listExpenses with filters and summarise clearly.

2. Watchlist — when I mention wanting to watch something, add it with addWatchlistItem (status plan_to_watch). When I say I watched/finished episodes, update progress or status with updateWatchlistItem — look up the item id via listWatchlistItems first. Ratings are out of 10.

Always confirm what you logged in one short line. Never invent ids — fetch them first.`;

  const examplePrompts = [
    "Log 450 for lunch at the office cafe",
    "I spent 1,200 on groceries and 300 on an auto today",
    "How much did I spend on food this month?",
    "Add Dune: Part Two to my watchlist",
    "I just finished episode 8 of Frieren — update it",
    "What am I currently watching?",
  ];

  const CODE_CLASS = "rounded-[5px] bg-bg-secondary px-[7px] py-0.5 font-mono text-xs break-all";
  const BENTO_CARD = "rounded-card border border-border-subtle bg-bg-card p-6 shadow-subtle";
  const BTN_PRIMARY = "rounded-md border border-text-primary bg-text-primary text-[13px] font-medium text-white transition-all duration-200 hover:border-[#2e2d27] hover:bg-[#2e2d27] disabled:cursor-not-allowed disabled:opacity-50";
  const BTN_SECONDARY = "rounded-md border border-border-subtle bg-transparent text-[13px] font-medium text-text-primary transition-all duration-200 hover:bg-bg-primary disabled:cursor-not-allowed disabled:opacity-50";

  const stepBadge = (n: number) => (
    <span className="inline-flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-text-primary text-[13px] font-bold text-white">{n}</span>
  );

  return (
    <div className="min-h-screen bg-bg-primary px-5 py-10">
      <div className="mx-auto flex max-w-195 flex-col gap-5">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 22H22L12 2ZM12 6L18.8 19.6H5.2L12 6Z" fill="var(--text-primary)"/></svg>
            <span className="text-[19px] font-bold tracking-[-0.5px]">PHub Dashboard</span>
          </div>
          <Link href="/" className="mb-0 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-text-secondary no-underline transition-all duration-200 hover:bg-bg-primary hover:text-text-primary">← Back to dashboard</Link>
        </div>

        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.5px]">Connect AI Assistant</h1>
          <p className="mt-2 text-sm leading-[1.6] text-text-secondary">
            Turn this dashboard into a custom AI Agent or Custom GPT action so you can log expenses and manage your
            watchlist by chatting — &ldquo;spent 450 on lunch&rdquo;, &ldquo;add Dune to my watchlist&rdquo;, done.
          </p>
        </div>

        {authError && (
          <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3.5 py-2.5 text-xs text-[#dc2626]">
            {authError}
          </div>
        )}

        {/* Step 1 */}
        <div className={`${BENTO_CARD} flex gap-4`}>
          {stepBadge(1)}
          <div className="min-w-0 flex-1">
            <h2 className="mb-1.5 text-[15px] font-semibold">Create a Custom GPT or AI Agent</h2>
            <p className="text-[13px] leading-[1.7] text-text-secondary">
              In your preferred LLM provider (ChatGPT Explore GPTs, Gemini Gems, or Claude Projects), initiate a new custom assistant creation. Keep sharing set to <strong>Only me</strong> — this agent will hold a token to your personal data.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className={`${BENTO_CARD} flex gap-4`}>
          {stepBadge(2)}
          <div className="min-w-0 flex-1">
            <h2 className="mb-1.5 text-[15px] font-semibold">Import the API schema</h2>
            <p className="mb-3 text-[13px] leading-[1.7] text-text-secondary">
              In your agent&apos;s developer settings under <strong>Actions</strong> or <strong>Capabilities</strong>, choose to import a schema from a URL and paste the link below. The LLM provider will discover the expense and watchlist API actions automatically.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={CODE_CLASS}>{schemaUrl}</span>
              <button onClick={() => copyText("schema", schemaUrl)} className={`${BTN_SECONDARY} px-3 py-1.5 text-xs`}>
                {copied === "schema" ? "✓ Copied" : "Copy URL"}
              </button>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className={`${BENTO_CARD} flex gap-4`}>
          {stepBadge(3)}
          <div className="min-w-0 flex-1">
            <h2 className="mb-1.5 text-[15px] font-semibold">Authenticate with your token</h2>
            <p className="mb-3 text-[13px] leading-[1.7] text-text-secondary">
              In the action&apos;s <strong>Authentication</strong> settings choose <strong>API Key</strong>, set
              Auth Type to <strong>Bearer</strong>, and paste your personal token. The API only ever reads or
              writes data belonging to the account this token was issued for.
            </p>

            {authLoading ? (
              <p className="text-xs text-text-muted">Checking sign-in…</p>
            ) : user ? (
              <div className="flex flex-col gap-3">
                <p className="text-xs text-text-secondary">
                  Signed in as <strong>{user.displayName || user.email}</strong>
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button onClick={copyPermanentKey} disabled={tokenBusy} className={`${BTN_PRIMARY} px-4 py-2 text-xs`}>
                    {tokenBusy ? "Generating…" : copied === "perm_key" ? "✓ Permanent Key Copied" : "Copy Permanent API Key (Never Expires)"}
                  </button>
                  <button onClick={copyToken} disabled={tokenBusy} className={`${BTN_SECONDARY} px-4 py-2 text-xs`}>
                    {tokenBusy ? "Generating…" : copied === "token" ? "✓ Token Copied" : "Copy 1-Hour ID Token"}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={signIn} disabled={!authApi} className={`${BTN_PRIMARY} px-4 py-2 text-xs`}>
                Sign in to get your token
              </button>
            )}

            <div className="mt-3.5 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3.5 py-2.5 text-xs leading-[1.6] text-[#166534]">
              <strong>Permanent API Key:</strong> Use the Permanent API Key for custom GPTs, Claude Projects, or automated AI Agents. It never expires and auto-refreshes in the background. Treat the key like a password — do not share it publicly.
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className={`${BENTO_CARD} flex gap-4`}>
          {stepBadge(4)}
          <div className="min-w-0 flex-1">
            <h2 className="mb-1.5 text-[15px] font-semibold">Teach the Agent how to behave</h2>
            <p className="mb-3 text-[13px] leading-[1.7] text-text-secondary">
              Paste this into the agent&apos;s <strong>Instructions</strong> or <strong>System Instructions</strong> field:
            </p>
            <pre className="max-h-65 overflow-y-auto rounded-lg bg-bg-secondary p-3.5 font-mono text-[11.5px] leading-[1.6] whitespace-pre-wrap wrap-break-word text-text-primary">{agentInstructions}</pre>
            <button onClick={() => copyText("instructions", agentInstructions)} className={`${BTN_SECONDARY} mt-2.5 px-3 py-1.5 text-xs`}>
              {copied === "instructions" ? "✓ Copied" : "Copy instructions"}
            </button>
          </div>
        </div>

        {/* Step 5 */}
        <div className={`${BENTO_CARD} flex gap-4`}>
          {stepBadge(5)}
          <div className="min-w-0 flex-1">
            <h2 className="mb-1.5 text-[15px] font-semibold">Try it out</h2>
            <p className="mb-3 text-[13px] leading-[1.7] text-text-secondary">
              Save the agent and start chatting. Things that should just work:
            </p>
            <div className="flex flex-col gap-2">
              {examplePrompts.map((prompt) => (
                <div key={prompt} className="rounded-lg bg-bg-secondary px-3 py-2 text-[12.5px] text-text-primary">
                  &ldquo;{prompt}&rdquo;
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Self-hosting note */}
        <div className={BENTO_CARD}>
          <span className="mb-2.5 block font-mono text-[10px] font-semibold tracking-[0.8px] text-text-secondary uppercase">Self-hosting?</span>
          <p className="text-[13px] leading-[1.7] text-text-secondary">
            Deploy this app with your own <span className={CODE_CLASS}>FIREBASE_CONFIG</span> environment
            variable (your Firebase Web App config JSON) and publish the matching Firestore security
            rules from <span className={CODE_CLASS}>firestore.rules</span>. Then follow the same steps above
            against your own domain — the schema URL adapts automatically.
          </p>
        </div>

        <p className="pb-5 text-center text-[11px] text-text-muted">
          The raw schema is at <a href="/api/openapi.json" target="_blank" rel="noopener noreferrer" className="text-text-secondary">/api/openapi.json</a>.
        </p>
      </div>
    </div>
  );
}
