# DECISIONS

> Why, not just what. Append new entries; never delete history (strike through if reversed).
> Format: date · decision · alternatives · reason

---

## D-001 · Expo (React Native) over Flutter

- **Date:** 2026-08-10
- **Decision:** Build EduReels with Expo SDK 57 + TypeScript.
- **Alternatives:** Flutter + `youtube_player_flutter`; bare React Native CLI.
- **Reason:** Machine had Node/npm only — no Flutter SDK, JDK, or Android Studio. Expo Go enables phone testing without multi-GB native tooling. Roadmap already listed `react-native-youtube-iframe`.
- **Tradeoff:** Pixel-perfect cross-platform animation story is Flutter’s strength; we accepted Expo for speed-to-device and resume timeline.

## D-002 · Keep project under `edu-ai-reels/` subfolder

- **Date:** 2026-08-10
- **Decision:** App lives in `f:\mOBILE APP\edu-ai-reels`, not the parent folder root.
- **Reason:** `create-expo-app` rejects names with spaces (`mOBILE APP`). Subfolder also isolates `node_modules` from misc parent files.

## D-003 · Vertical `PagerView` for Reels swipe

- **Date:** 2026-08-10
- **Decision:** Use `react-native-pager-view` with `orientation="vertical"` for the feed.
- **Alternatives:** FlashList + paging; ScrollView snap.
- **Reason:** Included in Expo Go, native page snapping, simple active-index via `onPageSelected`. Enough for MVP memory model (mount ±1 players).
- **Tradeoff:** Less virtualization than FlashList for huge lists; acceptable for personal learning feeds.

## D-004 · YouTube IFrame player, not downloaded video files

- **Date:** 2026-08-10
- **Decision:** Embed via `react-native-youtube-iframe` (WebView + official IFrame API).
- **Reason:** Legal/ToS-friendly playback; no local video hosting; works in Expo Go.
- **Tradeoff:** Depends on WebView + network; less control than native AV for offline.

## D-005 · Two-step YouTube API: search then videos.list

- **Date:** 2026-08-10
- **Decision:** `search.list` (100 quota) → `videos.list` (1 quota) for duration/embeddable filter.
- **Reason:** Search alone lacks reliable duration filtering for “short educational” priority. Client filters ≤ 240 seconds and drops non-embeddable.
- **Tradeoff:** ~101 units per page; mitigated by 12h AsyncStorage cache + local quota counter.

## D-006 · Offline fallback when no key / API failure

- **Date:** 2026-08-10
- **Decision:** Ship curated `FALLBACK_VIDEOS` so the app always demos.
- **Reason:** Resume/demo reliability; lets UI/player work before Cloud Console setup.

## D-007 · Prefetch window = 1 (memory)

- **Date:** 2026-08-10
- **Decision:** Only mount YouTube WebViews for `activeIndex ± PREFETCH_WINDOW` (1). Farther pages show thumbnail only.
- **Reason:** Each player is a WebView; mounting all pages kills memory/scroll smoothness.

## D-008 · Figma not required for MVP

- **Date:** 2026-08-10
- **Decision:** Ship minimal dark distraction-free UI in code; Figma Pro optional later for branding.
- **Reason:** Product goal is learning content, not social chrome. Avoid blocking on design tool access.

## D-009 · Project continuity docs are first-class

- **Date:** 2026-08-10
- **Decision:** Maintain `docs/` (HANDOVER, DECISIONS, FLOW, ARCHITECTURE, CONSTRAINTS, TEST_CHECKLIST, ROLLBACK, bug/feature traces).
- **Reason:** Portfolio + resume require the owner to understand deep “why”; sessions must not start from zero.

## D-010 · Persist last topic + educational title ranking

- **Date:** 2026-08-10
- **Decision:** Save last topic chip in AsyncStorage; rank API results with a local title score (`educationalScore`) before showing the feed.
- **Alternatives:** Always start on Machine Learning; rely only on YouTube `order=relevance`; add a ranking API.
- **Reason:** Resume continuity for learners; prefer explainer titles without spending more quota or adding dependencies.
- **Tradeoff:** Keyword scoring is heuristic — can mis-rank edge cases; acceptable for MVP and easy to tune.

## D-011 · Expo tunnel for phone on different Wi‑Fi

- **Date:** 2026-08-10
- **Decision:** Use `npx expo start --tunnel` (+ `@expo/ngrok`) when PC LAN ≠ phone college Wi‑Fi.
- **Alternatives:** Force same SSID; USB/`adb` (needs Android SDK).
- **Reason:** College Wi‑Fi and lab LAN often cannot see each other; tunnel works across networks.
- **Tradeoff:** Slower than LAN; depends on Expo/ngrok connectivity.

## D-013 · YouTube Error 153 needs HTTPS baseUrl / Referer

- **Date:** 2026-08-11
- **Decision:** Use `useLocalHTML` with `baseUrlOverride="https://www.youtube.com"` for the iframe player.
- **Alternatives:** Remote default HTML host; CORS proxy; open YouTube app externally.
- **Reason:** YouTube Error 153 (“Video player configuration error”) when WebView has no valid Referer.

## D-014 · Error 152-4 → load embed URI with app Referer header

- **Date:** 2026-08-11
- **Decision:** Replace `react-native-youtube-iframe` local HTML with a custom `YoutubeEmbedPlayer` that loads `https://www.youtube.com/embed/{id}` and sets `headers.Referer = https://com.edureels.app` (matches `app.json` package id).
- **Alternatives:** Keep `baseUrl` HTML wrapper; CORS proxy; open YouTube app only.
- **Reason:** After D-013, user still saw Error **152-4** (“This video is unavailable”). Community fix for RN WebView is an explicit Referer on the embed request, not only `baseUrl`.

## D-015 · Product shell without accounts

- **Date:** 2026-08-11
- **Decision:** Ship Feed / Library / Settings + local AsyncStorage engagement (like/save/history) and first-run onboarding — no auth backend.
- **Alternatives:** Full social app; Firebase auth; Expo Router multi-stack later.
- **Reason:** User asked to make the best possible learning app within current Expo Go + YouTube API constraints; local-first keeps resume/portfolio scope honest and shippable.

## D-016 · EduReels brand = teal learning identity

- **Date:** 2026-08-11
- **Decision:** Keep name **EduReels**, tagline **Learn AI in sixty seconds**, accent `#2DD4BF` on charcoal `#070A10`.
- **Alternatives:** Rename to LearnClip / AISwipe; purple “AI default” palette.
- **Reason:** Clear portfolio brand; avoid generic purple AI look; short tagline is interview-friendly.
