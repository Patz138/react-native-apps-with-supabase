import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from '../src/atoms/ProgressBar';
import { kineticTheme } from '../src/kineticTheme';

const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  parameters: {
    backgrounds: { default: 'kinetic-light', values: [{ name: 'kinetic-light', value: '#eef6f0' }] },
  },
  decorators: [(Story) => (
    <View style={{ padding: 24, width: 320, backgroundColor: '#eef6f0' }}>
      <Story />
    </View>
  )],
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    height:   { control: { type: 'number', min: 4, max: 24 } },
  },
  args: {
    progress: 0.65,
    height: 10,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Full: Story = { args: { progress: 1, colors: kineticTheme.gradients.fresh } };
export const Low: Story = { args: { progress: 0.2 } };
export const Thick: Story = { args: { progress: 0.8, height: 18 } };
