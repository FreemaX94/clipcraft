# Reddit — r/privacy

**Subreddit** : reddit.com/r/privacy (1.5M members)
**Rules** : strict on self-promotion. Frame as "tool I built because of THIS privacy problem", not "look at my product".
**Optimal time** : weekdays, 14:00-19:00 UTC
**Risk** : moderators may remove if perceived as self-promo. Lead with the problem.

---

## Title

```
Online video converters all upload your file. I made one that doesn't (verifiable in DevTools).
```

Alt:
```
I got tired of uploading my screen recordings to "free converters". Made one that runs entirely in the browser.
```

## Body

```markdown
Quick context: I'm a dev. Last month I needed to convert a screencast of an internal company demo into a GIF for our team Slack. Standard problem.

Every "online converter" — ezgif, CloudConvert, online-convert, Clideo — required me to upload the video to their servers. Reading their terms: "we keep your files for 24h for processing." For a screen recording of an unreleased product feature, that's a no.

I checked: there's no good private, web-based option. HandBrake is great but it's a 200MB install. The CLI ffmpeg is gatekept behind technical knowledge. Browser extensions for "video to GIF" all upload too.

So I built **ClipCraft** (https://clipcraft.vercel.app). It runs ffmpeg compiled to WebAssembly **inside your browser tab**. Your video file never leaves your laptop.

The "trust" question is fair, so the design lets you verify yourself:

1. Open the site
2. Open DevTools → Network tab
3. Drop a video
4. Run any conversion (GIF / audio extract / compress / format convert)
5. **You will see zero outgoing requests carrying your file.** The only requests are the initial app load and a one-time ~25MB download of the open-source ffmpeg engine from a public CDN.

The code is open source: https://github.com/FreemaX94/clipcraft — you can also clone and run locally with no internet.

What it collects:
- Anonymous page views (Vercel Analytics — no IP, no cookies, blockable with uBlock)
- That's it. No accounts, no emails, no payment info, no file metadata.

What it doesn't collect:
- Your videos. Ever.
- Your identity.
- Anything sold or shared with third parties.

Limitations:
- The first conversion is slow because the engine downloads (~25MB, then cached forever)
- Mobile Safari memory limits cap practical file size at ~200MB
- Multi-threaded ffmpeg requires browsers with COOP/COEP support (Chrome 96+, FF 109+, Safari 17.4+) — older browsers fall back to single-thread

Not asking for upvotes — just wanted to share with people who'd care about the use case. Happy to answer questions about the technical implementation or the threat model.

Detailed privacy page: https://clipcraft.vercel.app/privacy
```

---

## Reply templates

**"How do I know you're not lying about the no-upload claim?"**
> Three ways to verify:
> 1. DevTools Network tab while you convert. Zero outgoing requests with your file = proof.
> 2. Source code is on GitHub, MIT license. Read it, audit it, fork it.
> 3. The site uses static export — there's no API endpoint to POST a file TO, even if I wanted to.
> 
> I can lie in marketing. I can't lie in DevTools.

**"What about the Vercel-hosted side leaking my IP?"**
> Yes, Vercel sees your IP on the initial page load (same as any website). That's standard CDN logging. They don't see your videos because the videos never travel over HTTP after the initial app load. If you want to eliminate the IP exposure too, clone the repo and self-host (or use Tor).

**"Why ffmpeg.wasm and not native browser APIs?"**
> Because the native APIs aren't comprehensive. WebCodecs is improving but doesn't handle palette generation for high-quality GIFs, doesn't expose libx264 CRF presets for compression, etc. ffmpeg.wasm gives you the full ffmpeg surface area, which is what's needed for "real" conversions.

**"What's stopping a future update from adding upload?"**
> Two things: 1) the architecture (static export, no backend) would have to be torn down to add an upload endpoint — that's not a stealth change, you'd see it in the next release. 2) The repo is open source, so you can pin a version and host yourself if I ever betray the value prop.
```
