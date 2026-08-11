import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import { fetchAiHeadlines, type AiHeadline } from '../services/aiNews';
import { fetchLatestAiPapers, type ArxivPaper } from '../services/arxiv';
import type { TopicId } from '../types';
import { colors, spacing, TAB_BAR_CLEARANCE } from '../theme';

type Props = {
  onOpenTopic: (topicId: TopicId) => void;
};

type Segment = 'updates' | 'papers';

export function NewsScreen({ onOpenTopic }: Props) {
  const [segment, setSegment] = useState<Segment>('updates');
  const [headlines, setHeadlines] = useState<AiHeadline[]>([]);
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [newsResult, papersResult] = await Promise.allSettled([
        fetchAiHeadlines(28, { forceRefresh: true }),
        fetchLatestAiPapers(16),
      ]);

      if (newsResult.status === 'fulfilled') setHeadlines(newsResult.value);
      if (papersResult.status === 'fulfilled') setPapers(papersResult.value);

      if (newsResult.status === 'rejected' && papersResult.status === 'rejected') {
        setError('Could not load AI updates right now. Pull to refresh.');
      } else if (newsResult.status === 'rejected') {
        setError('Headlines unavailable — papers may still load.');
      } else if (papersResult.status === 'rejected') {
        setError('Papers unavailable — headlines may still load.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>AI Pulse</Text>
      <Text style={styles.subtitle}>Industry updates, new models, and research papers</Text>

      <View style={styles.segmentRow}>
        <SegmentBtn
          label="Updates"
          active={segment === 'updates'}
          onPress={() => setSegment('updates')}
        />
        <SegmentBtn
          label="Papers"
          active={segment === 'papers'}
          onPress={() => setSegment('papers')}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.accent} />
        }
      >
        <Text style={styles.section}>Watch on Feed</Text>
        <View style={styles.chipRow}>
          <PulseChip label="AI News reels" onPress={() => onOpenTopic('ainews')} />
          <PulseChip label="New models" onPress={() => onOpenTopic('models')} />
          <PulseChip label="Paper explainers" onPress={() => onOpenTopic('papers')} />
        </View>

        {loading && !headlines.length && !papers.length ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {segment === 'updates' ? (
          <>
            <Text style={styles.section}>Latest AI headlines</Text>
            <Text style={styles.hint}>TechCrunch, The Verge, MIT Tech Review, Google AI · pull to refresh</Text>
            {!loading && !headlines.length ? (
              <Text style={styles.empty}>No headlines yet. Check your connection and refresh.</Text>
            ) : null}
            {headlines.map((item) => (
              <Pressable
                key={item.id}
                style={styles.card}
                onPress={() => void Linking.openURL(item.link)}
              >
                <Text style={styles.meta}>
                  {item.source}
                  {item.published ? ` · ${formatDate(item.published)}` : ''}
                </Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.summary ? (
                  <Text style={styles.summary} numberOfLines={3}>
                    {item.summary}
                  </Text>
                ) : null}
              </Pressable>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.section}>Fresh arXiv papers</Text>
            <Text style={styles.hint}>cs.AI · cs.LG · cs.CL · open abstract in browser</Text>
            {!loading && !papers.length ? (
              <Text style={styles.empty}>No papers loaded yet. Pull to refresh.</Text>
            ) : null}
            {papers.map((paper) => (
              <Pressable
                key={paper.id}
                style={styles.card}
                onPress={() => void Linking.openURL(paper.link)}
              >
                <Text style={styles.meta}>
                  {paper.published} · {paper.category}
                </Text>
                <Text style={styles.cardTitle}>{paper.title}</Text>
                <Text style={styles.authors} numberOfLines={1}>
                  {paper.authors.join(', ')}
                </Text>
                <Text style={styles.summary} numberOfLines={3}>
                  {paper.summary}
                </Text>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function formatDate(value: string): string {
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) return value.slice(0, 16);
  return new Date(ms).toISOString().slice(0, 10);
}

function SegmentBtn({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.segmentBtn, active && styles.segmentBtnActive]} onPress={onPress}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

function PulseChip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.chip} onPress={onPress}>
      <Text style={styles.chipText}>{label}</Text>
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
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.chip,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segmentBtnActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  segmentText: {
    color: colors.muted,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: colors.text,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: TAB_BAR_CLEARANCE + 24,
    gap: spacing.sm,
  },
  section: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
    marginTop: spacing.sm,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  empty: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  chip: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  meta: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
    marginTop: 6,
    lineHeight: 20,
  },
  authors: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  summary: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
});
