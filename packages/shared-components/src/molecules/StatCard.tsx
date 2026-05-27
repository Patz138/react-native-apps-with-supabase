import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, spacing, radius } = kineticTheme;

export interface StatCardProps {
  /** Emoji-Icon oder kurzes Symbol */
  icon: string;
  /** Hauptzahl oder Wert */
  value: string | number;
  /** Einheit (z.B. "days", "sessions", "t") */
  unit?: string;
  /** Beschreibungszeile darunter */
  label: string;
}

export function StatCard({ icon, value, unit, label }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
    minWidth: 90,
  },
  icon: {
    fontSize: 22,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.onBackground,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.onSurfaceVariant,
  },
  label: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: colors.onSurfaceVariant,
  },
});
