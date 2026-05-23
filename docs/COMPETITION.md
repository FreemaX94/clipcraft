# COMPETITION.md — ClipCraft

**Date** : 2026-05-23
**Auteur** : Claude (Phase 2 — Validation rapide)
**Méthodologie** : recherches web (WebSearch + WebFetch) sur Reddit, Trustpilot, Product Hunt, Hacker News, Similarweb, GitHub. ~30 min de recherche.

---

## Vue d'ensemble du paysage concurrentiel

Le marché de la conversion vidéo en ligne se segmente en **3 catégories** :

1. **Server-side legacy** : ezgif.com, cloudconvert.com, online-convert.com, freeconvert.com — historiquement dominants, uploadent les fichiers
2. **SaaS éditeurs vidéo** : VEED.io, Kapwing, Clideo, Canva — freemium avec watermark, gros pivots IA
3. **Browser-side ffmpeg.wasm (concurrents directs ClipCraft)** : Modfy, GifConvert.io, Snipclip, Rotato Compress, EditClips.online, WuTools, TinyCompressor, addyosmani/video-compress

C'est cette **3ème catégorie qui est notre vrai concurrent**. Le bon signal : elle existe (validation marché). Le mauvais signal : on n'est pas premier.

---

## 1. ezgif.com — Le titan vieillissant

- **URL** : https://ezgif.com
- **Modèle** : 100% gratuit, ad-supported (pub display)
- **Traffic estimé** : **6.7M visites/mois**, Global Rank #6576 (Similarweb, avril 2026) — *en légère décroissance (-1.55% mois sur mois)*
- **Source traffic** : https://www.similarweb.com/website/ezgif.com/

### Forces
- Notoriété massive, SEO dominant sur "video to gif", "gif compressor", "mp4 to gif"
- Multi-outils (GIF maker, optimize, resize, rotate, speed changer, video editor)
- Pas de watermark, pas de paywall
- Limite généreuse : 200MB par fichier
- Bounce rate sain (22.8%) → users restent et reviennent

### Failles
- **UX datée 2010s** : design HTML brut, formulaires, recharges de pages, pas de drag&drop moderne
- **Upload obligatoire** : les fichiers sont uploadés sur leur serveur (gardés 1h)
- **Pas de mobile-first** : l'expérience smartphone est faible
- **Limite 200MB** : insuffisante pour les screencasts 4K modernes
- **Privacy "promise-based"** : ils disent supprimer après 1h, mais les fichiers passent par leur infra

### Complain user (Reddit/blogs)
> *"Every GIF you change speed on is uploaded to and processed on Ezgif's servers, and for screen recordings, work-related animations, or any GIF containing private content, you are handing that content to a third-party server."* — WildandFree Tools blog résumant des threads Reddit
> Source : https://wildandfreetools.com/blog/gif-speed-changer-ezgif-alternative/

### Note de menace : **9/10**
C'est l'éléphant. On ne le tuera pas. Mais on peut grignoter le segment "privacy-aware + design moderne".

---

## 2. cloudconvert.com — Le freemium agressif

- **URL** : https://cloudconvert.com
- **Modèle** : freemium — 25 min de conversion/jour gratuit, puis crédits payants
- **Traffic** : top concurrent #1 de ezgif selon Similarweb (avril 2026)

### Forces
- Catalogue de conversions énorme (200+ formats)
- API solide pour devs
- Intégrations Google Drive / Dropbox
- Qualité de conversion fiable

### Failles
- **Paywall agressif** : 25 min/jour seulement, puis crédits ($8 minimum)
- **Upload obligatoire** vers leurs serveurs (privacy zéro)
- **Lent sur gros fichiers** (queue partagée)
- Confusion sur "free trial" vs "free tier" — users floués

### Complain user (Trustpilot)
> *"The website said that I had used up my free trial and that I then had to pay a minimum of £120 to convert the other file I needed."* — Trustpilot review
> Source : recherché via WebSearch (Trustpilot bloqué en direct fetch 403)

### Note de menace : **6/10**
Cible plutôt B2B / power users. Le user occasionnel qu'on vise sera frustré par le paywall et cherchera autre chose — c'est NOTRE opportunité.

---

## 3. online-convert.com — Le vétéran à la UX poussiéreuse

- **URL** : https://www.online-convert.com
- **Modèle** : freemium avec limite de temps de traitement

### Forces
- Large palette de conversions (audio, vidéo, image, doc)
- Réputation établie (long historique)
- Notes Trustpilot globalement positives

### Failles
- **Free tier ridicule** : conversions > 2 min bloquées (cf complain ci-dessous)
- **UX antédiluvienne** : interface années 2010
- **Upload obligatoire** vers leurs serveurs
- **Limite de file size** sur free tier
- Pub display intrusive

