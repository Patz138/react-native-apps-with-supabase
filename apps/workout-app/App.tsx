import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { WorkoutCard, kineticTheme } from '@workout/shared-components';

const { colors, spacing, radius } = kineticTheme;

const upcomingWorkouts = [
  {
    id: 'w-001',
    title: 'Lower Body Strength',
    durationInMinutes: 45,
    difficulty: 'Intermediate'
  },
  {
    id: 'w-002',
    title: 'Core Stability Circuit',
    durationInMinutes: 20,
    difficulty: 'Beginner'
  }
] as const;

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/';
}

export default function App() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());

  const navigateTo = (path: string) => {
    setPathnameState(path);

    const maybeWindow = globalThis as {
      window?: {
        history?: { pushState: (data: unknown, title: string, url?: string | URL | null) => void };
        dispatchEvent?: (event: Event) => boolean;
      };
    };

    if (!maybeWindow.window?.history?.pushState || !maybeWindow.window.dispatchEvent) return;

    maybeWindow.window.history.pushState({}, '', path);
    maybeWindow.window.dispatchEvent(new Event('popstate'));
  };

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
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL fehlt. Bitte in der Workout-App konfigurieren.');
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

  const isDashboardPage = pathname === '/' || pathname === '/dashboard';
  const isHealthPage    = pathname === '/health';
  const isRegisterPage  = pathname === '/register' || pathname === '/register/success';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* ── NAVIGATION ── */}
        <View style={styles.navigationRow}>
          {(['dashboard', 'register', 'health'] as const).map((route) => {
            const isActive =
              (route === 'dashboard' && isDashboardPage) ||
              (route === 'register' && isRegisterPage) ||
              (route === 'health' && isHealthPage);
            return (
              <Pressable
                key={route}
                onPress={() => navigateTo(route === 'dashboard' ? '/dashboard' : `/${route}`)}
                style={[styles.navButton, isActive && styles.navButtonActive]}
              >
                <Text style={[styles.navButtonText, isActive && styles.navButtonTextActive]}>
                  {route.charAt(0).toUpperCase() + route.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── DASHBOARD ── */}
        {isDashboardPage && (
          <>
            <Text style={styles.heading}>Workout App</Text>
            <Text style={styles.subheading}>Mobile-Frontend fuer Trainingsplaene, Sessions und Fortschritt.</Text>
            <View style={styles.list}>
              {upcomingWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  durationInMinutes={workout.durationInMinutes}
                  difficulty={workout.difficulty}
                />
              ))}
            </View>
          </>
        )}

        {/* ── HEALTH ── */}
        {isHealthPage && (
          <View style={styles.healthCard}>
            <Text style={styles.heading}>Health Check</Text>
            <Text style={styles.subheading}>Prueft die Erreichbarkeit der Supabase Edge Function.</Text>
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

        {/* ── REGISTER PLACEHOLDER ── */}
        {isRegisterPage && (
          <View style={styles.healthCard}>
            <Text style={styles.heading}>Registrierung</Text>
            <Text style={styles.subheading}>Supabase Auth — kommt bald.</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const statusStyle: Record<HealthStatus, object> = {
  idle:      {},
  loading:   { backgroundColor: colors.difficulty.intermediate.bg, color: colors.difficulty.intermediate.text },
  healthy:   { backgroundColor: colors.difficulty.beginner.bg,     color: colors.difficulty.beginner.text },
  unhealthy: { backgroundColor: colors.difficulty.advanced.bg,     color: colors.difficulty.advanced.text },
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
    fontSize: 32,
    fontWeight: '700',
    color: colors.onBackground,
    letterSpacing: -0.64,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
  },
  list: {
    gap: spacing.md,
  },
  healthCard: {
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
