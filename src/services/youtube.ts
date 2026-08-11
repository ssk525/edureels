import { SEARCH_PAGE_SIZE } from '../config/env';
import type { Topic } from '../config/topics';
import type { ContentLanguage, EduVideo, FeedPage } from '../types';
import { parseIsoDuration, thumbnailFor } from '../utils/duration';
import { filterForTopic, rankEducational } from '../utils/educationalScore';

const API_BASE = 'https://www.googleapis.com/youtube/v3';
const MAX_SHORT_SECONDS = 4 * 60;

type YoutubeErrorBody = {
  error?: {
    code?: number;
    message?: string;
    errors?: { reason?: string }[];
  };
};

type SearchItem = {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    channelTitle?: string;
    channelId?: string;
    thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
  };
};

type VideoItem = {
  id: string;
  snippet?: {
    title?: string;
    channelTitle?: string;
    channelId?: string;
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
    thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
  };
  contentDetails?: { duration?: string };
  status?: { embeddable?: boolean };
};

export class YoutubeApiError extends Error {
  code?: number;
  reason?: string;

  constructor(message: string, code?: number, reason?: string) {
    super(message);
    this.name = 'YoutubeApiError';
    this.code = code;
    this.reason = reason;
  }
}

function throwIfApiError(payload: YoutubeErrorBody, fallback: string): void {
  if (!payload.error) return;
  const reason = payload.error.errors?.[0]?.reason;
  throw new YoutubeApiError(
    payload.error.message || fallback,
    payload.error.code,
    reason,
  );
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const payload = (await response.json()) as T & YoutubeErrorBody;
  throwIfApiError(payload, `YouTube request failed (${response.status})`);
  if (!response.ok) {
    throw new YoutubeApiError(`YouTube request failed (${response.status})`, response.status);
  }
  return payload;
}

function buildQuery(base: string, language: ContentLanguage): string {
  const core = base.trim().slice(0, 90);
  if (language === 'hi') {
    return `${core} hindi हिंदी explained`.slice(0, 120);
  }
  if (language === 'en') {
    return `${core} english explained`.slice(0, 120);
  }
  // Prefer English + Hindi educational shorts only (not other languages).
  return `${core} (english OR hindi OR हिंदी)`.slice(0, 120);
}

function relevanceLanguage(language: ContentLanguage): string {
  return language === 'hi' ? 'hi' : 'en';
}

const DEVANAGARI = /[\u0900-\u097F]/;
const HINDI_HINT = /\b(hindi|हिंदी|हिन्दी)\b/i;

function looksHindi(text: string): boolean {
  return DEVANAGARI.test(text) || HINDI_HINT.test(text);
}

function languageAllowed(
  item: VideoItem,
  language: ContentLanguage,
): boolean {
  if (language === 'both') return true;
  const title = item.snippet?.title ?? '';
  const channel = item.snippet?.channelTitle ?? '';
  const audio = (item.snippet?.defaultAudioLanguage ?? '').toLowerCase();
  const lang = (item.snippet?.defaultLanguage ?? '').toLowerCase();
  const blob = `${title} ${channel}`;
  const hindi = looksHindi(blob) || audio.startsWith('hi') || lang.startsWith('hi');
  if (language === 'hi') return hindi;
  // English preference: keep clearly English; drop obvious Hindi-only titles.
  if (hindi && !/\b(english|eng)\b/i.test(blob)) return false;
  return true;
}

function mapVideo(item: VideoItem, topic: Topic, language: ContentLanguage): EduVideo | null {
  if (!item.id || item.status?.embeddable === false) return null;
  if (!languageAllowed(item, language)) return null;
  const durationSec = parseIsoDuration(item.contentDetails?.duration);
  if (durationSec <= 0 || durationSec > MAX_SHORT_SECONDS) return null;

  return {
    id: item.id,
    title: (item.snippet?.title ?? 'Untitled').replace(/&amp;/g, '&').replace(/&#39;/g, "'"),
    channelTitle: item.snippet?.channelTitle ?? 'Unknown channel',
    channelId: item.snippet?.channelId ?? '',
    topicId: topic.id,
    topicLabel: topic.label,
    thumbnail:
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      thumbnailFor(item.id),
    durationSec,
  };
}

/**
 * search.list (~100) + videos.list (~1).
 * Language biases discovery to English and/or Hindi educational shorts.
 */
export async function fetchEducationalVideos(
  topic: Topic,
  pageToken?: string,
  apiKey = '',
  queryOverride?: string,
  language: ContentLanguage = 'both',
): Promise<FeedPage & { quotaUsed: number }> {
  if (!apiKey) {
    throw new YoutubeApiError('Missing YouTube API key', 403, 'missingKey');
  }

  const baseQuery = queryOverride?.trim() || topic.query;
  const searchParams = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    videoDuration: 'short',
    videoEmbeddable: 'true',
    videoSyndicated: 'true',
    safeSearch: 'strict',
    relevanceLanguage: relevanceLanguage(language),
    maxResults: String(SEARCH_PAGE_SIZE),
    q: buildQuery(baseQuery, language),
    order: 'relevance',
    key: apiKey,
  });
  if (pageToken) searchParams.set('pageToken', pageToken);

  const searchJson = await getJson<{
    items?: SearchItem[];
    nextPageToken?: string;
  }>(`${API_BASE}/search?${searchParams.toString()}`);

  const ids = (searchJson.items ?? [])
    .map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (!ids.length) {
    return { videos: [], nextPageToken: searchJson.nextPageToken, quotaUsed: 100 };
  }

  const videoParams = new URLSearchParams({
    part: 'snippet,contentDetails,status',
    id: ids.join(','),
    key: apiKey,
  });

  const videoJson = await getJson<{ items?: VideoItem[] }>(
    `${API_BASE}/videos?${videoParams.toString()}`,
  );

  const videos = filterForTopic(
    rankEducational(
      (videoJson.items ?? [])
        .map((item) => mapVideo(item, topic, language))
        .filter((video): video is EduVideo => Boolean(video)),
      topic.id,
    ),
    topic.id,
  );

  return {
    videos,
    nextPageToken: searchJson.nextPageToken,
    quotaUsed: 101,
  };
}
