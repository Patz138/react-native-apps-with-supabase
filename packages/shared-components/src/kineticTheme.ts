// ============================================================
//  KINETIC THEME — dark / electric-lime fitness design system
//  Source of Truth: extrahiert aus docs/ui/prototypes/workout-tracker-annotated
//  (siehe theme.json, generiert vom /discovery Skill)
// ============================================================

export const kineticColors = {
  background: '#0D0D0D',
  surfaceContainerLow: '#141414',
  surfaceContainer: '#1A1A1A',
  surfaceContainerHigh: '#222222',
  surfaceVariant: '#1e1e1e',
  surfaceBright: '#2a2a2a',
  outline: '#3a3a3a',
  outlineVariant: '#2a2a2a',
  onBackground: '#FFFFFF',
  onSurface: '#FFFFFF',
  onSurfaceVariant: '#888888',
  primary: '#E8FF47',
  primaryDim: '#c8df2a',
  primaryContainer: '#1e2500',
  onPrimary: '#000000',
  secondary: '#4FA3FF',
  tertiary: '#4ADE80',
  accent: '#FF8C42',
  error: '#FF5C5C',
  difficulty: {
    beginner:     { bg: '#16280f', text: '#4ade80', dot: '#4ade80' },
    intermediate: { bg: '#2a2400', text: '#facc15', dot: '#facc15' },
    advanced:     { bg: '#2a1212', text: '#ff5c5c', dot: '#ff5c5c' },
  },
} as const;

/**
 * Gradient-Farbstops (jeweils [from, to]) für das dependency-freie
 * Gradient-Atom. Diagonal von oben-links nach unten-rechts gedacht.
 */
export const kineticGradients = {
  primary: ['#E8FF47', '#c8df2a'],
  avatar:  ['#E8FF47', '#c8df2a'],
  banner:  ['#1c2a00', '#2a3d00'],
  hero:    ['#111111', '#1a1a1a', '#262626'],
  fresh:   ['#4ade80', '#16a34a'],
  streak:  ['#1c2a00', '#2a3d00'],
  ocean:   ['#4FA3FF', '#0891b2'],
  sunset:  ['#FF8C42', '#f97316'],
  surface: ['#1A1A1A', '#0D0D0D'],
} as const;

export const kineticSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 48,
  screenPadding: 24,
  containerMargin: 24,
  stackGap: 20,
  cardPadding: 16,
} as const;

export const kineticRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999,
} as const;

export const kineticTypography = {
  displayXL: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900' as const,
    letterSpacing: -1,
  },
  headlineLG: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  titleLG: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  titleMD: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800' as const,
  },
  titleSM: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
  },
  bodyBase: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySM: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
  },
  labelCaps: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  navLabel: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600' as const,
  },
} as const;

/**
 * Plattformübergreifende Schatten-Tokens.
 * iOS nutzt shadow*, Android elevation — react-native-web mappt auf box-shadow.
 */
export const kineticShadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 10,
  },
  /** Elektrischer Lime-Glow für primäre Flächen (FAB, CTA-Buttons) */
  primaryGlow: {
    shadowColor: '#E8FF47',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
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
