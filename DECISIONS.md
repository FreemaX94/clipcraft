# DECISIONS — Journal des décisions stratégiques

Format : chaque décision = un bloc avec **Contexte / Options / Choix / Rationale / Date**.

---

## D001 — Mission Autonomous Revenue Generator
- **Date** : 2026-05-23
- **Contexte** : reset du CLAUDE.md vers un mode opérationnel autonome (vs assisté).
- **Options envisagées** :
  - A. Continuer en mode "associé technique senior" qui pose des questions
  - B. Passer en mode "fondateur autonome" — Claude décide de tout
- **Choix** : B (Autonomous Revenue Generator).
- **Rationale** : maximiser la vitesse d'exécution sur 30 jours. L'humain a ~3-4h/jour, donc il ne doit pas être un goulot d'étranglement décisionnel. Toutes les décisions techniques/stratégiques passent par Claude.
- **Conséquence** : Claude ne demande plus de validation pour les choix de stack, design, naming, features. Demande uniquement : email, OAuth, actions manuelles irréductibles.

---

## D002 — Méthode d'idéation : auto-générée, scorée, choix unilatéral
- **Date** : 2026-05-23
- **Contexte** : démarrage Phase 1, besoin d'une idée de produit gratuit.
- **Options envisagées** :
  - A. Demander à l'humain
  - B. Générer 10 idées, scorer 6 critères, choisir la meilleure
- **Choix** : B.
- **Rationale** : CLAUDE.md exige une décision autonome. Le scoring multi-critères évite le biais "première idée séduisante".

---

## D003 — Idée retenue : ClipCraft
- **Date** : 2026-05-23
- **Contexte** : 10 idées scorées sur 6 critères /10 (total /60).
- **Top 3** : ClipCraft (53), Roast My Landing (50), CronExplain & BugForge (48).
- **Choix** : **ClipCraft** (convertisseur/GIF-maker vidéo 100% browser via ffmpeg.wasm).
- **Rationale** :
  1. **Seule idée à 0€ structurel à toute échelle** (pur client, jamais de coût serveur même à 1M users).
  2. **Hero feature ultra viral** : "Video → GIF en 5s sans upload" est un tweet de lancement évident.
  3. **Pain universel** : tous les segments (devs, marketers, créateurs) convertissent des vidéos chaque semaine.
  4. **Différenciation forte** vs CloudConvert (payant + upload obligatoire) et HandBrake (install lourde).
  5. **MVP buildable en 9 jours** avec un seul dev solo grâce à `@ffmpeg/ffmpeg`.
- **Risques majeurs acceptés** : taille de ffmpeg.wasm (~25Mo) + headers COOP/COEP requis + perf mobile limitée. Mitigations dans `docs/PRD.md`.

---

## D005 — Stack confirmée : Next.js 16.2.6 + React 19 + Tailwind v4 + ffmpeg.wasm v0.12.15
- **Date** : 2026-05-23
- **Contexte** : scaffold via `create-next-app@latest` a installé Next.js 16 (et non 15 comme prévu dans PRD initial). Vérification de la doc locale : breaking changes OK, Turbopack par défaut, output: 'export' toujours supporté.
- **Choix** : on reste sur Next.js 16. Aucun blocage identifié.
- **Rationale** : 16 est stable, performant (Turbopack), et tous les usages de ClipCraft (composant client unique + static export) sont supportés. Pas de raison de downgrade.
- **Conséquence** : PRD et ARCHITECTURE patchés pour cohérence. Headers COOP/COEP déplacés vers `vercel.json` (static export ignore les headers async dans next.config.ts).

---

## D006 — shadcn/ui repoussé hors MVP
- **Date** : 2026-05-23
- **Contexte** : ARCHITECTURE prévoyait shadcn/ui. Pendant le build, j'ai constaté que les composants nécessaires (radio, button, progress bar) sont triviaux en Tailwind brut.
- **Choix** : pas d'install shadcn/ui pour le MVP. Tailwind v4 direct.
- **Rationale** : YAGNI. shadcn/ui ajoute une CLI + des composants. Pour 4 boutons + 3 radios + 1 progress bar, c'est over-engineering.
- **Réversible** : si la Phase 4.4+ demande des composants riches (Toast, Dropdown, Dialog), on installe à ce moment-là.

---

## D004 — Pas de nom de domaine acheté avant traction prouvée
- **Date** : 2026-05-23
- **Contexte** : tentation de réserver `clipcraft.com` ou `clipcraft.io` dès maintenant.
- **Choix** : on reste sur `clipcraft.vercel.app` (ou variant si pris) jusqu'à preuve de traction (≥500 visiteurs uniques cumulés).
- **Rationale** : CLAUDE.md exige 0€ pendant 30j. Un .com vaut 10-15€/an mais c'est un coût avant validation. Le sous-domaine vercel.app est crédible pour un MVP indie.

