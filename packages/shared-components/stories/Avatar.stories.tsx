import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../src/molecules/Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Molecules/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'kinetic-dark', values: [{ name: 'kinetic-dark', value: '#141408' }, { name: 'light', value: '#fff' }] },
  },
  decorators: [(Story) => <View style={{ backgroundColor: '#141408', padding: 24 }}><Story /></View>],
  argTypes: {
    initials: { control: 'text',   description: '1–2 Buchstaben' },
    size:     { control: { type: 'number', min: 24, max: 96, step: 4 }, description: 'Durchmesser px' },
  },
  args: { initials: 'MM', size: 44 },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LargeAvatar: Story = { args: { size: 72 } };
export const SmallAvatar:  Story = { args: { size: 32 } };
export const SingleLetter: Story = { args: { initials: 'P' } };
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Avatar initials="MM" size={28} />
      <Avatar initials="MM" size={44} />
      <Avatar initials="MM" size={64} />
    </View>
  ),
};
