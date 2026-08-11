# B-001 · Metro fail: missing babel-preset-expo

## Meta

- **ID:** B-001
- **Title:** Metro transformer cannot find `babel-preset-expo`
- **Status:** fixed
- **Found:** 2026-08-10 · Expo start log

## Repro

1. Add root `babel.config.js` with `presets: ['babel-preset-expo']`
2. `npx expo start --lan`
3. Error: `Cannot find module 'babel-preset-expo'`

Expected: Metro waits on 8081 without transformer errors.  
Actual: transformer construction failed; server still listened but bundling broken until fixed.

## Trace

Expo Metro → `@expo/metro-config` babel transformer → loads project Babel config → requires `babel-preset-expo`. Blank TypeScript template relied on Expo defaults without a local babel config file.

## Attempts

| Date | Hypothesis / change | Result | Notes |
| --- | --- | --- | --- |
| 2026-08-10 | Remove `babel.config.js`; restart Metro | Fixed; Android bundle OK | � |

## Fix

Deleted custom Babel config; use Expo SDK 57 defaults. Constraint: do not re-add without installing the preset as a dependency.

## Verification

- [x] Metro `Waiting on http://localhost:8081`
- [x] `Android Bundled` success
- [x] Note in HANDOVER + CONSTRAINTS / DECISIONS-adjacent docs
