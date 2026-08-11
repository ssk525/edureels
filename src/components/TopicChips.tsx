import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import type { Topic } from '../config/topics';
import type { TopicId } from '../types';
import { colors, spacing } from '../theme';

type Props = {
  topics: Topic[];
  selectedId: TopicId;
  onSelect: (id: TopicId) => void;
};

export function TopicChips({ topics, selectedId, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {topics.map((topic) => {
        const active = topic.id === selectedId;
        return (
          <Pressable
            key={topic.id}
            onPress={() => onSelect(topic.id)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{topic.label}</Text>
          </Pressable>
        );
      })}
      <View style={{ width: spacing.sm }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.text,
  },
});
