import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { WorkoutDashboard } from '../src/organisms/WorkoutDashboard';

const meta: Meta<typeof WorkoutDashboard> = {
  title: 'Organisms/WorkoutDashboard',
  component: WorkoutDashboard,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'kinetic-dark', values: [{ name: 'kinetic-dark', value: '#141408' }] },
  },
  decorators: [(Story) => (
    <View style={{ backgroundColor: '#141408', width: 390, height: 844 }}>
      <Story />
    </View>
  )],
  argTypes: {
    userName:   { control: 'text' },
    initials:   { control: 'text' },
    streak:     { control: { type: 'number', min: 0, max: 365 } },
    sessions:   { control: { type: 'number', min: 0, max: 200 } },
    volumeTons: { control: { type: 'number', min: 0, max: 20, step: 0.1 } },
    activeTab:  { control: 'select', options: ['workouts', 'health', 'register'] },
    onTabChange:    { action: 'tab-changed' },
    onWorkoutPress: { action: 'workout-pressed' },
  },
  args: {
    userName: 'Max Mustermann',
    initials: 'MM',
    streak: 12,
    sessions: 48,
    volumeTons: 2.4,
    activeTab: 'workouts',
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const HighStreak: Story = { args: { streak: 42, sessions: 128, volumeTons: 12.5 } };
export const NewUser:    Story = { args: { streak: 0,  sessions: 1,   volumeTons: 0,    userName: 'Newcomer', initials: 'NC' } };
