import { StyleSheet, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { StatCard } from '../molecules/StatCard';

const { spacing } = kineticTheme;

export interface StatsRowProps {
  /** Aktuelle Streak in Tagen */
  streak?: number;
  /** Sessions diesen Monat */
  sessions?: number;
  /** Gesamt-Volumen in Tonnen */
  volumeTons?: number;
}

export function StatsRow({
  streak    = 0,
  sessions  = 0,
  volumeTons = 0,
}: StatsRowProps) {
  return (
    <View style={styles.row}>
      <StatCard icon="🔥" value={streak}                      unit="days"     label="Current Streak" />
      <StatCard icon="🏋️" value={sessions}                    unit="sessions" label="This Month"      />
      <StatCard icon="⚡" value={volumeTons.toFixed(1)}        unit="t"        label="Volume Lifted"   />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
