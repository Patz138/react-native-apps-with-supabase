import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { WorkoutCard } from '../src/WorkoutCard';

// ── META OBJECT ──────────────────────────────────────────
const meta: Meta<typeof WorkoutCard> = {
  title: 'Molecules/WorkoutCard',
  component: WorkoutCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'kinetic-dark',
      values: [
        { name: 'kinetic-dark',    value: '#141408' },
        { name: 'kinetic-surface', value: '#1d1c10' },
        { name: 'light',           value: '#ffffff' },
      ],
    },
  },
  // ── DECORATOR — verhindert Crash: RN View mit Kinetic-Hintergrund ──
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#141408', padding: 24, minWidth: 320, maxWidth: 400 }}>
        <Story />
      </View>
    ),
  ],
  // ── ARG TYPES ────────────────────────────────────────
  argTypes: {
    title: {
      control: 'text',
      description: 'Workout-Titel',
    },
    durationInMinutes: {
      control: { type: 'number', min: 5, max: 180, step: 5 },
      description: 'Dauer in Minuten',
    },
    difficulty: {
      control: 'select',
      options: ['Beginner', 'Intermediate', 'Advanced'],
      description: 'Schwierigkeitsstufe — beeinflusst Badge-Farbe',
    },
    onPress: {
      action: 'card-pressed',
      description: 'Callback bei Tap auf die Card',
    },
  },
  // ── DEFAULT ARGS (Meta-Object Standardargumente) ─────
  args: {
    title: 'Full Body Session',
    durationInMinutes: 40,
    difficulty: 'Intermediate',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── STORY OBJECTS ─────────────────────────────────────────

export const Default: Story = {};

export const Beginner: Story = {
  args: {
    title: 'Mobility Warmup',
    durationInMinutes: 15,
    difficulty: 'Beginner',
  },
};

export const Intermediate: Story = {
  args: {
    title: 'Core Stability Circuit',
    durationInMinutes: 30,
    difficulty: 'Intermediate',
  },
};

export const Advanced: Story = {
  args: {
    title: 'Athlete Conditioning',
    durationInMinutes: 60,
    difficulty: 'Advanced',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Full Body Functional Strength & Hypertrophy Conditioning',
    durationInMinutes: 75,
    difficulty: 'Advanced',
  },
};

export const QuickSession: Story = {
  args: {
    title: 'Express Core',
    durationInMinutes: 10,
    difficulty: 'Beginner',
  },
};

export const OverOneHour: Story = {
  args: {
    title: 'Endurance Block',
    durationInMinutes: 90,
    difficulty: 'Intermediate',
  },
};
