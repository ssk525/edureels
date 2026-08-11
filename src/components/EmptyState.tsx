import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { brand, colors, spacing } from '../theme';

type Props = {
  loading: boolean;
  error?: string | null;
  hasApiKey: boolean;
  onRetry: () => void;
};

export function EmptyState({ loading, error, hasApiKey, onRetry }: Props) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.subtitle}>Loading educational reels…</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Nothing to play</Text>
      <Text style={styles.subtitle}>
        {error ||
          (hasApiKey
            ? 'No videos available right now.'
            : 'Add a YouTube Data API key in Settings, then try again.')}
      </Text>
      <Text style={styles.tagline}>{brand.tagline}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  tagline: {
    color: colors.accent,
    fontWeight: '600',
    marginTop: spacing.md,
    fontSize: 13,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  button: {
    marginTop: spacing.lg,
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonText: {
    color: colors.text,
    fontWeight: '700',
  },
});
