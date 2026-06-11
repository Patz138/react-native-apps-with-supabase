import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius } = kineticTheme;

export interface FeatureChipProps {
  icon: string;
  label: string;
}

/**
 * Feature-Kachel auf der Landing-Page (Icon über Label).
 * Quelle: mol-featurechip-01 (.feature-chip).
 */
export function FeatureChip({ icon, label }: FeatureChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
  },
  icon: { fontSize: 22 },
  label: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 15,
  },
});
