import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, radius } = kineticTheme;

export interface LogoProps {
  /** 'mark' = nur das Icon-Quadrat · 'full' = Icon + "Kinetic"-Schriftzug */
  variant?: 'mark' | 'full';
  /** Kantenlänge des Icon-Quadrats in px (default 36) */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Kinetic-Logo: limegrünes Quadrat mit Hantel-Glyph, optional + Schriftzug.
 * Quelle: atm-icon-01 / atm-logotext-01 / mol-logoicon-01 (Landing + Login).
 */
export function Logo({ variant = 'full', size = 36, style }: LogoProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={[styles.mark, { width: size, height: size }]}>
        <Dumbbell size={size * 0.55} />
      </View>
      {variant === 'full' && <Text style={styles.text}>Kinetic</Text>}
    </View>
  );
}

/** Hantel-Glyph aus reinen Views — dependency-frei (kein react-native-svg). */
function Dumbbell({ size }: { size: number }) {
  const plate = { width: Math.max(3, size * 0.16), height: size * 0.82, borderRadius: 2 };
  const inner = { width: Math.max(2, size * 0.12), height: size * 0.5, borderRadius: 2 };
  const bar = { width: size * 0.22, height: Math.max(2, size * 0.16) };
  return (
    <View style={styles.dumbbell}>
      <View style={[styles.bone, plate]} />
      <View style={[styles.bone, inner]} />
      <View style={[styles.bone, bar]} />
      <View style={[styles.bone, inner]} />
      <View style={[styles.bone, plate]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dumbbell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
  },
  bone: {
    backgroundColor: colors.onPrimary,
  },
  text: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.onBackground,
  },
});
