import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  Gradient,
  HealthCard,
  NavButton,
  ProgressBar,
  StatsRow,
  StreakBanner,
  TopBar,
  WorkoutCard,
  kineticTheme,
} from '@workout/shared-components';

const { colors, gradients, spacing, radius, shadows } = kineticTheme;

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
  const healthProgress = healthStatus === 'healthy'
    ? 1
    : healthStatus === 'loading'
      ? 0.58
      : healthStatus === 'unhealthy'
        ? 0.2
        : 0.1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TopBar
          greeting="Kinetic control center"
          userName="Workout Admin"
          initials="WA"
        />

        <Gradient colors={gradients.hero} style={styles.hero}>
          <Text style={styles.heroEyebrow}>Browser workspace</Text>
          <Text style={styles.heroTitle}>
            {isHealthPage ? 'Keep the platform healthy.' : 'Curate the next workout wave.'}
          </Text>
          <Text style={styles.heroText}>
            Electric lime accents, layered surfaces, and the same component language as the app.
          </Text>
          <View style={styles.heroActions}>
            <NavButton label="Dashboard" active={!isHealthPage} onPress={() => setPathname('/')} />
            <NavButton label="Health" active={isHealthPage} onPress={() => setPathname('/health')} />
          </View>
        </Gradient>

        {!isHealthPage ? (
          <>
            <StatsRow streak={12} sessions={48} volumeTons={2.4} />
            <StreakBanner streakCount={12} />

            <View style={styles.panel}>
              <View style={styles.sectionHead}>
                <View>
                  <Text style={styles.sectionTitle}>Featured plans</Text>
                  <Text style={styles.sectionMeta}>Kinetic cards powered by shared components.</Text>
                </View>
                <Text style={styles.sectionChip}>Live</Text>
              </View>

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
            </View>

            <View style={styles.panel}>
              <View style={styles.sectionHead}>
                <View>
                  <Text style={styles.sectionTitle}>System pulse</Text>
                  <Text style={styles.sectionMeta}>Readiness for the next publish.</Text>
                </View>
                <Text style={styles.sectionChip}>{Math.round(healthProgress * 100)}%</Text>
              </View>
              <ProgressBar progress={healthProgress} height={8} />
              <Text style={styles.healthMessage}>{healthMessage}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.healthStack}>
              <HealthCard
                title="Connection"
                value={healthStatus.toUpperCase()}
                status={healthStatus}
                description={healthMessage}
              />
              <HealthCard
                title="Endpoint"
                value={healthEndpoint ? 'Configured' : 'Missing'}
                status={healthEndpoint ? 'healthy' : 'unhealthy'}
                description={healthEndpoint ?? 'EXPO_PUBLIC_SUPABASE_URL is not set.'}
              />
            </View>

            <View style={styles.panel}>
              <View style={styles.sectionHead}>
                <View>
                  <Text style={styles.sectionTitle}>Supabase check</Text>
                  <Text style={styles.sectionMeta}>Run the edge-function probe from the browser.</Text>
                </View>
                <Text style={styles.sectionChip}>Health</Text>
              </View>
              <Text style={styles.endpointText}>{healthEndpoint ?? 'Nicht konfiguriert'}</Text>
              <Pressable onPress={runHealthCheck} style={({ pressed }) => [styles.healthButtonShadow, pressed && styles.pressed]}>
                <Gradient colors={gradients.primary} style={styles.healthButton}>
                  <Text style={styles.healthButtonText}>Health-Check ausfuehren</Text>
                </Gradient>
              </Pressable>
            </View>
          </>
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
    padding: spacing.screenPadding,
    gap: spacing.xl,
    paddingBottom: spacing.huge,
  },
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...shadows.md,
  },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.onBackground,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
    maxWidth: 620,
  },
  heroText: {
    color: colors.onSurfaceVariant,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 660,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  panel: {
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.sm,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.onBackground,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800' as const,
    letterSpacing: -0.2,
  },
  sectionMeta: {
    color: colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  sectionChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceContainerHigh,
    color: colors.onBackground,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.3,
  },
  grid: {
    gap: spacing.md,
  },
  healthStack: {
    gap: spacing.md,
  },
  endpointText: {
    color: colors.onBackground,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  healthButtonShadow: {
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.primaryGlow,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  healthButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  healthButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: '800' as const,
  },
  healthMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
});
