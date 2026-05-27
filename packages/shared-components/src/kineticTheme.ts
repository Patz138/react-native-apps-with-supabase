export const kineticColors = {
  background: '#eef6f0',
  surfaceContainerLow: '#f6faf7',
  surfaceContainer: '#ffffff',
  surfaceContainerHigh: '#ffffff',
  surfaceVariant: '#e2efe7',
  surfaceBright: '#ffffff',
  outline: '#5b6b61',
  outlineVariant: '#d4e2d9',
  onBackground: '#0f1f15',
  onSurface: '#0f1f15',
  onSurfaceVariant: '#4a5a50',
  primary: '#16a34a',
  primaryDim: '#15803d',
  onPrimary: '#ffffff',
  secondary: '#0ea5e9',
  tertiary: '#0891b2',
  error: '#dc2626',
  difficulty: {
    beginner:     { bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
    intermediate: { bg: '#fef3c7', text: '#b45309', dot: '#f59e0b' },
    advanced:     { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
  },
} as const;

export const kineticSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  containerMargin: 24,
  inlineGap: 16,
  stackGap: 24,
  cardPadding: 16
} as const;

export const kineticRadius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999
} as const;

export const kineticTypography = {
  displayXL: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
    letterSpacing: -0.64
  },
  headlineLG: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.24
  },
  titleMD: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700' as const
  },
  bodyBase: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const
  },
  bodySM: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const
  },
  labelCaps: {
    fontSize: 10,
    lineHeight: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const
  }
} as const;

export const kineticTheme = {
  colors: kineticColors,
  spacing: kineticSpacing,
  radius: kineticRadius,
  typography: kineticTypography
} as const;

export type KineticTheme = typeof kineticTheme;