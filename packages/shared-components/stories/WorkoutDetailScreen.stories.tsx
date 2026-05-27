import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { WorkoutDetailScreen } from '../src/organisms/WorkoutDetailScreen';

const meta: Meta<typeof WorkoutDetailScreen> = {
  title: 'Organisms/WorkoutDetailScreen',
  component: WorkoutDetailScreen,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'kinetic-light', values: [{ name: 'kinetic-light', value: '#eef6f0' }] },
  },
  decorators: [(Story) => (
    <View style={{ backgroundColor: '#eef6f0', width: 390, height: 844 }}>
      <Story />
    </View>
  )],
  argTypes: {
    title:             { control: 'text' },
    durationInMinutes: { control: { type: 'number', min: 5, max: 120 } },
    difficulty:        { control: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
    description:       { control: 'text' },
    onBack:            { action: 'back' },
    onStart:           { action: 'start' },
  },
  args: {
    title: 'Lower Body Strength',
    durationInMinutes: 45,
    difficulty: 'Intermediate',
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Beginner: Story = {
  args: {
    title: 'Core Stability Circuit',
    durationInMinutes: 20,
    difficulty: 'Beginner',
    exercises: [
      { name: 'Plank',         sets: 3, reps: '45s', target: 'Core' },
      { name: 'Dead Bug',      sets: 3, reps: '12',  target: 'Abs' },
      { name: 'Russian Twist', sets: 3, reps: '20',  target: 'Obliques' },
    ],
  },
};

export const Advanced: Story = {
  args: {
    title: 'Upper Body Hypertrophy',
    durationInMinutes: 60,
    difficulty: 'Advanced',
  },
};
