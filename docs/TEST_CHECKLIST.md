# TEST CHECKLIST

> Proof, not vibes. A change is not done until the relevant boxes are checked.
> Commands assume cwd: `edu-ai-reels/`

## Always (every code change)

- [x] `npx tsc --noEmit` exits 0 _(verified 2026-08-10 by agent)_
- [ ] Diff reviewed by human (line by line) — AI summary alone is not enough
- [x] No secrets in staged files (`git status` / `git diff` check `.env`) — `.env` gitignored; key still empty
- [x] If behavior changed: `docs/HANDOVER.md` or bug/feature file updated

## Feed / player changes

- [x] `npm start` → Metro up (or Expo already running) — restarted; waiting on `:8081`
- [ ] Expo Go: first reel loads (API, cache, or fallback) — **needs your phone / Expo Go**
- [ ] Vertical swipe next / previous works — **needs Expo Go**
- [ ] Tap toggles play / pause — **needs Expo Go**
- [ ] Leave a paused reel, swipe away, return — should autoplay (not stuck paused) — **needs Expo Go**
- [ ] Video end advances to next (or safely no-ops on last) — **needs Expo Go**
- [ ] Topic chip switch resets to first page of that topic — **needs Expo Go**
- [ ] Kill app and reopen — last topic chip is restored — **needs Expo Go**
- [x] Far-from-active pages show thumbnail (not many WebViews) — code path reviewed (`PREFETCH_WINDOW`); runtime confirm on device

## API / quota changes

- [x] With empty key: fallback path, clear message, no crash — `.env` empty; `HAS_API_KEY` false; bundle builds
- [x] With valid key: live YouTube search returns results _(agent verified 2026-08-10 — e.g. “Machine Learning Explained in 100 Seconds”)_
- [ ] Dev quota line updates after a fresh search — confirm in Expo Go (`source: Live`)
- [ ] Second open of same topic within 12h prefers cache — confirm in Expo Go

## Docs / architecture changes

- [x] `docs/FLOW.md` still matches real call order
- [x] New decision appended to `docs/DECISIONS.md` if tradeoff changed

## Agent smoke checks (2026-08-10)

- [x] Android bundle from Metro succeeds
- [x] `educationalScore` ranks explainers above music/vlog titles
- [x] ISO duration parse + ≤240s filter logic

## Expected quick commands

```bash
cd "f:\mOBILE APP\edu-ai-reels"
npx tsc --noEmit
npm start
```

Typecheck expected: no errors.  
Metro expected: `Waiting on http://localhost:8081` and Android/iOS bundle succeeds when opened from Expo Go.
