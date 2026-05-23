---
name: launch-post-publish
description: Walks the user through publishing one of the prepared launch posts in docs/LAUNCH/. Reads the post for the chosen channel, copies the content to clipboard if possible, opens the right URL, and prepares the maker's first comment + reply templates. Use on launch day (J0) for each channel.
---

# Launch Post — publish helper

This skill turns the prepared markdown in `docs/LAUNCH/*.md` into an actual published post by walking the founder through each channel one at a time.

## When to invoke

- On launch day (J0 = 2026-06-07)
- User says "publish HN", "publish Reddit", "post twitter", "launch on PH"
- For re-posts on follow-up days (Indie Hackers, LinkedIn, Lobste.rs)

## What to do

### Step 1 — Identify the channel

Ask the user (or infer from message):
- `hn` → docs/LAUNCH/show-hn.md → https://news.ycombinator.com/submit
- `reddit-sideproject` → docs/LAUNCH/reddit-r-sideproject.md → https://www.reddit.com/r/SideProject/submit
- `reddit-webdev` → docs/LAUNCH/reddit-r-webdev.md → https://www.reddit.com/r/webdev/submit
- `reddit-privacy` → docs/LAUNCH/reddit-r-privacy.md → https://www.reddit.com/r/privacy/submit
- `twitter` → docs/LAUNCH/twitter-thread.md → https://twitter.com/compose/tweet
- `producthunt` or `ph` → docs/LAUNCH/product-hunt.md → https://www.producthunt.com/posts/new
- `indie-hackers` or `ih` → docs/LAUNCH/indie-hackers.md → https://www.indiehackers.com/new-post
- `linkedin` → docs/LAUNCH/linkedin.md → https://www.linkedin.com/feed/?shareActive=true

### Step 2 — Quick pre-flight checklist

Run `prod-audit` skill first. If it fails, **stop** — do not publish to a broken site.

Check:
- Is the URL `https://clipcraft-app.vercel.app` reachable and 200?
- Is the OG image rendering? (open opengraph.xyz with the URL or curl the meta tags)
- Are there any open issues on GitHub that would be embarrassing if linked in the post?

### Step 3 — Extract the post content

Read the target file. The file has these sections (consistent across channels):
- **Title** — copy into the submission's title field
- **Body** — copy into the body field (HN is plain text, others markdown)
- **First reply / first comment** — post within 2 minutes of submission
- **Reply templates** — keep at hand for incoming comments

Output the title, body, and first comment as three clearly-separated code blocks.

### Step 4 — Channel-specific timing & rules reminders

- **Hacker News**: Submit Tuesday-Thursday 8:00-10:00 UTC. Title under 80 chars. No emoji.
- **Product Hunt**: Submit 00:01 PST = 08:01 UTC. Don't ask for upvotes publicly. Hunter must comment first.
- **Reddit r/SideProject**: Showcase post. Self-deprecating tone wins. Reply within first hour.
- **Reddit r/webdev**: Saturday for Showcase Saturday. Title in [Showcase] format.
- **Reddit r/privacy**: Lead with the problem, not the product. Mods may remove if too promo.
- **Twitter**: First tweet must have media (GIF/screenshot), no link. Link goes in tweet 7+.
- **Indie Hackers**: Long-form welcome. Retrospective vibe. Ask 1-2 questions to engage.
- **LinkedIn**: Professional tone. Link in last paragraph (LinkedIn deboosts external links).

### Step 5 — Open the submission URL

The user actually publishes (irreducibly human). Tell them:
- "Open <URL>"
- "Paste title from block 1"
- "Paste body from block 2"
- "Submit"
- "Within 2 minutes, paste block 3 (first comment) as the first reply"

### Step 6 — Log the publication

Append to `LOG.md`:

```
**[HH:MM UTC] [PHASE 6] Posted on <channel>**
- URL: <submission-url> (once user gives it)
- Title: <title>
- Initial signal: TBD (check in 2h)
```

Update `docs/LAUNCH/launch-checklist.md` by checking off the corresponding action.

## Output format

Return to the user:

```
LAUNCH POST READY — <channel>

🌐 Submission URL: <URL>
📋 Title (copy this):
   <title>

📋 Body (copy this):
   <body>

📋 First comment (post within 2 min):
   <first-comment>

⏰ Optimal timing: <channel-specific window>
⚠️ Channel rules: <key rules>

When you've posted, send me the submission URL so I can log it in LOG.md.
```

## Anti-patterns

- ❌ Don't auto-post on behalf of the user — submissions are tied to their account/karma
- ❌ Don't cross-post (same content to 3 subs in 1 hour) — Reddit auto-flag
- ❌ Don't skip the prod-audit step — broken site + launch post = burned channel
