import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, spacing, radius } = kineticTheme;

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export interface StreakBannerProps {
  /** Anzahl Streak-Tage */
  streakCount: number;
  /**
   * Index des heutigen Tags (0 = Montag … 6 = Sonntag).
   * Wird nicht angegeben, wird der aktuelle Wochentag genutzt.
   */
  todayIndex?: number;
}

export function StreakBanner({ streakCount, todayIndex }: StreakBannerProps) {
  // Montag-basiert: JS getDay() gibt 0=Sun…6=Sat → (day+6)%7 = 0=Mon
  const today = todayIndex ?? (new Date().getDay() + 6) % 7;

  return (
    <View style={styles.banner}>
      {/* ── Info-Zeile ─────────────────────────────────── */}
      <View style={styles.infoRow}>
        <View style={styles.left}>
          <Text style={styles.label}>🔥 Weekly Streak</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{streakCount}</Text>
            <Text style={styles.sub}> days in a row — keep it up!</Text>
          </View>
        </View>
      </View>

      {/* ── Wochen-Dots ────────────────────────────────── */}
      <View style={styles.dots}>
        {WEEK_DAYS.map((day, i) => {
          const isDone  = i < today;
          const isToday = i === today;
          return (
            <View
              key={`${day}-${i}`}
              style={[
                styles.dot,
                isDone  && styles.dotDone,
                isToday && styles.dotToday,
              ]}
            >
              <Text
                style={[
                  styles.dotLabel,
                  (isDone || isToday) && styles.dotLabelActive,
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  left: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: colors.primary,
  },
  dotToday: {
    backgroundColor: colors.primaryDim,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dotLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.onSurfaceVariant,
  },
  dotLabelActive: {
    color: colors.onPrimary,
  },
});
