import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { PREFETCH_WINDOW } from '../config/env';
import type { EduVideo } from '../types';
import { colors, TAB_BAR_CLEARANCE } from '../theme';
import { AppIcon, type IconName } from './AppIcon';
import { ReelOverlay } from './ReelOverlay';
import { YoutubeEmbedPlayer } from './YoutubeEmbedPlayer';

type Props = {
  video: EduVideo;
  index: number;
  activeIndex: number;
  showHint?: boolean;
  liked: boolean;
  saved: boolean;
  startMuted?: boolean;
  autoAdvance?: boolean;
  onEnded: () => void;
  onLike: () => void;
  onSave: () => void;
  onWatch: () => void;
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export function ReelCard({
  video,
  index,
  activeIndex,
  showHint,
  liked,
  saved,
  startMuted = true,
  autoAdvance = true,
  onEnded,
  onLike,
  onSave,
  onWatch,
}: Props) {
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(startMuted);
  const [failed, setFailed] = useState(false);
  const skippedRef = useRef(false);

  const isActive = index === activeIndex;
  const shouldMountPlayer = Math.abs(index - activeIndex) <= PREFETCH_WINDOW;
  const play = isActive && !paused && !failed;

  useEffect(() => {
    skippedRef.current = false;
    setFailed(false);
  }, [video.id]);

  useEffect(() => {
    if (!isActive) {
      setPaused(false);
      setMuted(startMuted);
      return;
    }
    onWatch();
  }, [isActive, onWatch, startMuted]);

  useEffect(() => {
    if (!autoAdvance || !isActive || paused || failed || !video.durationSec) return;
    const timer = setTimeout(() => {
      onEnded();
    }, (video.durationSec + 2) * 1000);
    return () => clearTimeout(timer);
  }, [autoAdvance, failed, isActive, paused, video.durationSec, video.id, onEnded]);

  const buzz = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleUnavailable = () => {
    if (!isActive || skippedRef.current) return;
    skippedRef.current = true;
    setFailed(true);
    setTimeout(() => onEnded(), 700);
  };

  return (
    <View style={styles.page} collapsable={false}>
      {shouldMountPlayer && !failed ? (
        <View style={styles.playerWrap}>
          <YoutubeEmbedPlayer
            videoId={video.id}
            height={SCREEN_HEIGHT}
            width={SCREEN_WIDTH}
            play={play}
            muted={muted}
            onUnavailable={handleUnavailable}
          />
        </View>
      ) : (
        <Image source={{ uri: video.thumbnail }} style={styles.thumb} resizeMode="cover" />
      )}

      <Pressable
        style={styles.tapZone}
        onPress={() => {
          setPaused((value) => !value);
          if (muted) setMuted(false);
        }}
      />

      <View style={styles.overlayLayer} pointerEvents="box-none">
        <ReelOverlay
          video={video}
          paused={isActive && paused}
          showHint={showHint}
          failed={failed}
        />

        <View style={styles.sideActions} pointerEvents="box-none">
          <Action
            icon={liked ? 'heart' : 'heart-outline'}
            label="Like"
            active={liked}
            onPress={() => {
              buzz();
              onLike();
            }}
          />
          <Action
            icon={saved ? 'bookmark' : 'bookmark-outline'}
            label="Save"
            active={saved}
            onPress={() => {
              buzz();
              onSave();
            }}
          />
          <Action
            icon={muted ? 'volume-mute' : 'volume-high'}
            label={muted ? 'Unmute' : 'Mute'}
            onPress={() => {
              buzz();
              setMuted((value) => !value);
            }}
          />
          <Action
            icon="share-social-outline"
            label="Share"
            onPress={() => {
              buzz();
              void Share.share({
                message: `${video.title}\nhttps://www.youtube.com/watch?v=${video.id}`,
                url: `https://www.youtube.com/watch?v=${video.id}`,
              });
            }}
          />
          <Action
            icon="logo-youtube"
            label="YouTube"
            onPress={() => {
              void Linking.openURL(`https://www.youtube.com/watch?v=${video.id}`);
            }}
          />
          <Action icon="play-skip-forward" label="Next" onPress={onEnded} />
        </View>

        {isActive && muted && !failed ? (
          <Pressable
            style={styles.unmuteBanner}
            onPress={() => {
              buzz();
              setMuted(false);
            }}
          >
            <Text style={styles.unmuteText}>Tap to unmute</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function Action({
  icon,
  label,
  active,
  onPress,
}: {
  icon: IconName;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.actionBtn} onPress={onPress} accessibilityLabel={label}>
      <View style={[styles.actionOrb, active && styles.actionOrbActive]}>
        <AppIcon name={icon} size={18} color={active ? colors.accent : colors.text} />
      </View>
      <Text style={[styles.actionText, active && styles.actionActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  playerWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
  },
  thumb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg,
  },
  tapZone: {
    position: 'absolute',
    top: 130,
    bottom: TAB_BAR_CLEARANCE + 40,
    left: 0,
    right: 92,
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sideActions: {
    position: 'absolute',
    right: 12,
    bottom: TAB_BAR_CLEARANCE + 56,
    gap: 12,
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 3,
  },
  actionOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionOrbActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  actionText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
  },
  actionActive: {
    color: colors.accent,
  },
  unmuteBanner: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unmuteText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
});
