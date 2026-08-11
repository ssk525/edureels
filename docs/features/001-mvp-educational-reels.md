# F-001 · MVP Educational AI Reels (Phases 1–5)

## Meta

- **ID:** F-001
- **Title:** Educational AI Reels MVP
- **Status:** done (pending user API key + phone QA)
- **Opened:** 2026-08-10

## Scope

In:

- Expo TypeScript app in this folder
- Vertical swipe feed, play/pause, next/prev
- YouTube Data API v3 search for ML/DL/AI topics
- Short/educational filter, embed player, cache, quota awareness
- Local test via Expo Go

Out:

- Figma branding system
- Flutter port
- Auth / social features
- Custom backend

## Plan (executed)

1. Choose Expo over Flutter (machine constraints) → D-001
2. Scaffold + install player/pager/storage packages
3. Build services → hook → UI binding
4. Document collaboration workflow for GitHub/resume ownership

## Attempts

| Date | What we tried | Result | Notes |
| --- | --- | --- | --- |
| 2026-08-10 | `create-expo-app` in parent folder | Failed: space in folder name | � |
| 2026-08-10 | Create `edu-ai-reels` subapp | Success | � |
| 2026-08-10 | Custom `babel.config.js` | Metro failed missing `babel-preset-expo`; removed config | � |
| 2026-08-10 | `npx tsc --noEmit` + Android bundle | Success (bundle ~4.3MB) | � |

## Verification

- [x] `npx tsc --noEmit` clean
- [x] Metro serves Android bundle
- [ ] User Expo Go swipe/play QA
- [ ] Live API with real key

## Handoff

Add API key → restart Expo → phone test → then GitHub (without `.env`). Collaboration docs now required reading for future sessions.
