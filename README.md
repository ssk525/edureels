# EduReels

Vertical educational YouTube reels for AI/ML learning — Expo React Native (TypeScript), local library, AI news + arXiv papers, Android APK via EAS.

Portfolio / resume project with full decision docs under [`docs/`](docs/DOCS_INDEX.md).

## Download the Android app

Install the latest standalone APK (no PC / Expo Go needed):

**[Download EduReels APK (Google Drive)](https://drive.google.com/file/d/1PqOMWOtLHw2e3FdjbXvoQQjZZbDnax07/view?usp=sharing)**

On Android: open the link → Download → allow “Install unknown apps” if prompted.  
Details: [docs/SHARE_APK.md](docs/SHARE_APK.md)

## Features

- Vertical reels feed with topics + search  
- YouTube Data API (cache, quota, offline fallbacks)  
- EN / Hindi content preference  
- Like, save, share, history, notes, streak  
- News: industry headlines (RSS) + arXiv papers  
- Per-device API key setup  
- Standalone Android APK (EAS)

## Docs (start here)

| Audience | Open |
| --- | --- |
| **Project status / continuity** | [docs/DOCS_INDEX.md](docs/DOCS_INDEX.md) → [docs/HANDOVER.md](docs/HANDOVER.md) |
| **Learn the build** | [docs/LEARNING_FROM_SCRATCH.md](docs/LEARNING_FROM_SCRATCH.md) |
| **Interview talk** | [docs/INTERVIEW_PITCH.md](docs/INTERVIEW_PITCH.md) |
| **Interview Q&A** | [docs/INTERVIEW_QA.md](docs/INTERVIEW_QA.md) |
| **Resume (3 lines)** | [docs/RESUME_BULLETS.md](docs/RESUME_BULLETS.md) |
| **APK share** | [docs/SHARE_APK.md](docs/SHARE_APK.md) |

Also: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/DECISIONS.md](docs/DECISIONS.md)

## Run (development)

```bash
cd edu-ai-reels
npm install
npx expo start --tunnel
```

Use Expo Go (SDK 54). Add key in-app or in `.env`:

```
EXPO_PUBLIC_YOUTUBE_API_KEY=your_key_here
```

**Never commit `.env`.**

## Standalone APK

- **Public install link:** [Google Drive APK](https://drive.google.com/file/d/1PqOMWOtLHw2e3FdjbXvoQQjZZbDnax07/view?usp=sharing)
- Rebuild yourself:

```bash
npx eas-cli login
npx eas-cli build -p android --profile preview
```

Details: [docs/SHARE_APK.md](docs/SHARE_APK.md)

## Layout

```
src/components/   AppShell, Feed, News, Library, Settings, player
src/hooks/        useVideoFeed, useLibrary, useSettings, useApiKey
src/services/     youtube, cache, quota, library, learning, aiNews, arxiv, apiKey
src/config/       topics, env
docs/             learning, interview, resume, architecture, decisions
```

## GitHub

When pushing: exclude secrets, include `docs/`, use resume blurb from [docs/RESUME_BULLETS.md](docs/RESUME_BULLETS.md).
