import React from 'react';
import { Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { Gradient } from '../src/atoms/Gradient';
import { kineticTheme } from '../src/kineticTheme';

const { gradients } = kineticTheme;

const meta: Meta<typeof Gradient> = {
  title: 'Atoms/Gradient',
  component: Gradient,
  parameters: {
    backgrounds: { default: 'kinetic-light', values: [{ name: 'kinetic-light', value: '#eef6f0' }] },
  },
  decorators: [(Story) => (
    <View style={{ padding: 24, backgroundColor: '#eef6f0' }}>
      <Story />
    </View>
  )],
  argTypes: {
    direction: { control: 'select', options: ['vertical', 'horizontal', 'diagonal'] },
    steps:     { control: { type: 'number', min: 4, max: 64 } },
  },
  args: {
    colors: gradients.hero,
    direction: 'diagonal',
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ label }: { label: string }) => (
  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{label}</Text>
);

export const Hero: Story = {
  args: { colors: gradients.hero },
  render: (args) => (
    <Gradient {...args} style={{ height: 140, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Box label="Hero" />
    </Gradient>
  ),
};

export const Fresh: Story = {
  args: { colors: gradients.fresh },
  render: (args) => (
    <Gradient {...args} style={{ height: 140, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Box label="Fresh" />
    </Gradient>
  ),
};

export const Ocean: Story = {
  args: { colors: gradients.ocean, direction: 'horizontal' },
  render: (args) => (
    <Gradient {...args} style={{ height: 140, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Box label="Ocean · horizontal" />
    </Gradient>
  ),
};

export const Sunset: Story = {
  args: { colors: gradients.sunset, direction: 'vertical' },
  render: (args) => (
    <Gradient {...args} style={{ height: 140, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
      <Box label="Sunset · vertical" />
    </Gradient>
  ),
};
