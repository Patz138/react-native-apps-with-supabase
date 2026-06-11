import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius } = kineticTheme;

export interface ExerciseRowProps {
  /** Positionsnummer (wird bei `done` durch ✓ ersetzt) */
  index: number;
  name: string;
  detail?: string;
  /** Sets-Label, z.B. "4 × 8" */
  sets: string;
  done?: boolean;
  /** letzte Zeile → keine untere Trennlinie */
  last?: boolean;
}

/**
 * Übungszeile in der "Today's Workout"-Karte.
 * Quelle: mol-exerciserow-01 (.exercise-row).
 */
export function ExerciseRow({ index, name, detail, sets, done = false, last = false }: ExerciseRowProps) {
  return (
    <View style={[styles.row, !last && styles.bordered]}>
      <View style={[styles.num, done && styles.numDone]}>
        <Text style={[styles.numText, done && styles.numTextDone]}>{done ? '✓' : index}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
      <View style={styles.setsChip}>
        <Text style={styles.setsText}>{sets}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  bordered: { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  num: {
    width: 30,
    height: 30,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numDone: { backgroundColor: colors.primary },
  numText: { fontSize: 12, fontWeight: '700', color: colors.onSurfaceVariant },
  numTextDone: { color: colors.onPrimary },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: colors.onBackground },
  detail: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 2 },
  setsChip: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  setsText: { fontSize: 12, color: colors.onSurfaceVariant },
});
