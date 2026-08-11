# F-003 · Product polish — Library, Settings, Search, engagement

## Meta

- **ID:** F-003
- **Title:** Make EduReels feel like a learning product (not just a YouTube pager)
- **Status:** shipped (local)
- **Requested:** 2026-08-11 · user granted product freedom to expand features

## Goal

Upgrade MVP into a portfolio-ready educational reels app: onboarding, engagement actions, personal library, settings, and search — while keeping YouTube Data API + Expo Go constraints.

## Scope

### In
- First-run onboarding (pick starting topic)
- Feed / Library / Settings shell with floating tab bar
- Like, Save, Share, Unmute, Next, open on YouTube
- Watch history + saved list (AsyncStorage)
- Free-text educational search
- Settings: start muted, auto-advance, quota meter, clear library
- Quota soft-gate before live fetches
- Immersive embed (`controls=0`) + Referer header (continues B-003)
- Fallbacks for all 7 topics

### Out
- Accounts / cloud sync
- Comments / social graph
- True offline video download
- Native YouTube SDK / EAS production build (still Expo Go)

## Acceptance

- [ ] Onboarding appears once, then feed
- [ ] Like/Save persist across reload
- [ ] Library shows saved + history
- [ ] Search returns short educational clips (with API key)
- [ ] Settings toggles affect feed behavior
- [ ] Tab bar does not break full-screen swipe height
