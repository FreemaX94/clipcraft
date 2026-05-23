# LinkedIn — Launch post

**Tone** : professional but human. LinkedIn rewards story + lesson > product pitch.
**Optimal time** : Tuesday-Thursday, 08:00-10:00 UTC (early ET morning) or 16:00-18:00 UTC.
**Format** : ~200-300 words, no link in the first paragraph (algorithm), use line breaks for readability.

---

## Post body

```
I shipped a side project in 14 days, on a strict $0 budget.

It's called ClipCraft — a video converter that runs entirely in the browser. No upload, no signup, no watermark. You drop a video, you get a GIF / MP3 / compressed clip. The file never reaches a server, which means I have nothing to leak, nothing to lose, and nothing costing me money in operations.

Why this matters professionally:

→ For creators and marketers: a one-stop tool to make tweet-ready GIFs from screencasts without uploading internal content to a third-party server.

→ For developers writing documentation: GIFs for GitHub READMEs in 30 seconds, no installation.

→ For people fighting "free trial" patterns: this is what "free" actually looks like — no usage limit, no upgrade screen, no paywall ambush.

Three lessons from the build:

1. The "indie product" cost curve is now flat. Vercel, GitHub, public CDNs — running an MVP for thousands of users costs $0/month, structurally. The bottleneck is creativity and distribution, not infrastructure.

2. The competitive moat for tools like this is design and trust, not features. Seven similar products exist. None have broken through. The opportunity is being the one that's actually nice to use.

3. WebAssembly has quietly become serious. The browser can run ffmpeg at near-native speed. Things that "needed a backend" five years ago no longer do.

If you want to try it: clipcraft.vercel.app
Open source: github.com/freemanlopez94140/clipcraft

I'd love feedback from anyone who's launched a $0-stack product and learned what works for distribution. Comments open ↓
```

---

## Tags / Hashtags (3-5 max)

```
#indiehackers #webassembly #buildinpublic #saas #privacy
```

---

## Comment replies

**"What was the hardest part?"**
> Getting cross-origin isolation headers right so ffmpeg.wasm could use multi-threading. The Next.js docs and the ffmpeg.wasm docs each only cover half of it. Cost me a full afternoon.

**"How much time per day on this?"**
> 3-4 hours / day, 14 days. About 50 total hours from idea to ship.

**"Would you recommend this stack for other side projects?"**
> Yes, for any project that doesn't need persistent user state. Next.js static + Vercel free + a public CDN for heavy assets = unbeatable. The minute you need accounts/DB, the calculus changes.
