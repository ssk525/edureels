import type { ReactNode } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import type { EduVideo } from '../types';
import type { HistoryEntry } from '../services/library';
import type { NotesMap, StreakState } from '../services/learning';
import { colors, spacing, TAB_BAR_CLEARANCE } from '../theme';
import { formatDuration } from '../utils/duration';
import { AppIcon } from './AppIcon';
import { useState } from 'react';

type Props = {
  saved: EduVideo[];
  history: HistoryEntry[];
  likedIds: string[];
  notes: NotesMap;
  streak: StreakState;
  onSaveNote: (videoId: string, note: string) => void;
  onContinue: () => void;
};

export function LibraryScreen({
  saved,
  history,
  likedIds,
  notes,
  streak,
  onSaveNote,
  onContinue,
}: Props) {
  const continueVideo = history[0];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Library</Text>
      <Text style={styles.subtitle}>Your local learning journal</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <Stat label="Streak" value={`${streak.current}d`} hint={`Best ${streak.best}d`} />
          <Stat label="Saved" value={`${saved.length}`} hint="Study later" />
          <Stat label="Watched" value={`${history.length}`} hint="On device" />
        </View>

        {continueVideo ? (
          <Pressable style={styles.continueCard} onPress={onContinue}>
            <View style={{ flex: 1 }}>
              <Text style={styles.continueEyebrow}>Continue learning</Text>
              <Text style={styles.continueTitle} numberOfLines={2}>
                {continueVideo.title}
              </Text>
              <Text style={styles.continueSub}>{continueVideo.topicLabel}</Text>
            </View>
            <Text style={styles.continueCta}>Open feed</Text>
          </Pressable>
        ) : null}

        <Section
          title="Saved for later"
          empty="Bookmark reels from the feed to build your study list."
          items={saved}
          renderItem={(video) => (
            <SavedRow
              key={`saved-${video.id}`}
              video={video}
              note={notes[video.id] ?? ''}
              onSaveNote={onSaveNote}
            />
          )}
        />

        <Section
          title="Recently watched"
          empty="Swipe the feed — history appears here."
          items={history.slice(0, 30)}
          renderItem={(video) => (
            <VideoRow
              key={`hist-${video.id}-${video.watchedAt}`}
              video={video}
              badge={likedIds.includes(video.id) ? 'Liked' : undefined}
            />
          )}
        />
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

function Section<T extends { id: string }>({
  title,
  empty,
  items,
  renderItem,
}: {
  title: string;
  empty: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.length ? items.map(renderItem) : <Text style={styles.empty}>{empty}</Text>}
    </View>
  );
}

function SavedRow({
  video,
  note,
  onSaveNote,
}: {
  video: EduVideo;
  note: string;
  onSaveNote: (videoId: string, note: string) => void;
}) {
  const [draft, setDraft] = useState(note);

  return (
    <View style={styles.savedCard}>
      <VideoRow video={video} badge="Saved" />
      <TextInput
        value={draft}
        onChangeText={setDraft}
        onEndEditing={() => onSaveNote(video.id, draft)}
        placeholder="Quick note for revision…"
        placeholderTextColor={colors.muted}
        style={styles.noteInput}
      />
    </View>
  );
}

function VideoRow({ video, badge }: { video: EduVideo; badge?: string }) {
  return (
    <Pressable
      style={styles.row}
      onPress={() => void Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`)}
    >
      <Image source={{ uri: video.thumbnail }} style={styles.thumb} />
      <View style={styles.meta}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.rowSub} numberOfLines={1}>
          {video.channelTitle}
          {video.durationSec ? ` · ${formatDuration(video.durationSec)}` : ''}
        </Text>
        <View style={styles.badgeRow}>
          <Text style={styles.topic}>{video.topicLabel}</Text>
          {badge ? <Text style={styles.badge}>{badge}</Text> : null}
        </View>
      </View>
      <AppIcon name="open-outline" size={16} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: (Constants.statusBarHeight ?? 20) + 12,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    paddingHorizontal: spacing.md,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE + 24,
    gap: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  statHint: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  continueEyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  continueTitle: {
    color: colors.text,
    fontWeight: '700',
    marginTop: 4,
  },
  continueSub: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  continueCta: {
    color: colors.accent,
    fontWeight: '800',
    fontSize: 12,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  empty: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  savedCard: {
    gap: 8,
  },
  noteInput: {
    backgroundColor: colors.chip,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: {
    width: 96,
    height: 64,
    borderRadius: 10,
    backgroundColor: colors.bgElevated,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  rowSub: {
    color: colors.muted,
    fontSize: 11,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  topic: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  badge: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
});
