import { StyleSheet, Text } from 'react-native';

import { formatWorkoutDuration } from '@workout/shared-utils';
import { kineticTheme } from '../kineticTheme';

const { colors, typography } = kineticTheme;

export interface DurationLabelProps {
  durationInMinutes: number;
  /** Optionaler Präfix — z.B. ein Emoji oder kurzer Text */
  prefix?: string;
}

export function DurationLabel({ durationInMinutes, prefix }: DurationLabelProps) {
  const formatted = formatWorkoutDuration(durationInMinutes);
  return (
    <Text style={styles.label}>
      {prefix ? `${prefix} · ${formatted}` : formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.bodySM.fontSize,
    lineHeight: typography.bodySM.lineHeight,
    fontWeight: typography.bodySM.fontWeight,
    color: colors.onSurfaceVariant,
  },
});
