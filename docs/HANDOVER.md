# HANDOVER

> Living continuity file. Read when returning to the project. Update when status changes.
> Last updated: 2026-08-11

## Project one-liner

**EduReels** — Expo SDK 54 (React Native + TypeScript): vertical educational YouTube reels (ML/AI), local library, AI news (RSS) + arXiv papers, Android APK via EAS. Portfolio / resume project.

## Bootstrap (new laptop)

1. Read [DOCS_INDEX.md](DOCS_INDEX.md)  
2. Read this file + [CONSTRAINTS.md](CONSTRAINTS.md)  
3. Never commit `.env` or API keys  

Human learning pack: [LEARNING_FROM_SCRATCH.md](LEARNING_FROM_SCRATCH.md) · [INTERVIEW_PITCH.md](INTERVIEW_PITCH.md) · [INTERVIEW_QA.md](INTERVIEW_QA.md) · [RESUME_BULLETS.md](RESUME_BULLETS.md)

## Where things stand

| Area | Status |
| --- | --- |
| Expo SDK 54 + TypeScript | Done |
| Vertical feed + topics + search | Done |
| YouTube embed + Referer fix | Done (`YoutubeEmbedPlayer`) |
| Cache / quota / fallbacks | Done |
| EN / Hindi content preference | Done |
| Per-device API key setup | Done |
| Library (like/save/history/notes/streak) | Done |
| News: Updates (RSS) + Papers (arXiv) | Done |
| Clean Feed chrome (no slogan) | Done |
| EAS Android preview APK | Done (multiple builds under `@ssk525/edureels`) |
| Collaboration + learning docs | Done (`docs/`) |
| GitHub remote / first public push | **Not done yet** — wait for user ask; never commit secrets |

## In progress / next human actions

1. Study learning + interview docs (above).  
2. When ready: ask to create **first clean GitHub commit + push** (`.env` stays out).  
3. Optional: rename launcher label, Play Store submission, automated tests.

## Broken / known gaps

- YouTube language filters are heuristic, not perfect.  
- Embed reliability still WebView/YouTube dependent; ended uses duration timer.  
- RSS feeds can fail individually (`Promise.allSettled`).  
- No automated unit/E2E tests yet — [TEST_CHECKLIST.md](TEST_CHECKLIST.md).  
- Expo APK artifact links expire (save local APK copy).

## Do not rediscover

- Stack is **Expo SDK 54 + TypeScript**, not Flutter ([DECISIONS.md](DECISIONS.md)).  
- Package id `com.edureels.app` — used as YouTube Referer.  
- EAS project: `@ssk525/edureels` (slug `edureels`).  
- Prefer per-user API keys for shared APKs.

## Session handoff (latest)

```
Did: Full docs pack — DOCS_INDEX, LEARNING_FROM_SCRATCH, INTERVIEW_PITCH,
     INTERVIEW_QA, RESUME_BULLETS; refreshed HANDOVER/README/AGENTS for
     laptop move + agent continuity. Ready for GitHub when user asks.
Left: User review docs; then request clean GitHub commit/push (no .env).
Watch: Do not push secrets; confirm .gitignore includes .env.
```

## How to resume in one minute

1. Read this file + CONSTRAINTS.  
2. Skim FLOW if changing load/play.  
3. Plan first; one logical change.  
4. Update this HANDOVER before ending.
