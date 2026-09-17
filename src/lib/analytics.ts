import posthog from "posthog-js";

// Analytics is entirely opt-in and gated behind two independent switches:
//   1. A PostHog project key must be configured (VITE_POSTHOG_KEY). Without
//      one there is nothing to send events to, so we no-op everywhere and
//      never show a consent prompt.
//   2. The visitor must have granted analytics consent (see consent.ts).
// Nothing is captured, and PostHog is never loaded, until both are true.
//
// Session replay and broad autocapture are intentionally disabled — only the
// named product events in this file are ever sent.

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const POSTHOG_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || "https://us.i.posthog.com";

export function isAnalyticsConfigured(): boolean {
  return !!POSTHOG_KEY;
}

let initialized = false;

export function initAnalyticsIfConsented() {
  if (initialized || !POSTHOG_KEY) return;
  if (!hasAnalyticsConsent()) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    persistence: "localStorage",
  });
  initialized = true;
}

export function shutdownAnalytics() {
  if (!initialized) return;
  posthog.reset();
  initialized = false;
}

// ---- Consent ----
// The consent decision itself is stored in localStorage unconditionally —
// remembering "the visitor said no" is strictly necessary/functional storage
// and doesn't require its own consent, the same way a cookie-consent cookie
// is exempt under PECR.
const CONSENT_KEY = "project-razor-analytics-consent";

export type ConsentState = "granted" | "denied" | null;

export function getAnalyticsConsent(): ConsentState {
  const raw = localStorage.getItem(CONSENT_KEY);
  return raw === "granted" || raw === "denied" ? raw : null;
}

export function hasAnalyticsConsent(): boolean {
  return getAnalyticsConsent() === "granted";
}

export function setAnalyticsConsent(granted: boolean) {
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  if (granted) {
    initAnalyticsIfConsented();
  } else {
    shutdownAnalytics();
  }
}

// ---- Identity ----
// Reconciles the anonymous pre-signup distinct_id with the authenticated
// user so the lesson_started -> signup_completed funnel survives the
// anon->auth transition. posthog-js's identify() merges the current
// anonymous device id into the identified user automatically.
export function identifyUser(userId: string) {
  if (!initialized) return;
  posthog.identify(userId);
}

// ---- Events ----
export type AnalyticsEvent =
  | { name: "lesson_started"; props: { lesson_id: string } }
  | { name: "lesson_1_1_completed"; props?: Record<string, never> }
  | { name: "signup_wall_shown"; props: { lesson_id: string } }
  | { name: "signup_started"; props?: Record<string, never> }
  | { name: "signup_completed"; props?: Record<string, never> }
  | { name: "anon_progress_migrated"; props: { lesson_count: number } };

export function track(event: AnalyticsEvent) {
  if (!initialized) return;
  posthog.capture(event.name, event.props);
}
