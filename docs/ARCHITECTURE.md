# ARCHITECTURE — ClipCraft

**Version** : 0.1 (J3, 2026-05-23)
**Statut** : draft, à confirmer en Phase 4 (build) si une lib bouge.

---

## 1. Vue d'ensemble (TL;DR)

ClipCraft est une **SPA statique 100% client-side**.
- Aucun backend, aucune DB, aucun stockage.
- Tout le traitement vidéo se fait **dans le navigateur** via `ffmpeg.wasm`.
- Le fichier vidéo **ne quitte JAMAIS** la machine de l'utilisateur.
- Coût d'opération : **0 € à toute échelle** (Vercel free hobby + CDN public pour ffmpeg.wasm).

## 2. Schéma ASCII

```
┌─────────────────────────────────────────────────────────────┐
│                  USER BROWSER (Chrome/FF/Safari)            │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Next.js 15 SPA (statique, ~3 Mo gzipped)           │  │
│   │  ┌───────────────────────────────────────────────┐  │  │
│   │  │  React UI (Tailwind v4 + shadcn/ui)           │  │  │
│   │  │   - <DropZone>     drag&drop / file picker    │  │  │
│   │  │   - <VideoPreview> HTML5 video native         │  │  │
│   │  │   - <ToolPanel>    GIF / Trim / Audio / etc   │  │  │
│   │  │   - <ProgressBar>  ffmpeg progress events     │  │  │
│   │  │   - <DownloadBtn>  blob URL → save           │  │  │
│   │  └─────────────┬─────────────────────────────────┘  │  │
│   │                │ File blob                          │  │
│   │                ▼                                    │  │
│   │  ┌───────────────────────────────────────────────┐  │  │
│   │  │  @ffmpeg/ffmpeg v0.12 (Web Worker interne)    │  │  │
│   │  │  - core ~25 Mo, chargé à la 1ʳᵉ utilisation   │  │  │
│   │  │  - écrit / lit dans MEMFS (RAM browser)       │  │  │
│   │  └───────────────────────────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   🔒 Aucune requête réseau pendant la conversion           │
│      (vérifiable via DevTools → Network)                   │
└─────────────────────────────────────────────────────────────┘
        │                                       ▲
        │ (1) load app HTML/JS/CSS              │
        │ ~3 Mo gzipped                         │
        ▼                                       │
┌─────────────────────────────────┐             │
│  Vercel CDN (free hobby tier)   │             │
│  - Static export Next.js        │             │
│  - Headers:                     │             │
│    COOP: same-origin            │             │
│    COEP: credentialless         │             │
│  - Vercel Analytics (web vitals)│             │
└─────────────────────────────────┘             │
                                                │
        ┌───────────────────────────────────────┘
        │ (2) first conversion → fetch ffmpeg.wasm core
        │ ~25 Mo gzipped, cached forever (Cache-Control)
        ▼
┌──────────────────────────────────┐
│  unpkg.com / jsdelivr.net        │
│  CDN public gratuit illimité     │
│  → @ffmpeg/core-mt@latest        │
│  (allège Vercel des 25 Mo)       │
└──────────────────────────────────┘

           ┌──────────────────────────────────┐
           │  GitHub (free repo)              │
           │  push main → Vercel auto-deploy  │
           └──────────────────────────────────┘
```

## 3. Stack détaillée

### Frontend
| Couche | Lib | Version | Raison |
|--------|-----|---------|--------|
| Framework | **Next.js** | 15 (App Router) | SEO metadata API, OG image native, file routing, Vercel-friendly |
| Build | `next build` + `output: 'export'` | — | Statique pur, déployable n'importe où |
| Styling | **Tailwind CSS** | v4 (zero-config) | Productivité max, bundle minimal |
| Composants | **shadcn/ui** | latest | Button, Slider, Progress, Toast, Dropdown — copiés dans le repo |
| State | React `useState` + `useReducer` | — | Trop simple pour Zustand/Redux |
| Vidéo | HTML5 `<video>` natif | — | Preview gratuit, zéro lib |
| Conversion | **`@ffmpeg/ffmpeg`** | v0.12+ | Maintenu, Web Worker interne, support multi-thread |
| Utilitaires ffmpeg | `@ffmpeg/util` | v0.12+ | `fetchFile`, `toBlobURL` |

