import { StyleSheet, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { Gradient } from './Gradient';

const { colors, gradients, radius } = kineticTheme;

export interface ProgressBarProps {
  /** Fortschritt 0…1 (wird geklemmt) */
  progress: number;
  /** Balkenhöhe in px — default 10 */
  height?: number;
  /** Gradient-Farben der Füllung — default primary */
  colors?: readonly string[];
  /** Hintergrund-/Track-Farbe */
  trackColor?: string;
}

export function ProgressBar({
  progress,
  height = 10,
  colors: fillColors = gradients.primary,
  trackColor = colors.surfaceVariant,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <View style={[styles.track, { height, borderRadius: height / 2, backgroundColor: trackColor }]}>
      <Gradient
        colors={fillColors}
        direction="horizontal"
        style={{ width: `${pct}%`, height: '100%', borderRadius: height / 2 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
});
