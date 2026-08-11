# ROLLBACK

> Safety net before large or risky edits. Fill the “active rollback” section when starting risky work.

## Safe defaults

| Situation | Rollback |
| --- | --- |
| Uncommitted bad edit | `git restore <file>` or discard in IDE |
| Bad local commit (not pushed) | `git revert <sha>` (prefer revert over hard reset) |
| Bad pushed commit | `git revert <sha>` + push — **no force-push to main** |
| Dependency mess | restore `package.json` + `package-lock.json`, then `npm ci` |
| Metro / Babel weirdness | delete `.expo` cache; do not invent babel configs without `babel-preset-expo` installed |

## Active rollback (fill when starting risky work)

```
Change goal:
Files likely touched:
Last known good commit / tag:
Verify after rollback: (link TEST_CHECKLIST items)
```

Currently: **no risky migration in flight.** Last known good local state = MVP Phases 1–5 + docs set (2026-08-10).

## High-risk areas

1. Replacing `PagerView` feed
2. Changing YouTube player library
3. Adding native modules that break Expo Go
4. Migrating to Flutter

For those: write a short plan in a `docs/features/` file first, get user OK, then implement.

## Restore secrets note

If `.env` is lost: recreate from Google Cloud Console API key; never recover keys from git history (they should not be there).