### Complain user (Trustpilot)
> *"Their purported 'free' online converter would not convert a 110KB file because the 'task took more than 2 minutes to process,' and the user would need to pay to convert the file."*
> Source : https://www.trustpilot.com/review/online-convert.com

### Note de menace : **4/10**
Vieillit mal, perd des parts de marché. Ils dorment.

---

## 4. Modfy — Le concurrent direct ffmpeg.wasm pionnier

- **URL** : https://modfy.video
- **Modèle** : open-source, gratuit
- **Lancement Product Hunt** : 2020 — 119 upvotes, Day Rank #22
- **Source PH** : https://www.producthunt.com/products/modfy

### Forces
- Open-source (crédibilité dev)
- 100% client-side, privacy native
- CLUI (command-line-like UI) — niche dev
- Pionnier de la catégorie

### Failles
- **Traction modeste** : 119 upvotes PH en 2020, puis silence relatif (7 followers PH seulement)
- **UX très technique** : CLI-style, pas pour le grand public
- **Pas de SEO solide** sur les keywords clés ("mp4 to gif")
- **Le projet semble en mode maintenance** : peu d'évolutions visibles
- **Cible dev** uniquement, pas créateurs/marketeurs

### Note de menace : **5/10**
Existe, mais n'a jamais pris en mainstream à cause d'une UX dev-only. ClipCraft peut prendre le segment grand public.

---

## 5. GifConvert.io — Concurrent direct récent et propre

- **URL** : https://gifconvert.io
- **Modèle** : gratuit, browser-side ffmpeg.wasm
- **Pitch site** : "Everything runs directly in your browser using WebAssembly — your files are never uploaded to any server."

### Forces
- Positionnement IDENTIQUE à ClipCraft (100% local, privacy)
- Stack technique IDENTIQUE (ffmpeg.wasm)
- UI plus propre que ezgif
- SEO modéré sur "gif compressor", "gif converter"

### Failles
- **Faible notoriété** : traffic non documenté publiquement, pas de discussions Reddit/HN visibles
- **Périmètre limité** : focus GIF uniquement, pas multi-format vidéo
- **Pas de mention de trim, MP3 extraction, multi-codec**
- **Branding faible** : nom générique, peu mémorable

### Note de menace : **7/10**
**C'est le concurrent le plus dangereux** parce que pitch identique. Mais leur scope est plus étroit (GIF only) et leur branding est faible. ClipCraft peut gagner en proposant plus de features (trim, MP3, compress, conversion universelle) + meilleur design + nom plus fort.

---

## 6. Snipclip — Compresseur browser-side simple

- **URL** : https://snipclip.app
- **Modèle** : gratuit, browser-side
- **Scope** : compression vidéo vers 720p MP4

### Forces
- Pitch privacy ("does not upload your video to any server")
- Simplicité radicale
- Stack moderne

### Failles
- **Mono-feature** (compression seulement)
- **Sortie unique** : 720p MP4 (pas de choix qualité/format)
- **Pas de GIF, pas de trim, pas de MP3**
- Notoriété très faible

### Note de menace : **3/10**
Trop niche. ClipCraft écrase en couverture fonctionnelle.

---

## 7. Rotato Compress — Outil bonus d'un éditeur Mac

- **URL** : https://tools.rotato.app/compress
- **Modèle** : gratuit, browser-side, lead-magnet pour leur appli Mac payante

### Forces
- UX léchée (vient d'une équipe design)
- 100% local
- Bon SEO sur "video compressor private"

### Failles
- **Mono-feature** (compress)
- **C'est un side-tool** pour vendre Rotato (l'éditeur Mac) — pas un produit phare
- Pas de GIF ni MP3 ni trim

### Note de menace : **4/10**
Bel exemple mais limité en scope. ClipCraft est plus complet.

---

## 8. TinyCompressor — Newcomer HN novembre 2025

- **URL** : (Show HN novembre 2025) https://news.ycombinator.com/item?id=46076830
- **Modèle** : gratuit, browser-side ffmpeg.wasm
- **Scope** : image, video, PDF compression — jusqu'à 85% de réduction

### Forces
- Lancement HN récent (Nov 2025) — donc traction encore fraîche
- Multi-format (image + vidéo + PDF) = scope plus large que la moyenne
- Pitch privacy

### Failles
- **Pas axé GIF** (notre hero feature)
- **Pas de trim ni extraction MP3**
- Branding "TinyCompressor" pas mémorable
- Pas d'angle créateur/Twitter

### Note de menace : **5/10**
Bon produit, scope différent. On peut coexister.

---

## 9. Mentions honorables (faible menace mais à surveiller)

