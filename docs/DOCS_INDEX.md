# Docs index (start here)

> If you moved this project to a new laptop, open this file first.
> Suggested order: HANDOVER → CONSTRAINTS → ARCHITECTURE → FLOW → DECISIONS → LEARNING_FROM_SCRATCH.

Markdown is preferred over PDF so GitHub can render and diff everything cleanly.

## Project continuity (order)

1. [HANDOVER.md](HANDOVER.md) — current status  
2. [CONSTRAINTS.md](CONSTRAINTS.md) — hard limits (never commit `.env`)  
3. [ARCHITECTURE.md](ARCHITECTURE.md) — system map  
4. [FLOW.md](FLOW.md) — load / play path  
5. [DECISIONS.md](DECISIONS.md) — why Expo, WebView Referer, etc.  
6. [LEARNING_FROM_SCRATCH.md](LEARNING_FROM_SCRATCH.md) — full build story  

## Learning + career

| File | Purpose |
| --- | --- |
| [LEARNING_FROM_SCRATCH.md](LEARNING_FROM_SCRATCH.md) | How we built EduReels from zero |
| [INTERVIEW_PITCH.md](INTERVIEW_PITCH.md) | How to explain the project in interviews |
| [INTERVIEW_QA.md](INTERVIEW_QA.md) | Likely questions + strong answers |
| [RESUME_BULLETS.md](RESUME_BULLETS.md) | ATS-friendly resume lines (max 3) |
| [CODE_WALKTHROUGH.md](CODE_WALKTHROUGH.md) | File-by-file mental model |
| [SHARE_APK.md](SHARE_APK.md) | Standalone APK + sharing |

## Continuity / engineering

| File | Purpose |
| --- | --- |
| [HANDOVER.md](HANDOVER.md) | Living status |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Layers & folders |
| [FLOW.md](FLOW.md) | Runtime flow |
| [DECISIONS.md](DECISIONS.md) | Decision log |
| [CONSTRAINTS.md](CONSTRAINTS.md) | Must / must-not |
| [TEST_CHECKLIST.md](TEST_CHECKLIST.md) | Manual QA |
| [ROLLBACK.md](ROLLBACK.md) | Undo risky changes |
| [features/](features/) | Feature traces |
| [bugs/](bugs/) | Bug traces |

## One sentence for agents

**EduReels** is an Expo SDK 54 React Native (TypeScript) app: vertical educational YouTube reels + local library + AI news (RSS) + arXiv papers, shipped as an Android APK via EAS; secrets stay in `.env` / on-device API key storage — never in git.
