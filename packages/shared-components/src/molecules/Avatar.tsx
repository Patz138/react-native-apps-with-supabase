import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors } = kineticTheme;

export interface AvatarProps {
  /** 1–2 Buchstaben, die im Kreis angezeigt werden */
  initials: string;
  /** Durchmesser in Pixel — default: 44 */
  size?: number;
}

export function Avatar({ initials, size = 44 }: AvatarProps) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.text, { fontSize: Math.round(size * 0.38) }]}>
        {initials.slice(0, 2).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.onPrimary,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
});
