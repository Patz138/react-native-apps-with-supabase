import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { StatusPill } from '../atoms/StatusPill';
import type { StatusPillStatus } from '../atoms/StatusPill';

const { colors, spacing, radius } = kineticTheme;

export type { StatusPillStatus };

export interface HealthCardProps {
  /** Metriktitel (z.B. "Heart Rate", "Steps Today") */
  title: string;
  /** Hauptwert — Zahl oder formatierter String */
  value: string | number;
  /** Einheit des Werts (z.B. "bpm", "steps", "h") */
  unit?: string;
  /** Status-Indikator — bestimmt die StatusPill-Farbe */
  status: StatusPillStatus;
  /** Optionaler Erklärungstext unterhalb des Werts */
  description?: string;
}

export function HealthCard({ title, value, unit, status, description }: HealthCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <StatusPill status={status} />
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.onBackground,
    letterSpacing: -0.64,
  },
  unit: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.onSurfaceVariant,
  },
  description: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
});
