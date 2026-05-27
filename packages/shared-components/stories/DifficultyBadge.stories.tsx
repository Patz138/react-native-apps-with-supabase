import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { DifficultyBadge } from '../src/atoms/DifficultyBadge';

// ── META OBJECT ──────────────────────────────────────────────────
const meta: Meta<typeof DifficultyBadge> = {
  title: 'Atoms/DifficultyBadge',
  component: DifficultyBadge,
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
      <View style={{ backgroundColor: '#eef6f0', padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    difficulty: {
      control: 'select',
      options: ['Beginner', 'Intermediate', 'Advanced'],
      description: 'Schwierigkeitsstufe — bestimmt Farbe des Badges',
    },
  },
  args: {
    difficulty: 'Intermediate',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── STORY OBJECTS ─────────────────────────────────────────────────

export const Default: Story = {};

export const Beginner: Story = {
  args: { difficulty: 'Beginner' },
};

export const Intermediate: Story = {
  args: { difficulty: 'Intermediate' },
};

export const Advanced: Story = {
  args: { difficulty: 'Advanced' },
};

/** Alle drei Varianten auf einen Blick */
export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <DifficultyBadge difficulty="Beginner" />
      <DifficultyBadge difficulty="Intermediate" />
      <DifficultyBadge difficulty="Advanced" />
    </View>
  ),
};
