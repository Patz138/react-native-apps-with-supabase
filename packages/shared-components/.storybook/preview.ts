import { createElement } from 'react';
import { View } from 'react-native';

const preview = {
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'kinetic-dark',
      values: [
        { name: 'kinetic-dark', value: '#0D0D0D' },
        { name: 'kinetic-surface', value: '#1A1A1A' },
      ]
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story: any) => createElement(
      View,
      { style: { flex: 1, backgroundColor: '#0D0D0D', padding: 24 } },
      createElement(Story),
    )
  ]
};

export default preview;