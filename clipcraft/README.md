# ClipCraft

> Convert, compress, GIF-ify videos. Right in your browser. Zero upload.

ClipCraft is an in-browser video toolkit. Drop any video and get a GIF, an MP3 extract, a compressed clip, or a converted format. Everything runs locally via [`ffmpeg.wasm`](https://github.com/ffmpegwasm/ffmpeg.wasm). Your file never reaches a server.

**Live**: [clipcraft.vercel.app](https://clipcraft.vercel.app) *(coming soon)*

## What it does

| Tool | Output | Notes |
|------|--------|-------|
| Video → GIF | `.gif` | 3 presets: Twitter (5 MB), Discord (8 MB), High quality |
| Extract audio | `.mp3` | 3 bitrates: 192 / 128 / 96 kbps |
| Compress | `.mp4` (H.264) | 3 presets: Heavy (CRF 32), Balanced (CRF 26), Light (CRF 22) |
| Convert format | `.mp4` / `.webm` / `.mov` | H.264 / VP9 / H.264 codecs |

Plus optional **trim** on any tool, via "Mark IN / Mark OUT" buttons that capture the video's current playback time.

## Why

Every "free online video converter" out there does one of these:
- Paywalls you on the second file
- Adds a watermark
- Caps at 100 MB
- Uploads your file to their servers (a problem for any private/work content)
- Has a UX from 2014

ClipCraft is the privacy-respecting, modern, actually-free alternative. Verify "no upload" yourself: open DevTools → Network tab → run a conversion → see zero outgoing requests with your file.

## Stack

- [**Next.js 16**](https://nextjs.org) (App Router, static export, Turbopack)
- [**React 19**](https://react.dev) + [**Tailwind CSS v4**](https://tailwindcss.com)
- [`@ffmpeg/ffmpeg`](https://www.npmjs.com/package/@ffmpeg/ffmpeg) v0.12 — WebAssembly engine, served from [unpkg](https://unpkg.com) public CDN (one-time ~25 MB download, cached forever)
- [`@vercel/analytics`](https://www.npmjs.com/package/@vercel/analytics) — anonymous web analytics only

**Zero backend.** Zero database. Zero accounts. The app is a 1.1 MB static bundle.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

**Note**: in `next dev`, the COOP/COEP headers from `vercel.json` are not applied, so `ffmpeg.wasm` falls back to single-thread mode (slower but functional). The multi-threaded build kicks in on production deploys.

## Build & deploy

```bash
npm run build
```

This produces a static export in `out/`. Deploy to any static host: Vercel, Cloudflare Pages, GitHub Pages, Netlify, S3, etc.

For Vercel: pushing to GitHub with this repo linked to a Vercel project auto-deploys. The `vercel.json` at the root applies the required `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless` headers for multi-threaded ffmpeg.wasm.

## Architecture notes

### Why ffmpeg.wasm from a public CDN (and not from Vercel)

ffmpeg.wasm core is ~25 MB. Serving it from Vercel's free Hobby tier (100 GB bandwidth/month) would cap us around 4 K users/month. Serving it from a public CDN like unpkg or jsdelivr — which is what the `@ffmpeg/ffmpeg` v0.12 API supports natively via `coreURL` and `wasmURL` — keeps Vercel's bandwidth on the app only (~3 MB gzipped per first visit).

### Why `COEP: credentialless` instead of `require-corp`

Cross-origin isolation is required for `SharedArrayBuffer`, which `ffmpeg.wasm` uses for multi-threading. The default `require-corp` breaks any cross-origin resource without explicit CORS headers — that includes the unpkg-hosted wasm engine, OG images, Twitter cards, etc. `credentialless` gives the same isolation guarantees while still allowing cross-origin resources to load (without their credentials). Supported in Chrome 96+, Firefox 109+, Safari 17.4+.

### Why static export

The app has no server-side logic. Static export means deployment is portable (any CDN), there's no runtime cost, and the security surface is trivial (no API to compromise, no DB to leak, no auth to misconfigure).

## Project layout

```
clipcraft/
├── app/
│   ├── page.tsx              # The main SPA (drop zone + 4 tools + trim)
│   ├── layout.tsx            # Metadata, fonts, Vercel Analytics
│   ├── privacy/page.tsx      # Privacy policy + verification steps
│   ├── opengraph-image.tsx   # Generated OG image (1200×630)
│   ├── sitemap.ts            # Sitemap generator
│   └── globals.css           # Tailwind v4 directives
├── lib/
│   └── ffmpeg.ts             # FFmpeg singleton + lazy loader + presets + arg builders
├── public/
│   └── robots.txt
├── next.config.ts            # output: 'export' + images.unoptimized
├── vercel.json               # COOP/COEP headers
└── package.json
```

## Caveats and limitations

- **First conversion is slow.** The ~25 MB engine downloads once, then caches forever in the browser. Subsequent conversions are fast.
- **Mobile Safari has memory limits** around 200 MB of input file before it crashes. There's a 500 MB soft limit in the UI to protect desktop users.
- **No conversion progress on Trim-without-decode**: ffmpeg.wasm progress events are accurate when input/output durations match. With trim, progress jumps around.
- **No 9:16 / 1:1 aspect ratio presets** yet. Roadmap.

## Roadmap (not committed)

- Vertical 9:16 GIF and MP4 presets (Instagram Reels / TikTok)
- Speed up / slow down (0.5×, 1.5×, 2×)
- Concat multiple clips into one GIF
- Frame extraction (PNG sequence)
- PWA install with offline support

## Contributing

PRs welcome. Issues even more so — especially around the "first 25 MB load is slow" UX problem, which I don't have a great answer for yet.

## License

MIT.

## Support

If ClipCraft saved you 10 minutes of fighting paywalls, [Ko-fi](https://ko-fi.com/clipcraft) takes 30 seconds. Donations are optional and not gating any feature, now or ever.
