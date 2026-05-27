import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutDifficulty } from '@workout/shared-types';
import { kineticTheme } from '../kineticTheme';

const { colors, spacing, radius } = kineticTheme;

export interface DifficultyBadgeProps {
  difficulty: WorkoutDifficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const key = difficulty.toLowerCase() as keyof typeof colors.difficulty;
  const palette = colors.difficulty[key];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      <Text style={[styles.text, { color: palette.text }]}>{difficulty}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
