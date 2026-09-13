# Project Razor — Context & Current Task

> Working context for Claude Code. Self-contained: assume no prior knowledge beyond this file and the connected repo. Save at repo root as `CLAUDE.md` so it loads automatically.

## What this is

Project Razor is a gamified critical-thinking trainer — "Duolingo for spotting bad arguments." It teaches users to identify logical fallacies, cognitive biases, and bad-faith rhetorical tactics using real-world examples. Core learning loop: **Learn → Drill → Warzone → Gauntlet**. Solo founder (Billy) drives product; you handle implementation.

**One hard brand constraint:** intellectual honesty. The product teaches people to detect puffery and unverified claims, so its own copy must contain none. This matters most for legal pages and any user-facing text — draft from real facts, never invent. If a fact isn't available, ask; don't fill the gap.

## Stack

- **Frontend:** React + TypeScript + Vite (SPA)
- **Hosting:** Vercel
- **Backend:** Supabase — Postgres, Auth, Row Level Security (RLS)
- **Email:** Resend (transactional; server-side only)
- **DNS/domain:** Namecheap → `project-razor.com`
- **Analytics:** PostHog (to be wired — see task)

Key architectural facts: the Supabase **anon key is public by design** — RLS is the real access-control layer. Anonymous lesson progress is kept in `localStorage` and migrated to Supabase on signup so users never replay free content. Lesson 1.1 is free; a signup wall follows completion of 1.1.

## Current objective

Get the app relaunch-ready. Priorities are already triaged and decisions locked (below). Work in the execution order given. Produce reviewable code changes; production verification (deployed RLS, live analytics, real share/mobile checks) happens after but is not a reason to hold the code.

---

## Decisions locked — do not reopen

1. **Canonical domain = `www`.** Live state is apex→www with `https://www.project-razor.com` serving 200. Keep it. Align all OG/metadata URLs, preview-image URLs, and Supabase auth redirect URLs to the `www` host. Settle this first — it's upstream of social previews and auth.
2. **Analytics = PostHog, account-linked, email confirmation ON.** The success metric is **unique verified accounts**, not submitted forms. `signup_completed` fires only on a confirmed new account — never inferred from an error-free `signUp()` response. Session replay and broad autocapture stay **off**. Ship a consent mechanism appropriate to account-linked persistence: `localStorage` is storage under ICO/PECR, so a banner or a properly-fitted statistical-purposes basis is required — do **not** assume "no banner." Wire consent before events fire.
3. **Cross-browser signup recovery = out of scope for v1.** If a learner completes 1.1, signs up, then confirms email in a *different* browser, anonymous progress does not follow them. Same-device is the supported path. State this limitation as a known boundary; don't design around it now.

---

## Tasks, in execution order

### 1. Canonical domain → www
Confirm and align. Metadata, preview-image URLs, and Supabase auth redirect config all point to `https://www.project-razor.com`. Accept 301 or 308 as permanent redirects.
**Done when:** auth redirects and all absolute URLs resolve on the `www` host with no cross-host bounce.

### 2. Social preview (OG / Twitter)
Crawlers don't run JS — a Vite SPA's static `index.html` is what gets scraped, so client-injected meta tags are invisible to them. Current state: **no OG/Twitter tags** in `index.html`.
- Put complete OG + Twitter tags directly in `index.html` (static): `og:title`, `og:description`, `og:image` (absolute `https://www...` URL, 1200×630, <5MB, PNG/JPG), `og:url`, `og:type`, `twitter:card=summary_large_image`, `twitter:image`.
- Host the default preview image at a stable absolute URL.
- Scope = default site-wide preview only. Per-challenge dynamic OG images are a **separate future task** — do not build them here.
**Done when:** `curl -A "facebookexternalhit" https://www.project-razor.com` returns the tags in raw HTML; Facebook Sharing Debugger and X Card Validator pass clean. (Real iMessage/WhatsApp/Slack checks are production acceptance.)

### 3. Analytics + Bug A + Bug B — build together (same flow)

**Events** (define behaviour, then instrument):
| Event | Meaning |
|---|---|
| `lesson_started` | Visitor begins a lesson; prop `lesson_id` (use existing code ID `1-1`). Define repeat-attempt behaviour. |
| `lesson_1_1_completed` | First successful completion of 1.1 only; summary rerenders don't count. |
| `signup_wall_shown` | Eligible anonymous learner actually sees the wall. |
| `signup_started` | First deliberate interaction with the signup form this attempt. |
| `signup_completed` | Confirmed new account only. Never inferred from an error-free `signUp()`. |
| `anon_progress_migrated` | Guest progress successfully persisted to the account; no event on no-op or failure. |

Reconcile the anonymous ID to the user ID at signup so the funnel survives the anon→auth transition. Build a `lesson_started → signup_completed` funnel in PostHog.

**Bug A — signup handoff misroutes.** The completion wall's "Create free account" button opens `/auth`, which defaults to **Sign In**; post-auth users land at `/account`.
Fix: the wall opens the **signup** view directly; after authentication **and** successful migration, continue to Lesson 1.2 via a safe internal redirect.
Entry points: `src/pages/LessonFlow.tsx` (completion wall, ~L601–703), `src/pages/Auth.tsx`.

