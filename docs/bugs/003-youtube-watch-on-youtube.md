# B-003 · YouTube shows “Watch on YouTube” / no inline play

## Meta

- **ID:** B-003
- **Title:** Inline player stuck on Watch on YouTube / Error 152-4
- **Status:** investigating / fix shipped (awaiting verify)
- **Found:** 2026-08-10 · Expo Go Android screenshot from user

## Repro

1. Open EduReels via tunnel in Expo Go
2. Feed metadata loads (title, channel, quota)
3. Player shows “This video is unavailable” / Error 152-4 or 153
4. Video does not play inline

## Trace

`FeedScreen` → `ReelCard` → `YoutubeEmbedPlayer` (WebView) → YouTube embed.

Root cause: YouTube now requires a valid HTTPS **Referer** for embeds. Expo Go WebViews often send none → Error 153 / 152-4.

## Attempts

| Date | Hypothesis / change | Result | Notes |
| --- | --- | --- | --- |
| 2026-08-10 | Remove full-screen press overlay; muted autoplay; controls | Still Error 153 | � |
| 2026-08-11 | Error 153 = missing Referer. Set `useLocalHTML` + `baseUrlOverride=https://www.youtube.com` | Became Error **152-4** | � |
| 2026-08-11 | Custom WebView: load embed **URI** + `Referer: https://com.edureels.app` (D-014) | Awaiting user verify | � |

## Fix

Load `youtube.com/embed/{id}` directly with `headers.Referer = https://com.edureels.app` (package id from `app.json`). Curated fallbacks cleaned to verified embeddable IDs.

## Verification

- [ ] Video plays inline in Expo Go (no 152-4 / 153)
- [ ] Pause / unmute buttons work
- [ ] Swipe still works
