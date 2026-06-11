import { Pressable, StyleSheet, Text } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors } = kineticTheme;

export interface CheckboxProps {
  checked: boolean;
  onToggle?: (next: boolean) => void;
}

/**
 * Quadratische Checkbox mit Lime-Füllung + schwarzem Haken.
 * Quelle: mol-checkbox-01 (.checkbox / .checkbox.checked).
 */
export function Checkbox({ checked, onToggle }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onToggle?.(!checked)}
      style={[styles.box, checked && styles.checked]}
    >
      {checked && <Text style={styles.tick}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 20,
    height: 20,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: { backgroundColor: colors.primary, borderColor: colors.primary },
  tick: { fontSize: 13, color: colors.onPrimary, fontWeight: '700', lineHeight: 16 },
});
