import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { Gradient } from '../atoms/Gradient';
import { ProgressBar } from '../atoms/ProgressBar';
import { StatCard } from '../molecules/StatCard';

const { colors, gradients, spacing, radius, shadows } = kineticTheme;

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export interface Goal {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

export interface ProgressScreenProps {
  /** 7 Tageswerte (Volumen in kg) — Mo…So */
  weeklyVolume?: number[];
  /** Volumen diesen Monat in Tonnen */
  monthlyVolumeTons?: number;
  /** Sessions diesen Monat */
  monthlySessions?: number;
  /** Ø Session-Dauer in Minuten */
  avgSessionMin?: number;
  goals?: Goal[];
}

const SAMPLE_VOLUME = [3200, 0, 4100, 2800, 5200, 3600, 0];

const SAMPLE_GOALS: Goal[] = [
  { label: 'Workouts',    current: 4,   target: 5,  unit: '' },
  { label: 'Volume',      current: 8.2, target: 12, unit: 't' },
  { label: 'Active Days', current: 5,   target: 7,  unit: '' },
];

export function ProgressScreen({
  weeklyVolume     = SAMPLE_VOLUME,
  monthlyVolumeTons = 9.6,
  monthlySessions  = 18,
  avgSessionMin    = 42,
  goals            = SAMPLE_GOALS,
}: ProgressScreenProps) {
  const maxVolume = Math.max(...weeklyVolume, 1);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.heading}>Progress</Text>
        <Text style={styles.subheading}>Your training trends this month</Text>
      </View>

      {/* ── Summary Stats ───────────────────────────────── */}
      <View style={styles.statsRow}>
        <StatCard icon="📊" value={monthlyVolumeTons.toFixed(1)} unit="t"   label="Volume" />
        <StatCard icon="🏋️" value={monthlySessions}              unit="ses" label="Sessions" />
        <StatCard icon="⏱"  value={avgSessionMin}                unit="min" label="Avg / Session" />
      </View>

      {/* ── Weekly Volume Chart ─────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle}>Weekly Volume</Text>
          <Text style={styles.cardMeta}>kg lifted</Text>
        </View>
        <View style={styles.chart}>
          {weeklyVolume.map((value, i) => {
            const ratio = value / maxVolume;
            const isTop = value === maxVolume && value > 0;
            return (
              <View key={i} style={styles.barColumn}>
                <Text style={styles.barValue}>{value > 0 ? `${(value / 1000).toFixed(1)}t` : ''}</Text>
                <View style={styles.barTrack}>
                  {value > 0 ? (
                    <Gradient
                      colors={isTop ? gradients.fresh : gradients.primary}
                      style={[styles.bar, { height: `${Math.max(ratio * 100, 6)}%` }]}
                    />
                  ) : (
                    <View style={styles.barEmpty} />
                  )}
                </View>
                <Text style={styles.barLabel}>{WEEK_DAYS[i]}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ── Monthly Goals ───────────────────────────────── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Goals</Text>
        <View style={styles.goalList}>
          {goals.map((g) => {
            const ratio = g.target > 0 ? g.current / g.target : 0;
            const reached = ratio >= 1;
            return (
              <View key={g.label} style={styles.goal}>
                <View style={styles.goalHead}>
                  <Text style={styles.goalLabel}>
                    {g.label} {reached ? '✅' : ''}
                  </Text>
                  <Text style={styles.goalValue}>
                    {formatNum(g.current)}{g.unit} / {formatNum(g.target)}{g.unit}
                  </Text>
                </View>
                <ProgressBar
                  progress={ratio}
                  colors={reached ? gradients.fresh : gradients.primary}
                />
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
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
  header: {
    gap: 4,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.onBackground,
    letterSpacing: -0.64,
  },
  subheading: {
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.onBackground,
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: colors.onSurfaceVariant,
  },
  chart: {
    flexDirection: 'row',
    height: 160,
    gap: spacing.xs,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: colors.onSurfaceVariant,
    height: 12,
  },
  barTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '78%',
    borderRadius: radius.sm,
    minHeight: 6,
  },
  barEmpty: {
    width: '78%',
    height: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceVariant,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.onSurfaceVariant,
  },
  goalList: {
    gap: spacing.md,
  },
  goal: {
    gap: 8,
  },
  goalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.onBackground,
  },
  goalValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.onSurfaceVariant,
  },
});
