# Reddit — r/SideProject

**Subreddit** : reddit.com/r/SideProject
**Rules** : self-promotion welcome, but show what you learned. Include retrospective vibe.
**Optimal time** : Monday-Tuesday, 12:00-15:00 UTC (~8am ET, peak afternoon EU)

---

## Title

```
I built a video → GIF converter that runs 100% in your browser (no upload). Here's what I learned in 14 days.
```

Alt:
```
14 days, $0 budget: I built ClipCraft, a browser-side video converter that never uploads your file
```

## Body (markdown OK on Reddit)

```markdown
Hey r/SideProject 👋

For the past two weeks I've been building **ClipCraft** — a video to GIF / MP3 / compress / convert tool that runs entirely in the browser using `ffmpeg.wasm`. Your file never leaves your laptop.

**Live**: https://clipcraft.vercel.app
**Code**: https://github.com/FreemaX94/clipcraft

### The why

I tried to make a GIF for a GitHub README last month. CloudConvert wanted £120/year. Online-convert blocked a 110KB file with "took more than 2 minutes." ezgif works but you have to upload your screencast (which often contains stuff you don't want on a third-party server).

So I built the version I wished existed.

### The stack (100% free tier, $0 spent)

- **Next.js 16** static export, hosted on **Vercel Hobby** (free)
- **ffmpeg.wasm** loaded from **unpkg** (public CDN, free, offloads the 25MB engine from Vercel)
- **Tailwind v4** + raw React (no shadcn/ui — overkill for 4 buttons)
- **Vercel Analytics** (free)
- No backend, no DB, no accounts — there's literally nothing to store

Build size: 1.1 MB total. Loads ffmpeg.wasm lazily on first conversion (~25MB, cached forever).

### 4 things I learned

1. **`output: 'export'` in Next 16 disables async headers.** I burned an hour wondering why my COOP/COEP weren't applying. Solution: put them in `vercel.json` instead.

2. **`COEP: credentialless` > `require-corp` for cross-origin.** The standard advice for SharedArrayBuffer is COEP=require-corp, but that breaks every image you don't control. credentialless lets you have crossOriginIsolated AND load OG images from anywhere. Supported in Chrome 96+, FF 109+, Safari 17.4+.

3. **Static export ignores dynamic routes by default.** I added a `sitemap.ts` and an `opengraph-image.tsx` and got a build error. Fix: `export const dynamic = "force-static"` in each.

4. **The biggest UX risk isn't conversion speed — it's the first load.** 25MB of WebAssembly is unavoidable. Wrap it in a friendly "Downloading the engine, one time only" loader and people are patient. Without the loader they bail.

### Free tier validation

At my scale (Vercel Hobby, 100GB bandwidth/mo):
- 100 users/mo → 0.3 GB transferred (the 1.1MB app)
- 10,000 users/mo → 30 GB (still under)
- 100,000 users/mo → 300 GB → would need to migrate to Cloudflare Pages (no bandwidth limit)

ffmpeg.wasm is on unpkg so it doesn't count.

### What's shipped beyond the initial scope

- 5 GIF presets including **TikTok/Reels (9:16 vertical)** and **Instagram (1:1 square)** — none of the other ffmpeg.wasm tools I checked surface these as one-click options
- **Speed control** (0.5× / 1.5× / 2× / 4×) on GIF, Compress, Convert — pitch-preserved audio via chained `atempo` filters. The #1 expected Twitter virality unlock, also missing from competitors.
- **Vertical 9:16 / Square 1:1 aspect** on Compress + Convert (already had it on GIF). One-click "social-ready" output for any tool that outputs video.
- **Snapshot frame** as a 5th tool: pause the video, click to export the current frame as a high-quality PNG. Designed for GitHub README thumbnails and social share images.
- **"Try with a sample video"** button so visitors who land without a video at hand can still evaluate in one click
- Auto-branded 404 page, custom favicon, PWA manifest (installable as an app)

### What's next

- Concat multiple clips into one GIF
- Multi-frame extraction zipped (single-frame already shipped via Snapshot)
- Custom watermark removal (paint-to-remove area)
- Per-tool aspect ratio for the Snapshot tool

Would love feedback. The angles I'm worried about:

- Is the privacy framing ("verify zero upload in DevTools") believable, or does it feel like marketing fluff?
- Does the 4-tool layout feel cluttered or convenient?

Thanks for reading 🙏
```

---

## Reply templates for common comments

**"Why not just use HandBrake?"**
> HandBrake is great but it's a 200MB install. ClipCraft is for when you need a one-off conversion fast and don't want to install anything.

**"How do I trust you when you say no upload?"**
> Don't trust me, verify: open DevTools → Network tab → drop a video → convert. You'll see the initial app/engine load and then zero outgoing requests. The repo is open source — you can also clone and run locally with no internet.

**"What about ezgif?"**
> ezgif is dominant for a reason — it works. But it uploads your file (visible in their Network tab), shows ads, and the UX is from 2010. ClipCraft is the "private + modern" alternative.

**"Will this stay free?"**
> Yes. The site has no costs to operate at indie scale (Vercel free tier, ffmpeg.wasm on a public CDN). If I ever monetize, it'll be Ko-fi donations + maybe a "Pro" tier with extra presets — never paywalls on the core 4 tools.