### Hosting & déploiement
| Service | Tier | Usage |
|---------|------|-------|
| **Vercel** | Hobby (free) | Static hosting + auto-deploy sur push GitHub |
| **GitHub** | Free | Repo public (visibilité bonus SEO) |
| **unpkg.com** ou **jsdelivr.net** | Free public CDN | Sert `@ffmpeg/core-mt-*.wasm` (~25 Mo) pour soulager Vercel |
| **Vercel Analytics** | Free hobby (2 500 events/mo) | Suivi web vitals + visiteurs uniques |

### Pas de backend
- Aucune Vercel Function, aucune route API, aucune DB.
- Aucun Supabase / Turso / Neon.
- Aucun système d'auth.
- **Pourquoi** : la promesse "ton fichier ne quitte pas ton PC" exige zéro upload.

## 4. Choix techniques justifiés

### Pourquoi Next.js et pas Vite + React ?
- ✅ `metadata` API → tags OG / Twitter / SEO trivial
- ✅ `next/og` → génération OG image dynamique gratuite (utile pour le partage social)
- ✅ Routing fichier → ajout de pages `/faq`, `/privacy`, `/blog` trivial pour SEO long-tail
- ✅ Tailwind v4 fonctionne out-of-the-box
- ⚠️ Bundle légèrement plus lourd que Vite — acceptable car SEO > 100 Ko de bundle initial

### Pourquoi `output: 'export'` (statique) ?
- ClipCraft n'a aucune logique serveur → SSR inutile
- Statique = déploiement portable (Vercel, Cloudflare Pages, GitHub Pages, Netlify)
- Plan B de migration trivial si Vercel devient hostile

### Pourquoi charger ffmpeg.wasm depuis unpkg/jsdelivr et pas depuis Vercel ?
**Calcul de bande passante critique :**
- Bundle Next.js app : ~3 Mo gzipped
- ffmpeg-core wasm : ~25 Mo (~7-10 Mo gzipped selon version)
- Vercel hobby = 100 Go bandwidth / mois
- À **10 000 utilisateurs uniques / mois** chargeant tout : `(3 + 8) × 10 000 = 110 Go` → **dépassement**

**Mitigation : décharger ffmpeg.wasm sur unpkg/jsdelivr**
- Bande passante unpkg/jsdelivr = illimitée (CDN public soutenu par fondations)
- `@ffmpeg/ffmpeg` permet de spécifier `coreURL` et `wasmURL` pointant vers unpkg
- Avec ça : Vercel ne sert que ~3 Mo × 10 000 = **30 Go** → bien sous la limite

### Pourquoi COEP `credentialless` et pas `require-corp` ?
- `ffmpeg.wasm` exige `crossOriginIsolated === true` pour utiliser `SharedArrayBuffer` (perf multi-thread)
- `crossOriginIsolated` nécessite COOP `same-origin` + COEP `require-corp` OU `credentialless`
- `require-corp` casse toute ressource cross-origin sans CORS headers (images Twitter etc.)
- `credentialless` permet cross-origin sans CORS — compatible avec unpkg, jsdelivr, OG images
- ✅ Supporté Chrome 96+ (Nov 2021), FF 109+ (Jan 2023), Safari 17.4+ (Mar 2024). En 2026 : >97% des users.

## 5. Sécurité & Privacy (argument marketing #1)

| Aspect | ClipCraft | CloudConvert / ezgif |
|--------|-----------|-----------------------|
| Upload du fichier vers un serveur ? | ❌ Jamais | ✅ Obligatoire |
| Persistance des fichiers ? | ❌ Aucune (RAM only) | ⚠️ Souvent (TOS flous) |
| Vérifiable par l'utilisateur ? | ✅ DevTools Network = 0 requête | ❌ Trust required |
| Open source ? | ✅ Repo public GitHub | ❌ Closed |

**Discours produit** : *"We can't see your files because they never leave your computer. Open the DevTools Network tab while you convert — you'll see zero outgoing requests."*

## 6. Performance & limites attendues

| Scénario | Estimation |
|----------|------------|
| Premier chargement (cold) | ~3-5 s (HTML+JS+CSS) |
| Premier chargement ffmpeg.wasm | +8-15 s (réseau, ensuite cached) |
| Conversion MP4 10s → GIF | ~5-15 s (Apple M-series), ~20-40 s (low-end laptop) |
| Compression MP4 100 Mo → 30 Mo | ~30-90 s |
| Mémoire max conseillée | ~500 Mo fichier source (Chrome desktop) |
| Mobile Safari iOS | Limité ~200 Mo, on désactive les GIFs lourds |

