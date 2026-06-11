import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius, spacing } = kineticTheme;

export type BadgeVariant = 'outline' | 'solid';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

/**
 * Pill-Badge mit Großbuchstaben-Label.
 * Quelle: mol-herobadge (outline) / atm-todaytag (solid).
 */
export function Badge({ label, variant = 'outline' }: BadgeProps) {
  const solid = variant === 'solid';
  return (
    <View style={[styles.badge, solid ? styles.solid : styles.outline]}>
      <Text style={[styles.text, solid ? styles.solidText : styles.outlineText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
  },
  outline: { backgroundColor: colors.surfaceContainer, borderColor: colors.outlineVariant },
  solid: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  outlineText: { color: colors.primary },
  solidText: { color: colors.onPrimary },
});
