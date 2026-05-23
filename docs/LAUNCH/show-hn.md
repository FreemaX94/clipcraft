# Show HN — ClipCraft

**Sub-reddit / Site** : news.ycombinator.com — submission type "Show HN"
**Optimal time to post** : Tuesday-Thursday, 8:00-10:00 UTC (=3-5am ET)
**Account requirements** : minimum 5 karma, 24h+ account age

---

## Title (max 80 chars)

```
Show HN: ClipCraft – Convert videos to GIF/MP3 in your browser, zero upload
```

Alternative shorter:
```
Show HN: ClipCraft – Video to GIF, 100% in your browser
```

## Body (HN doesn't allow markdown — plain text)

```
Hi HN,

I built ClipCraft because I was tired of CloudConvert paywalling me on a 200MB
screen recording I wanted to turn into a GIF for a GitHub README. The "free
online converters" world is a graveyard of watermarks, paywalls hidden behind
trial counters, and "your file uploaded successfully — would you like to pay
to continue?" dark patterns.

Worse: most of these tools want you to upload your file to their servers. If
the video is a screencast of a work product, a customer demo, or anything
NDA-flavored, that's a problem.

ClipCraft does five things — video to GIF (5 presets including TikTok 9:16
and Instagram 1:1), audio extract (MP3), compression (with optional 9:16
or 1:1 crop), format conversion (MP4/WebM/MOV), and single-frame snapshot
to PNG. Optional trim and speed control (0.5x/1.5x/2x/4x, pitch-preserved
audio via chained atempo) on top. It runs ffmpeg.wasm in
your browser. Your file is never uploaded. You can verify it yourself: open
DevTools, go to the Network tab, drop a video, run a conversion. You'll see
the initial app load and a one-time ~25MB fetch of the WebAssembly engine
from unpkg, then zero outgoing requests carrying your video.

Stack:
- Next.js 16 static export, hosted on Vercel
- @ffmpeg/ffmpeg 0.12 (uses SharedArrayBuffer for multi-thread when COOP/COEP
  headers are set)
- Tailwind v4 for the UI
- No backend, no database, no accounts. ~1.1 MB initial bundle.

The whole thing is open source: https://github.com/FreemaX94/clipcraft

Try it: https://clipcraft.vercel.app

I'd love feedback on:
1. Did ffmpeg.wasm load reasonably fast for you? (the 25MB worker is the
   biggest UX risk)
2. Did the multi-thread mode work? (you should see "crossOriginIsolated:
   true" in the console)
3. Any conversion presets you'd want that I missed?

Caveats and known limits:
- Mobile Safari is iffy on files over 200MB (memory limits). I'm showing a
  warning when that's likely.
- The 25MB initial download is unavoidable — that's just the size of ffmpeg
  compiled to WebAssembly. It's cached after first load.
- I'm using unpkg as a public CDN to offload that 25MB from my Vercel free
  tier; if unpkg goes down, conversions break (working on a fallback).

Not monetized today, but planning to add a Ko-fi button for support. I'm
explicitly NOT adding paywalls or feature gates.

Thanks for any feedback.
```

---

## First reply prep (post within 5 min)

```
A couple of things I forgot to mention in the post:

- The whole site (including the worker) respects "credentialless" COEP rather
  than "require-corp", so cross-origin OG images and external embeds still
  work. This is what allows me to load ffmpeg.wasm from unpkg instead of
  serving it myself.

- I tested on Chrome/Firefox/Safari on macOS, Chrome/Edge on Windows, and
  iOS Safari. Single-thread fallback kicks in if crossOriginIsolated is false
  (e.g. embedded in an iframe, or with a wrong header config).

Happy to dig into any of the details.
```

## Comment replies to anticipate

**"Why not just install HandBrake / ffmpeg locally?"**
> Fair question. The pitch is "I have a 5MB video to convert RIGHT NOW and
> I'm on a fresh laptop or a colleague's machine." A 25MB browser one-time
> load beats 200MB+ HandBrake install + learning curve for occasional needs.
> Also: works on Chromebooks, locked-down corporate machines, etc.

**"What about gifski / ezgif?"**
> ezgif uploads your file to their servers and shows ads. gifski is excellent
> but CLI-only and Mac/Windows install. ClipCraft is the middle ground: same
> tier of quality (palettegen+paletteuse, lanczos), zero install, zero upload.

**"How is this different from Modfy / Snipclip / [other ffmpeg.wasm app]?"**
> Honest answer: it isn't fundamentally. The differences are:
> 1. Multi-tool in one page (most ffmpeg.wasm apps do one thing).
> 2. Modern design (most others have 2019 React aesthetic).
> 3. Explicit "verify zero upload in DevTools" framing as the lead value prop.
> 4. Open source. If you want a different combination of features, fork it.

**"How does the WebAssembly multi-threading work without SharedArrayBuffer
on some setups?"**
> Two ffmpeg-core builds exist: `@ffmpeg/core-mt` (multi-thread, needs
> crossOriginIsolated=true) and `@ffmpeg/core` (single-thread fallback).
> I detect `window.crossOriginIsolated` at load time and pick the right one.
> In production (Vercel with my custom headers), multi-thread kicks in.
> In dev / single-thread, you get the same correctness, just ~2-3x slower.
