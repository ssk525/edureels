# F-002 · Resume polish: persist topic + educational filter + walkthrough

## Meta

- **ID:** F-002
- **Title:** Resume / GitHub readiness polish (no new deps)
- **Status:** done (pending phone QA for prefs/pause)
- **Opened:** 2026-08-10

## Scope

In:

- Persist last selected topic across app restarts (AsyncStorage)
- Soft educational keyword preference when ranking API results
- Reset pause when leaving a reel page
- `docs/CODE_WALKTHROUGH.md` for interview ownership

Out:

- New npm dependencies
- Auth / backend
- Figma branding
- GitHub push (user must ask)

## Plan (executed)

1. `services/preferences.ts` — get/set last topic id
2. `utils/educationalScore.ts` + rank in `youtube.ts`
3. `ReelCard` — clear pause when inactive
4. `useVideoFeed` — hydrate topic before first load; save on change
5. Docs + typecheck

## Attempts

| Date | What we tried | Result | Notes |
| --- | --- | --- | --- |
| 2026-08-10 | Implement F-002 as planned | Code + docs landed | � |

## Verification

- [x] `npx tsc --noEmit` (run after implementation)
- [ ] Cold start restores last topic (Expo Go)
- [ ] Swipe away and back: video not stuck paused

## Handoff

Ready for user API key + phone QA. Next optional slice: persist last index per topic, or first GitHub commit.
