import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { BottomNav } from '../src/organisms/BottomNav';

const meta: Meta<typeof BottomNav> = {
  title: 'Organisms/BottomNav',
  component: BottomNav,
  parameters: {
    backgrounds: { default: 'kinetic-light', values: [{ name: 'kinetic-light', value: '#eef6f0' }] },
  },
  decorators: [(Story) => (
    <View style={{ width: 390, height: 160, padding: 16, justifyContent: 'flex-end', backgroundColor: '#eef6f0' }}>
      <Story />
    </View>
  )],
  argTypes: {
    activeTab:   { control: 'select', options: ['workouts', 'progress', 'health', 'profile'] },
    floating:    { control: 'boolean' },
    onTabChange: { action: 'tab-changed' },
  },
  args: {
    activeTab: 'workouts',
    floating: false,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Workouts: Story = {};
export const Progress: Story = { args: { activeTab: 'progress' } };
export const Health:   Story = { args: { activeTab: 'health' } };
export const Profile:  Story = { args: { activeTab: 'profile' } };
