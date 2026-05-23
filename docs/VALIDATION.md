# VALIDATION.md — ClipCraft

**Date** : 2026-05-23
**Phase** : 2 — Validation rapide du marché
**Méthodologie** : WebSearch + WebFetch sur Reddit, Hacker News, Product Hunt, Trustpilot, Similarweb, GitHub. ~30-45 min de recherche.
**Limites** : pas d'accès direct à Google Trends (UI interactive), pas d'accès Trustpilot CloudConvert (403), Reddit indexation partielle.

---

## 1. Demande de marché

### Signaux quantitatifs trouvés

| Source | Donnée | Interprétation |
|---|---|---|
| **Similarweb** (avril 2026) | ezgif.com = **6.7M visites/mois**, Global Rank #6576 | Demande massive et soutenue sur le besoin de conversion vidéo/GIF en ligne |
| **Similarweb** | Bounce rate ezgif = 22.8%, durée moy. = 5min02 | Les users qui arrivent restent et utilisent — pas du trafic accidentel |
| **Similarweb** | ezgif décroît de -1.55% mois sur mois | Marché légèrement en pression / chercher nouvelles solutions |
| **Similarweb** | cloudconvert = top concurrent #1 de ezgif (avril 2026) | Le pair ezgif/cloudconvert domine le marché |
| **Audience ezgif** | 69% hommes, 18-24 = plus gros segment | Confirme persona créateur/dev/gamer Twitter |
| **Hacker News** | "Show HN: TinyCompressor" (Nov 2025), "Show HN: WebAssembly+ffmpeg" (2021), "Show HN: gifcap" (2020), "Show HN: Modfy video transcoder" (2020) | La catégorie "ffmpeg.wasm browser-side" est récurrente sur HN — appétit communautaire |
| **Product Hunt** | Modfy a obtenu 119 upvotes en 2020, Day Rank #22 | Catégorie chaude pour le lancement, mais ne suffit pas pour percer mainstream |

**Source globale** : https://www.similarweb.com/website/ezgif.com/

### Signaux qualitatifs (citations de threads / blogs)

> *"When users raise privacy concerns about screen recordings and work content on Reddit, the consistent response is to use something browser-based that does not upload."*
> Source agrégée : https://wildandfreetools.com/blog/gif-speed-changer-ezgif-alternative/

Cette synthèse de discussions Reddit confirme qu'il existe **une demande explicite pour le browser-side privacy**.

### Bonnes nouvelles
- **Demande massive et durable** : ezgif seul = 6.7M visites/mois, et c'est 1 concurrent parmi 10+
- **Engagement profond** : 5min sur ezgif, bounce 22.8% → ce sont des utilisateurs qui CONVERTISSENT
- **Tendance privacy** : sensibilité croissante au upload de fichiers professionnels
- **Stack mature** : ffmpeg.wasm est stable (Chrome 92+, Firefox 79+, Safari 15.2+)

### Mauvaises nouvelles
- **Pas de données Google Trends chiffrées récupérées** (UI interactive uniquement)
- **Pas de subreddit dédié** où les users demandent activement "j'aimerais que quelqu'un crée X" — la demande s'exprime plutôt par l'usage d'ezgif (passive)
- **Au moins 7 concurrents ffmpeg.wasm sont déjà actifs** (Modfy, GifConvert.io, Snipclip, Rotato, EditClips, WuTools, TinyCompressor) → on n'est pas premier

---

## 2. Pain points utilisateurs (5 plaintes récurrentes)

### Pain #1 — Le paywall caché qui frustre
> *"The website said that I had used up my free trial and that I then had to pay a minimum of £120 to convert the other file I needed."*
> Cité dans Trustpilot CloudConvert via WebSearch (la page directe a renvoyé un 403)

**Insight** : les users veulent du gratuit honnête et illimité, pas du faux gratuit.

### Pain #2 — Les limites de temps absurdes sur du free
> *"Their purported 'free' online converter would not convert a 110KB file because the 'task took more than 2 minutes to process,' and the user would need to pay to convert the file."*
> Source : Trustpilot online-convert.com — https://www.trustpilot.com/review/online-convert.com

**Insight** : un fichier de 110KB bloqué par le free tier = abus. Les users haïssent ce dark pattern.

### Pain #3 — Privacy : "je ne veux pas uploader mon écran sur leur serveur"
> *"Every GIF you change speed on is uploaded to and processed on Ezgif's servers, and for screen recordings, work-related animations, or any GIF containing private content, you are handing that content to a third-party server."*
> Source : https://wildandfreetools.com/blog/gif-speed-changer-ezgif-alternative/

**Insight** : screencasts de boulot, contenu confidentiel, demos client — les pros n'ont pas envie d'uploader.

### Pain #4 — Watermarks dans le "free"
> *"Clideo's free plan adds a distinct Clideo watermark to all exported videos."*
> *"VEED requires a paid plan to remove the watermark. Free exports have watermarks."*
> Source : recherches Trustpilot / blog reviews (VEED Help Center confirme le watermark sur free)

**Insight** : SaaS éditeurs polluent l'export gratuit pour pousser au payant. Très détesté.

### Pain #5 — UX vieillote / pas mobile
> Ezgif et online-convert sont décrits par les comparatifs comme ayant une "UX 2010s" (HTML brut, formulaires, pas de drag&drop instantané, pas de feedback de progression moderne). Reddit threads recommandent des alternatives "more modern" sans nommer un vainqueur clair.

**Insight** : la porte est ouverte pour qui sait designer en 2026.

---

## 3. Verdict

### 🟡 **VALIDÉ — AVEC RÉSERVE**

