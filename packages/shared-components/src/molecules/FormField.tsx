import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { FieldLabel } from '../atoms/FieldLabel';
import { Input } from '../atoms/Input';

const { colors } = kineticTheme;

export interface FormFieldProps {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  /** rendert ein Passwortfeld inkl. Show/Hide-Toggle */
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  /** Fehlertext — färbt Rahmen rot und zeigt die Meldung */
  error?: string;
  /** Hinweistext unter dem Feld (wenn kein Fehler) */
  hint?: string;
}

/**
 * Label + Eingabefeld als Einheit, optional mit Passwort-Toggle & Hinweis.
 * Quelle: mol-formfield-01 / mol-passwordfield-01.
 */
export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  error,
  hint,
}: FormFieldProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.field}>
      <FieldLabel>{label}</FieldLabel>
      <View style={styles.inputWrap}>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          error={!!error}
          style={secureTextEntry ? styles.inputPadded : undefined}
        />
        {secureTextEntry && (
          <Pressable style={styles.toggle} onPress={() => setHidden((h) => !h)} hitSlop={8}>
            <Text style={styles.toggleText}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        )}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 20 },
  inputWrap: { position: 'relative', justifyContent: 'center' },
  inputPadded: { paddingRight: 64 },
  toggle: { position: 'absolute', right: 14, paddingVertical: 4 },
  toggleText: { color: colors.onSurfaceVariant, fontSize: 14 },
  error: { fontSize: 12, color: colors.error, marginTop: 6 },
  hint: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 6 },
});
