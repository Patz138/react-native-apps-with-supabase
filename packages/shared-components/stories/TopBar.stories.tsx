import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { TopBar } from '../src/organisms/TopBar';

const meta: Meta<typeof TopBar> = {
  title: 'Organisms/TopBar',
  component: TopBar,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'kinetic-dark', values: [{ name: 'kinetic-dark', value: '#141408' }] },
  },
  decorators: [(Story) => <View style={{ backgroundColor: '#141408', padding: 24, width: 360 }}><Story /></View>],
  argTypes: {
    greeting:  { control: 'text', description: 'Begrüßungszeile' },
    userName:  { control: 'text', description: 'Vollständiger Name' },
    initials:  { control: 'text', description: '1–2 Initialen' },
    onNotifications: { action: 'notifications-pressed' },
    onSettings:      { action: 'settings-pressed' },
  },
  args: { greeting: 'Good morning,', userName: 'Max Mustermann', initials: 'MM' },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const MorningGreeting:  Story = { args: { greeting: 'Good morning,' } };
export const EveningGreeting:  Story = { args: { greeting: 'Good evening,' } };
export const ShortName:        Story = { args: { userName: 'Pat', initials: 'P' } };
