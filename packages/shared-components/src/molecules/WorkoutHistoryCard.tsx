import { Pressable, StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { Tag } from '../atoms/Tag';

const { colors, radius, spacing } = kineticTheme;

export interface WorkoutHistoryTag {
  label: string;
  primary?: boolean;
}

export interface WorkoutHistoryCardProps {
  icon: string;
  /** Hintergrundfarbe der Icon-Box */
  iconBg?: string;
  name: string;
  /** z.B. "Yesterday • 61 min" */
  meta: string;
  tags?: WorkoutHistoryTag[];
  /** Volumen-Wert, z.B. "4.2t" */
  volume: string;
  onPress?: () => void;
}

/**
 * Zeile in "Recent Workouts" — Icon · Name/Meta/Tags · Volumen.
 * Quelle: atm-workouthistorycard-01 (.workout-card, Overview).
 */
export function WorkoutHistoryCard({
  icon,
  iconBg = colors.surfaceContainerHigh,
  name,
  meta,
  tags = [],
  volume,
  onPress,
}: WorkoutHistoryCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>{meta}</Text>
        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.map((t, i) => (
              <Tag key={`${t.label}-${i}`} label={t.label} variant={t.primary ? 'primary' : 'default'} />
            ))}
          </View>
        )}
      </View>
      <View style={styles.vol}>
        <Text style={styles.volValue}>{volume}</Text>
        <Text style={styles.volUnit}>volume</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  pressed: { borderColor: colors.outline },
  icon: { width: 48, height: 48, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 22 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.onBackground },
  meta: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 3 },
  tags: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  vol: { alignItems: 'flex-end' },
  volValue: { fontSize: 15, fontWeight: '700', color: colors.onBackground },
  volUnit: { fontSize: 11, color: colors.onSurfaceVariant },
});
