import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ProfileScreen } from '../src/organisms/ProfileScreen';

const meta: Meta<typeof ProfileScreen> = {
  title: 'Organisms/ProfileScreen',
  component: ProfileScreen,
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
    userName:    { control: 'text' },
    initials:    { control: 'text' },
    level:       { control: 'text' },
    memberSince: { control: 'text' },
    streak:      { control: { type: 'number', min: 0, max: 365 } },
    sessions:    { control: { type: 'number', min: 0, max: 500 } },
    volumeTons:  { control: { type: 'number', min: 0, max: 50, step: 0.1 } },
    onSettingPress: { action: 'setting-pressed' },
    onLogout:       { action: 'logout' },
  },
  args: {
    userName: 'Max Mustermann',
    initials: 'MM',
    level: 'Intermediate Athlete',
    memberSince: 'Member since Jan 2026',
    streak: 12,
    sessions: 48,
    volumeTons: 2.4,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ProAthlete: Story = {
  args: {
    userName: 'Sara Klein',
    initials: 'SK',
    level: 'Elite Athlete',
    streak: 96,
    sessions: 312,
    volumeTons: 28.7,
    badges: [
      { icon: '🔥', label: '7-Day Streak', earned: true },
      { icon: '💪', label: '50 Sessions',  earned: true },
      { icon: '🏆', label: 'PR Crusher',   earned: true },
      { icon: '🌅', label: 'Early Bird',   earned: true },
      { icon: '⚡', label: '10t Volume',   earned: true },
      { icon: '🎯', label: 'Goal Master',  earned: true },
    ],
  },
};
