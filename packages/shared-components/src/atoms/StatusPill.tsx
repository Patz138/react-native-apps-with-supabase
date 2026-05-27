import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, spacing, radius } = kineticTheme;

export type StatusPillStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

const STATUS_CONFIG: Record<
  StatusPillStatus,
  { bg: string; dot: string; text: string; label: string }
> = {
  idle: {
    bg:    colors.surfaceVariant,
    dot:   colors.outline,
    text:  colors.onSurfaceVariant,
    label: 'Idle',
  },
  loading: {
    bg:    '#e0f2fe',
    dot:   colors.secondary,
    text:  '#0369a1',
    label: 'Loading',
  },
  healthy: {
    bg:    '#dcfce7',
    dot:   '#22c55e',
    text:  '#15803d',
    label: 'Healthy',
  },
  unhealthy: {
    bg:    '#fee2e2',
    dot:   '#ef4444',
    text:  colors.error,
    label: 'Unhealthy',
  },
};

export interface StatusPillProps {
  status: StatusPillStatus;
  /** Überschreibt das Standard-Label für den gewählten Status */
  label?: string;
}

export function StatusPill({ status, label }: StatusPillProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
      <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.text, { color: cfg.text }]}>
        {label ?? cfg.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
});
