import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../theme';

const APP_REFERER = 'https://com.edureels.app';

type Props = {
  videoId: string;
  height: number;
  width: number;
  play: boolean;
  muted: boolean;
  onUnavailable?: () => void;
};

/**
 * Immersive YouTube embed with app Referer (avoids Error 152/153).
 * Reports load failures so the feed can auto-skip.
 */
export function YoutubeEmbedPlayer({
  videoId,
  height,
  width,
  play,
  muted,
  onUnavailable,
}: Props) {
  const uri = useMemo(() => {
    const params = new URLSearchParams({
      playsinline: '1',
      autoplay: play ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: '0',
      rel: '0',
      fs: '0',
      modestbranding: '1',
      enablejsapi: '1',
      iv_load_policy: '3',
      origin: APP_REFERER,
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, play, muted]);

  return (
    <View style={[styles.wrap, { height, width }]} pointerEvents="none">
      <WebView
        key={`${videoId}-${play ? 'p' : 's'}-${muted ? 'm' : 'u'}`}
        source={{
          uri,
          headers: {
            Referer: APP_REFERER,
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        }}
        style={styles.webview}
        scrollEnabled={false}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo={false}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
        setSupportMultipleWindows={false}
        originWhitelist={['https://*', 'http://*']}
        androidLayerType="hardware"
        userAgent="Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        onHttpError={() => onUnavailable?.()}
        onError={() => onUnavailable?.()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
