import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius } = kineticTheme;

export interface IconButtonProps {
  /** Glyph/Emoji als String oder beliebiges Icon-Element */
  icon: ReactNode;
  /** kleiner Lime-Punkt oben rechts (Notification) */
  badge?: boolean;
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/**
 * Quadratischer Icon-Button (Back, Bell, Settings).
 * Quelle: atm-backbutton / atm-iconbutton (+ atm-badge).
 */
export function IconButton({ icon, badge = false, size = 40, onPress, accessibilityLabel }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.btn, { width: size, height: size }, pressed && styles.pressed]}
    >
      {typeof icon === 'string' ? <Text style={styles.glyph}>{icon}</Text> : icon}
      {badge && <View style={styles.badge} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  glyph: { fontSize: 18, color: colors.onBackground },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});
