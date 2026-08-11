import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

const GLYPHS = {
  heart: '♥',
  'heart-outline': '♡',
  bookmark: '◆',
  'bookmark-outline': '◇',
  'volume-mute': '⨯',
  'volume-high': '♫',
  'share-social-outline': '↗',
  'logo-youtube': '▶',
  'play-skip-forward': '»',
  search: '⌕',
  'open-outline': '↗',
  'play-circle': '●',
  'play-circle-outline': '○',
  settings: '☰',
  'settings-outline': '☰',
  news: '✦',
  'news-outline': '✧',
} as const;

export type IconName = keyof typeof GLYPHS;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export function AppIcon({ name, size = 18, color = colors.text }: Props) {
  return (
    <Text style={[styles.icon, { fontSize: size, color, lineHeight: size + 2 }]}>{GLYPHS[name]}</Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
