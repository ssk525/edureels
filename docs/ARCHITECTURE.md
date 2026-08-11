# ARCHITECTURE

> High-level map — shape, not every line. Re-read every session.

## Goal

Educational vertical video feed (YouTube) + local learning journal + AI Pulse (RSS + arXiv). Runtime: Expo Go (dev) and EAS Android APK (shipped).

## Layers

```
┌──────────────────────────────────────────────┐
│  UI                                          │
│  AppShell → Feed | News | Library | Settings │
│  ReelCard · YoutubeEmbedPlayer · TopicChips  │
├──────────────────────────────────────────────┤
│  Hooks                                       │
│  useVideoFeed · useLibrary · useSettings     │
│  useApiKey                                   │
├──────────────────────────────────────────────┤
│  Services                                    │
│  youtube · cache · quota · preferences       │
│  library · learning · apiKey · aiNews · arxiv│
├──────────────────────────────────────────────┤
│  Config / data / utils                       │
│  topics · env · fallbackVideos · score · theme│
├──────────────────────────────────────────────┤
│  Platform                                    │
│  Expo SDK 54 · RN 0.81 · AsyncStorage        │
│  WebView · PagerView · EAS Build             │
└──────────────────────────────────────────────┘
```

## Data model (core)

`EduVideo`: `id`, `title`, `channelTitle`, `channelId`, `topicId`, `topicLabel`, `thumbnail`, `durationSec`

`VideoSource`: `'api' | 'cache' | 'fallback'`

`ContentLanguage`: `'en' | 'hi' | 'both'`

## External systems

| System | Use | Constraint |
| --- | --- | --- |
| YouTube Data API v3 | Search + video metadata | ~100 + 1 quota units; 10k/day default |
| YouTube embed | Playback in WebView | Needs HTTPS Referer (`https://com.edureels.app`) |
| RSS feeds | AI headlines | Free; may flake per source |
| arXiv Atom API | Research papers | Free; no YouTube key |
| AsyncStorage | Cache, prefs, library, keys | Device-local |
| EAS | Android APK | `@ssk525/edureels` |

## Non-goals (for now)

- Downloading YouTube files  
- Cloud auth / sync  
- Play Store listing (optional later)  
- Flutter rewrite  

## Related

[FLOW.md](FLOW.md) · [DECISIONS.md](DECISIONS.md) · [LEARNING_FROM_SCRATCH.md](LEARNING_FROM_SCRATCH.md)
