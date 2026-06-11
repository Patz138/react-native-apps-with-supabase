import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius } = kineticTheme;

export interface StrengthMeterProps {
  /** Anzahl aktiver Segmente (0..segments) */
  strength: number;
  segments?: number;
  /** Label darunter, z.B. "Password strength: Fair" */
  label?: string;
}

/**
 * Passwort-Stärke-Anzeige aus Segmenten + Label.
 * Quelle: mol-strengthbar-01 / mol-strengthsegment-01 / mol-strengthlabel-01.
 */
export function StrengthMeter({ strength, segments = 4, label }: StrengthMeterProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {Array.from({ length: segments }, (_, i) => (
          <View key={i} style={[styles.segment, i < strength && styles.active]} />
        ))}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8 },
  bar: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 3, borderRadius: radius.pill, backgroundColor: colors.outlineVariant },
  active: { backgroundColor: colors.primary },
  label: { fontSize: 11, color: colors.onSurfaceVariant, marginTop: 4 },
});
