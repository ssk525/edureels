# Sharing EduReels with friends (standalone APK)

## Can friends use it without my PC?

Yes — after you install an **APK** built with EAS. Expo Go + tunnel needs your PC; the APK does not.

Friends still need **phone internet** for YouTube videos.

## Different concepts

Topic chips on the Feed (ML, Deep Learning, LLMs, Prompting, Python, …).  
Anyone can also use **Search** for another concept (e.g. “reinforcement learning hindi”).

## English + Hindi only

Settings → **Lesson language**:

- **EN + Hindi** (default)
- **English**
- **Hindi**

Also chosen on first onboarding. YouTube is not perfect at language filtering, but queries + filters bias to EN/HI.

## Build APK (one-time setup)

1. Create a free account at https://expo.dev  
2. In this folder:

```bash
cd "f:\mOBILE APP\edu-ai-reels"
npx eas-cli login
npx eas-cli init
npx eas-cli build -p android --profile preview
```

3. When the build finishes, Expo gives a download link for the `.apk`.
4. Install on your phone (allow “Install unknown apps” if Android asks).
5. Share that APK file / link with friends (WhatsApp, Drive, etc.).

The YouTube API key from `.env` is baked into the APK at build time (`EXPO_PUBLIC_…`).  
Friends share your daily quota (~10,000 units). For a small friend group that is usually fine.

## Security note

Do not post the APK publicly on the open internet if your API key is inside it. Share only with people you trust, or create a separate Google Cloud key with YouTube Data API only + quota alerts.
