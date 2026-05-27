import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { StatsRow } from '../src/organisms/StatsRow';

const meta: Meta<typeof StatsRow> = {
  title: 'Organisms/StatsRow',
  component: StatsRow,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'kinetic-dark', values: [{ name: 'kinetic-dark', value: '#141408' }] },
  },
  decorators: [(Story) => <View style={{ backgroundColor: '#141408', padding: 24, width: 360 }}><Story /></View>],
  argTypes: {
    streak:     { control: { type: 'number', min: 0, max: 365 }, description: 'Streak-Tage' },
    sessions:   { control: { type: 'number', min: 0, max: 200 }, description: 'Sessions diesen Monat' },
    volumeTons: { control: { type: 'number', min: 0, max: 20, step: 0.1 }, description: 'Volumen in Tonnen' },
  },
  args: { streak: 12, sessions: 48, volumeTons: 2.4 },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const HighNumbers: Story = { args: { streak: 42, sessions: 128, volumeTons: 15.8 } };
export const Zeros:       Story = { args: { streak: 0,  sessions: 0,   volumeTons: 0     } };
