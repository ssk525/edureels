# Interview Q&A — EduReels

> Study answers, then close the file and answer from memory.

## Product & motivation

**Q: What is EduReels?**  
A: A React Native (Expo) app for short educational AI/ML YouTube reels, with topic discovery, local library, and an AI news/papers pulse. Shipped as an Android APK.

**Q: Who is it for?**  
A: Learners who want TikTok-style swipe UX but for concepts (ML, transformers, LLMs), plus daily AI headlines and research abstracts.

## Stack

**Q: Why Expo instead of Flutter?**  
A: Delivery machine had Node only. Expo Go enabled phone testing without Android Studio/Flutter SDK. We locked SDK 54 for Expo Go compatibility. Flutter remains an option later for heavier native needs.

**Q: Why TypeScript?**  
A: Safer refactors across hooks/services; clearer interviewable types for videos, topics, settings.

## Architecture

**Q: How is the app structured?**  
A: `AppShell` tabs → screens → hooks (`useVideoFeed`, `useLibrary`) → services (`youtube`, `cache`, `quota`, `aiNews`, `arxiv`). AsyncStorage for local persistence.

**Q: Why no Redux?**  
A: One feed state machine in a hook is enough for MVP; less boilerplate, easier to explain.

## YouTube API

**Q: How do you fetch videos?**  
A: `search.list` for candidates (short, embeddable), then `videos.list` for duration/status. Filter ≤ ~4 minutes, rank titles, cache page.

**Q: What about quota?**  
A: Search costs ~100 units; videos.list ~1. Default free cap ~10k/day. We cache ~12h, track daily usage, soft-gate when remaining quota is too low.

**Q: Why two API calls?**  
A: Search doesn’t reliably give duration/embed flags we need for a reels experience.

## Playback

**Q: How do videos play?**  
A: WebView loads YouTube embed URL with `Referer: https://com.edureels.app` to satisfy YouTube’s embed identity rules (fixes Error 152/153).

**Q: Do you download videos?**  
A: No. Embedding is the compliant path; downloading would raise ToS and storage issues.

## Features

**Q: What does the News tab do?**  
A: **Updates** = aggregated AI RSS headlines. **Papers** = latest arXiv cs.AI/LG/CL entries. Both free; no YouTube key required for that tab.

**Q: How do multiple people use one APK?**  
A: Each user pastes their own YouTube Data API key on device so quotas aren’t shared from one baked-in key.

**Q: English and Hindi?**  
A: Settings/onboarding set content language. Queries and title heuristics bias toward EN and/or HI; YouTube language filters aren’t perfect.

## Tradeoffs & honesty

**Q: What’s the weakest part?**  
A: Embed reliability still depends on YouTube/WebView; ended-event is approximated by duration timer; no automated E2E tests yet; RSS sources can flake (we use `Promise.allSettled`).

**Q: What would you add next?**  
A: Unit tests for scoring/duration parsing; better paper-to-explainer linking; optional watch-later; CI on GitHub.

## Behavioral bridge

**Q: What did you learn?**  
A: Mobile embeds need correct HTTP identity; free APIs force caching discipline; shipping an APK changes how you think about updates vs live content feeds.
