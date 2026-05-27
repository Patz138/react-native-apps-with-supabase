import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

export type GradientDirection = 'vertical' | 'horizontal' | 'diagonal';

export interface GradientProps {
  /** 2+ Hex-Farben — z.B. kineticTheme.gradients.hero */
  colors: readonly string[];
  /** Verlaufsrichtung — default: 'diagonal' */
  direction?: GradientDirection;
  /** Anzahl Farbbänder — höher = glatter (default 32) */
  steps?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * Dependency-freier Linear-Gradient für React Native + react-native-web.
 * Stapelt `steps` interpolierte Farbbänder; bei 'diagonal' wird die
 * Band-Ebene rotiert und überdimensioniert, damit die Ecken voll decken.
 */
export function Gradient({
  colors,
  direction = 'diagonal',
  steps = 32,
  style,
  children,
}: GradientProps) {
  const stops = colors.length >= 2 ? colors : [colors[0] ?? '#000', colors[0] ?? '#000'];
  const bandColors = Array.from({ length: steps }, (_, i) =>
    interpolate(stops, steps === 1 ? 0 : i / (steps - 1)),
  );

  const isRow = direction === 'horizontal';
  const bands = (
    <View style={[styles.bandLayer, { flexDirection: isRow ? 'row' : 'column' }]}>
      {bandColors.map((color, i) => (
        <View key={i} style={[styles.band, { backgroundColor: color }]} />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {direction === 'diagonal' ? (
        <View style={styles.diagonalClip}>
          <View style={styles.diagonalLayer}>{bands}</View>
        </View>
      ) : (
        bands
      )}
      {children != null && <View style={styles.content}>{children}</View>}
    </View>
  );
}

// ── Farb-Interpolation ────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

/** Mischt eine Farbskala an Position t ∈ [0,1] und liefert einen rgb()-String. */
export function interpolate(colors: readonly string[], t: number): string {
  if (colors.length === 1) return colors[0];
  const scaled = t * (colors.length - 1);
  const i = Math.min(Math.floor(scaled), colors.length - 2);
  const localT = scaled - i;
  const [r1, g1, b1] = hexToRgb(colors[i]);
  const [r2, g2, b2] = hexToRgb(colors[i + 1]);
  return `rgb(${lerp(r1, r2, localT)}, ${lerp(g1, g2, localT)}, ${lerp(b1, b2, localT)})`;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  bandLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  band: {
    flex: 1,
  },
  diagonalClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  // Überdimensionierte, rotierte Ebene: macht den vertikalen Verlauf diagonal
  // und deckt nach 45°-Rotation weiterhin alle Ecken ab.
  diagonalLayer: {
    position: 'absolute',
    top: '-75%',
    left: '-75%',
    right: '-75%',
    bottom: '-75%',
    transform: [{ rotate: '45deg' }],
  },
  content: {
    flex: 1,
  },
});
