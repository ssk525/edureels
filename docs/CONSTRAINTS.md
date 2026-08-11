# CONSTRAINTS

> Scoped permission. “Allow” never means “allow anything.”
> AI must follow these unless the user explicitly overrides in the same message.

## Never

1. **Never commit or paste secrets** — `.env`, API keys, tokens. Keep `.env` gitignored.
2. **Never add dependencies** without asking first (new npm packages, SDKs, analytics).
3. **Never download Flutter / Android Studio / JDK** into this folder unless the user explicitly requests a Flutter migration.
4. **Never** put project downloads outside `f:\mOBILE APP\` (prefer `edu-ai-reels/` only).
5. **Never** scrape YouTube HTML or download video binaries — use Data API + IFrame player only.
6. **Never** invent a backend / auth / payments layer without an explicit feature request.
7. **Never** rewrite the feed architecture (PagerView → FlashList, hook → Redux, etc.) without a logged decision + user OK.
8. **Never** skip updating `docs/HANDOVER.md` + relevant bug/feature file when finishing a session of real work.
9. **Never** claim “done” without running or pointing to `docs/TEST_CHECKLIST.md` items that apply.
10. **Never** force-push, amend shared history, or skip git hooks unless the user explicitly asks.

## Always

1. **Plan before code** for non-trivial changes: approach, files touched, risks — then wait for direction if unclear.
2. **One logical change per request** when possible; split large asks.
3. **Comment non-obvious logic** (intent / assumptions), not restating the code.
4. **Log decisions** in `docs/DECISIONS.md` when choosing libraries, patterns, or tradeoffs.
5. **Update FLOW.md** if the call path between modules changes.
6. **Prefer small diffs** the human can read line by line.
7. **Pin model context** in decision / bug / feature entries (which AI / date).

## Soft preferences

- Minimal distraction-free UI (educational content first).
- TypeScript strict; no `any` unless justified in a comment.
- Quota-aware: prefer cache over fresh search when valid.
