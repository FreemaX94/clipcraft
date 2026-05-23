# LOG — Journal d'exécution

Format : `[YYYY-MM-DD HH:MM] [PHASE] action → résultat`

---

## 2026-05-23 — J1

**[14:00] [PHASE 0] Bootstrap**
- Création de `CLAUDE.md` (mission Autonomous Revenue Generator) → ok
- Création de `MISSION.md`, `LOG.md`, `METRICS.md`, `DECISIONS.md` → ok
- Démarrage Phase 1 (idéation 10 idées via superpowers:brainstorming)

**[14:45] [PHASE 1] Idéation**
- 10 idées générées + scorées sur 6 critères /10
- Top 3 : ClipCraft (53), Roast My Landing (50), CronExplain & BugForge (48)
- **Décision** : ClipCraft (convertisseur/GIF-maker vidéo 100% browser via ffmpeg.wasm)
- PRD complet rédigé dans `docs/PRD.md`
- MISSION.md mis à jour avec l'idée retenue + hypothèses spécifiques
- DECISIONS.md : ajout D003 (choix ClipCraft) + D004 (pas de domaine avant traction)

**Blockers** : aucun.
**Apprentissage J1 (idéation)** : la contrainte "0€ structurel à toute échelle" élimine plus de la moitié des idées candidates (toute idée avec un appel API obligatoire). Forcer le client-only oriente naturellement vers des produits durablement gratuits.

**[15:30] [PHASE 2] Validation marché (déléguée à agent en background)**
- Agent général-purpose lancé avec mission : Google Trends + Reddit/HN/PH + 3 concurrents minimum
- Durée agent : ~5 min, 32 tool calls
- Verdict : **🟡 GO avec réserve**
- Findings clés :
  • ezgif.com = 6.7M visites/mois (Similarweb avril 2026), bounce 22.8%, durée 5min → marché massif et engagé
  • **7+ concurrents ffmpeg.wasm déjà actifs** (Modfy, GifConvert.io, Snipclip, Rotato, EditClips, WuTools, TinyCompressor) — aucun n'a percé mais c'est un signal mixte
  • Pain points exploitables : paywalls (£120 min CloudConvert), watermarks (Clideo/VEED), privacy (ezgif upload), UX 2010s
  • Angle gagnant : *"ezgif's power, with 2026 design, and your file never leaves your laptop"*
- Fichiers créés : `docs/COMPETITION.md` (8 concurrents analysés) + `docs/VALIDATION.md` (5 pain points, 3 angles de lancement)

**[15:32] [PHASE 3] Architecture (en parallèle de Phase 2)**
- Décision majeure : **ffmpeg.wasm chargé depuis CDN externe (unpkg)** plutôt que servi par Vercel → préserve les 100Go bandwidth du free tier (sinon 10K users × 25Mo = 280Go = dépassement)
- COEP `credentialless` retenu (vs `require-corp`) → compat CDN externe + OG images
- Aucun backend, aucune DB → promesse "zero upload" + 0€ structurel
- Free tier viable jusqu'à ~30K users/mois (puis migration CF Pages)
- Fichier créé : `docs/ARCHITECTURE.md` (10 sections, decisions A001-A006)

**[15:45] [PHASE 4.1] Setup projet Next.js**
- `npx create-next-app@latest clipcraft` → **Next.js 16.2.6** installé (au lieu de 15 prévu), React 19.2.4, Tailwind v4 (PostCSS), TypeScript 5
- Cleanup : suppression des CLAUDE.md et AGENTS.md créés par le scaffold (redondants avec mon CLAUDE.md racine)
- Lecture de la doc locale `node_modules/next/dist/docs/` (Next 16 a des breaking changes) : Turbopack par défaut, output: 'export' OK, headers async ne marchent pas avec static export → vercel.json
- Install : `@ffmpeg/ffmpeg@0.12.15` + `@ffmpeg/util@0.12.2`
- Décisions adaptatives : D005 (Next.js 16 confirmé), D006 (shadcn/ui repoussé, Tailwind brut suffit)

**[16:00] [PHASE 4.2 + 4.3] Code MVP — ffmpeg + DropZone + Hero MP4→GIF**
- `clipcraft/next.config.ts` : `output: 'export'` + `images.unoptimized: true` + `reactStrictMode`
- `clipcraft/vercel.json` : headers COOP `same-origin` + COEP `credentialless` + X-Content-Type-Options + Referrer-Policy
- `clipcraft/lib/ffmpeg.ts` : singleton FFmpeg, lazy load depuis unpkg `@ffmpeg/core-mt@0.12.10`, fallback `core` (single-thread) si `crossOriginIsolated === false`, 3 presets GIF (Twitter/Discord/High), filter palettegen+paletteuse propre
- `clipcraft/app/layout.tsx` : metadata SEO complète (title template, OG, Twitter card, viewport themeColor, robots)
- `clipcraft/app/page.tsx` : state machine 6 états (empty/loaded/loading-engine/converting/done/error), drag&drop natif, preview HTML5 vidéo + GIF, 3 presets en radio, progress bar live, download button, 3 USPs en bas, footer Ko-fi
- ✅ `npm run build` : compile 2.2s, TS 1.8s, static export 1.1 Mo total (689K chunks JS)
- Aucune erreur de build, aucun warning ESLint critique

**Blockers Phase 4 restants** :
- Phase 4.4 (Trim timeline) : composant slider à coder, ~1-2h
- Phase 4.5 (MP3/Compress/Convert formats) : ajouts ffmpeg, ~2-3h
- Phase 4.6 (Landing + SEO + analytics) : OG image, sitemap, Vercel Analytics SDK, ~1-2h
- **Blocker bloquant le déploiement** : besoin compte Vercel + GitHub (action humaine) pour push + auto-deploy

**Apprentissage J1 (build)** : Next.js 16 + ffmpeg.wasm + static export = stack légère (1.1 Mo bundle), zéro backend, zéro fric. La contrainte "no upload" force des choix architecturaux qui éliminent toute possibilité de coût caché futur.

