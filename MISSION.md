# MISSION — Autonomous Revenue Generator

**Démarrage** : 2026-05-23 (J1)
**Horizon** : 30 jours (jusqu'au 2026-06-22)
**Budget** : 0€ jusqu'à J+30 · 50€ max après J+30 si traction prouvée

---

## Objectif

Lancer un produit web utile en 100% free tier, atteindre **≥100 visiteurs uniques et 10 utilisateurs actifs** à J+30, et générer **un premier euro** via Ko-fi/Gumroad/Polar dès que possible.

## Hypothèses de marché à tester

1. **H1 — Distribution organique** : un outil utile + résolution d'un vrai pain point + une démo "wow" en 5s suffit à générer >50 visiteurs via 3 canaux gratuits (Reddit, X, HN).
2. **H2 — Free → donation** : un sous-segment d'utilisateurs (~1-3%) clique sur Ko-fi quand l'outil leur a vraiment servi.
3. **H3 — Client-only viable** : on peut livrer un MVP utile sans backend payant ni base de données (localStorage + APIs gratuites).
4. **H4 — Niche > généralité** : un outil niche bien ciblé bat un outil généraliste plus large.

## Plan stratégique sur 30 jours

| Phase | Jours | Livrable |
|-------|-------|----------|
| 0. Bootstrap | J1 matin | 4 fichiers de pilotage |
| 1. Idéation | J1 aprem | 10 idées scorées + 1 choisie + `docs/PRD.md` |
| 2. Validation | J2 | `docs/COMPETITION.md` + `docs/VALIDATION.md` |
| 3. Architecture | J3 | `docs/ARCHITECTURE.md` |
| 4. Build MVP | J4-12 | MVP déployé sur sous-domaine gratuit |
| 5. Lancement | J13-15 | Posts Reddit/X/HN/PH/IH/LinkedIn |
| 6. Itération | J16-30 | Stand-up quotidien, A/B tests, push canaux |

## Révisions hebdomadaires

- **Lundi J8** : revue métriques semaine 1, ajustements stack/scope.
- **Lundi J15** : revue post-bootstrap, validation date lancement.
- **Lundi J22** : revue post-lancement, décision pivot ou push.
- **Lundi J29** : préparation post-mortem ou plan mois 2.

## Idée retenue

**ClipCraft** — convertisseur/compresseur/GIF-maker vidéo 100% côté navigateur via `ffmpeg.wasm`.

- **Tagline** : *Convert, compress, and GIF-ify videos right in your browser. Zero upload. Forever free.*
- **Score idéation** : 53/60 (1ʳᵉ sur 10 idées)
- **Hero feature** : Video → GIF en <30s sans upload
- **Coût à 10K users** : 0€ (statique pure sur Vercel)
- **PRD complet** : [docs/PRD.md](docs/PRD.md)
- **Date de lancement cible** : J+15 = 2026-06-07
- **🌐 URL LIVE (depuis J1 soirée)** : https://clipcraftapp.vercel.app
- **📦 Repo public** : https://github.com/FreemaX94/clipcraft

## Hypothèses spécifiques à ClipCraft

- **H-CC-1** : la promesse "100% local, no upload" résonne fort (privacy + vitesse) et différencie de CloudConvert/Online-Convert.
- **H-CC-2** : le cas "Video → GIF" est le hero viral pour Twitter/X (créateurs partagent des GIFs en masse).
- **H-CC-3** : 25 Mo de ffmpeg.wasm est acceptable si on le charge à la demande (premier convert) avec un loader friendly.

