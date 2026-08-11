import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import { useKeepAwake } from 'expo-keep-awake';
import PagerView from 'react-native-pager-view';
import { useVideoFeed } from '../hooks/useVideoFeed';
import { DAILY_QUOTA_LIMIT } from '../config/env';
import type { ContentLanguage, EduVideo, TopicId } from '../types';
import { colors, spacing } from '../theme';
import { AppIcon } from './AppIcon';
import { EmptyState } from './EmptyState';
import { ReelCard } from './ReelCard';
import { TopicChips } from './TopicChips';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
  likedIds: string[];
  savedIds: Set<string>;
  startMuted: boolean;
  autoAdvance: boolean;
  showQuota: boolean;
  contentLanguage: ContentLanguage;
  apiKey: string;
  initialTopicId?: TopicId | null;
  onInitialTopicConsumed?: () => void;
  onLike: (video: EduVideo) => void;
  onSave: (video: EduVideo) => void;
  onWatch: (video: EduVideo) => void;
};

export function FeedScreen({
  likedIds,
  savedIds,
  startMuted,
  autoAdvance,
  showQuota,
  contentLanguage,
  apiKey,
  initialTopicId = null,
  onInitialTopicConsumed,
  onLike,
  onSave,
  onWatch,
}: Props) {
  useKeepAwake();
  const pagerRef = useRef<PagerView>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [draftQuery, setDraftQuery] = useState('');
  const {
    topics,
    topicId,
    setTopicId,
    searchQuery,
    runSearch,
    clearSearch,
    videos,
    activeIndex,
    onPageSelected,
    loading,
    loadingMore,
    error,
    source,
    quotaUsed,
    hasApiKey,
    reload,
  } = useVideoFeed({
    contentLanguage,
    apiKey,
    initialTopicId,
    onInitialTopicConsumed,
  });

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= videos.length) return;
      pagerRef.current?.setPage(index);
    },
    [videos.length],
  );

  if (loading && !videos.length) {
    return <EmptyState loading hasApiKey={hasApiKey} onRetry={reload} />;
  }

  if (!videos.length) {
    return (
      <EmptyState
        loading={false}
        error={error}
        hasApiKey={hasApiKey}
        onRetry={reload}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        orientation="vertical"
        initialPage={0}
        offscreenPageLimit={1}
        onPageSelected={(event) => {
          onPageSelected(event.nativeEvent.position);
          if (hintVisible && event.nativeEvent.position > 0) {
            setHintVisible(false);
          }
        }}
        key={`${topicId}:${searchQuery ?? ''}:${contentLanguage}`}
      >
        {videos.map((video, index) => (
          <View key={video.id} style={styles.page} collapsable={false}>
            <ReelCard
              video={video}
              index={index}
              activeIndex={activeIndex}
              showHint={hintVisible && index === 0}
              liked={likedIds.includes(video.id)}
              saved={savedIds.has(video.id)}
              startMuted={startMuted}
              autoAdvance={autoAdvance}
              onEnded={() => goTo(index + 1)}
              onLike={() => onLike(video)}
              onSave={() => onSave(video)}
              onWatch={() => onWatch(video)}
            />
          </View>
        ))}
      </PagerView>

      <View style={styles.topBar} pointerEvents="box-none">
        <View style={styles.brandRow}>
          <View style={styles.statusWrap}>
            {searchQuery ? (
              <Text style={styles.source} numberOfLines={1}>
                Search · {searchQuery}
              </Text>
            ) : source !== 'api' ? (
              <Text style={styles.source} numberOfLines={1}>
                {source === 'cache' ? 'Cached' : 'Offline demo'}
                {` · ${contentLanguage === 'hi' ? 'Hindi' : contentLanguage === 'en' ? 'English' : 'EN+HI'}`}
              </Text>
            ) : null}
            {loadingMore ? <Text style={styles.source}>Loading more…</Text> : null}
          </View>
          <Pressable
            style={styles.iconBtn}
            onPress={() => setSearchOpen((value) => !value)}
            accessibilityLabel="Search lessons"
          >
            <AppIcon name="search" size={18} color={colors.text} />
          </Pressable>
        </View>

        {searchOpen ? (
          <View style={styles.searchRow}>
            <TextInput
              value={draftQuery}
              onChangeText={setDraftQuery}
              placeholder="Search topics…"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              returnKeyType="search"
              onSubmitEditing={() => {
                runSearch(draftQuery);
                setSearchOpen(false);
              }}
            />
            <Pressable
              style={styles.searchGo}
              onPress={() => {
                runSearch(draftQuery);
                setSearchOpen(false);
              }}
            >
              <Text style={styles.searchGoText}>Go</Text>
            </Pressable>
            {searchQuery ? (
              <Pressable
                onPress={() => {
                  clearSearch();
                  setDraftQuery('');
                }}
              >
                <Text style={styles.clearSearch}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <TopicChips topics={topics} selectedId={topicId} onSelect={setTopicId} />
        )}

        {error && source !== 'api' ? (
          <Text style={styles.banner} numberOfLines={2}>
            {error}
          </Text>
        ) : null}
        {showQuota ? (
          <Text style={styles.quota}>
            Quota {quotaUsed} / {DAILY_QUOTA_LIMIT}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  pager: {
    flex: 1,
  },
  page: {
    height: SCREEN_HEIGHT,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: (Constants.statusBarHeight ?? 20) + 8,
    paddingBottom: spacing.sm,
  },
  brandRow: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  statusWrap: {
    flex: 1,
  },
  source: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  searchGo: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchGoText: {
    color: colors.text,
    fontWeight: '700',
  },
  clearSearch: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 12,
  },
  banner: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
    color: colors.danger,
    fontSize: 11,
  },
  quota: {
    marginTop: 6,
    marginHorizontal: spacing.md,
    color: colors.muted,
    fontSize: 10,
  },
});
