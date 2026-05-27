import { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import {
  WorkoutDashboard,
  WorkoutDetailScreen,
  ProgressScreen,
  HealthScreen,
  ProfileScreen,
  BottomNav,
  kineticTheme,
} from '@workout/shared-components';
import type { Exercise } from '@workout/shared-components';

const { colors } = kineticTheme;

// ── App-weiter State ──────────────────────────────────────────────
type Tab = 'workouts' | 'progress' | 'health' | 'profile';
type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

// ── Statische Demo-Daten ──────────────────────────────────────────
const USER = { name: 'Max Mustermann', initials: 'MM' };

interface AppWorkout {
  id: string;
  title: string;
  durationInMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description?: string;
  exercises?: Exercise[];
}

const WORKOUTS: AppWorkout[] = [
  {
    id: 'w1',
    title: 'Lower Body Strength',
    durationInMinutes: 45,
    difficulty: 'Intermediate',
    description: 'Build powerful legs and glutes with compound lifts. Warm up thoroughly and keep your form tight on every rep.',
    exercises: [
      { name: 'Back Squat',        sets: 4, reps: '8',  target: 'Quads · Glutes' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', target: 'Hamstrings'     },
      { name: 'Walking Lunges',    sets: 3, reps: '12', target: 'Glutes'         },
      { name: 'Leg Press',         sets: 3, reps: '12', target: 'Quads'          },
      { name: 'Calf Raises',       sets: 4, reps: '15', target: 'Calves'         },
    ],
  },
  {
    id: 'w2',
    title: 'Core Stability Circuit',
    durationInMinutes: 20,
    difficulty: 'Beginner',
    description: 'A quick, focused circuit to strengthen your core and improve balance. Move with control, not speed.',
    exercises: [
      { name: 'Plank',         sets: 3, reps: '45s', target: 'Core'      },
      { name: 'Dead Bug',      sets: 3, reps: '12',  target: 'Abs'       },
      { name: 'Bird Dog',      sets: 3, reps: '10',  target: 'Lower Back'},
      { name: 'Russian Twist', sets: 3, reps: '20',  target: 'Obliques'  },
    ],
  },
  {
    id: 'w3',
    title: 'Upper Body Hypertrophy',
    durationInMinutes: 60,
    difficulty: 'Advanced',
    description: 'High-volume upper body session for maximum muscle growth. Push close to failure on the final set.',
    exercises: [
      { name: 'Bench Press',     sets: 4, reps: '10', target: 'Chest'     },
      { name: 'Pull-Ups',        sets: 4, reps: '8',  target: 'Back'      },
      { name: 'Overhead Press',  sets: 3, reps: '10', target: 'Shoulders' },
      { name: 'Barbell Row',     sets: 3, reps: '12', target: 'Back'      },
      { name: 'Bicep Curls',     sets: 3, reps: '12', target: 'Biceps'    },
      { name: 'Tricep Pushdown', sets: 3, reps: '15', target: 'Triceps'   },
    ],
  },
];

const STATS = { streak: 12, sessions: 48, volumeTons: 2.4 };

// ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab,      setActiveTab]      = useState<Tab>('workouts');
  const [selectedId,     setSelectedId]     = useState<string | null>(null);
  const [healthStatus,   setHealthStatus]   = useState<HealthStatus>('idle');
  const [healthMessage,  setHealthMessage]  = useState('No health check run yet.');

  const selectedWorkout = useMemo(
    () => WORKOUTS.find((w) => w.id === selectedId) ?? null,
    [selectedId],
  );

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

  // ── Workout-Detail (Overlay über allem, eigene Navigation) ───────
  if (selectedWorkout) {
    return (
      <SafeAreaView style={styles.root}>
        <WorkoutDetailScreen
          title={selectedWorkout.title}
          durationInMinutes={selectedWorkout.durationInMinutes}
          difficulty={selectedWorkout.difficulty}
          description={selectedWorkout.description}
          exercises={selectedWorkout.exercises}
          onBack={() => setSelectedId(null)}
          onStart={() => setSelectedId(null)}
        />
      </SafeAreaView>
    );
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.screen}>
        {activeTab === 'workouts' && (
          <WorkoutDashboard
            userName={USER.name}
            initials={USER.initials}
            streak={STATS.streak}
            sessions={STATS.sessions}
            volumeTons={STATS.volumeTons}
            workouts={WORKOUTS}
            onWorkoutPress={(id) => setSelectedId(id)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressScreen
            monthlyVolumeTons={9.6}
            monthlySessions={STATS.sessions}
            avgSessionMin={42}
          />
        )}

        {activeTab === 'health' && (
          <HealthScreen
            connectionStatus={healthStatus}
            endpoint={healthEndpoint}
            healthMessage={healthMessage}
            onRunHealthCheck={runHealthCheck}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            userName={USER.name}
            initials={USER.initials}
            streak={STATS.streak}
            sessions={STATS.sessions}
            volumeTons={STATS.volumeTons}
          />
        )}

        <BottomNav activeTab={activeTab} onTabChange={(t) => setActiveTab(t as Tab)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },
});
