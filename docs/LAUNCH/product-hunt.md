# Product Hunt — Launch page

**Launch time** : 00:01 PST (= 08:01 UTC) on launch day. The earlier in the PT day, the more time you have to climb.
**Day choice** : Tuesday-Thursday. Avoid Monday (overcrowded) and Friday (low engagement).
**Risk** : Product Hunt's audience skews towards SaaS with logins. A 100%-static no-login tool is somewhat counter-cultural. Lean into that as a feature.

---

## Product name

```
ClipCraft
```

## Tagline (max 60 chars)

```
Convert, compress, GIF-ify videos. 100% browser. Zero upload.
```

## Description (max 260 chars on the topic page summary)

```
Drop any video. Get a viral-ready GIF, an MP3 extract, or a compressed clip in seconds. Runs entirely in your browser via ffmpeg.wasm — your file never reaches a server. Open source, forever free, no signup, no watermark.
```

---

## Long description (the main page body)

```markdown
**Why I built this**

Every "free online video converter" out there does one of these:
- Paywalls you on the second file ("upgrade to convert more")
- Adds a watermark to the output
- Limits files to 100MB
- Uploads your file to their servers (which is a problem for any work content)
- Has a UI that hasn't been touched since 2014

I needed to turn a screen recording of an internal product demo into a GIF for a tweet. None of the existing options worked. So I built the version I wished existed.

**What ClipCraft does**

Four tools, one page:
🎬 Video → GIF (5 presets: Twitter, Discord, High-quality, TikTok/Reels 9:16 vertical, Instagram 1:1 square)
🎵 Extract audio as MP3 (3 quality presets)
🗜️ Compress to share over Slack/email (3 levels)
🔄 Convert formats (MP4 ↔ WebM ↔ MOV)

Plus optional **trim** (mark IN / mark OUT on the video) and **speed control** (0.5× / 1.5× / 2× / 4× — audio re-timed without pitch shift). And a "Try with a sample video" button so you can test in one click — no need to dig up a video to evaluate.

**The differentiator: it runs in your browser**

ClipCraft uses ffmpeg compiled to WebAssembly. The entire conversion happens inside your browser tab. Your video file never leaves your laptop. You can verify this yourself:

1. Open DevTools → Network tab
2. Drop a video, run a conversion
3. You'll see zero outgoing requests carrying your file

Stronger than any "we promise we don't keep your data" privacy policy.

**Free forever, for real**

- No accounts, no signup, no email collection
- No paywall, no feature gates, no watermark
- No usage limits
- Anonymous analytics only (Vercel Analytics — no cookies, blockable)

Open source on GitHub: https://github.com/FreemaX94/clipcraft

**Tech, briefly**

Next.js 16 static export → Vercel free tier. ffmpeg.wasm loaded from unpkg (public CDN) on first conversion (~25MB, then cached forever). Total bundle: 1.1MB. Multi-threaded mode when COOP/COEP headers are set (Chrome 96+, FF 109+, Safari 17.4+), single-thread fallback otherwise.

**Caveats**

- First conversion takes longer because the engine downloads (one-time)
- Mobile Safari has memory limits around 200MB
- This is v1 — feedback welcome

**Built in 14 days, $0 budget**

If you find it useful, a Ko-fi tip goes a long way: ko-fi.com/clipcraft
```

---

## Topics to add

```
- Developer Tools
- Video
- Privacy
- Open Source
- Productivity
- No-Code
```

---

## Maker's first comment (post within 2 min of launch)

```
Hi PH 👋

I'm the maker. A few things I want to flag upfront:

**What's not here**: no accounts, no login, no waitlist, no email collection. The site has no backend. There's literally nothing to sign up for. If you want to use it, you just use it.

**Why "zero upload" matters**: I tried building this 6 months ago and gave up because I assumed I'd need a beefy server. Turns out ffmpeg.wasm is mature now — it runs in any modern browser at usable speed. The browser becomes the server. Your file stays on your laptop.

**What I'd love feedback on**:
1. Did the 25MB initial engine download feel acceptable? (It's a one-time cost, cached forever, but I worry about first-impression bounce.)
2. The trim UX uses "Mark IN / Mark OUT" buttons that capture the video element's currentTime. Workable, or do you need a proper dual-handle slider?
3. What formats / presets did I miss? (I'd love to add 9:16 vertical for IG/TikTok next.)

**Roadmap**:
- Vertical / square presets for non-GIF tools (already on GIF — extending to MP4 compress/convert)
- Concat multiple clips into one GIF
- Frame extraction (PNG sequence)
- Maybe a desktop-class PWA install (manifest already in place)

Happy to answer any questions about the implementation, the architecture, or the privacy threat model.

Thanks for trying it 🙏
```

---

## Reply templates

**"Looks great, but the 25MB load is steep"**
> Agreed it's the biggest UX risk. Three things mitigate it: (1) it's a one-time cost — cached forever after, (2) it only loads when you click "Convert", not on page open, (3) the loader gives clear feedback. If you bounce before the first convert, the cost is just the 1.1MB app load.

**"Why not WebCodecs API instead of ffmpeg.wasm?"**
> WebCodecs is improving but it doesn't give you full ffmpeg surface area yet — no palette generation for high-quality GIFs, no libx264 CRF presets, no audio mux. ffmpeg.wasm is the pragmatic choice in 2026. When WebCodecs catches up, I'll likely migrate the simpler ops to it for a 25MB win.

**"Will you add accounts / cloud storage later?"**
> No accounts, ever. That's the whole point. If I want monetization, it'll be Ko-fi donations or a "Pro" with extra presets — never something that requires giving me data.

**"Is this iOS/Android friendly?"**
> Desktop is the primary target. Mobile works but has practical limits (~200MB on Safari, ~300MB on Chrome Android). If you're regularly converting on mobile, I'd love feedback on what feature set would be useful.
