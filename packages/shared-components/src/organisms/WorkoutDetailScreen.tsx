import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { WorkoutDifficulty } from '@workout/shared-types';
import { formatWorkoutDuration } from '@workout/shared-utils';
import { kineticTheme } from '../kineticTheme';
import { Gradient } from '../atoms/Gradient';

const { colors, gradients, spacing, radius, shadows } = kineticTheme;

export interface Exercise {
  name: string;
  sets: number;
  /** Wiederholungen oder Dauer, z.B. "12" oder "45s" */
  reps: string;
  /** Zielmuskel — optional */
  target?: string;
}

export interface WorkoutDetailScreenProps {
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
  /** Kurzbeschreibung */
  description?: string;
  exercises?: Exercise[];
  onBack?: () => void;
  onStart?: () => void;
}

const SAMPLE_EXERCISES: Exercise[] = [
  { name: 'Back Squat',        sets: 4, reps: '8',   target: 'Quads · Glutes' },
  { name: 'Romanian Deadlift', sets: 3, reps: '10',  target: 'Hamstrings'     },
  { name: 'Walking Lunges',    sets: 3, reps: '12',  target: 'Glutes'         },
  { name: 'Leg Press',         sets: 3, reps: '12',  target: 'Quads'          },
  { name: 'Calf Raises',       sets: 4, reps: '15',  target: 'Calves'         },
];

export function WorkoutDetailScreen({
  title,
  durationInMinutes,
  difficulty,
  description = 'A focused session designed to build strength and control. Warm up first and keep your form tight on every rep.',
  exercises = SAMPLE_EXERCISES,
  onBack,
  onStart,
}: WorkoutDetailScreenProps) {
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ──────────────────────────────────────── */}
        <Gradient colors={gradients.hero} direction="diagonal" style={styles.hero}>
          <View style={styles.heroTopRow}>
            <Pressable
              onPress={onBack}
              style={styles.backBtn}
              accessibilityLabel="Go back"
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <Text style={styles.heroEyebrow}>{difficulty.toUpperCase()} · WORKOUT</Text>
          </View>

          <Text style={styles.heroTitle}>{title}</Text>

          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>⏱  {formatWorkoutDuration(durationInMinutes)}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>🏋️  {exercises.length} exercises</Text>
            </View>
          </View>
        </Gradient>

        {/* ── Description ────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this workout</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* ── Exercises ──────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          <View style={styles.exerciseList}>
            {exercises.map((ex, i) => (
              <View key={ex.name} style={styles.exerciseRow}>
                <View style={styles.indexCircle}>
                  <Text style={styles.indexText}>{i + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  {ex.target ? <Text style={styles.exerciseTarget}>{ex.target}</Text> : null}
                </View>
                <Text style={styles.exerciseReps}>{ex.sets} × {ex.reps}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky Start CTA ─────────────────────────────── */}
      <View style={styles.ctaWrap}>
        <Pressable
          onPress={onStart}
          style={({ pressed }) => [styles.ctaShadow, pressed && styles.pressed]}
        >
          <Gradient colors={gradients.primary} style={styles.cta}>
            <Text style={styles.ctaText}>▶  Start Workout</Text>
          </Gradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
    gap: spacing.lg,
  },
  hero: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.containerMargin,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    gap: spacing.md,
    ...shadows.primaryGlow,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 26,
    lineHeight: 28,
    color: colors.onPrimary,
    fontWeight: '700' as const,
    marginTop: -2,
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    color: 'rgba(255,255,255,0.85)',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700' as const,
    color: colors.onPrimary,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.onPrimary,
  },
  section: {
    paddingHorizontal: spacing.containerMargin,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.onBackground,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.onSurfaceVariant,
  },
  exerciseList: {
    gap: spacing.sm,
    marginTop: 4,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  indexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.primaryDim,
  },
  exerciseInfo: {
    flex: 1,
    gap: 2,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.onBackground,
  },
  exerciseTarget: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  exerciseReps: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.onSurfaceVariant,
  },
  ctaWrap: {
    position: 'absolute',
    left: spacing.containerMargin,
    right: spacing.containerMargin,
    bottom: spacing.lg,
  },
  ctaShadow: {
    borderRadius: radius.lg,
    ...shadows.primaryGlow,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cta: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
});
