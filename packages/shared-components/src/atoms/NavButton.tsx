import { Pressable, StyleSheet, Text } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, spacing, radius } = kineticTheme;

export interface NavButtonProps {
  label: string;
  /** Aktiver/selektierter Zustand — gelber Hintergrund */
  active?: boolean;
  onPress?: () => void;
}

export function NavButton({ label, active = false, onPress }: NavButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, active && styles.active]}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  active: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.onSurfaceVariant,
  },
  activeLabel: {
    color: colors.onPrimary,
  },
});
