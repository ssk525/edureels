import { useCallback, useEffect, useRef, useState } from 'react';
import { DAILY_QUOTA_LIMIT, LOAD_MORE_THRESHOLD } from '../config/env';
import { DEFAULT_TOPIC, getTopic, TOPICS } from '../config/topics';
import { FALLBACK_VIDEOS } from '../data/fallbackVideos';
import { readFeedCache, writeFeedCache } from '../services/cache';
import { readLastTopicId, writeLastTopicId } from '../services/preferences';
import { addQuotaUsage, getQuotaUsed, remainingQuota } from '../services/quota';
import { fetchEducationalVideos, YoutubeApiError } from '../services/youtube';
import type { ContentLanguage, EduVideo, TopicId, VideoSource } from '../types';

function dedupe(videos: EduVideo[]): EduVideo[] {
  const seen = new Set<string>();
  return videos.filter((video) => {
    if (seen.has(video.id)) return false;
    seen.add(video.id);
    return true;
  });
}

function fallbackFor(topicId: TopicId): EduVideo[] {
  const matched = FALLBACK_VIDEOS.filter((video) => video.topicId === topicId);
  return matched.length ? matched : FALLBACK_VIDEOS;
}

type Options = {
  contentLanguage: ContentLanguage;
  apiKey: string;
  initialTopicId?: TopicId | null;
  onInitialTopicConsumed?: () => void;
};

export function useVideoFeed({
  contentLanguage,
  apiKey,
  initialTopicId,
  onInitialTopicConsumed,
}: Options) {
  const [topicId, setTopicIdState] = useState<TopicId>(DEFAULT_TOPIC.id);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [prefsReady, setPrefsReady] = useState(false);
  const [videos, setVideos] = useState<EduVideo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<VideoSource>('fallback');
  const [quotaUsed, setQuotaUsed] = useState(0);
  const nextPageToken = useRef<string | undefined>(undefined);
  const fetchingMore = useRef(false);

  const topic = getTopic(topicId);
  const isSearch = Boolean(searchQuery?.trim());
  const hasApiKey = apiKey.trim().length >= 20;

  const setTopicId = useCallback((id: TopicId) => {
    setSearchQuery(null);
    setTopicIdState(id);
    void writeLastTopicId(id);
  }, []);

  const runSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery(null);
  }, []);

  const hydrateQuota = useCallback(async () => {
    setQuotaUsed(await getQuotaUsed());
  }, []);

  const loadTopic = useCallback(async () => {
    setLoading(true);
    setError(null);
    setVideos([]);
    setActiveIndex(0);
    nextPageToken.current = undefined;

    const usedNow = await getQuotaUsed();
    setQuotaUsed(usedNow);

    if (!isSearch) {
      const cached = await readFeedCache(topic.id, contentLanguage);
      if (cached?.videos.length) {
        setVideos(cached.videos);
        nextPageToken.current = cached.nextPageToken;
        setSource('cache');
        setLoading(false);
        return;
      }
    }

    if (!hasApiKey) {
      setVideos(fallbackFor(topic.id));
      setSource('fallback');
      setError('Add your own YouTube Data API key in Settings to load live reels.');
      setLoading(false);
      return;
    }

    if (remainingQuota(usedNow) < 101) {
      setVideos(fallbackFor(topic.id));
      setSource('fallback');
      setError(`Daily YouTube quota nearly used (${usedNow}/${DAILY_QUOTA_LIMIT}). Showing offline clips.`);
      setLoading(false);
      return;
    }

    try {
      const page = await fetchEducationalVideos(
        topic,
        undefined,
        apiKey,
        isSearch ? searchQuery ?? undefined : undefined,
        contentLanguage,
      );
      const used = await addQuotaUsage(page.quotaUsed);
      setQuotaUsed(used);

      if (!page.videos.length) {
        setVideos(fallbackFor(topic.id));
        setSource('fallback');
        setError(
          isSearch
            ? 'No short educational videos matched that search.'
            : 'No short educational videos found for this topic yet.',
        );
        setLoading(false);
        return;
      }

      nextPageToken.current = page.nextPageToken;
      setVideos(page.videos);
      setSource('api');
      if (!isSearch) {
        await writeFeedCache(topic.id, contentLanguage, page.videos, page.nextPageToken);
      }
    } catch (err) {
      const message =
        err instanceof YoutubeApiError
          ? err.message
          : 'Could not reach YouTube. Showing offline clips.';
      setVideos(fallbackFor(topic.id));
      setSource('fallback');
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, contentLanguage, hasApiKey, isSearch, searchQuery, topic]);

  const loadMore = useCallback(async () => {
    if (!hasApiKey || source === 'fallback') return;
    if (!nextPageToken.current || fetchingMore.current) return;
    if (remainingQuota(quotaUsed) < 101) return;

    fetchingMore.current = true;
    setLoadingMore(true);
    try {
      const page = await fetchEducationalVideos(
        topic,
        nextPageToken.current,
        apiKey,
        isSearch ? searchQuery ?? undefined : undefined,
        contentLanguage,
      );
      const used = await addQuotaUsage(page.quotaUsed);
      setQuotaUsed(used);
      nextPageToken.current = page.nextPageToken;

      setVideos((current) => {
        const merged = dedupe([...current, ...page.videos]);
        if (!isSearch) {
          void writeFeedCache(topic.id, contentLanguage, merged, page.nextPageToken);
        }
        return merged;
      });
    } catch {
      // Keep current feed.
    } finally {
      fetchingMore.current = false;
      setLoadingMore(false);
    }
  }, [apiKey, contentLanguage, hasApiKey, isSearch, quotaUsed, searchQuery, source, topic]);

  useEffect(() => {
    void hydrateQuota();
  }, [hydrateQuota]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const saved = await readLastTopicId();
      if (!cancelled && saved) {
        setTopicIdState(saved);
      }
      if (!cancelled) setPrefsReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!prefsReady || !initialTopicId) return;
    setSearchQuery(null);
    setTopicIdState(initialTopicId);
    void writeLastTopicId(initialTopicId);
    onInitialTopicConsumed?.();
  }, [initialTopicId, onInitialTopicConsumed, prefsReady]);

  useEffect(() => {
    if (!prefsReady) return;
    void loadTopic();
  }, [loadTopic, prefsReady]);

  const onPageSelected = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (index >= videos.length - LOAD_MORE_THRESHOLD) {
        void loadMore();
      }
    },
    [loadMore, videos.length],
  );

  return {
    topics: TOPICS,
    topicId,
    setTopicId,
    searchQuery,
    runSearch,
    clearSearch,
    videos,
    activeIndex,
    setActiveIndex,
    onPageSelected,
    loading: loading || !prefsReady,
    loadingMore,
    error,
    source,
    quotaUsed,
    hasApiKey,
    reload: loadTopic,
  };
}
