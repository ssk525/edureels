import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOPICS } from '../config/topics';
import type { ContentLanguage, TopicId } from '../types';

const LAST_TOPIC_KEY = 'edu-reels:prefs:lastTopic:v1';
const SETTINGS_KEY = 'edu-reels:prefs:settings:v1';

const TOPIC_IDS = new Set(TOPICS.map((topic) => topic.id));

export type AppSettings = {
  onboardingDone: boolean;
  startMuted: boolean;
  autoAdvance: boolean;
  showQuota: boolean;
  /** Prefer English, Hindi, or both for lesson discovery. */
  contentLanguage: ContentLanguage;
  /** User dismissed personal API key setup (may still use builtin/offline). */
  apiKeySetupDone: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  onboardingDone: false,
  startMuted: true,
  autoAdvance: true,
  showQuota: true,
  contentLanguage: 'both',
  apiKeySetupDone: false,
};

function isTopicId(value: string): value is TopicId {
  return TOPIC_IDS.has(value as TopicId);
}

export async function readLastTopicId(): Promise<TopicId | null> {
  try {
    const value = await AsyncStorage.getItem(LAST_TOPIC_KEY);
    if (!value || !isTopicId(value)) return null;
    return value;
  } catch {
    return null;
  }
}

export async function writeLastTopicId(topicId: TopicId): Promise<void> {
  await AsyncStorage.setItem(LAST_TOPIC_KEY, topicId);
}

export async function readSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const language = parsed.contentLanguage;
    const contentLanguage: ContentLanguage =
      language === 'en' || language === 'hi' || language === 'both'
        ? language
        : DEFAULT_SETTINGS.contentLanguage;
    return { ...DEFAULT_SETTINGS, ...parsed, contentLanguage };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function writeSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const current = await readSettings();
  const next = { ...current, ...patch };
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}
