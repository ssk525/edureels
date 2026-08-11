import { useState } from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import { colors, spacing } from '../theme';

type Props = {
  onSave: (key: string) => Promise<void>;
  onSkip: () => void;
  hasBuiltinKey?: boolean;
};

export function ApiKeySetupScreen({ onSave, onSkip, hasBuiltinKey }: Props) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>Setup</Text>
      <Text style={styles.title}>YouTube API key</Text>
      <Text style={styles.body}>
        Connect a YouTube Data API key to load educational reels. The key is stored only on this
        device.
      </Text>

      <Text style={styles.section}>How to get an API key</Text>
      <Text style={styles.steps}>
        1. Open Google Cloud Console{'\n'}
        2. Enable YouTube Data API v3{'\n'}
        3. Go to Credentials → Create API key{'\n'}
        4. Restrict the key to YouTube Data API v3{'\n'}
        5. Copy the key and paste it below
      </Text>

      <Pressable
        style={styles.link}
        onPress={() =>
          void Linking.openURL('https://console.cloud.google.com/apis/credentials')
        }
      >
        <Text style={styles.linkText}>Open Google Cloud Console</Text>
      </Pressable>

      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder="Paste API key"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={styles.cta}
        disabled={saving}
        onPress={() => {
          setSaving(true);
          setError(null);
          void onSave(draft)
            .catch((err: unknown) => {
              setError(err instanceof Error ? err.message : 'Could not save key');
            })
            .finally(() => setSaving(false));
        }}
      >
        <Text style={styles.ctaText}>{saving ? 'Saving…' : 'Save API key'}</Text>
      </Pressable>

      <Pressable style={styles.skip} onPress={onSkip}>
        <Text style={styles.skipText}>
          {hasBuiltinKey ? 'Continue without changing key' : 'Continue in offline demo mode'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: (Constants.statusBarHeight ?? 20) + 48,
    paddingHorizontal: spacing.lg,
  },
  kicker: {
    color: colors.accent,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  section: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginTop: spacing.md,
  },
  error: {
    color: colors.danger,
    marginTop: 8,
    fontSize: 12,
  },
  cta: {
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaText: {
    color: '#042F2E',
    fontWeight: '800',
  },
  link: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  linkText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 13,
  },
  steps: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  skip: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  skipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
});
