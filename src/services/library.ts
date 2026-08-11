import AsyncStorage from '@react-native-async-storage/async-storage';
import type { EduVideo } from '../types';

const SAVED_KEY = 'edu-reels:library:saved:v1';
const LIKED_KEY = 'edu-reels:library:liked:v1';
const HISTORY_KEY = 'edu-reels:library:history:v1';
const MAX_HISTORY = 80;

export type HistoryEntry = EduVideo & {
  watchedAt: number;
};

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function readSaved(): Promise<EduVideo[]> {
  return readJson(SAVED_KEY, []);
}

export async function toggleSaved(video: EduVideo): Promise<EduVideo[]> {
  const current = await readSaved();
  const exists = current.some((item) => item.id === video.id);
  const next = exists
    ? current.filter((item) => item.id !== video.id)
    : [video, ...current.filter((item) => item.id !== video.id)];
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
}

export async function isSaved(videoId: string): Promise<boolean> {
  const saved = await readSaved();
  return saved.some((item) => item.id === videoId);
}

export async function readLikedIds(): Promise<string[]> {
  return readJson(LIKED_KEY, []);
}

export async function toggleLiked(videoId: string): Promise<string[]> {
  const current = await readLikedIds();
  const next = current.includes(videoId)
    ? current.filter((id) => id !== videoId)
    : [videoId, ...current];
  await AsyncStorage.setItem(LIKED_KEY, JSON.stringify(next));
  return next;
}

export async function readHistory(): Promise<HistoryEntry[]> {
  return readJson(HISTORY_KEY, []);
}

export async function pushHistory(video: EduVideo): Promise<HistoryEntry[]> {
  const current = await readHistory();
  const entry: HistoryEntry = { ...video, watchedAt: Date.now() };
  const next = [entry, ...current.filter((item) => item.id !== video.id)].slice(0, MAX_HISTORY);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export async function clearLibrary(): Promise<void> {
  await AsyncStorage.multiRemove([SAVED_KEY, LIKED_KEY, HISTORY_KEY]);
}

export async function getContinueVideo(): Promise<HistoryEntry | null> {
  const history = await readHistory();
  return history[0] ?? null;
}
