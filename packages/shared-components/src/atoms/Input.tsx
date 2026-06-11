import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { KeyboardTypeOptions, StyleProp, TextStyle } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius, spacing } = kineticTheme;

export interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  /** roter Rahmen für Validierungsfehler */
  error?: boolean;
  editable?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * Text-Eingabefeld mit Fokus- und Fehler-Rahmen.
 * Quelle: atm-textinput-01 (.field-input).
 */
export function Input({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  error = false,
  editable = true,
  style,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#555555"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      editable={editable}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.input, focused && styles.focused, error && styles.error, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    color: colors.onBackground,
  },
  focused: { borderColor: colors.primary },
  error: { borderColor: colors.error },
});