**Stratégie d'UX face aux limites :**
- Affichage clair du temps estimé avant lancement
- Warning si fichier >500 Mo : "Ton navigateur risque de crash. Continuer ?"
- Mobile = mode "compression light only", GIF désactivé avec message explicatif

## 7. Projection coûts free-tier

| Utilisateurs / mois | Vercel bandwidth | Build minutes | Vercel Analytics | Total |
|---------------------|------------------|---------------|------------------|-------|
| 100 | ~0.3 Go | ~10 min | ~300 events | **0 €** |
| 1 000 | ~3 Go | ~10 min | ~3 000 events ⚠️ | **0 €** (events overflow = pas de blocage, juste pas de data au-delà) |
| 10 000 | ~30 Go | ~10 min | overflow | **0 €** |
| 100 000 | ~300 Go ❌ | ~10 min | overflow | **Migration nécessaire** |

**Quand on dépasse 100 Go bandwidth (≈ 30K users uniques/mois) :**
- **Plan A** : migrer hosting vers **Cloudflare Pages** (bandwidth illimité free)
- **Plan B** : passer Vercel Pro à 20 $/mois (≈ équivalent traction monétisable)
- **Plan C** : self-host sur un VPS gratuit (Oracle Cloud Always Free, etc.)

→ **Décision** : on reste Vercel hobby tant que <30K users/mois. Au-delà = signal monétisation suffisante pour justifier 20 $/mois ou migration.

## 8. Risques techniques & mitigations

| Risque | Probabilité | Sévérité | Mitigation |
|--------|-------------|----------|------------|
| ffmpeg.wasm trop lourd, abandon utilisateur | Haute | Haute | Chargement à la 1ʳᵉ conversion seulement, loader friendly avec "Loading the magic… ~10s" |
| COEP `credentialless` non supporté sur Safari <17.4 | Faible (en 2026) | Moyenne | Détecter → fallback en single-thread (plus lent mais marche) |
| Mobile crashes sur gros fichiers | Haute | Moyenne | Détection mobile + désactiver les opérations lourdes |
| API `@ffmpeg/ffmpeg` change | Faible | Moyenne | Pin version exacte, valider via context7 avant install |
| Vercel modifie le free tier | Faible | Haute | Repo statique = migration <1h vers CF Pages |
| unpkg/jsdelivr down → conversions cassées | Très faible | Haute | Fallback : héberger une copie ffmpeg.wasm sur Vercel (mange bandwidth mais marche) |

## 9. Decisions Log (architecture)

- **A001** : Next.js 15 statique (et pas Vite) → SEO + OG image natifs.
- **A002** : ffmpeg.wasm chargé depuis CDN public externe (et pas Vercel) → préserve free tier.
- **A003** : COEP `credentialless` (et pas `require-corp`) → compat CDN externe + OG.
- **A004** : Aucun backend, aucune DB → promesse "zero upload" + 0 € structurel.
- **A005** : Pas de monorepo, pas de Turbo, pas de tests E2E au MVP → vélocité > over-engineering.
- **A006** : shadcn/ui (composants copiés) plutôt que MUI/Chakra → bundle minimal + zéro lock-in.

## 10. Structure de répertoires prévue

```
clipcraft/
├── app/
│   ├── page.tsx              # Single-page app (hero + tools)
│   ├── layout.tsx            # Metadata + COOP/COEP headers
│   ├── faq/page.tsx          # Future (post-launch)
│   ├── privacy/page.tsx      # "We don't see your files" detailed
│   └── opengraph-image.tsx   # OG image dynamique
├── components/
│   ├── DropZone.tsx
│   ├── VideoPreview.tsx
│   ├── ToolPanel.tsx
│   ├── tools/
│   │   ├── GifTool.tsx
│   │   ├── TrimTool.tsx
│   │   ├── AudioTool.tsx
│   │   ├── CompressTool.tsx
│   │   └── ConvertTool.tsx
│   ├── ProgressBar.tsx
│   └── ui/                   # shadcn primitives
├── lib/
│   ├── ffmpeg.ts             # ffmpeg instance + lazy load
│   └── presets.ts            # GIF/compress presets
├── public/
│   └── og-default.png
├── next.config.mjs           # headers COOP/COEP
├── package.json
└── README.md
```

---

**Statut final** : architecture validée pour Phase 4. Aucun coût caché identifié à <30K users/mois.
**Prochaine étape** : Phase 4.1 — scaffold du projet Next.js.
