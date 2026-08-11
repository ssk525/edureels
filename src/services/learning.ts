import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'edu-reels:library:notes:v1';
const STREAK_KEY = 'edu-reels:library:streak:v1';

export type NotesMap = Record<string, string>;

export type StreakState = {
  /** YYYY-MM-DD days the user watched at least one reel */
  days: string[];
  current: number;
  best: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayBefore(isoDay: string): string {
  const date = new Date(`${isoDay}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export async function readNotes(): Promise<NotesMap> {
  try {
    const raw = await AsyncStorage.getItem(NOTES_KEY);
    return raw ? (JSON.parse(raw) as NotesMap) : {};
  } catch {
    return {};
  }
}

export async function writeNote(videoId: string, note: string): Promise<NotesMap> {
  const current = await readNotes();
  const trimmed = note.trim();
  if (trimmed) current[videoId] = trimmed;
  else delete current[videoId];
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(current));
  return current;
}

export async function readStreak(): Promise<StreakState> {
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    if (!raw) return { days: [], current: 0, best: 0 };
    return JSON.parse(raw) as StreakState;
  } catch {
    return { days: [], current: 0, best: 0 };
  }
}

/** Call when a reel becomes active — updates learning streak. */
export async function recordLearningDay(): Promise<StreakState> {
  const today = todayKey();
  const state = await readStreak();
  if (state.days.includes(today)) {
    return computeStreak(state.days);
  }
  const days = [today, ...state.days.filter((day) => day !== today)].slice(0, 120);
  const next = computeStreak(days);
  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(next));
  return next;
}

function computeStreak(days: string[]): StreakState {
  const unique = [...new Set(days)].sort((a, b) => (a < b ? 1 : -1));
  let current = 0;
  let cursor = todayKey();
  for (const day of unique) {
    if (day === cursor) {
      current += 1;
      cursor = dayBefore(cursor);
      continue;
    }
    break;
  }
  // Allow streak to still count if last learn was yesterday (not broken yet today).
  if (current === 0 && unique[0] === dayBefore(todayKey())) {
    cursor = unique[0];
    for (const day of unique) {
      if (day === cursor) {
        current += 1;
        cursor = dayBefore(cursor);
        continue;
      }
      break;
    }
  }
  const best = Math.max(current, unique.length ? estimateBest(unique) : 0);
  return { days: unique, current, best: Math.max(best, current) };
}

function estimateBest(sortedDesc: string[]): number {
  let best = 1;
  let run = 1;
  for (let i = 0; i < sortedDesc.length - 1; i += 1) {
    if (dayBefore(sortedDesc[i]) === sortedDesc[i + 1]) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  return best;
}

export async function clearNotesAndStreak(): Promise<void> {
  await AsyncStorage.multiRemove([NOTES_KEY, STREAK_KEY]);
}
