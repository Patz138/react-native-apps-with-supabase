import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { DurationLabel } from '../src/atoms/DurationLabel';

// ── META OBJECT ──────────────────────────────────────────────────
const meta: Meta<typeof DurationLabel> = {
  title: 'Atoms/DurationLabel',
  component: DurationLabel,
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
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#141408', padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    durationInMinutes: {
      control: { type: 'number', min: 5, max: 180, step: 5 },
      description: 'Dauer in Minuten — wird automatisch in h/min formatiert',
    },
    prefix: {
      control: 'text',
      description: 'Optionaler Präfix (z.B. Emoji oder Label)',
    },
  },
  args: {
    durationInMinutes: 45,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── STORY OBJECTS ─────────────────────────────────────────────────

export const Default: Story = {};

export const ShortSession: Story = {
  args: { durationInMinutes: 10 },
};

export const ThirtyMin: Story = {
  args: { durationInMinutes: 30 },
};

export const ExactlyOneHour: Story = {
  args: { durationInMinutes: 60 },
};

export const OverOneHour: Story = {
  args: { durationInMinutes: 90 },
};

export const WithPrefix: Story = {
  args: { durationInMinutes: 45, prefix: '⏱' },
};
