import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Constants from 'expo-constants';
import type { AppSettings } from '../services/preferences';
import { brand, colors, spacing, TAB_BAR_CLEARANCE } from '../theme';

type Props = {
  settings: AppSettings;
  quotaUsed: number;
  hasUserKey: boolean;
  onUpdate: (patch: Partial<AppSettings>) => void;
  onClearLibrary: () => void;
  onClearCacheHint: () => void;
  onEditApiKey: () => void;
  onClearApiKey: () => void;
};

export function SettingsScreen({
  settings,
  quotaUsed,
  hasUserKey,
  onUpdate,
  onClearLibrary,
  onClearCacheHint,
  onEditApiKey,
  onClearApiKey,
}: Props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Playback, language, and API access</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.langBlock}>
          <Text style={styles.langTitle}>Lesson language</Text>
          <Text style={styles.langHint}>Prefer English and/or Hindi educational reels</Text>
          <View style={styles.langRow}>
            {(
              [
                { id: 'both', label: 'EN + Hindi' },
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'Hindi' },
              ] as const
            ).map((option) => {
              const active = settings.contentLanguage === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.langChip, active && styles.langChipActive]}
                  onPress={() => onUpdate({ contentLanguage: option.id })}
                >
                  <Text style={[styles.langChipText, active && styles.langChipTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Row
          label="Start muted"
          hint="Safer autoplay in public spaces"
          value={settings.startMuted}
          onChange={(startMuted) => onUpdate({ startMuted })}
        />
        <Row
          label="Auto-advance"
          hint="Jump to the next reel after each clip"
          value={settings.autoAdvance}
          onChange={(autoAdvance) => onUpdate({ autoAdvance })}
        />
        <Row
          label="Show quota meter"
          hint="YouTube Data API daily usage"
          value={settings.showQuota}
          onChange={(showQuota) => onUpdate({ showQuota })}
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your YouTube API key</Text>
          <Text style={styles.cardBody}>
            {hasUserKey
              ? 'API key is saved on this device.'
              : 'No API key yet. Add one to load live educational reels.'}
          </Text>
          <Pressable style={styles.inlineBtn} onPress={onEditApiKey}>
            <Text style={styles.inlineBtnText}>{hasUserKey ? 'Replace key' : 'Add my key'}</Text>
          </Pressable>
          {hasUserKey ? (
            <Pressable
              style={styles.inlineBtnQuiet}
              onPress={() => {
                Alert.alert('Remove API key?', 'Live YouTube search will stop until you add a key again.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: onClearApiKey },
                ]);
              }}
            >
              <Text style={styles.inlineBtnQuietText}>Remove key</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quota today</Text>
          <Text style={styles.cardBody}>{quotaUsed} units used (limit ~10,000)</Text>
        </View>

        <Pressable
          style={styles.dangerBtn}
          onPress={() => {
            Alert.alert('Clear library?', 'Removes saved, liked, and watch history on this device.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: onClearLibrary },
            ]);
          }}
        >
          <Text style={styles.dangerText}>Clear library data</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={() => {
            Alert.alert('Replay onboarding?', 'Shows the welcome screen again on next launch.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Replay',
                onPress: () => onUpdate({ onboardingDone: false }),
              },
            ]);
          }}
        >
          <Text style={styles.secondaryText}>Replay onboarding</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={onClearCacheHint}>
          <Text style={styles.secondaryText}>About feed cache</Text>
        </Pressable>

        <Text style={styles.footer}>
          {brand.tagline}{'\n'}
          Version {Constants.expoConfig?.version ?? '1.1.0'}
        </Text>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowHint}>{hint}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#333', true: colors.accent }}
        thumbColor="#fff"
      />
    </View>
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
    fontSize: 28,
    fontWeight: '800',
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
    gap: spacing.md,
  },
  langBlock: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  langTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  langHint: {
    color: colors.muted,
    fontSize: 12,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  langChip: {
    backgroundColor: colors.chip,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  langChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  langChipText: {
    color: colors.muted,
    fontWeight: '700',
    fontSize: 12,
  },
  langChipTextActive: {
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  rowHint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.accentSoft,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  cardTitle: {
    color: colors.text,
    fontWeight: '800',
  },
  cardBody: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 13,
  },
  inlineBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inlineBtnText: {
    color: '#042F2E',
    fontWeight: '800',
    fontSize: 12,
  },
  inlineBtnQuiet: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  inlineBtnQuietText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 12,
  },
  dangerBtn: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
  },
  dangerText: {
    color: colors.danger,
    fontWeight: '700',
  },
  secondaryBtn: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '600',
  },
  footer: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
