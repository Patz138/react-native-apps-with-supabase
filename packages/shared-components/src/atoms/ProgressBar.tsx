import { StyleSheet, View } from 'react-native';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { Gradient } from './Gradient';

const { colors, radius } = kineticTheme;

export interface ProgressBarProps {
  /** Fortschritt 0..1 (wird geklemmt) */
  progress: number;
  /** Balkenhöhe in px — default 4 (Prototyp) */
  height?: number;
  /** Track-Hintergrundfarbe (default surface) */
  trackColor?: string;
  /** Füllfarbe (default Lime) */
  fillColor?: string;
  /** Optionaler Verlauf für den Füllbalken */
  colors?: readonly string[];
  style?: StyleProp<ViewStyle>;
}

/**
 * Schlanke Fortschrittsleiste (Track + flacher Lime-Fill).
 * Quelle: mol-progressbar-01 / mol-progressfill-01 (Registration).
 */
export function ProgressBar({
  progress,
  height = 4,
  trackColor = colors.surfaceContainer,
  fillColor = colors.primary,
  colors: gradientColors,
  style,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress));
  const width = `${pct * 100}%` as DimensionValue;
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      {gradientColors && gradientColors.length >= 2 ? (
        <Gradient colors={gradientColors} direction="horizontal" style={[styles.fill, { width }]} />
      ) : (
        <View style={[styles.fill, { width, backgroundColor: fillColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
