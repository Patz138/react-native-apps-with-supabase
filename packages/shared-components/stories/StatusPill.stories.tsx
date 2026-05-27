import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { StatusPill } from '../src/atoms/StatusPill';

// ── META OBJECT ──────────────────────────────────────────────────
const meta: Meta<typeof StatusPill> = {
  title: 'Atoms/StatusPill',
  component: StatusPill,
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
    status: {
      control: 'select',
      options: ['idle', 'loading', 'healthy', 'unhealthy'],
      description: 'Status-Zustand — bestimmt Farbe und Standard-Label',
    },
    label: {
      control: 'text',
      description: 'Optionaler Label-Override (überschreibt Standard-Text)',
    },
  },
  args: {
    status: 'healthy',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── STORY OBJECTS ─────────────────────────────────────────────────

export const Default: Story = {};

export const Idle: Story = {
  args: { status: 'idle' },
};

export const Loading: Story = {
  args: { status: 'loading' },
};

export const Healthy: Story = {
  args: { status: 'healthy' },
};

export const Unhealthy: Story = {
  args: { status: 'unhealthy' },
};

export const CustomLabel: Story = {
  args: { status: 'healthy', label: 'API Online' },
};

/** Alle vier Status-Varianten auf einen Blick */
export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <StatusPill status="idle" />
      <StatusPill status="loading" />
      <StatusPill status="healthy" />
      <StatusPill status="unhealthy" />
    </View>
  ),
};
