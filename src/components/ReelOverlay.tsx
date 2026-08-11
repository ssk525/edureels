import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import type { EduVideo } from '../types';
import { colors, spacing, TAB_BAR_CLEARANCE } from '../theme';
import { formatDuration } from '../utils/duration';

type Props = {
  video: EduVideo;
  paused: boolean;
  showHint?: boolean;
  failed?: boolean;
};

export function ReelOverlay({ video, paused, showHint, failed }: Props) {
  return (
    <View style={styles.wrap} pointerEvents="none">
      {paused && !failed ? (
        <View style={styles.pauseBadge}>
          <Text style={styles.pauseIcon}>▶</Text>
        </View>
      ) : null}

      {failed ? (
        <View style={styles.failBadge}>
          <Text style={styles.failTitle}>Embed unavailable</Text>
          <Text style={styles.failBody}>Skipping · open on YouTube if you want this clip</Text>
        </View>
      ) : null}

      <LinearGradient
        colors={['transparent', 'rgba(7,10,16,0.55)', 'rgba(7,10,16,0.94)']}
        style={styles.bottom}
      >
        <View style={styles.metaRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{video.topicLabel}</Text>
          </View>
          {video.durationSec ? (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{formatDuration(video.durationSec)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.channel} numberOfLines={1}>
          {video.channelTitle}
        </Text>
        {showHint ? (
          <Text style={styles.hint}>Tap to pause · swipe up · save what you learn</Text>
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  pauseBadge: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pauseIcon: {
    color: colors.text,
    fontSize: 28,
    marginLeft: 4,
  },
  failBadge: {
    position: 'absolute',
    alignSelf: 'center',
    top: '38%',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '80%',
  },
  failTitle: {
    color: colors.text,
    fontWeight: '800',
    textAlign: 'center',
  },
  failBody: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: spacing.md,
    paddingTop: 48,
    paddingBottom: TAB_BAR_CLEARANCE + 18,
    paddingRight: 96,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  pill: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.35)',
  },
  pillText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  channel: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  hint: {
    color: colors.muted,
    fontSize: 11,
    marginTop: spacing.sm,
  },
});
