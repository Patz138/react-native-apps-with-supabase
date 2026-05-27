import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-webpack5';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-mcp'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  features: {
    componentsManifest: true
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => prop.parent?.fileName?.includes('node_modules') === false
    }
  },
  webpackFinal: async (baseConfig) => {
    baseConfig.module ??= { rules: [] };
    baseConfig.module.rules ??= [];
    baseConfig.module.rules.unshift({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('@babel/preset-typescript'),
            [require.resolve('@babel/preset-react'), { runtime: 'automatic' }]
          ]
        }
      }
    });

    baseConfig.resolve ??= {};
    baseConfig.resolve.alias = {
      ...(baseConfig.resolve.alias ?? {}),
      // react-native → react-native-web für Browser-Rendering
      'react-native$': 'react-native-web',
      // @workout/* Monorepo-Packages direkt auf den TS-Source zeigen
      '@workout/shared-utils':  resolve(__dirname, '../../shared-utils/src'),
      '@workout/shared-types':  resolve(__dirname, '../../shared-types/src'),
      '@workout/shared-components': resolve(__dirname, '../src'),
    };
    baseConfig.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.mjs',
      '.js',
      '.jsx',
      '.json'
    ];

    return baseConfig;
  }
};

export default config;
