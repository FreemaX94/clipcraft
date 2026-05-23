# ClipCraft custom skills

Skills automating recurring workflows during Phase 6 (post-launch iteration).

| Skill | When | What it does |
|-------|------|--------------|
| [daily-standup](./daily-standup/SKILL.md) | Every morning | Pulls metrics, writes `docs/STANDUPS/YYYY-MM-DD.md`, picks today's hypothesis + distribution action |
| [prod-audit](./prod-audit/SKILL.md) | Weekly + before launch | 7-step health check on https://clipcraft-app.vercel.app (headers, routes, OG tags, bundle size) |
| [vercel-deploy](./vercel-deploy/SKILL.md) | After any code change | Local build sanity → vercel deploy --prod → re-point canonical alias → verify |
| [ux-expert-review](./ux-expert-review/SKILL.md) | Before launch / when metric is off | Reviews a page from a chosen persona's perspective, returns prioritized P0/P1/P2 issues |
| [launch-post-publish](./launch-post-publish/SKILL.md) | On launch day (J0) | Walks through publishing one of the 9 prepared launch posts on HN/Reddit/PH/Twitter/etc. |

## How they fit together

```
Morning routine (Phase 6):
  daily-standup  →  prod-audit  →  ux-expert-review (if metrics off)  →  work on action item

After any change:
  edit code/docs → commit  →  vercel-deploy  →  prod-audit

Launch day (J0):
  prod-audit (pre-flight)
  → launch-post-publish (HN at 08:00 UTC)
  → launch-post-publish (PH at 08:01 UTC)
  → launch-post-publish (Twitter at 10:00 UTC)
  → ... follow launch-checklist.md
```

## Invocation

In Claude Code: type `/<skill-name>` or describe what you need (Claude will pick the right skill).

Examples:
- `/daily-standup`
- `/prod-audit`
- `/vercel-deploy`
- `/ux-expert-review` (with prompt: "review the home page as persona A")
- `/launch-post-publish hn`

These skills override default behavior in the context they target — they don't replace the broader CLAUDE.md mission.
