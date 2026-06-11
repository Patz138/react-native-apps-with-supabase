import { Pressable, StyleSheet, Text } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, shadows } = kineticTheme;

export interface FABProps {
  icon?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/**
 * Floating Action Button mit Lime-Glow.
 * Quelle: atm-floatingactionbutton-01 (.fab).
 */
export function FAB({ icon = '+', onPress, accessibilityLabel = 'Neues Workout' }: FABProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      <Text style={styles.icon}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primaryGlow,
  },
  pressed: { opacity: 0.9 },
  icon: { fontSize: 28, lineHeight: 32, fontWeight: '600', color: colors.onPrimary },
});
