import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ProgressScreen } from '../src/organisms/ProgressScreen';

const meta: Meta<typeof ProgressScreen> = {
  title: 'Organisms/ProgressScreen',
  component: ProgressScreen,
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
    monthlyVolumeTons: { control: { type: 'number', min: 0, max: 30, step: 0.1 } },
    monthlySessions:   { control: { type: 'number', min: 0, max: 60 } },
    avgSessionMin:     { control: { type: 'number', min: 0, max: 120 } },
  },
  args: {
    monthlyVolumeTons: 9.6,
    monthlySessions: 18,
    avgSessionMin: 42,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HighActivity: Story = {
  args: {
    weeklyVolume: [4200, 3800, 5100, 4600, 6200, 5400, 3100],
    monthlyVolumeTons: 18.4,
    monthlySessions: 26,
    avgSessionMin: 58,
    goals: [
      { label: 'Workouts',    current: 6,    target: 5,  unit: '' },
      { label: 'Volume',      current: 18.4, target: 15, unit: 't' },
      { label: 'Active Days', current: 7,    target: 7,  unit: '' },
    ],
  },
};

export const QuietWeek: Story = {
  args: {
    weeklyVolume: [0, 1800, 0, 2200, 0, 0, 1500],
    monthlyVolumeTons: 3.2,
    monthlySessions: 6,
    avgSessionMin: 28,
  },
};
