import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'edu-reels:prefs:youtubeApiKey:v1';

/** Dev/build fallback from .env — each friend should set their own key in-app. */
export const BUILTIN_YOUTUBE_API_KEY = (
  process.env.EXPO_PUBLIC_YOUTUBE_API_KEY ?? ''
).trim();

export function isValidYoutubeKey(value: string): boolean {
  return value.trim().length >= 20;
}

export async function readUserYoutubeKey(): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(USER_KEY);
    if (!value || !isValidYoutubeKey(value)) return null;
    return value.trim();
  } catch {
    return null;
  }
}

export async function writeUserYoutubeKey(key: string): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, key.trim());
}

export async function clearUserYoutubeKey(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}

/** Prefer the user's own key so a 50-person group does not share one quota. */
export async function resolveYoutubeApiKey(): Promise<string> {
  const userKey = await readUserYoutubeKey();
  if (userKey) return userKey;
  return BUILTIN_YOUTUBE_API_KEY;
}
