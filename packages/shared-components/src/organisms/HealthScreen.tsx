import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { NavButton } from '../atoms/NavButton';
import { HealthCard } from '../molecules/HealthCard';
import type { StatusPillStatus } from '../atoms/StatusPill';

const { colors, spacing, radius } = kineticTheme;

export interface HealthScreenProps {
  /** Supabase-Verbindungsstatus */
  connectionStatus?: StatusPillStatus;
  /** Endpoint-URL — wird angezeigt wenn vorhanden */
  endpoint?: string;
  /** Nachricht vom letzten Health-Check */
  healthMessage?: string;
  /** Herzfrequenz in bpm */
  heartRate?: number;
  /** Schritte heute */
  steps?: number;
  /** Schlaf in Stunden */
  sleep?: number;
  /** Kalorien in kcal */
  calories?: number;
  onRunHealthCheck?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function HealthScreen({
  connectionStatus = 'idle',
  endpoint,
  healthMessage   = 'No health check run yet.',
  heartRate,
  steps,
  sleep,
  calories,
  onRunHealthCheck,
  activeTab   = 'health',
  onTabChange,
}: HealthScreenProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.heading}>Health</Text>
        <Text style={styles.subheading}>Metrics & connection status</Text>
      </View>

      {/* ── Health Metric Cards ─────────────────────────── */}
      <View style={styles.grid}>
        <HealthCard
          title="Heart Rate"
          value={heartRate ?? '—'}
          unit="bpm"
          status={heartRate !== undefined ? 'healthy' : connectionStatus}
          description={heartRate ? 'Resting — within normal range' : undefined}
        />
        <HealthCard
          title="Steps Today"
          value={steps !== undefined ? steps.toLocaleString() : '—'}
          unit="steps"
          status={steps !== undefined
            ? (steps >= 8000 ? 'healthy' : 'unhealthy')
            : connectionStatus}
        />
        <HealthCard
          title="Sleep"
          value={sleep ?? '—'}
          unit="h"
          status={sleep !== undefined
            ? (sleep >= 7 ? 'healthy' : 'unhealthy')
            : connectionStatus}
          description={sleep !== undefined && sleep < 7
            ? 'Below recommended 7–9 hours'
            : undefined}
        />
        <HealthCard
          title="Calories Burned"
          value={calories ?? '—'}
          unit="kcal"
          status={calories !== undefined ? 'healthy' : connectionStatus}
        />
      </View>

      {/* ── Connection Card ─────────────────────────────── */}
      <View style={styles.connectionCard}>
        <Text style={styles.connectionTitle}>Supabase Connection</Text>
        {endpoint ? <Text style={styles.endpoint}>{endpoint}</Text> : null}
        <Text style={styles.message}>{healthMessage}</Text>
        {onRunHealthCheck && (
          <Pressable onPress={onRunHealthCheck} style={styles.checkBtn}>
            <Text style={styles.checkBtnText}>Run Health Check</Text>
          </Pressable>
        )}
      </View>

      {/* ── Bottom Nav ──────────────────────────────────── */}
      {onTabChange && (
        <View style={styles.tabRow}>
          {NAV_TABS.map(({ key, label }) => (
            <NavButton
              key={key}
              label={label}
              active={key === activeTab}
              onPress={() => onTabChange(key)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const NAV_TABS = [
  { key: 'workouts', label: 'Workouts' },
  { key: 'health',   label: 'Health'   },
  { key: 'register', label: 'Profile'  },
];

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.containerMargin,
    gap: spacing.stackGap,
    paddingBottom: 48,
  },
  header: {
    gap: 4,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.onBackground,
    letterSpacing: -0.64,
  },
  subheading: {
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  grid: {
    gap: spacing.md,
  },
  connectionCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  connectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: colors.onBackground,
  },
  endpoint: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    fontFamily: 'monospace',
  },
  message: {
    fontSize: 14,
    color: colors.onBackground,
    lineHeight: 20,
  },
  checkBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  checkBtnText: {
    color: colors.onPrimary,
    fontWeight: '700' as const,
    fontSize: 14,
  },
});
