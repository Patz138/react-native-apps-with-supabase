import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius } = kineticTheme;

export interface TagProps {
  label: string;
  variant?: 'default' | 'primary';
}

/**
 * Kleines Pill-Tag für Muskelgruppen/Kategorien.
 * Quelle: .tag / .tag.primary (Overview Recent-Workouts).
 */
export function Tag({ label, variant = 'default' }: TagProps) {
  const primary = variant === 'primary';
  return (
    <View style={[styles.tag, primary && styles.primary]}>
      <Text style={[styles.text, primary && styles.primaryText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  primary: { backgroundColor: colors.primaryContainer },
  text: { fontSize: 11, fontWeight: '600', color: colors.onSurfaceVariant },
  primaryText: { color: colors.primary },
});
