import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { WorkoutCard, kineticTheme } from '@workout/shared-components';

const { colors, spacing, radius } = kineticTheme;

const adminPreview = [
  {
    id: 'plan-001',
    title: 'Starter Strength Plan',
    durationInMinutes: 30,
    difficulty: 'Beginner'
  },
  {
    id: 'plan-002',
    title: 'Performance Split',
    durationInMinutes: 55,
    difficulty: 'Advanced'
  }
] as const;

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/';
}

function setPathname(pathname: string): void {
  const maybeWindow = globalThis as {
    window?: {
      history?: { pushState: (data: unknown, title: string, url?: string | URL | null) => void };
      dispatchEvent?: (event: Event) => boolean;
    };
  };
  if (!maybeWindow.window?.history?.pushState || !maybeWindow.window.dispatchEvent) return;
  maybeWindow.window.history.pushState({}, '', pathname);
  maybeWindow.window.dispatchEvent(new Event('popstate'));
}

export default function App() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('idle');
  const [healthMessage, setHealthMessage] = useState('Noch kein Check ausgefuehrt.');

  const healthEndpoint = useMemo(() => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return null;
    return `${supabaseUrl}/functions/v1/client-connection-check`;
  }, []);

  useEffect(() => {
    const maybeWindow = globalThis as {
      window?: {
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    };
    const syncPath = () => setPathnameState(getCurrentPathname());
    maybeWindow.window?.addEventListener?.('popstate', syncPath);
    return () => { maybeWindow.window?.removeEventListener?.('popstate', syncPath); };
  }, []);

  async function runHealthCheck() {
    if (!healthEndpoint) {
      setHealthStatus('unhealthy');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL fehlt. Bitte in der Admin-App konfigurieren.');
      return;
    }
    try {
      setHealthStatus('loading');
      setHealthMessage('Verbindung wird geprueft...');
      const response = await fetch(healthEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string };
      if (!response.ok || !payload.ok) {
        setHealthStatus('unhealthy');
        setHealthMessage(payload.error ?? 'Health-Check fehlgeschlagen.');
        return;
      }
      setHealthStatus('healthy');
      setHealthMessage(payload.message ?? 'Verbindung zur Edge Function ist gesund.');
    } catch {
      setHealthStatus('unhealthy');
      setHealthMessage('Verbindung konnte nicht hergestellt werden.');
    }
  }

  const isHealthPage = pathname === '/health';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* ── NAVIGATION ── */}
        <View style={styles.navigationRow}>
          <Pressable
            onPress={() => setPathname('/')}
            style={[styles.navButton, !isHealthPage && styles.navButtonActive]}
          >
            <Text style={[styles.navButtonText, !isHealthPage && styles.navButtonTextActive]}>
              Dashboard
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPathname('/health')}
            style={[styles.navButton, isHealthPage && styles.navButtonActive]}
          >
            <Text style={[styles.navButtonText, isHealthPage && styles.navButtonTextActive]}>
              Health
            </Text>
          </Pressable>
        </View>

        {/* ── DASHBOARD ── */}
        {!isHealthPage ? (
          <>
            <Text style={styles.heading}>Admin App</Text>
            <Text style={styles.subheading}>
              Web-Frontend fuer Planung, Kuration und Verwaltung von Workout-Inhalten.
            </Text>
            <View style={styles.grid}>
              {adminPreview.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  durationInMinutes={workout.durationInMinutes}
                  difficulty={workout.difficulty}
                />
              ))}
            </View>
          </>
        ) : (

          /* ── HEALTH ── */
          <View style={styles.healthCard}>
            <Text style={styles.heading}>Health Check</Text>
            <Text style={styles.subheading}>
              Prueft die Erreichbarkeit der Supabase Edge Function vom Admin-Client.
            </Text>
            <Text style={styles.label}>Endpoint</Text>
            <Text style={styles.endpointText}>{healthEndpoint ?? 'Nicht konfiguriert'}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.statusPill, statusStyle[healthStatus]]}>
                {healthStatus.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.healthMessage}>{healthMessage}</Text>
            <Pressable onPress={runHealthCheck} style={styles.healthButton}>
              <Text style={styles.healthButtonText}>Health-Check ausfuehren</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const statusStyle: Record<HealthStatus, object> = {
  idle:      {},
  loading:   { backgroundColor: '#fef3c7', color: '#b45309' },
  healthy:   { backgroundColor: '#dcfce7', color: '#15803d' },
  unhealthy: { backgroundColor: '#fee2e2', color: '#b91c1c' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.containerMargin,
    gap: spacing.stackGap,
  },
  navigationRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navButton: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceContainerLow,
  },
  navButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  navButtonText: {
    color: colors.onSurfaceVariant,
    fontWeight: '600',
    fontSize: 14,
  },
  navButtonTextActive: {
    color: colors.onPrimary,
  },
  heading: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.onBackground,
    letterSpacing: -0.64,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
    maxWidth: 720,
  },
  grid: {
    gap: spacing.md,
    maxWidth: 720,
  },
  healthCard: {
    maxWidth: 720,
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  label: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.onSurfaceVariant,
    fontWeight: '700',
  },
  endpointText: {
    fontSize: 13,
    color: colors.onBackground,
    fontFamily: 'monospace',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    backgroundColor: colors.surfaceVariant,
    fontWeight: '700',
    overflow: 'hidden',
  },
  healthMessage: {
    fontSize: 14,
    color: colors.onBackground,
    lineHeight: 20,
  },
  healthButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  healthButtonText: {
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
});
