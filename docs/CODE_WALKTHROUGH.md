# CODE WALKTHROUGH (resume / interview)

> Own the mental model. Pair with [FLOW.md](FLOW.md) and [DECISIONS.md](DECISIONS.md).

## Elevator pitch (30 seconds)

EduReels is an Expo React Native app that plays short educational YouTube videos in a vertical reels feed, with topic/language controls, a local learning library, and an AI Pulse tab (RSS headlines + arXiv papers). It uses a quota-aware YouTube Data API layer and ships as an Android APK via EAS.

## Why Expo, not Flutter

*“The machine had Node but not Flutter/Android Studio. Expo Go got a phone MVP fast; we pinned SDK 54 for store Expo Go compatibility, then shipped an EAS APK. I’d revisit Flutter for heavier native animation or offline file playback.”*

## Architecture in one breath

```
AppShell (Feed | News | Library | Settings)
  → hooks (useVideoFeed, useLibrary, useSettings, useApiKey)
    → services (youtube, cache, quota, aiNews, arxiv, library, learning)
      → YouTube HTTP + RSS/arXiv + AsyncStorage + WebView embed
```

## Critical path (feed)

1. Resolve API key (on-device preferred, else `.env` builtin)  
2. Restore last topic  
3. Load: **cache → API → fallback**  
4. API: `search.list` then `videos.list`; filter ≤ ~4 min; rank titles  
5. `PagerView` swipe; mount player for `activeIndex ± 1`  
6. Embed with Referer `https://com.edureels.app`  

## Files to open cold

| File | Say this |
| --- | --- |
| `useVideoFeed.ts` | Feed state machine |
| `youtube.ts` | Quota-aware fetch + language bias |
| `YoutubeEmbedPlayer.tsx` | Referer fix for Error 152/153 |
| `aiNews.ts` / `arxiv.ts` | News Updates vs Papers |
| `educationalScore.ts` | Client ranking without extra API cost |
| `AppShell.tsx` | Product shell / tabs |

## Tradeoffs

- No video downloads (ToS + storage) — embed only  
- Duration timer ≈ ended event  
- Language filter is best-effort  
- Free quota forces cache discipline  

## Demo script

1. Feed swipe + topic/search  
2. News → Updates + Papers  
3. Library streak/saved  
4. Mention APK independent of PC  

## What you’d build next

- Jest tests for score + duration parse  
- Stronger paper↔explainer linking  
- CI on GitHub  
- Optional Play Store listing
