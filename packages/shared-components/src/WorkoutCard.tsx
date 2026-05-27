import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { WorkoutDifficulty } from '@workout/shared-types';
import { formatWorkoutDuration } from '@workout/shared-utils';
import { kineticTheme } from './kineticTheme';

const { colors, spacing, radius, shadows } = kineticTheme;

export interface WorkoutCardProps {
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
  onPress?: () => void;
}

export function WorkoutCard({ title, durationInMinutes, difficulty, onPress }: WorkoutCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.accent, { backgroundColor: colors.difficulty[diffKey[difficulty]].dot }]} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.badge, diffBadgeStyle[difficulty]]}>
            <View style={[styles.diffDot, diffDotStyle[difficulty]]} />
            <Text style={[styles.badgeText, diffTextStyle[difficulty]]}>{difficulty}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.meta}>⏱  {formatWorkoutDuration(durationInMinutes)}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </Pressable>
  );
}

const diffKey: Record<WorkoutDifficulty, 'beginner' | 'intermediate' | 'advanced'> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
};

const diffBadgeStyle: Record<WorkoutDifficulty, object> = {
  Beginner:     { backgroundColor: colors.difficulty.beginner.bg },
  Intermediate: { backgroundColor: colors.difficulty.intermediate.bg },
  Advanced:     { backgroundColor: colors.difficulty.advanced.bg },
};

const diffTextStyle: Record<WorkoutDifficulty, object> = {
  Beginner:     { color: colors.difficulty.beginner.text },
  Intermediate: { color: colors.difficulty.intermediate.text },
  Advanced:     { color: colors.difficulty.advanced.text },
};

const diffDotStyle: Record<WorkoutDifficulty, object> = {
  Beginner:     { backgroundColor: colors.difficulty.beginner.dot },
  Intermediate: { backgroundColor: colors.difficulty.intermediate.dot },
  Advanced:     { backgroundColor: colors.difficulty.advanced.dot },
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  accent: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.onBackground,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  diffDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
  },
  chevron: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.outlineVariant,
  },
});
