import { StyleSheet, Text } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors } = kineticTheme;

export interface FieldLabelProps {
  children: string;
}

/**
 * Großbuchstaben-Label über einem Eingabefeld.
 * Quelle: atm-fieldlabel-01 (.field-label).
 */
export function FieldLabel({ children }: FieldLabelProps) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onSurfaceVariant,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
