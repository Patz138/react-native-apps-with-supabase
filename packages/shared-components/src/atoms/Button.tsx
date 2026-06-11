import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius, spacing } = kineticTheme;

export type ButtonVariant = 'primary' | 'secondary' | 'social';
export type ButtonSize = 'md' | 'lg';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Pfeil → rechts neben dem Label (primärer CTA) */
  withArrow?: boolean;
  /** Icon-Slot links vom Label (z.B. Provider-Logo bei `social`) */
  icon?: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Pill-Button in drei Varianten.
 * Quelle: atm-primarybutton / atm-secondarybutton / atm-socialbutton.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  withArrow = false,
  icon,
  disabled = false,
  onPress,
  style,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        variantContainer[variant],
        fullWidth && styles.full,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon != null && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.label, variantLabel[variant]]}>{label}</Text>
      {withArrow && <Text style={[styles.label, variantLabel[variant], styles.arrow]}>→</Text>}
    </Pressable>
  );
}

const variantContainer = StyleSheet.create({
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: 'transparent', borderColor: colors.outline },
  social: { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant },
});

const variantLabel = StyleSheet.create({
  primary: { color: colors.onPrimary },
  secondary: { color: colors.onBackground },
  social: { color: colors.onBackground },
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  md: { paddingVertical: 14, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: 18, paddingHorizontal: spacing.xl },
  full: { width: '100%' },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: { fontSize: 16, fontWeight: '700' },
  arrow: { fontSize: 18 },
  icon: { alignItems: 'center', justifyContent: 'center' },
});
