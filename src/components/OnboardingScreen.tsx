import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { TOPICS } from '../config/topics';
import type { ContentLanguage, TopicId } from '../types';
import { brand, colors, spacing } from '../theme';

type Props = {
  onDone: (preferredTopic: TopicId, language: ContentLanguage) => void;
};

export function OnboardingScreen({ onDone }: Props) {
  const [selected, setSelected] = useState<TopicId>('ml');
  const [language, setLanguage] = useState<ContentLanguage>('both');

  return (
    <View style={styles.screen}>
      <LinearGradient
        colors={['#0B3D3A', colors.bg, colors.bg]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>Welcome</Text>
        <Text style={styles.title}>{brand.tagline}</Text>
        <Text style={styles.body}>{brand.pitch}</Text>

        <Text style={styles.section}>Language</Text>
        <View style={styles.grid}>
          {(
            [
              { id: 'both', label: 'English + Hindi' },
              { id: 'en', label: 'English only' },
              { id: 'hi', label: 'Hindi only' },
            ] as const
          ).map((option) => {
            const active = language === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setLanguage(option.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.section, { marginTop: spacing.lg }]}>Start with a track</Text>
        <Text style={styles.hint}>Friends can pick any concept from the feed chips later.</Text>
        <View style={styles.grid}>
          {TOPICS.map((topic) => {
            const active = topic.id === selected;
            return (
              <Pressable
                key={topic.id}
                onPress={() => setSelected(topic.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{topic.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.cta} onPress={() => onDone(selected, language)}>
          <Text style={styles.ctaText}>Start learning</Text>
        </Pressable>
        <Text style={styles.footnote}>
          Swipe up · tap to pause · change language anytime in Settings
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingTop: (Constants.statusBarHeight ?? 20) + 48,
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  kicker: {
    color: colors.accent,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  section: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.text,
  },
  cta: {
    marginTop: spacing.xl,
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  ctaText: {
    color: '#042F2E',
    fontWeight: '800',
    fontSize: 16,
  },
  footnote: {
    color: colors.muted,
    fontSize: 12,
    marginTop: spacing.md,
    lineHeight: 18,
  },
});
