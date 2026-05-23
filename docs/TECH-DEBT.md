# TECH-DEBT — known shortcuts taken in the J1 MVP sprint

Every entry is **a deliberate shortcut taken to ship in 14 days**. Each one has a follow-up plan and a trigger condition.

Rule: refactor when this list reaches 5+ items OR when one item starts blocking new features.

---

## TD-001 — Trim UX uses "Mark IN / Mark OUT" buttons instead of a proper dual-handle slider
- **Where**: `clipcraft/app/page.tsx`, trim panel inside `loaded` state
- **What was done**: 2 buttons that capture `video.currentTime` into start/end state
- **Why shortcut**: dual-handle slider with frame-accurate seeking would have taken another half-day, and the button approach is actually fine for typical use cases (5-10s clips)
- **Follow-up**: implement a real range slider component (or pull `radix-ui/Slider`) when trim usage > 30% of conversions (per analytics).
- **Trigger**: user feedback "the trim UX is clunky" mentioned more than 3 times, OR analytics shows >30% of conversions use trim.

## TD-002 — ffmpeg.wasm fallback to single-thread silently degrades performance
- **Where**: `clipcraft/lib/ffmpeg.ts`, `ensureLoaded` function
- **What was done**: detect `crossOriginIsolated`, swap between `@ffmpeg/core-mt` and `@ffmpeg/core`, log a one-line message to the load progress callback
- **Why shortcut**: it's a "soft warning" rather than blocking. Production should always be multi-thread (vercel.json sets COOP/COEP).
- **Follow-up**: surface a visible UI banner in single-thread mode ("Tip: deploy with COOP/COEP to get 2-3x faster conversions"). Currently this only matters in `next dev`.
- **Trigger**: if more than 10% of users in production report slow conversions despite using modern browsers, investigate header propagation.

## TD-003 — No fallback when unpkg/jsdelivr is down
- **Where**: `clipcraft/lib/ffmpeg.ts`, `loadCoreFromCDN`
- **What was done**: hardcoded unpkg URL. If unpkg goes down, conversions break.
- **Why shortcut**: unpkg downtime is rare and historically brief.
- **Follow-up**: implement a fallback chain (unpkg → jsdelivr → self-hosted on Vercel as last resort). Self-hosting eats Vercel bandwidth but only when other CDNs fail.
- **Trigger**: first time unpkg outage causes a user-visible failure.

## TD-004 — No error boundary in React tree
- **Where**: `clipcraft/app/layout.tsx` (no `error.tsx` either)
- **What was done**: errors in `convert()` get caught locally and shown via `status.kind === "error"`. Crashes outside that path show a default Next.js error page.
- **Why shortcut**: the app is one page; the error surface is small.
- **Follow-up**: add `app/error.tsx` for graceful global error handling, especially for the OOM crash path on mobile.
- **Trigger**: any production crash report.

## TD-005 — Vercel Analytics events overflow at 2 500 events/month
- **Where**: Vercel Hobby free tier limit
- **What was done**: nothing — at our scale, 2 500 events/month is plenty
- **Why shortcut**: we won't hit this for the first few months
- **Follow-up**: switch to Plausible self-hosted on Cloudflare (free) or Umami when we cross 2 000 events/month
- **Trigger**: Vercel Analytics dashboard shows usage > 80% of monthly cap

## TD-006 — No automated tests
- **Where**: literally everywhere
- **What was done**: skipped Vitest/Playwright test setup entirely. Validated via headless browser at the end of J1.
- **Why shortcut**: app surface is small (1 main flow + 1 privacy page). Hand-testing on 3 browsers covers it.
- **Follow-up**: add Playwright E2E for the 4 main flows when we start accepting PRs. Add Vitest unit tests for `lib/ffmpeg.ts` arg builders.
- **Trigger**: first external PR, or first regression in main flow.

## TD-007 — Mobile detection is heuristic, not robust
- **Where**: `clipcraft/app/page.tsx` — there's a 500 MB soft limit but no specific mobile UX
- **What was done**: same UI on desktop and mobile. No "mobile mode" with reduced features.
- **Why shortcut**: validation Phase 2 showed desktop is the primary target. Mobile is a bonus.
- **Follow-up**: add `navigator.userAgent` + memory check, show a "best on desktop" banner if mobile + file > 100 MB.
- **Trigger**: mobile bounce rate > 60% in Vercel Analytics.

## TD-008 — OG image is build-time static, not personalized
- **Where**: `clipcraft/app/opengraph-image.tsx`
- **What was done**: one OG image for the whole site
- **Why shortcut**: nothing to personalize at MVP stage
- **Follow-up**: when we add /docs or /blog, add per-route OG images.
- **Trigger**: adding more than 3 public routes.

---

## Items considered but rejected (intentionally NOT done)

These would NOT be tech debt because they're principled non-features:

- **No accounts / auth.** Not a shortcut, an architectural commitment.
- **No file upload to a server.** Not a shortcut, the whole pitch.
- **No watermark on outputs.** Not a shortcut, a value commitment.
- **No "Pro" tier with locked features.** Not a shortcut, see [DECISIONS.md D004](../DECISIONS.md) on monetization.
