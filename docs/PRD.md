# PRD — ClipCraft

**Version** : 0.1 (draft initial, J1)
**Date** : 2026-05-23
**Auteur** : Claude (mode autonome) + FreemaX94@gmail.com

---

## 1. Produit

**Nom de code** : ClipCraft
**Tagline** : *Convert, compress, and GIF-ify videos right in your browser. Zero upload. Forever free.*
**URL cible (J+15)** : `clipcraft.vercel.app` (à confirmer si dispo, sinon `clipcraft-app.vercel.app`)

## 2. Problème résolu

Tout utilisateur (créateurs, devs, marketers, étudiants, journalistes) a besoin **plusieurs fois par semaine** de :
- convertir une vidéo en GIF (Twitter/X, Discord, docs produit)
- extraire l'audio d'une vidéo (podcast, voice memo)
- compresser une vidéo pour la partager (email, WhatsApp, Slack)
- convertir entre formats (MP4, WebM, MOV, MKV)
- découper un clip court d'une vidéo longue

**Solutions actuelles cassées :**
- **CloudConvert / Online-Convert** : payant au-delà de quelques MB, upload obligatoire, vie privée nulle
- **HandBrake / DaVinci Resolve** : install lourde, courbe d'apprentissage, overkill pour 30s de besoin
- **ffmpeg CLI** : barrière pour 99% des gens
- **Outils web "gratuits"** : 99% mentent (paywall caché après upload, qualité dégradée, watermark)

## 3. Solution

**ClipCraft = ffmpeg.wasm packagé dans une UI ultra simple, 100% côté navigateur.**

Le fichier ne quitte JAMAIS l'ordinateur de l'utilisateur. Conversion locale, instantanée, gratuite, illimitée.

## 4. Persona cible (priorisé)

1. **Le créateur de contenu Twitter/X** (P1) — veut transformer un screencast MP4 en GIF de <5Mo pour un tweet
2. **Le dev qui rédige un README/issue GitHub** (P1) — veut une démo GIF de son feature
3. **Le marketer / community manager** (P2) — veut compresser une vidéo pour LinkedIn ou Slack interne
4. **L'étudiant / chercheur** (P3) — veut extraire l'audio d'une conférence YouTube téléchargée

## 5. Features MVP (J4-J12) — STRICTES

**Must-have :**
1. **MP4 → GIF** (hero feature, démo de lancement)
2. **Trim** : sélectionner début / fin avant export (slider visuel)
3. **MP4 → MP3** (extraction audio)
4. **Compress MP4** : 3 presets (Light / Medium / Heavy)
5. **Convert** : MP4 ↔ WebM ↔ MOV
6. **Drag & drop + sélecteur de fichier**
7. **Preview avant export** (lecteur vidéo HTML5)
8. **Téléchargement direct**
9. **UI responsive (desktop priorité, mobile acceptable)**
10. **Bouton "Soutenir sur Ko-fi"** (discret, en footer)

**Explicitement HORS scope MVP :**
- ❌ Comptes / login (jamais, pas besoin)
- ❌ Historique des conversions (le browser garde rien, c'est volontaire)
- ❌ Filtres / effets vidéo
- ❌ Watermark removal (zone grise légale)
- ❌ Édition multitrack
- ❌ Cloud storage / partage de liens
- ❌ Téléchargement depuis URL YouTube (zone grise + complexité)

## 6. Critères de succès (J+30)

- **Minimum acceptable** : 100 visiteurs uniques, 10 conversions effectives trackées, MVP fonctionnel sans bug bloquant
- **Bon** : 1 000 visiteurs, 100 conversions/jour, 1€+ via Ko-fi
- **Excellent** : 10 000 visiteurs, 500 conversions/jour, 50€+ via Ko-fi + mentions Reddit/HN

## 7. Stack pressentie (à confirmer en Phase 3 Architecture)

- **Framework** : Next.js 16.2.6 App Router (Turbopack par défaut) + React 19.2.4
- **UI** : Tailwind v4 + shadcn/ui
- **Worker ffmpeg** : `@ffmpeg/ffmpeg` v0.12+ (Web Worker pour pas bloquer le main thread)
- **Hébergement** : Vercel (free hobby tier)
- **Analytics** : Vercel Analytics (free)
- **Storage** : zéro (tout en mémoire, jamais persisté)
- **Backend** : zéro (statique pure)
- **Repo** : GitHub gratuit

## 8. User stories prioritaires

1. *En tant que dev*, je veux drag-drop un screencast MP4 et obtenir un GIF <5Mo en <30s, pour le coller dans une issue GitHub.
2. *En tant que créateur X*, je veux trimmer une vidéo (10s → 6s) et l'exporter en GIF optimisé pour Twitter.
3. *En tant qu'utilisateur Privacy-aware*, je veux la certitude que mon fichier ne quitte pas mon ordinateur (preuve = bandeau "100% local, no upload" + open source).
4. *En tant que marketer*, je veux compresser une vidéo 200Mo en <30Mo pour la mettre sur LinkedIn.

## 9. Risques identifiés & mitigation

| Risque | Probabilité | Mitigation |
|--------|-------------|------------|
| ffmpeg.wasm trop lourd au load (~25Mo) | Haute | Code-splitting, load on first use seulement, loader friendly |
| Performance médiocre sur low-end machines | Moyenne | Limite douce 500Mo, warning UX, presets "low quality fast" |
| Concurrents existants (ezgif.com, gifski) | Haute | Différenciation : 100% local, multi-format, design moderne |
| SharedArrayBuffer / COOP/COEP headers requis | Haute | Config Vercel `headers` pour Cross-Origin-Isolation |
| Mobile (Safari iOS) limites mémoire | Haute | Mobile = compress only, désactiver les GIF lourds + message clair |

## 10. Validation free-tier (vérification anti-coût caché)

| Service | Free tier | Limite | OK ? |
|---------|-----------|--------|------|
| Vercel | 100GB bandwidth/mois | Suffit pour ~1M page views statiques | ✅ |
| GitHub | repos illimités, 2000 min/mois Actions | Pas besoin de CI lourd | ✅ |
| Vercel Analytics | 2500 events/mois | Bonus, on basculera Plausible si besoin | ✅ |
| ffmpeg.wasm | 100% client, open-source MIT | Aucun coût serveur | ✅ |
| **Coût total à 100/1K/10K users** | **0€ / 0€ / 0€** | — | ✅ |

## 11. Plan d'attaque (Phase 4 = Build)

| Jour | Livrable |
|------|----------|
| J4 | Setup Next.js + Tailwind + repo GitHub + Vercel deploy auto |
| J5 | Drop zone + lecteur preview + load ffmpeg.wasm |
| J6 | Feature 1 : MP4 → GIF (preset défaut) |
| J7 | Feature 2 : Trim avec timeline UI |
| J8 | Feature 3 : MP4 → MP3 + Feature 4 : compression |
| J9 | Feature 5 : conversion universelle |
| J10 | Polish UI + landing page section unique |
| J11 | SEO de base + OG image + analytics |
| J12 | QA, fix bugs, tests sur 3 navigateurs |
| J13-15 | Lancement (cf Phase 5) |

---

**Statut** : ✅ Idée validée par scoring autonome.
**Prochaine étape** : Phase 2 = Validation rapide (J2) — Google Trends, Reddit, concurrents.
