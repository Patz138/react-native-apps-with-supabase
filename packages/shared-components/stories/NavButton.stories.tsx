import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { NavButton } from '../src/atoms/NavButton';

// ── META OBJECT ──────────────────────────────────────────────────
const meta: Meta<typeof NavButton> = {
  title: 'Atoms/NavButton',
  component: NavButton,
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
    label: {
      control: 'text',
      description: 'Button-Beschriftung',
    },
    active: {
      control: 'boolean',
      description: 'Aktiver/selektierter Zustand (gelber Hintergrund)',
    },
    onPress: {
      action: 'pressed',
      description: 'Callback bei Tap',
    },
  },
  args: {
    label: 'Workouts',
    active: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── STORY OBJECTS ─────────────────────────────────────────────────

export const Default: Story = {};

export const Active: Story = {
  args: { label: 'Workouts', active: true },
};

export const Inactive: Story = {
  args: { label: 'Health', active: false },
};

/** Tab-Bar Simulation mit 3 Buttons */
export const TabBar: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <NavButton label="Workouts" active />
      <NavButton label="Health" />
      <NavButton label="Profile" />
    </View>
  ),
};