**Pourquoi VALIDÉ** :
- La demande est **prouvée et massive** (ezgif 6.7M visites/mois, engagement profond, marché qui ne se rétracte pas)
- Les **pain points sont réels et nombreux** (paywall, watermark, privacy, UX)
- La **stack technique fonctionne** (ffmpeg.wasm est mature, multiples preuves de concept déjà déployés)
- Le **coût est zéro** (Vercel + ffmpeg.wasm = aucun OpEx)
- Le **scope MVP est raisonnable** (15 jours, faisable)

**Pourquoi RÉSERVE** :
- **On n'est pas premier**. Au minimum 7 concurrents ffmpeg.wasm existent (Modfy, GifConvert.io, Snipclip, Rotato, EditClips, WuTools, TinyCompressor). Aucun n'a percé mais c'est aussi un signal que **percer est difficile**.
- **GifConvert.io a notre pitch exact**, juste un scope plus étroit. Il faut élargir vite (multi-feature : GIF + Trim + MP3 + Compress + Convert).
- **SEO sera brutal** : ezgif domine le mot-clé "video to gif" depuis 10+ ans. On n'aura pas de trafic organique avant 6-12 mois.
- **La stratégie de lancement est CRITIQUE** : sans HN/Reddit/Twitter buzz initial, on reste à zéro user.

### Ce qu'il faut faire (pas négociable)

1. **Différenciation par le design** (Tailwind/shadcn, animations fluides, dark mode, branding propre)
2. **Différenciation par le scope** (5 features dès le J+15, pas 1)
3. **Différenciation par le branding** (nom mémorable, OG image léchée, copy frappant)
4. **Différenciation par la communauté** (Twitter/X dev community, Reddit r/webdev + r/SideProject + r/InternetIsBeautiful)
5. **Privacy comme USP n°1** ("Your file never leaves your laptop. Period.")

### Ce qui peut tuer le projet

- Performance ffmpeg.wasm trop faible sur low-end → users frustrés (3-10 min pour une conversion de 5min selon doc officielle)
- COOP/COEP headers mal configurés sur Vercel → SharedArrayBuffer cassé → conversion impossible
- Mobile Safari iOS limites mémoire → on perd 30% du trafic mobile potentiel
- Aucun signal de lancement (silence HN, silence Reddit) → 0 users J+30, on stoppe

---

## 4. Angles de lancement recommandés

### Angle #1 — "Privacy-first" (cible : devs, journalistes, employés corporate)
**Pitch** : *"Convert any video to GIF without uploading it. Your file never leaves your laptop. Open source. Forever free."*

**Canaux** :
- Show HN: *"Show HN: ClipCraft — video → GIF, 100% in your browser, zero upload"*
- r/privacy, r/programming, r/webdev, r/selfhosted

**Hook visuel** : screencast 10s drag→drop→GIF, network tab DevTools ouverte montrant 0 upload après le load initial ffmpeg.wasm.

### Angle #2 — "Designed for Twitter/X creators" (cible : créateurs, marketers)
**Pitch** : *"Drag any video. Get a viral-ready GIF in 5 seconds. Tweet-optimized presets. No watermark. No paywall."*

**Canaux** :
- Twitter/X thread avec démo en GIF (méta : la démo elle-même est faite avec l'outil)
- r/SideProject, r/InternetIsBeautiful, r/Twitter
- Product Hunt launch

**Hook visuel** : avant/après — un screencast 200Mo qui devient un GIF 4Mo prêt à tweeter en 8s.

### Angle #3 — "GitHub README + Docs tool" (cible : devs, technical writers)
**Pitch** : *"Make beautiful GIFs for your GitHub README in 30 seconds. No CLI, no installation, no upload."*

**Canaux** :
- Dev.to, Hashnode, Hacker News
- r/programming, r/webdev, r/opensource
- Twitter/X dev community (post citant les meilleurs READMEs vus, avec un exemple ClipCraft)

**Hook visuel** : un README GitHub poli avec un GIF made-with-ClipCraft (watermark discret optionnel "Made with clipcraft.vercel.app" en lien).

### Bonus — Angle "anti-ezgif" (à utiliser avec subtilité)
Sans nommer le concurrent, capitaliser sur **leur UX désuète** : "Looks like 2026, not 2010. Privacy by default, not by promise. No upload, no signup, no watermark."

---

## 5. Décision GO / NO-GO

**🟢 GO** — mais avec discipline :
- Ne pas dépasser **15 jours** pour le MVP
- **Pas d'auth, pas de DB, pas de backend** — pur static (cf CLAUDE.md règle d'or)
- Si à J+30 on a < 100 visiteurs uniques, on pivote sur un angle niche (GIF for GitHub, ou GIF for Twitter)
- Si la performance ffmpeg.wasm sur low-end est catastrophique, ajouter un message UX honnête plutôt que mentir sur la rapidité

---

## Sources principales

- https://www.similarweb.com/website/ezgif.com/ (traffic ezgif)
- https://www.trustpilot.com/review/online-convert.com (complaints online-convert)
- https://wildandfreetools.com/blog/gif-speed-changer-ezgif-alternative/ (synthèse Reddit privacy)
- https://www.producthunt.com/products/modfy (traction Modfy)
- https://news.ycombinator.com/item?id=46076830 (Show HN TinyCompressor 2025)
- https://github.com/ffmpegwasm/ffmpeg.wasm (stack technique)
- https://github.com/addyosmani/video-compress (preuve concept Addy Osmani)
- https://www.spotsaas.com/blog/cloudconvert-software-review (review CloudConvert)
- https://support.veed.io/en/articles/7060527-watermark-still-showing-for-paid-customers (VEED watermark)
