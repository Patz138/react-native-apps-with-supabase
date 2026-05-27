import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { StatCard } from '../src/molecules/StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'kinetic-dark', values: [{ name: 'kinetic-dark', value: '#141408' }] },
  },
  decorators: [(Story) => <View style={{ backgroundColor: '#141408', padding: 24 }}><Story /></View>],
  argTypes: {
    icon:  { control: 'text', description: 'Emoji-Icon' },
    value: { control: 'text', description: 'Hauptwert' },
    unit:  { control: 'text', description: 'Einheit (optional)' },
    label: { control: 'text', description: 'Label-Zeile' },
  },
  args: { icon: '🔥', value: 12, unit: 'days', label: 'Current Streak' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Streak:  Story = { args: { icon: '🔥', value: 12,   unit: 'days',     label: 'Current Streak' } };
export const Sessions: Story = { args: { icon: '🏋️', value: 48,  unit: 'sessions', label: 'This Month'     } };
export const Volume:  Story = { args: { icon: '⚡', value: '2.4', unit: 't',        label: 'Volume Lifted'  } };

export const AllThree: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, width: 340 }}>
      <StatCard icon="🔥" value={12}    unit="days"     label="Current Streak" />
      <StatCard icon="🏋️" value={48}    unit="sessions" label="This Month"     />
      <StatCard icon="⚡" value="2.4"   unit="t"        label="Volume Lifted"  />
    </View>
  ),
};
