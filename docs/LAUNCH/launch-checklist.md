# LAUNCH CHECKLIST — ClipCraft

**Date de lancement cible** : 2026-06-07 (J+15 du démarrage projet)
**Hypothèse** : produit déployé sur `clipcraft.vercel.app`, repo public sur GitHub, compte Ko-fi `ko-fi.com/clipcraft` ouvert.

---

## J-3 (2026-06-04) — Préparation visuelle

- [ ] **Tourner 1 démo screencast** (10-15s) qui montre : drop d'une vidéo MP4 → choix preset Twitter → clic → GIF téléchargé. Montrer le DevTools Network ouvert avec ZÉRO requête sortante pendant la conversion (preuve "no upload").
- [ ] **Convertir le screencast lui-même avec ClipCraft** (méta). Sortie : 2 GIFs.
  - `clipcraft-demo-twitter.gif` (preset Twitter)
  - `clipcraft-demo-discord.gif` (preset Discord)
- [ ] **Screenshot OG image** sur le site déployé pour vérifier qu'elle s'affiche bien sur Twitter Card Validator et Facebook Sharing Debugger.
- [ ] **Tester sur 3 navigateurs** : Chrome desktop, Firefox desktop, Safari mobile iOS. Logger les bugs dans `docs/TECH-DEBT.md`.

## J-1 (2026-06-06) — Préparation comptes

- [ ] **Twitter/X** : compte personnel prêt, bio mentionne "building ClipCraft". Suivre 20 indie hackers / devs influents pertinents.
- [ ] **Product Hunt** : compte créé, profil rempli, suivre 5 makers pertinents.
- [ ] **Hacker News** : compte avec >5 karma (sinon on a moins de visibilité). Si nouveau compte, on attend J+7 au moins.
- [ ] **Reddit** : compte avec karma minimum sur chaque sub (r/SideProject : 50+, r/webdev : 100+, r/privacy : 50+). Si nouveau, contribuer 2-3 commentaires utiles dans les 24h précédentes.
- [ ] **Indie Hackers** : profil créé, "products" ajouté.
- [ ] **LinkedIn** : draft du post préparé.
- [ ] **Ko-fi** : compte `clipcraft` créé, bouton de soutien actif, lien copiable.

## J0 (2026-06-07) — Lancement (timing optimisé)

L'objectif : démarrer fort, ne pas étaler sur 7 jours.

| Heure (UTC) | Action |
|-------------|--------|
| **00:01 PST = 07:01 UTC** | Publier sur **Product Hunt** (`product-hunt.md`). Critique pour catcher la 1ʳᵉ vague de la journée PH. |
| **+30 min** | Premier commentaire sur sa propre PH avec démo GIF + Q&A |
| **08:00 UTC = 04:00 EST** | Publier **Show HN** (`show-hn.md`). HN front-page se joue le matin US. |
| **10:00 UTC** | Twitter/X thread (`twitter-thread.md`) avec démo GIF |
| **12:00 UTC** | Reddit r/SideProject (`reddit-r-sideproject.md`) |
| **14:00 UTC** | Reddit r/webdev (`reddit-r-webdev.md`) |
| **16:00 UTC** | Reddit r/privacy (`reddit-r-privacy.md`) |
| **18:00 UTC** | Indie Hackers (`indie-hackers.md`) |
| **20:00 UTC** | LinkedIn (`linkedin.md`) |

**Règle d'or pour J0** : passer 2-3h en mode "réponse rapide" sur les commentaires. Une question non répondue dans la première heure = signal négatif algorithmique.

## J+1 à J+7 — Amplification

- [ ] **Daily** : check métriques (Vercel Analytics) le matin
- [ ] **Daily** : répondre à 100% des commentaires PH / HN / Reddit / Twitter
- [ ] **J+1** : DM 5 micro-influenceurs (Twitter dev) avec démo personnalisée
- [ ] **J+2** : post Dev.to "How I built ClipCraft in 14 days for $0" (long form, SEO)
- [ ] **J+3** : post sur Lobste.rs si on a un parrainage
- [ ] **J+5** : post sur Hashnode + Medium (republish Dev.to)
- [ ] **J+7** : récap métriques semaine 1 dans `LOG.md` + post Twitter "First week numbers"

## Métriques à surveiller chaque jour

- Visiteurs uniques (Vercel Analytics)
- Source du trafic (referrers)
- Pages vues
- Conversions effectives (heuristique : si on ajoute un event Vercel custom plus tard)
- Stars GitHub
- Followers Twitter gagnés
- Comments / upvotes par canal
- Donations Ko-fi

## Critères de succès J0

- 🟢 Minimum acceptable : 100 visiteurs uniques, 1 mention organique
- 🟡 Bon : 500 visiteurs, top 10 Product Hunt, front page HN >2h
- 🟢 Excellent : 2000+ visiteurs, top 5 PH, HN front page 6h+, mention sur un newsletter indie

## Critères de pivot (J+10 post-lancement)

Si à J+10 cumulé on a :
- < 50 visiteurs/jour stable → **pivot angle** (focus sur "GIF for GitHub README" ou "Tweet-ready GIF" seulement)
- < 500 visiteurs cumulés sur 10 jours → **post-mortem dans `docs/POSTMORTEM.md`** et nouvelle idée pour mois 2

## Garde-fous

- **Ne pas spammer** : 1 post par sub max, espacé de 6h minimum
- **Pas de mention en cross-post** ("hey already discussed on HN today!" est banné par r/webdev)
- **Pas de fake upvotes** : ban éternel sur Reddit + PH
- **Respect des règles de chaque communauté** : lire la sidebar avant de poster
