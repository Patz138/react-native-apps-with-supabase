import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { WorkoutDifficulty } from '@workout/shared-types';
import { kineticTheme } from '../kineticTheme';
import { WorkoutCard } from '../WorkoutCard';
import { TopBar } from './TopBar';
import { StatsRow } from './StatsRow';
import { StreakBanner } from './StreakBanner';

const { colors, spacing } = kineticTheme;

export interface WorkoutItem {
  id: string;
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
}

export interface WorkoutDashboardProps {
  userName?: string;
  initials?: string;
  greeting?: string;
  streak?: number;
  sessions?: number;
  volumeTons?: number;
  workouts?: WorkoutItem[];
  onWorkoutPress?: (id: string) => void;
}

const SAMPLE_WORKOUTS: WorkoutItem[] = [
  { id: '1', title: 'Lower Body Strength',       durationInMinutes: 45, difficulty: 'Intermediate' },
  { id: '2', title: 'Core Stability Circuit',     durationInMinutes: 20, difficulty: 'Beginner'     },
  { id: '3', title: 'Upper Body Hypertrophy',     durationInMinutes: 60, difficulty: 'Advanced'     },
];

export function WorkoutDashboard({
  userName    = 'Athlete',
  initials    = 'AT',
  greeting,
  streak      = 12,
  sessions    = 48,
  volumeTons  = 2.4,
  workouts    = SAMPLE_WORKOUTS,
  onWorkoutPress,
}: WorkoutDashboardProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── 1. Top Bar ────────────────────────────────── */}
      <TopBar userName={userName} initials={initials} greeting={greeting} />

      {/* ── 2. Stats Row ──────────────────────────────── */}
      <StatsRow streak={streak} sessions={sessions} volumeTons={volumeTons} />

      {/* ── 3. Streak Banner ──────────────────────────── */}
      <StreakBanner streakCount={streak} />

      {/* ── 4. Upcoming Workouts ──────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Upcoming Workouts</Text>
          <Text style={styles.sectionAction}>See all</Text>
        </View>
        <View style={styles.cardList}>
          {workouts.map((w) => (
            <WorkoutCard
              key={w.id}
              title={w.title}
              durationInMinutes={w.durationInMinutes}
              difficulty={w.difficulty}
              onPress={() => onWorkoutPress?.(w.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.containerMargin,
    gap: spacing.stackGap,
    paddingBottom: 140,
  },
  section: {
    gap: spacing.md,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.onBackground,
    letterSpacing: -0.2,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  cardList: {
    gap: spacing.md,
  },
});
