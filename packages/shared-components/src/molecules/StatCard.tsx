import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius } = kineticTheme;

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

/**
 * Kompakte Statistik-Kachel (Icon · Wert+Einheit · Label).
 * Quelle: mol-statcard-01 (.stat-card, Overview).
 */
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
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 14,
    minWidth: 90,
  },
  icon: { fontSize: 20, marginBottom: 8 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: { fontSize: 22, fontWeight: '800', color: colors.onBackground },
  unit: { fontSize: 12, fontWeight: '600', color: colors.onSurfaceVariant },
  label: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
});
