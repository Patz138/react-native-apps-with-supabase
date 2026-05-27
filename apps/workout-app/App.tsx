import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import {
  WorkoutDashboard,
  HealthScreen,
  kineticTheme,
} from '@workout/shared-components';

const { colors } = kineticTheme;

// ── App-weiter State ──────────────────────────────────────────────
type Tab = 'workouts' | 'health' | 'register';
type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

// ── Statische Demo-Daten ──────────────────────────────────────────
const USER = { name: 'Max Mustermann', initials: 'MM' };

const WORKOUTS = [
  { id: 'w1', title: 'Lower Body Strength',   durationInMinutes: 45, difficulty: 'Intermediate' as const },
  { id: 'w2', title: 'Core Stability Circuit', durationInMinutes: 20, difficulty: 'Beginner'     as const },
  { id: 'w3', title: 'Upper Body Hypertrophy', durationInMinutes: 60, difficulty: 'Advanced'     as const },
];

const STATS = { streak: 12, sessions: 48, volumeTons: 2.4 };

// ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab,     setActiveTab]     = useState<Tab>('workouts');
  const [healthStatus,  setHealthStatus]  = useState<HealthStatus>('idle');
  const [healthMessage, setHealthMessage] = useState('No health check run yet.');

  // Supabase Endpoint aus Env
  const healthEndpoint = useMemo(() => {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    return url ? `${url}/functions/v1/client-connection-check` : undefined;
  }, []);

  // ── Health-Check ────────────────────────────────────────────────
  async function runHealthCheck() {
    if (!healthEndpoint) {
      setHealthStatus('unhealthy');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL is not configured.');
      return;
    }
    try {
      setHealthStatus('loading');
      setHealthMessage('Checking connection…');

      const res     = await fetch(healthEndpoint, { method: 'GET' });
      const payload = (await res.json()) as { ok?: boolean; message?: string; error?: string };

      if (!res.ok || !payload.ok) {
        setHealthStatus('unhealthy');
        setHealthMessage(payload.error ?? 'Health check failed.');
        return;
      }
      setHealthStatus('healthy');
      setHealthMessage(payload.message ?? 'Supabase connection is healthy.');
    } catch {
      setHealthStatus('unhealthy');
      setHealthMessage('Could not reach the endpoint.');
    }
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root}>

      {activeTab === 'workouts' && (
        <WorkoutDashboard
          userName={USER.name}
          initials={USER.initials}
          streak={STATS.streak}
          sessions={STATS.sessions}
          volumeTons={STATS.volumeTons}
          workouts={WORKOUTS}
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as Tab)}
        />
      )}

      {activeTab === 'health' && (
        <HealthScreen
          connectionStatus={healthStatus}
          endpoint={healthEndpoint}
          healthMessage={healthMessage}
          onRunHealthCheck={runHealthCheck}
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as Tab)}
        />
      )}

      {activeTab === 'register' && (
        <HealthScreen
          connectionStatus="idle"
          healthMessage="Profile & registration — coming soon."
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as Tab)}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
