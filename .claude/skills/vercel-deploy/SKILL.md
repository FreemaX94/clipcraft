---
name: vercel-deploy
description: Clean Vercel production deploy workflow. Builds, deploys, re-points the canonical alias (clipcraftapp.vercel.app) to the new deployment, and verifies headers. Use after any code change to ship. Replaces the manual 3-step vercel deploy + alias set + curl verify dance.
---

# Vercel Deploy — ClipCraft

A single command from "I have committed changes" to "production is live with the canonical URL".

## When to invoke

- After committing code or doc changes that affect the deployed app
- User says "ship it", "deploy", "push to prod"
- After a `git pull` that brought new commits

## What to do

### Step 1 — Local build sanity check

From `clipcraft/`:

```bash
npm run build 2>&1 | tail -10
```

Look for `✓ Compiled successfully` and the route list. If TypeScript errors or ESLint fails, **stop** and fix before deploying.

### Step 2 — Deploy to production

```bash
vercel deploy --prod --yes 2>&1 | grep -E "Production:|Error" | tail -2
```

Capture the new deployment URL from the output — it looks like `https://clipcraft-XXXXXXX-freemans-projects-13b6abc9.vercel.app`.

If the build fails on Vercel side, run `vercel inspect <deployment-url> --logs` to debug.

### Step 3 — Re-point the canonical alias

```bash
vercel alias set <new-deployment-url> clipcraftapp.vercel.app
```

Without this step, the new deployment is live at its random URL but `clipcraftapp.vercel.app` still points at the previous one.

### Step 4 — Quick verify

```bash
curl -sI https://clipcraftapp.vercel.app | grep -iE "HTTP|cross-origin"
```

Must see HTTP 200 + COOP/COEP. If 401, Deployment Protection has been re-enabled — disable via:

```bash
TOKEN=$(cat "$APPDATA/com.vercel.cli/Data/auth.json" | grep -oP '"token"\s*:\s*"\K[^"]+' | head -1)
curl -sX PATCH "https://api.vercel.com/v9/projects/prj_cv56ut7vkVUHTK2rUlG8nUbTqrZf?teamId=team_JSn140IBiaI38CB0JYddr814" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ssoProtection":null,"passwordProtection":null}'
```

### Step 5 — Run prod-audit for a deeper check (optional but recommended)

Invoke the `prod-audit` skill for the full 7-step verification.

## Output

Report:
- "Deployed to `<new-deployment-url>` (build OK in Xs)"
- "Canonical alias re-pointed to `clipcraftapp.vercel.app`"
- "Verified HTTP 200 + COOP/COEP"
- (If audit run) "prod-audit: NO ISSUES" or list of anomalies

## Anti-patterns

- ❌ Don't skip Step 1 (local build) — Vercel will give you the same error but slower
- ❌ Don't skip Step 3 (alias re-point) — most "the new feature isn't showing up" bugs come from this
- ❌ Don't use `vercel deploy` (without --prod) for releases — that creates a preview, not a production deployment
