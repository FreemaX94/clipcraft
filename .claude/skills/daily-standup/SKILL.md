---
name: daily-standup
description: Use at the start of every day in Phase 6 (post-launch) to generate the daily stand-up. Pulls metrics from Vercel Analytics, identifies the day's hypothesis to test, picks one distribution action, and creates docs/STANDUPS/YYYY-MM-DD.md.
---

# Daily Stand-up — ClipCraft Phase 6

This skill produces the **daily check-in** during post-launch iteration. Run it once per morning.

## When to invoke

- Every morning during Phase 6 (J+15 to J+30+)
- User says "stand-up", "morning recap", "daily", or "où on en est"

## What to do

### 1. Read previous stand-up (if any)

Find the most recent file in `docs/STANDUPS/` (excluding `_template.md`).
Read it to understand:
- Yesterday's hypothesis (was it confirmed/rejected?)
- Yesterday's distribution action (did it work?)
- Open blockers

### 2. Pull current metrics

For Vercel Analytics:
```bash
TOKEN=$(cat "$APPDATA/com.vercel.cli/Data/auth.json" | grep -oP '"token"\s*:\s*"\K[^"]+' | head -1)
curl -s "https://api.vercel.com/v1/web/insights/views?projectId=prj_cv56ut7vkVUHTK2rUlG8nUbTqrZf&teamId=team_JSn140IBiaI38CB0JYddr814&since=$(date -d 'yesterday' -u +%s)000&until=$(date -u +%s)000" -H "Authorization: Bearer $TOKEN" | head -200
```

Also check:
- GitHub stars: `gh api repos/FreemaX94/clipcraft --jq .stargazers_count`
- GitHub watchers: `gh api repos/FreemaX94/clipcraft --jq .subscribers_count`

### 3. Update METRICS.md

Append a row to the table with today's date, yesterday's numbers, source breakdown.

### 4. Create today's stand-up file

Copy `docs/STANDUPS/_template.md` to `docs/STANDUPS/YYYY-MM-DD.md` (use today's date in UTC).

Fill in:
- **Yesterday's metrics** (from step 2)
- **1 hypothesis to test today** — pick based on yesterday's data. Examples:
  - If conversions concentrated on one tool → "What if I emphasize tool X in the hero copy?"
  - If high bounce on mobile → "What if I add a mobile-specific warning?"
  - If Reddit traffic is dominant → "What if I post on a related sub today?"
- **1 distribution action** — concrete and shippable today (a Reddit reply, a Twitter quote-tweet, an Indie Hackers comment, etc.)
- **1 product improvement** — derived from a specific user comment / metric. If no concrete signal, skip this and write "None today, gathering signal".
- **Blockers**
- **Pivot watch** (J+10 onwards): is current 7-day avg below the threshold?

### 5. Stage the file

Don't commit yet — the user reviews and adjusts before commit.

## Output

Report to the user:
- "Stand-up written to `docs/STANDUPS/YYYY-MM-DD.md`."
- Quick summary: 3 lines max (yesterday's numbers, today's bet, blockers if any).

## Anti-patterns

- ❌ Don't invent metrics if the API is down → explicitly write "Vercel API unreachable" in the file
- ❌ Don't pick a hypothesis without grounding in yesterday's data
- ❌ Don't skip the pivot-watch section after J+10
