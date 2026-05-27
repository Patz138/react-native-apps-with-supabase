import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';

import { HealthScreen } from '../src/organisms/HealthScreen';

const meta: Meta<typeof HealthScreen> = {
  title: 'Organisms/HealthScreen',
  component: HealthScreen,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'kinetic-dark', values: [{ name: 'kinetic-dark', value: '#141408' }] },
  },
  decorators: [(Story) => (
    <View style={{ backgroundColor: '#141408', width: 390, height: 844 }}>
      <Story />
    </View>
  )],
  argTypes: {
    connectionStatus: { control: 'select', options: ['idle', 'loading', 'healthy', 'unhealthy'] },
    endpoint:         { control: 'text' },
    healthMessage:    { control: 'text' },
    heartRate:        { control: { type: 'number', min: 40, max: 200 } },
    steps:            { control: { type: 'number', min: 0, max: 30000 } },
    sleep:            { control: { type: 'number', min: 0, max: 12, step: 0.5 } },
    calories:         { control: { type: 'number', min: 0, max: 5000 } },
    onRunHealthCheck: { action: 'health-check-run' },
    onTabChange:      { action: 'tab-changed' },
  },
  args: {
    connectionStatus: 'idle',
    healthMessage: 'No health check run yet.',
    activeTab: 'health',
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllHealthy: Story = {
  args: {
    connectionStatus: 'healthy',
    healthMessage: 'Connection to Supabase Edge Function is healthy.',
    endpoint: 'https://xyz.supabase.co/functions/v1/client-connection-check',
    heartRate: 68,
    steps: 9200,
    sleep: 7.5,
    calories: 2100,
  },
};

export const SomePoor: Story = {
  args: {
    connectionStatus: 'healthy',
    heartRate: 72,
    steps: 3100,
    sleep: 5.5,
    calories: 1800,
    healthMessage: 'Connected.',
  },
};

export const Loading: Story = {
  args: {
    connectionStatus: 'loading',
    healthMessage: 'Checking connection…',
  },
};

export const ConnectionError: Story = {
  args: {
    connectionStatus: 'unhealthy',
    healthMessage: 'Could not reach Supabase Edge Function.',
    endpoint: 'https://xyz.supabase.co/functions/v1/client-connection-check',
  },
};
