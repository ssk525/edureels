import { useMemo, useState } from 'react';
import { Alert, ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApiKey } from '../hooks/useApiKey';
import { useLibrary } from '../hooks/useLibrary';
import { useSettings } from '../hooks/useSettings';
import { getQuotaUsed } from '../services/quota';
import { writeLastTopicId } from '../services/preferences';
import type { ContentLanguage, EduVideo, TopicId } from '../types';
import { brand, colors, TAB_BAR_CLEARANCE } from '../theme';
import { ApiKeySetupScreen } from './ApiKeySetupScreen';
import { AppIcon, type IconName } from './AppIcon';
import { FeedScreen } from './FeedScreen';
import { LibraryScreen } from './LibraryScreen';
import { NewsScreen } from './NewsScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { SettingsScreen } from './SettingsScreen';

type Tab = 'feed' | 'news' | 'library' | 'settings';

export function AppShell() {
  const [tab, setTab] = useState<Tab>('feed');
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [pendingTopic, setPendingTopic] = useState<TopicId | null>(null);
  const { settings, ready: settingsReady, update } = useSettings();
  const library = useLibrary();
  const api = useApiKey();

  const savedIds = useMemo(() => new Set(library.saved.map((v) => v.id)), [library.saved]);

  if (!settingsReady || !library.ready || !api.ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.bootTag}>{brand.tagline}</Text>
      </View>
    );
  }

  if (!settings.onboardingDone) {
    return (
      <OnboardingScreen
        onDone={(topicId: TopicId, language: ContentLanguage) => {
          void writeLastTopicId(topicId);
          void update({ onboardingDone: true, contentLanguage: language });
        }}
      />
    );
  }

  if (!api.hasUserKey && !settings.apiKeySetupDone) {
    return (
      <ApiKeySetupScreen
        hasBuiltinKey={api.hasBuiltinKey}
        onSave={async (key) => {
          await api.saveKey(key);
          await update({ apiKeySetupDone: true });
        }}
        onSkip={() => {
          void update({ apiKeySetupDone: true });
        }}
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.body}>
        {tab === 'feed' ? (
          <FeedScreen
            likedIds={library.likedIds}
            savedIds={savedIds}
            startMuted={settings.startMuted}
            autoAdvance={settings.autoAdvance}
            showQuota={settings.showQuota}
            contentLanguage={settings.contentLanguage}
            apiKey={api.apiKey}
            initialTopicId={pendingTopic}
            onInitialTopicConsumed={() => setPendingTopic(null)}
            onLike={(video) => {
              void library.onToggleLike(video.id);
            }}
            onSave={(video) => {
              void library.onToggleSave(video);
            }}
            onWatch={(video: EduVideo) => {
              void library.onWatch(video);
            }}
          />
        ) : null}
        {tab === 'news' ? (
          <NewsScreen
            onOpenTopic={(topicId) => {
              setPendingTopic(topicId);
              setTab('feed');
            }}
          />
        ) : null}
        {tab === 'library' ? (
          <LibraryScreen
            saved={library.saved}
            history={library.history}
            likedIds={library.likedIds}
            notes={library.notes}
            streak={library.streak}
            onSaveNote={(videoId, note) => {
              void library.onSaveNote(videoId, note);
            }}
            onContinue={() => setTab('feed')}
          />
        ) : null}
        {tab === 'settings' ? (
          <SettingsScreen
            settings={settings}
            quotaUsed={quotaUsed}
            hasUserKey={api.hasUserKey}
            onUpdate={(patch) => {
              void update(patch);
            }}
            onClearLibrary={() => {
              void library.onClear();
            }}
            onClearCacheHint={() => {
              Alert.alert(
                'Feed cache',
                'Topic feeds cache for 12 hours on this device. Switch topics or run a new search to refresh.',
              );
            }}
            onEditApiKey={() => {
              void update({ apiKeySetupDone: false });
            }}
            onClearApiKey={() => {
              void api.clearKey();
              void update({ apiKeySetupDone: false });
            }}
          />
        ) : null}
      </View>

      <View style={styles.tabBar} pointerEvents="box-none">
        <View style={styles.tabInner}>
          <TabButton
            label="Feed"
            icon={tab === 'feed' ? 'play-circle' : 'play-circle-outline'}
            active={tab === 'feed'}
            onPress={() => setTab('feed')}
          />
          <TabButton
            label="News"
            icon={tab === 'news' ? 'news' : 'news-outline'}
            active={tab === 'news'}
            onPress={() => setTab('news')}
          />
          <TabButton
            label="Library"
            icon={tab === 'library' ? 'bookmark' : 'bookmark-outline'}
            active={tab === 'library'}
            onPress={() => setTab('library')}
          />
          <TabButton
            label="Settings"
            icon={tab === 'settings' ? 'settings' : 'settings-outline'}
            active={tab === 'settings'}
            onPress={() => {
              setTab('settings');
              void getQuotaUsed().then(setQuotaUsed);
            }}
          />
        </View>
      </View>
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: IconName;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.tabBtn} onPress={onPress} accessibilityLabel={label}>
      <AppIcon name={icon} size={16} color={active ? colors.accent : colors.muted} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  bootTag: {
    color: colors.muted,
    fontWeight: '600',
  },
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  body: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_CLEARANCE,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  tabInner: {
    flexDirection: 'row',
    marginHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(7,10,16,0.92)',
    paddingVertical: 10,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.accent,
  },
});
