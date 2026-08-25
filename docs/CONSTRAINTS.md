# Product constraints — EduReels

Non-negotiable product rules for this app.

## Security & API

1. Never commit secrets (`.env`, API keys, tokens). Keep `.env` gitignored.
2. Prefer in-app / device-local API key entry over baking keys into the repo.
3. Use YouTube Data API + IFrame player only — no HTML scraping or video binary downloads.

## Product scope

1. Educational content first — minimal distraction UI.
2. Quota-aware: prefer valid cache over fresh search when possible.
3. No backend / auth / payments layer unless explicitly requested as a feature.

## Engineering

1. TypeScript strict; avoid `any` unless justified.
2. Prefer small, reviewable diffs for architecture changes.
3. Log meaningful tradeoffs in [DECISIONS.md](DECISIONS.md) and update [FLOW.md](FLOW.md) when call paths change.