- **EditClips.online** : ffmpeg.wasm, multi-outils, mais peu de notoriété
- **WuTools** : ffmpeg.wasm, focus video tools, branding modeste
- **addyosmani/video-compress (GitHub)** : démo open-source d'Addy Osmani, pas un produit fini
- **VEED.io / Kapwing / Clideo** : SaaS éditeurs avec watermark sur le free — ne sont pas du même segment (pro éditing)

---

## Tableau récapitulatif

| Concurrent | Modèle | Stack | Privacy | UX | Scope | Traction | Menace /10 |
|---|---|---|---|---|---|---|---|
| **ezgif.com** | Gratuit (ads) | Server | ❌ upload | 1/5 (datée) | Tout GIF | **6.7M visits/mo** | **9** |
| **cloudconvert** | Freemium | Server | ❌ upload | 3/5 | Multi-format | Top 2 du marché | 6 |
| **online-convert** | Freemium | Server | ❌ upload | 1/5 | Multi-format | En déclin | 4 |
| **Modfy** | OSS | ffmpeg.wasm | ✅ local | 2/5 (CLUI) | Multi | 119 PH 2020 | 5 |
| **GifConvert.io** | Gratuit | ffmpeg.wasm | ✅ local | 4/5 | GIF only | Faible | **7** |
| **Snipclip** | Gratuit | ffmpeg.wasm | ✅ local | 4/5 | Compress 720p | Faible | 3 |
| **Rotato Compress** | Gratuit (LM) | ffmpeg.wasm | ✅ local | 5/5 | Compress | Modeste | 4 |
| **TinyCompressor** | Gratuit | ffmpeg.wasm | ✅ local | 4/5 | Image+Video+PDF | HN Nov 2025 | 5 |
| **ClipCraft (us)** | Gratuit | ffmpeg.wasm | ✅ local | **5/5** | **GIF+Trim+MP3+Compress+Convert** | À construire | — |

---

## ClipCraft positioning vs competitors

### Notre matrice de différenciation

| Axe | ezgif | cloudconvert | GifConvert.io | Modfy | **ClipCraft** |
|---|---|---|---|---|---|
| 100% privacy (no upload) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Zero paywall forever | ✅ | ❌ | ✅ | ✅ | ✅ |
| Zero watermark | ✅ | ✅ | ✅ | ✅ | ✅ |
| Modern UX (2026) | ❌ | ⚠️ | ⚠️ | ❌ | ✅ |
| Multi-feature (GIF+trim+MP3+compress) | ✅ | ✅ | ❌ | ⚠️ | ✅ |
| Designed for creators (Twitter/X, devs) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Drag & drop instant, no signup | ⚠️ | ⚠️ | ✅ | ⚠️ | ✅ |
| Mobile-decent | ❌ | ⚠️ | ⚠️ | ❌ | ⚠️ (compress only) |

### Notre angle gagnant : **"ezgif's power, with 2026 design, and your file never leaves your laptop"**

On ne bat PAS ezgif sur le SEO ou la notoriété en 6 mois. On bat ezgif sur **trois axes** combinés :
1. **Design moderne** (Tailwind + shadcn vs HTML brut années 2010)
2. **Privacy native** (le fichier ne sort jamais — preuve technique, pas une promesse)
3. **Workflow créateur** (drag → trim → GIF en <30s, optimisé pour Twitter/Discord/GitHub README)

### Risque concurrentiel principal

**GifConvert.io** a déjà notre pitch. La seule façon de gagner contre eux :
- Élargir le scope (ils sont GIF-only, on est GIF+Trim+MP3+Compress+Convert)
- Meilleur branding et meilleure landing
- Meilleur SEO / contenu
- Plus de presence Twitter/Reddit/HN dès le lancement

### Pivot envisageable si trop dur

Si après 4-6 semaines on stagne en SEO contre ezgif/GifConvert, **pivoter vers une niche** :
- "GIFs pour devs / GitHub READMEs" (avec presets optimisés README, compression GIF agressive)
- "Screencast → tweet-ready GIF" (workflow ultra-court pour twitter/X)
- "Video to GIF for Slack/Discord" (presets format/size optimisés pour ces plateformes)

---

## Conclusion concurrentielle

**On entre dans un marché bondé mais lucratif.** ezgif fait 6.7M visites/mois, ce qui prouve la demande. Plusieurs concurrents ffmpeg.wasm existent déjà (signal positif : la stack marche, le pitch est compris) mais **aucun n'a réussi à devenir mainstream** (signal positif : la porte reste ouverte).

Notre fenêtre : être **le ffmpeg.wasm le mieux designé, avec le scope le plus large pour les créateurs**.

Risque réel : on est **6ème ou 7ème entrant** dans la sous-catégorie ffmpeg.wasm. Différenciation par le **design + le branding + le scope** ou pivot dans 4-6 semaines.
