# Indie Hackers — Launch post

**Site** : indiehackers.com/post
**Group** : "Show IH" (or just main feed)
**Optimal time** : Tuesday-Thursday, mid-day US

---

## Title

```
14 days, $0: I shipped ClipCraft — a video converter that runs in the browser (no upload, ever)
```

## Body

```markdown
👋 IH,

I'm sharing my launch from yesterday. The goal was to validate whether you can ship a useful indie product in <15 days on a strict $0 budget. Verdict: yes, but with caveats.

**What it is**: ClipCraft (https://clipcraft.vercel.app) — drop a video, get a GIF / MP3 / compressed clip / converted format. Everything runs in your browser via ffmpeg.wasm. Your file never reaches a server.

**Open source**: https://github.com/freemanlopez94140/clipcraft

---

## The 14 days

**Days 1-2: idea + validation**
Scored 10 ideas across 6 criteria (pain quotidien, faisable gratuit, wow factor, viralité, différentiation, time-to-MVP). ClipCraft won 53/60. Did competitive scan: ezgif does 6.7M visits/mo (massive market), but 7+ ffmpeg.wasm competitors already exist (Modfy, GifConvert.io, Snipclip, etc.) — none have broken through. Signal: market is big AND ungated.

**Day 3: architecture**
Decided on Next.js 16 + static export + Vercel Hobby + ffmpeg.wasm from unpkg. Critical decision: serve the 25MB ffmpeg engine from a public CDN instead of Vercel, otherwise I'd hit the 100GB/mo bandwidth limit at ~30K users/mo.

**Days 4-12: build**
4 tools (GIF, audio extract, compress, format convert) + optional trim. ~600 lines of React. Biggest time sink wasn't the conversion code — it was getting cross-origin isolation right so ffmpeg.wasm can use SharedArrayBuffer for multi-threading.

**Days 13-15: launch content**
Wrote tailored posts for HN, Reddit (×3), Twitter, Product Hunt, IH, LinkedIn. ~3000 words of copy.

---

## The economics

| Item | Cost |
|------|------|
| Vercel Hobby | $0/mo (100GB bandwidth, plenty for MVP) |
| GitHub | $0/mo (public repo) |
| unpkg CDN | $0/mo (public, serves the 25MB engine) |
| Vercel Analytics | $0/mo (2500 events free tier) |
| Domain | $0/mo (using `clipcraft.vercel.app`, will buy a .com if traction proves) |
| **TOTAL** | **$0/mo** structurally, at any scale below ~30K users |

If I cross 30K MAU, I'll have to migrate to Cloudflare Pages (no bandwidth cap) — but that's a "good problem to have" milestone, not a "need to pay" milestone.

---

## What I'd do differently

1. **Less time on the brainstorm.** I spent 2 hours scoring 10 ideas. The top 3 were all similar in score — could've picked any and gone. Anti-bikeshedding rule: 30 min max next time.

2. **Skip shadcn/ui on V1.** I planned to install it, didn't end up needing it for the 4 buttons + radio inputs. Tailwind v4 raw was enough.

3. **The 25MB ffmpeg load is unavoidable.** I spent time looking for a smaller alternative; there isn't one. Better UX framing of the load was the right answer.

4. **Trim UX.** I went with "Mark IN / Mark OUT" buttons over a dual-handle slider because it was faster to ship. Got feedback that a slider would be better. Fair — will add in v1.1.

---

## What I'd love help with

**Distribution**: I'm new at the lifecycle game. If you've launched on PH/HN/IH and have one piece of "thing I learned the hard way" advice, I'd love it.

**Monetization**: at what user count does it make sense to add a Ko-fi button vs a Polar "Pro" tier? I have neither today; tomorrow I'll have Ko-fi as a tip jar.

**Bug reports**: try it and let me know what breaks. Mobile Safari is my biggest worry zone.

---

## Numbers I'll track

Will post Day 7 and Day 30 retros with:
- Visiteurs uniques (Vercel Analytics)
- Top referring channel
- Conversion to "actually used the tool" (heuristic)
- Donations Ko-fi
- GitHub stars
- Pivots considered

If anyone wants a longer technical write-up of the COEP/COOP / SharedArrayBuffer fights I had with the browser, lmk in the comments — happy to do a Dev.to / Hashnode follow-up.

Thanks for reading 🙏
```

---

## Reply templates

**"Why $0 budget? Why not just pay for tools?"**
> Two reasons: (1) it forces discipline — you can't paper over a bad architectural choice with a $20/mo SaaS, (2) it proves the structural cost. If ClipCraft can't be sustained on $0 at the indie scale I'm targeting, the unit economics are wrong.

**"How will you grow past the initial launch bump?"**
> SEO is the long game (privacy-focused video conversion is a long-tail keyword), but SEO takes 6-12 months. Short-term: build-in-public on Twitter, weekly Dev.to / Hashnode articles, replies in r/webdev / r/SideProject when relevant.

**"Did you really not spend any money?"**
> Zero. I have receipts (or rather, the lack of them). The only "cost" is my time. The product I shipped is structurally costless to operate.
