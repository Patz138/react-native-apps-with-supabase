import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { HealthCard } from '../src/molecules/HealthCard';

// ── META OBJECT ──────────────────────────────────────────────────
const meta: Meta<typeof HealthCard> = {
  title: 'Molecules/HealthCard',
  component: HealthCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'kinetic-light',
      values: [
        { name: 'kinetic-light',    value: '#eef6f0' },
        { name: 'kinetic-surface', value: '#ffffff' },
        { name: 'light',           value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#eef6f0', padding: 24, minWidth: 320, maxWidth: 400 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'Metriktitel',
    },
    value: {
      control: 'text',
      description: 'Hauptwert (Zahl oder String)',
    },
    unit: {
      control: 'text',
      description: 'Einheit (optional)',
    },
    status: {
      control: 'select',
      options: ['idle', 'loading', 'healthy', 'unhealthy'],
      description: 'Status-Indikator — bestimmt StatusPill-Farbe',
    },
    description: {
      control: 'text',
      description: 'Optionaler Erklärungstext',
    },
  },
  args: {
    title: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    status: 'healthy',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── STORY OBJECTS ─────────────────────────────────────────────────

export const Default: Story = {};

export const HeartRate: Story = {
  args: {
    title: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    status: 'healthy',
    description: 'Resting heart rate — within normal range',
  },
};

export const Steps: Story = {
  args: {
    title: 'Steps Today',
    value: '8,432',
    unit: 'steps',
    status: 'healthy',
  },
};

export const SleepUnhealthy: Story = {
  args: {
    title: 'Sleep',
    value: '6.5',
    unit: 'h',
    status: 'unhealthy',
    description: 'Below recommended 7–9 hours',
  },
};

export const LoadingState: Story = {
  args: {
    title: 'Blood Oxygen',
    value: '—',
    unit: '%',
    status: 'loading',
  },
};

export const IdleState: Story = {
  args: {
    title: 'Stress Level',
    value: '—',
    status: 'idle',
    description: 'Connect wearable to measure',
  },
};

/** Mehrere Cards in einer Liste */
export const CardGrid: Story = {
  render: () => (
    <View style={{ gap: 12, width: 360 }}>
      <HealthCard title="Heart Rate"  value={72}      unit="bpm"   status="healthy"   />
      <HealthCard title="Steps Today" value="8,432"   unit="steps" status="healthy"   />
      <HealthCard title="Sleep"       value="6.5"     unit="h"     status="unhealthy" description="Below 7 h" />
      <HealthCard title="Calories"    value="—"                    status="loading"   />
    </View>
  ),
};