**Bug B — migration XP replay / cross-account leak.** Migration adds guest XP to the profile *separately* from progress rows; logout clears the migration flag while retaining browser progress. A later login on the same browser can replay XP or carry another account's local state into a new session.
Fix: make migration **idempotent** (no duplicate XP/progress on retry/replay); logout clears retained guest progress/flags so nothing bleeds into a subsequent different account; `anon_progress_migrated` fires only on a real, successful, non-duplicate persist.
Entry points: `src/contexts/CourseProgressContext.tsx`, `src/lib/api.ts` (progress persistence + migration).
**Verify Bug B with:** reload mid-flow · delayed email confirmation · duplicate-email submit · migration retry · **logout → login as a different account** — all with no duplicate progress or XP. This is the highest-risk item; treat the logout→different-account test as the gate before trusting the migration event.

### 4. Security — secrets + RLS
- **Secrets:** no `service_role` key anywhere in frontend code or any `VITE_`-prefixed env var (Vite exposes every `VITE_` var to the client). Resend key server-side only. Gate = **zero exposed privileged credentials**, confirmed by inspecting frontend references, build-time env names, built bundle, and any published source maps — reviewed without logging secret values. A `grep dist/` is useful triage, not the gate (deps contain words like `secret`/`resend`; real creds can appear unlabelled). Confirm where Resend is actually configured rather than assuming an app endpoint.
- **RLS:** RLS enabled on every public table (migrations enable it on `profiles` and `progress` — verify deployed state, not just migration files). INSERT uses `WITH CHECK`; UPDATE must enforce ownership on **both** existing and proposed rows (`USING` + `WITH CHECK`). A policy mentioning `auth.uid()` isn't sufficient if another permissive policy grants broader access. Test with fixtures for anonymous / user-A / user-B isolation; require absence of unauthorized read or mutation (an empty anon SELECT can be correct).
Migration reference: `supabase/migrations/20250101000000_initial_schema.sql`.

### 5. Mobile
Default buttons/inputs are 40px; nav links and the password-visibility toggle lack a padded target — below the 44px minimum. Fix shared controls + nav + password toggle.
**Done when:** Learn → Drill → Warzone → completion wall → signup → confirmation/return is fully usable at 375px (touch): no horizontal scroll, tap targets ≥44px, legible without zoom. Include keyboard-open layout, long-answer wrapping, disabled/submitted states, scrolling, progress retention. Re-run after CAPTCHA + legal links land.

### 6. Tier 2
- **Spam protection:** Cloudflare **Turnstile** via Supabase's supported CAPTCHA integration (site key public, secret in Supabase server-side config). A frontend-only honeypot doesn't protect direct calls to the public signup endpoint. Test expired/missing tokens and normal sign-in/password-reset.
- **Validation:** build on the existing Zod schema; verify Supabase rejects bad email/password through the real backend path before adding any separate endpoint.
- **Legal pages:** Privacy + Terms routes, linked in footer and at signup. Draft from real operating facts (operator name + contact, providers = Supabase/Resend/PostHog, retention/deletion process, audience, chosen analytics behaviour). Keep drafts reviewable before publishing. Agreeing to Terms / acknowledging Privacy ≠ consent to optional analytics.
- **CTA:** primary marketing action = "Start Lesson 1" → `/train/lesson/1-1`. Sign-in and library navigation secondary. Preserve the wall after 1.1.

### Later / conditional
Tier 3 (batched later): favicon, custom 404, broken-link sweep, meta titles/descriptions on indexable pages, page-load/Lighthouse pass, image compression. HTTPS is handled by Vercel — just keep the www redirect clean. Tier 4 (conditional): cookie consent is folded into task 3 above; sitemap/robots, alt text, colour contrast are deferred, not launch-gating.

---

## Needed from Billy before some steps finish (not blockers to starting)

- **PostHog** project/API key (or approval to create one).
- **Legal facts** for the Privacy/Terms drafts (operator + contact, retention/deletion process, confirm providers, audience).
- **Turnstile** Cloudflare site + secret key (secret → Supabase config).

Check for existing credentials/integrations in the repo/env before requesting new access.

## How Billy works

Casual and concise; prefers speed once direction is agreed. Short directional notes, expects you to interpret and execute. Flags logical inconsistencies directly and expects you to surface and correct your own errors. External-facing copy: prose, no bullet points, no puffery. Implementation handoffs like this one: structured with explicit definitions of done and non-goals is fine.

## Repo entry points (quick map)

- `index.html` — static head; OG tags go here (task 2)
- `src/pages/LessonFlow.tsx` (~L601–703) — lesson completion wall (Bug A)
- `src/pages/Auth.tsx` — auth page / signup-vs-signin default (Bug A)
- `src/contexts/CourseProgressContext.tsx` — progress state (Bug B)
- `src/lib/api.ts` — progress persistence + guest migration (Bug B)
- `supabase/migrations/20250101000000_initial_schema.sql` — schema + RLS (task 4)
