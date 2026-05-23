# Twitter / X — Launch thread

**Optimal time** : Tuesday-Thursday, 14:00-17:00 UTC (~9am-12pm ET, peak engagement)
**Format** : 7-9 tweet thread, demo GIF in tweet 1, link in tweet 7+, no link in tweet 1 (algorithm penalty)

---

## Pre-thread checklist

- [ ] Demo GIF ready (under 4 MB, looped, made WITH ClipCraft)
- [ ] Screenshot of DevTools Network tab during conversion (showing 0 file upload)
- [ ] Screenshot of the OG image
- [ ] Pin the thread to profile for 7 days

---

## Tweet 1 (HOOK — no link, must have media)

```
I just shipped a video converter that NEVER uploads your file.

→ Drop a video
→ Get a GIF / MP3 / compressed clip in seconds
→ All in your browser. Zero upload. Open DevTools to verify.

100% free. No watermark. No signup.

Here's how it works ↓
```

📎 *Attach: the demo GIF*

---

## Tweet 2 (PROBLEM)

```
Every "free online converter" does one of these:

❌ Paywalls you on the 2nd file
❌ Adds a watermark
❌ Caps at 100MB
❌ Uploads your file to their servers (privacy nightmare for work content)
❌ UX from 2010

I needed a tool I could use on a corporate screencast without uploading.
```

---

## Tweet 3 (SOLUTION)

```
The solution: run ffmpeg directly in the browser, compiled to WebAssembly.

ffmpeg.wasm has been viable since Chrome 96 (2021). With cross-origin isolation headers, it runs multi-threaded and is ~2-3x faster than naive single-thread.

Your file never touches a server. It can't — there isn't one.
```

---

## Tweet 4 (PROOF)

```
The "no upload" claim is verifiable.

Open DevTools → Network tab → drop a video → convert.

You see:
1. The initial app load (~3MB gzipped)
2. A one-time ~25MB ffmpeg engine download (cached forever)
3. Then nothing. Zero outgoing requests with your file.
```

📎 *Attach: DevTools Network screenshot*

---

## Tweet 5 (WHAT IT DOES)

```
Four tools, one page:

🎬 Video → GIF (Twitter/Discord-optimized presets)
🎵 Extract audio as MP3
🗜️ Compress to share over Slack/email
🔄 Convert MP4 ↔ WebM ↔ MOV

Plus optional trim ("Mark IN / Mark OUT" on the video).

All client-side. All free. All forever.
```

---

## Tweet 6 (BUILD STORY)

```
14 days from idea to launch. $0 spent.

Stack:
- Next.js 16 static export
- Tailwind v4
- ffmpeg.wasm 0.12 (from unpkg public CDN)
- Vercel Hobby (free tier)
- Zero backend, zero database, zero auth

Open source: github.com/FreemaX94/clipcraft
```

---

## Tweet 7 (LINK + CTA)

```
Try it now: clipcraft.vercel.app

Built in public — drop me a reply with what feature you'd want next.

Also: if a screen recording in your tab right now would be useful as a GIF for a tweet, this is the easiest 30 seconds you'll spend today.
```

---

## Tweet 8 (TECHNICAL DEEP DIVE — optional)

```
Tech notes for the curious:

→ COEP "credentialless" (not "require-corp") so cross-origin OG images work
→ ffmpeg core served from unpkg to keep my Vercel under 100GB/mo bandwidth
→ palettegen+paletteuse for high-quality GIFs (no banding)
→ Total bundle: 1.1MB, loads engine lazily on first convert
```

---

## Tweet 9 (SOFT ASK)

```
If you find this useful:

⭐ Star the repo: github.com/FreemaX94/clipcraft
🔁 RT this thread (helps a ton for indie projects)
☕ ko-fi.com/clipcraft (zero pressure, just an option)

And tag a friend who's spent too long fighting CloudConvert paywalls.
```

---

## Quote-tweet variants (for amplification by other accounts)

If a developer/maker RTs:
> "If you've ever needed to make a quick GIF from a screencast for a tweet, this is the move."

If a privacy-focused account RTs:
> "Verified: zero outgoing requests in DevTools during conversion. This is how 'no upload' should be done."

---

## Reply templates for common comments

**"How is this different from gifski / ezgif?"**
> gifski is excellent but CLI/desktop install. ezgif is web but uploads your file + ads + paywalls. ClipCraft is the "web + no upload + no ads + free" intersection.

**"25MB download is huge."**
> Yep — and unavoidable, that's just the size of ffmpeg compiled to WASM. It's a one-time download cached forever. If you do >1 conversion in your life, the math wins.

**"Will you accept donations?"**
> ko-fi.com/clipcraft — but seriously, no pressure. I'd rather you RT the thread than send $2.

**"Open source license?"**
> MIT. Fork it, host it, white-label it, whatever.
