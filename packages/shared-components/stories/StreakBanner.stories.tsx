import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { StreakBanner } from '../src/organisms/StreakBanner';

const meta: Meta<typeof StreakBanner> = {
  title: 'Organisms/StreakBanner',
  component: StreakBanner,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'kinetic-dark', values: [{ name: 'kinetic-dark', value: '#141408' }] },
  },
  decorators: [(Story) => <View style={{ backgroundColor: '#141408', padding: 24, width: 360 }}><Story /></View>],
  argTypes: {
    streakCount: { control: { type: 'number', min: 0, max: 365 }, description: 'Streak-Tage' },
    todayIndex:  { control: { type: 'number', min: 0, max: 6   }, description: '0=Mo … 6=So' },
  },
  args: { streakCount: 12, todayIndex: 3 }, // Donnerstag
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Monday:    Story = { args: { todayIndex: 0, streakCount: 1  } };
export const Wednesday: Story = { args: { todayIndex: 2, streakCount: 3  } };
export const Friday:    Story = { args: { todayIndex: 4, streakCount: 5  } };
export const Sunday:    Story = { args: { todayIndex: 6, streakCount: 7  } };
export const LongStreak: Story = { args: { todayIndex: 5, streakCount: 42 } };
