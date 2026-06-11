import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, spacing } = kineticTheme;

export interface DividerProps {
  /** optionaler zentrierter Text, z.B. "or continue with" */
  label?: string;
}

/**
 * Horizontale Trennlinie, optional mit zentriertem Label.
 * Quelle: mol-divider-01 / atm-dividertext-01.
 */
export function Divider({ label }: DividerProps) {
  if (!label) return <View style={styles.line} />;
  return (
    <View style={styles.row}>
      <View style={styles.flexLine} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.flexLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flexLine: { flex: 1, height: 1, backgroundColor: colors.outlineVariant },
  line: { height: 1, width: '100%', backgroundColor: colors.outlineVariant },
  label: { fontSize: 13, color: colors.onSurfaceVariant },
});
