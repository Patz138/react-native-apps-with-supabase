import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { Gradient } from '../atoms/Gradient';

const { colors, gradients, spacing, radius, shadows } = kineticTheme;

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
    <Gradient colors={gradients.banner} style={styles.banner}>
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
                  isDone  && styles.dotLabelDone,
                  isToday && styles.dotLabelToday,
                ]}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </Gradient>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.primaryGlow,
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
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 30,
    fontWeight: '700' as const,
    color: colors.onPrimary,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  dotToday: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  dotLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.75)',
  },
  dotLabelDone: {
    color: colors.primaryDim,
  },
  dotLabelToday: {
    color: colors.onPrimary,
  },
});
