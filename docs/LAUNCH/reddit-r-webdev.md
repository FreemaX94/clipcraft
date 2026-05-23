# Reddit — r/webdev

**Subreddit** : reddit.com/r/webdev (1.7M members)
**Rules** : Showcase Saturday is the safest day for self-promotion. Otherwise, lead with technical value, not pitch.
**Optimal time** : Saturday 14:00-18:00 UTC for Showcase Saturday

---

## Title (Showcase Saturday)

```
[Showcase] ClipCraft — video → GIF/MP3/compressed/converted, runs 100% in browser via ffmpeg.wasm. Open source. Forever free.
```

## Title (technical post, any day)

```
TIL: you can run ffmpeg in the browser and skip your server entirely. Here's how I built ClipCraft on $0.
```

## Body

```markdown
**Live**: https://clipcraft.vercel.app
**Repo**: https://github.com/FreemaX94/clipcraft

I wanted to build a "online video converter" without the usual paywall/upload/watermark tax. Turned out you can just run ffmpeg in the browser now (`ffmpeg.wasm` is mature enough as of 2026). Here are the interesting bits:

### Architecture

- **Next.js 16** with `output: 'export'` → pure static, deployable anywhere (Vercel Hobby in my case)
- **No backend, no DB, no auth.** The promise is "your file never reaches my server" — there literally isn't a server.
- **ffmpeg.wasm** loaded lazily on first conversion (~25 MB one-time, cached forever)
- Engine served from **unpkg public CDN**, not from my Vercel — keeps bandwidth under 100GB/mo even at 30K users/mo

### Three gotchas worth knowing

**1. SharedArrayBuffer needs cross-origin isolation, which needs COOP+COEP headers.**

`ffmpeg.wasm` multi-thread mode uses SharedArrayBuffer for performance. The browser only gives you SAB if `crossOriginIsolated === true`, which requires:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp  -- OR --  credentialless
```

`require-corp` breaks every cross-origin image without CORS headers (so basically: Twitter cards, OG images from other sites, etc.). Use `credentialless` instead — it gives you SAB AND lets you load cross-origin images. Chrome 96+, FF 109+, Safari 17.4+.

**2. Next.js `output: 'export'` disables async `headers()`.**

If you put headers in `next.config.ts` async functions and then statically export, they get silently dropped. I lost an hour to this. Fix: put them in `vercel.json` (or your platform's equivalent).

```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
      { "key": "Cross-Origin-Embedder-Policy", "value": "credentialless" }
    ]
  }]
}
```

**3. Static export requires `force-static` on dynamic routes.**

`app/sitemap.ts` and `app/opengraph-image.tsx` looked fine in dev but failed `next build` with `output: 'export'`. Fix: add `export const dynamic = "force-static"` to each.

### The privacy angle is real

Open DevTools → Network → drop a video → convert. You see ONE initial fetch (the app + engine from CDN) and then nothing. No POST with your file. No telemetry on the file content. It's a stronger guarantee than any "we promise we don't keep your data" privacy policy.

### What I'd love feedback on

- The 25MB initial WebAssembly load is unavoidable. Did the friendly loader make it tolerable for you, or do you bail when you see "downloading"?
- Is there a format / preset I'm missing? (I've got Twitter-optimized GIF, Discord GIF, MP3 extract, 3 compress levels, MP4↔WebM↔MOV)
- The trim UX uses "Mark IN / Mark OUT" buttons that capture the video element's currentTime. Workable, or should I bite the bullet and build a proper dual-handle slider?

Roadmap: vertical 9:16 GIFs for IG/TikTok, "speed up 2x" preset for Twitter virals, optional concat (multiple clips into one GIF).
```

---

## Reply templates

**"Have you tried [competitor X using ffmpeg.wasm]?"**
> Yes, did the competitive scan. There are ~7 of these (Modfy, GifConvert.io, Snipclip…). None have broken through. The differentiators I'm aiming for: 1) 4 tools in one page vs single-purpose, 2) 2026 design vs 2019 React, 3) explicit "verify in DevTools" privacy framing.

**"Why not Vite + React instead of Next.js for a static SPA?"**
> Considered it. Picked Next.js for: built-in metadata API (SEO/OG), `next/og` for dynamic OG image generation at build time, file-based routing for the /privacy page. Bundle size penalty was ~50KB, acceptable for the DX win.

**"How do you make money?"**
> I don't, currently. There's a Ko-fi button for donations. If I ever add monetization, it'll be commission-based (Gumroad/Polar) or a tiny Pro tier — never paywalls on the core tools.
```
