# Learning EduReels from scratch

> Goal: understand **what** we built, **why**, and **how** — so you can explain it without reading chat history.
> Read slowly. Open the linked files while you study.

## 0. What the product is

**EduReels** is a mobile app (Android) where you:

1. Swipe vertical **short educational YouTube videos** (ML, DL, LLMs, etc.)
2. Switch **topics** or **search**
3. Prefer **English / Hindi / both**
4. **Like / save / share**, keep **history**, **notes**, **streak**
5. Open **News**: industry **headlines** (RSS) + **arXiv papers**
6. Install as a real **APK** (no PC needed after install)

It is a **portfolio / resume** project with deep ownership of the code.

---

## 1. Why this stack (beginning)

### Machine constraints

- PC had **Node.js / npm**
- No Flutter SDK, no full Android Studio toolchain at the start
- Needed to test on a **real phone** quickly

### Choice

| Option | Verdict |
| --- | --- |
| Flutter | Deferred — missing SDK/tooling |
| Expo + React Native + TypeScript | **Chosen** — Expo Go → later EAS APK |

**SDK note:** Project uses **Expo SDK 54** so it matches Play Store Expo Go. SDK 57 was tried and caused “project incompatible.”

Decision log: [DECISIONS.md](DECISIONS.md) (D-001, D-012).

---

## 2. Project birth

```text
f:\mOBILE APP\edu-ai-reels\     ← app root (keep node_modules here)
  App.tsx                       ← StatusBar + AppShell
  app.json / eas.json           ← Expo + EAS config
  .env                          ← YouTube key (GITIGNORED)
  src/
    components/                 ← UI screens & player
    hooks/                      ← useVideoFeed, useLibrary, useSettings, useApiKey
    services/                   ← youtube, cache, quota, library, learning, arxiv, aiNews, apiKey
    config/                     ← topics, env constants
    data/                       ← offline fallback videos
    utils/                      ← duration parse, educationalScore
  docs/                         ← this collaboration + learning pack
```

Created with Expo blank TypeScript template, then filled layer by layer.

---

## 3. Core idea: vertical feed of educational shorts

### UI

- `react-native-pager-view` — vertical pages (Reels-style)
- Each page = `ReelCard` (player + overlay + actions)
- Topic chips + search on top
- Bottom tabs: **Feed · News · Library · Settings** (`AppShell`)

### Data

1. User picks a **topic** (or search string)
2. App calls **YouTube Data API v3**
3. Keep only **short**, **embeddable** clips
4. **Rank** titles toward “explained / tutorial”
5. **Cache** results ~12h (save quota)
6. If no key / API fail → **fallback** curated IDs

Quota: search ≈ **100** units, videos.list ≈ **1**. Free default ≈ **10,000/day**.

---

## 4. YouTube playback (hardest bug)

### Problem

Embedding YouTube inside a React Native **WebView** often shows:

- Error **153** / **152-4** — “video unavailable” / config error

### Cause

Modern YouTube embeds expect a valid HTTPS **Referer**. Local WebViews often send none.

### Fix we shipped

Custom `YoutubeEmbedPlayer`:

- Load `https://www.youtube.com/embed/{id}?...`
- Send header `Referer: https://com.edureels.app` (matches `app.json` package id)
- Immersive (`controls=0`); our UI handles pause/mute/next
- Auto-skip when WebView HTTP/load errors

See bug trace: [bugs/003-youtube-watch-on-youtube.md](bugs/003-youtube-watch-on-youtube.md).

---

## 5. Product features added after MVP

| Feature | Where |
| --- | --- |
| Onboarding (topic + language) | `OnboardingScreen` |
| Per-device YouTube API key | `ApiKeySetupScreen` + `apiKey.ts` |
| Like / save / share / history / notes / streak | `library.ts`, `learning.ts` |
| Settings (mute, auto-advance, language, quota) | `SettingsScreen` |
| AI News headlines (RSS) | `aiNews.ts` → News **Updates** |
| arXiv papers | `arxiv.ts` → News **Papers** |
| EN / HI content bias | `youtube.ts` + settings |
| Standalone APK | EAS `preview` profile → Android APK |

---

## 6. Dev vs production

| Mode | How | Needs PC? |
| --- | --- | --- |
| Expo Go + tunnel | `npx expo start --tunnel` | Yes |
| Installed APK | EAS build, install `.apk` | No (after install) |

News/papers/videos still need **phone internet**.

Sharing APK: [SHARE_APK.md](SHARE_APK.md).

---

## 7. Security habits (memorize)

- Never commit `.env` or real API keys
- Prefer **each user pastes their own key** on device (group of friends / class)
- Restrict Google Cloud key to **YouTube Data API v3** only
- APK download links on Expo expire (availability days) — save a local copy

---

## 8. Study path (1–2 evenings)

1. Read this file end-to-end  
2. Open [FLOW.md](FLOW.md) and trace one swipe  
3. Open `src/hooks/useVideoFeed.ts` and narrate cache → API → fallback  
4. Open `src/services/youtube.ts` and explain quota  
5. Open `YoutubeEmbedPlayer.tsx` and explain Referer  
6. Practice [INTERVIEW_PITCH.md](INTERVIEW_PITCH.md) out loud  
7. Drill [INTERVIEW_QA.md](INTERVIEW_QA.md)  

---

## 9. What “done” looked like for v1.1

- Working feed on phone (Expo Go + APK)
- Library + settings + news/papers
- Cleaner UI (minimal chrome on Feed)
- Docs pack for learning, interview, resume, and agent continuity

Next when you are ready: **first clean GitHub push** (no secrets).
