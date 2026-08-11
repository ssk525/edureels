# B-002 · Expo Go incompatible with SDK 57

## Meta

- **ID:** B-002
- **Title:** Play Store Expo Go rejects SDK 57 project
- **Status:** fixed (downgraded to SDK 54)
- **Found:** 2026-08-10 · Expo Go on Android (“Project is incompatible… requires newer Expo Go”)

## Repro

1. Project on Expo SDK 57
2. Install latest Expo Go from Play Store
3. Open `exp://…exp.direct` tunnel URL
4. Error: Project is incompatible with this version of Expo Go

## Trace

Expo Go binary on Play Store supports older SDK (54). SDK 57 Expo Go is not on Play Store yet (approval lag). Project runtimeVersion must match Expo Go.

## Attempts

| Date | Hypothesis / change | Result | Notes |
| --- | --- | --- | --- |
| 2026-08-10 | User updated Play Store Expo Go | Still incompatible | — |
| 2026-08-10 | Downgrade project to Expo SDK 54 + `expo install --fix` | Typecheck OK; restart tunnel | � |

## Fix

Downgrade to SDK 54 (D-012). Keep Play Store Expo Go.

## Verification

- [x] `npx tsc --noEmit`
- [ ] User reconnects Expo Go with new tunnel URL and app loads
