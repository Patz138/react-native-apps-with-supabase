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
  primaryBright: '#22c55e',
  primaryContainer: '#dcfce7',
  onPrimary: '#ffffff',
  secondary: '#0ea5e9',
  tertiary: '#0891b2',
  accent: '#84cc16',
  gold: '#f59e0b',
  error: '#dc2626',
  difficulty: {
    beginner:     { bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
    intermediate: { bg: '#fef3c7', text: '#b45309', dot: '#f59e0b' },
    advanced:     { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
  },
} as const;

/**
 * Gradient-Farbstops (jeweils [from, to]) für den dependency-freien
 * Gradient-Atom. Diagonal von oben-links nach unten-rechts gedacht.
 */
export const kineticGradients = {
  primary: ['#22c55e', '#15803d'],
  hero:    ['#16a34a', '#0d9488'],
  banner:  ['#1ec96e', '#0e9f6e'],
  fresh:   ['#84cc16', '#16a34a'],
  ocean:   ['#0ea5e9', '#0891b2'],
  sunset:  ['#f59e0b', '#f97316'],
  surface: ['#ffffff', '#eef6f0'],
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

/**
 * Plattformübergreifende Schatten-Tokens.
 * iOS nutzt shadow*, Android elevation — react-native-web mappt auf box-shadow.
 */
export const kineticShadows = {
  sm: {
    shadowColor: '#0f1f15',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0f1f15',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  lg: {
    shadowColor: '#0f1f15',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
  },
  /** Farbiger Glow für Primary-Flächen (Hero-Karten, CTA-Buttons) */
  primaryGlow: {
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 8,
  },
} as const;

export const kineticTheme = {
  colors: kineticColors,
  gradients: kineticGradients,
  spacing: kineticSpacing,
  radius: kineticRadius,
  typography: kineticTypography,
  shadows: kineticShadows,
} as const;

export type KineticTheme = typeof kineticTheme;