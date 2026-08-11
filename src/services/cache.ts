import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_TTL_MS } from '../config/env';
import type { ContentLanguage, EduVideo, TopicId } from '../types';

const cacheKey = (topicId: TopicId, language: ContentLanguage) =>
  `edu-reels:feed:v5:${topicId}:${language}`;

type CachedFeed = {
  savedAt: number;
  videos: EduVideo[];
  nextPageToken?: string;
};

export async function readFeedCache(
  topicId: TopicId,
  language: ContentLanguage,
): Promise<CachedFeed | null> {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(topicId, language));
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedFeed;
    if (!cached.videos?.length) return null;
    if (Date.now() - cached.savedAt > CACHE_TTL_MS) return null;
    return cached;
  } catch {
    return null;
  }
}

export async function writeFeedCache(
  topicId: TopicId,
  language: ContentLanguage,
  videos: EduVideo[],
  nextPageToken?: string,
): Promise<void> {
  const payload: CachedFeed = {
    savedAt: Date.now(),
    videos,
    nextPageToken,
  };
  await AsyncStorage.setItem(cacheKey(topicId, language), JSON.stringify(payload));
}
