# Interview pitch — how to talk about EduReels

> Practice out loud. Sound like you built it — because you did.

## 30-second version

“I built EduReels, an Expo React Native app that serves short educational YouTube videos on AI and machine learning in a vertical reels feed. It uses the YouTube Data API with caching and quota awareness, supports English and Hindi content preference, and includes a local learning library plus an AI updates tab with industry headlines and arXiv papers. I also shipped a standalone Android APK with EAS so it runs without a development PC.”

## 2-minute version (structure)

1. **Problem** — Short-form learning is addictive, but most feeds aren’t educational or topic-controlled.  
2. **Solution** — Vertical educational reels filtered by topic, language, and explainer-style ranking.  
3. **Architecture** — UI → hooks → services → YouTube / AsyncStorage / WebView; no heavy Redux.  
4. **Hardest bug** — YouTube Error 152/153 in WebView fixed with an explicit HTTPS Referer matching the app id.  
5. **Ops reality** — Free API quota, 12h cache, offline fallbacks, per-device API keys for sharing.  
6. **Ship** — EAS preview APK for real-device install and distribution.  
7. **What I’d do next** — tests for scoring/parsers, watch-later sync, better paper↔video linking.

## Demo script (if they ask to show)

1. Feed: swipe, pause, change topic, search  
2. Settings: language EN/HI  
3. Library: saved + streak  
4. News: Updates (headlines) vs Papers (arXiv)  
5. Mention: “APK install works offline from PC; content still needs network.”

## Phrases that sound senior (use carefully)

- “Quota-aware data layer”  
- “Client-side ranking to avoid extra API cost”  
- “Graceful degradation: cache → API → curated fallback”  
- “Referer identity for embed compliance”  
- “Local-first learning journal; no auth backend yet”

## Phrases to avoid

- “AI wrote the whole app”  
- “I don’t know why the Referer is needed”  
- “We download YouTube videos” (we don’t — we embed)

## If asked “what was your contribution?”

Be honest and specific:

- Product decisions (Expo vs Flutter, tabs, news + papers)  
- Debugging playback on Android WebView  
- Quota/cache design  
- Shipping APK and documenting for resume  

Point to `docs/DECISIONS.md` and `docs/bugs/003-*.md` as proof of process.
