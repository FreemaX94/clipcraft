---
name: prod-audit
description: Runs a full production health audit on https://clipcraft-app.vercel.app. Checks HTTP/headers, cross-origin isolation, all key routes (/, /privacy, /sitemap.xml, /robots.txt, /opengraph-image, /icon, /apple-icon, /manifest.webmanifest), OG meta tags, JS bundle sizes, 404 page. Reports anomalies and suggests fixes. Use before any launch milestone or weekly during Phase 6.
---

# Production Audit — ClipCraft

Runs in 60 seconds. No browser needed (pure curl + grep).

## When to invoke

- User says "audit prod", "check prod", "vérif prod", "is everything OK?"
- Before any launch post (HN/Reddit/PH/Twitter) — confirm nothing is broken publicly
- Weekly maintenance during Phase 6
- After any significant deploy

## What to do

Execute the audit script below and report findings.

### Step 1 — Headers & cross-origin isolation (CRITICAL for ffmpeg.wasm)

```bash
echo "=== / headers ===" 
curl -sI https://clipcraft-app.vercel.app/ | grep -iE "HTTP|cross-origin|strict-transport|x-content|cache-control|x-vercel-cache"
```

**Must see:**
- `HTTP/1.1 200 OK`
- `Cross-Origin-Embedder-Policy: credentialless` (or require-corp)
- `Cross-Origin-Opener-Policy: same-origin`
- `Strict-Transport-Security` (HSTS enabled)
- `X-Vercel-Cache: HIT` (preferred, MISS is acceptable on cold)

**Red flags:**
- 401 → Deployment Protection re-enabled (PATCH api.vercel.com to disable)
- COEP/COOP missing → vercel.json not applied (check Vercel project settings)

### Step 2 — All key routes return 200

```bash
for path in / /privacy /sitemap.xml /robots.txt /opengraph-image /icon /apple-icon /manifest.webmanifest; do
  code=$(curl -sI "https://clipcraft-app.vercel.app$path" -o /dev/null -w "%{http_code}")
  echo "$code  $path"
done
```

**Must:** every line shows `200`. Any 4xx/5xx is a regression to investigate.

### Step 3 — 404 returns the custom branded page

```bash
curl -s https://clipcraft-app.vercel.app/not-a-real-page | grep -c "got cut from the edit"
```

Must return `1` (the branded copy is present). If 0, the not-found.tsx isn't being picked up.

### Step 4 — OG meta tags integrity

```bash
curl -s https://clipcraft-app.vercel.app/ | grep -oE '<meta (property|name)="(og:|twitter:)[^"]+" content="[^"]+"'
```

Should list at least: og:title, og:description, og:url, og:image, og:image:width=1200, og:image:height=630, twitter:card=summary_large_image, twitter:title, twitter:image.

### Step 5 — Title & H1 present

```bash
curl -s https://clipcraft-app.vercel.app/ | grep -oE '<title[^>]*>[^<]+</title>'
curl -s https://clipcraft-app.vercel.app/ | grep -oE '<h1[^>]*>[^<]+'
```

Title should be: "ClipCraft — Convert, compress and GIF-ify videos in your browser".
H1 should start with "Convert, compress, GIF-ify videos."

### Step 6 — JS bundle size sanity check

```bash
curl -s https://clipcraft-app.vercel.app/ | grep -oE 'src="/_next/static/chunks/[^"]+\.js"' | while read script; do
  url="https://clipcraft-app.vercel.app${script#src=\"}"
  url="${url%\"}"
  size=$(curl -sI "$url" | grep -i content-length | grep -oE '[0-9]+')
  echo "$size $script"
done | awk '{sum+=$1; print} END {print "TOTAL:", sum, "bytes"}'
```

Acceptable range: 500 KB – 800 KB uncompressed. Above 1 MB = investigate for bundle bloat.

### Step 7 — Sitemap & robots.txt point to canonical URL

```bash
curl -s https://clipcraft-app.vercel.app/sitemap.xml | grep -c "clipcraft-app.vercel.app"
curl -s https://clipcraft-app.vercel.app/robots.txt
```

Sitemap should contain 2 URLs both with `clipcraft-app.vercel.app`. Robots.txt should `Allow: /` and reference the sitemap.

## Output format

After running all 7 steps, report in this format:

```
PROD AUDIT — clipcraft-app.vercel.app — YYYY-MM-DD HH:MM UTC

✅ Headers OK (COOP/COEP present)
✅ All 8 routes 200
✅ Branded 404 OK
✅ OG tags OK (12 found)
✅ Title + H1 OK
✅ JS bundle 642 KB (under 800 KB threshold)
✅ Sitemap canonical URLs OK

NO ISSUES.
```

Or:

```
PROD AUDIT — ...

✅ Headers OK
❌ /sitemap.xml returned 404 — was probably broken in the last deploy
⚠️ JS bundle now 1.2 MB (was 642 KB last week) — investigate dependency added

FIX RECOMMENDED:
- Check recent commits for sitemap.ts changes
- Run `npm ls --depth=0` to spot new deps
```

## Anti-patterns

- ❌ Don't run this skill in a loop (it's a snapshot, not monitoring)
- ❌ Don't auto-fix without flagging the issue first — let the user decide
- ❌ Don't skip Step 1 (COOP/COEP) — if missing, the whole product breaks silently for users (single-thread fallback is much slower)
