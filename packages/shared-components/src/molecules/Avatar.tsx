import { StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { Gradient } from '../atoms/Gradient';

const { colors, gradients, shadows } = kineticTheme;

export interface AvatarProps {
  /** 1–2 Buchstaben, die im Kreis angezeigt werden */
  initials: string;
  /** Durchmesser in Pixel — default: 44 */
  size?: number;
  /** Heller Ring um den Avatar — default: false */
  ring?: boolean;
}

export function Avatar({ initials, size = 44, ring = false }: AvatarProps) {
  const dimension = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View
      style={[
        styles.wrapper,
        dimension,
        shadows.sm,
        ring && {
          borderWidth: 3,
          borderColor: colors.surfaceContainer,
          padding: 2,
        },
      ]}
    >
      <Gradient
        colors={gradients.primary}
        style={[styles.circle, { borderRadius: size / 2 }]}
      >
        <Text style={[styles.text, { fontSize: Math.round(size * 0.38) }]}>
          {initials.slice(0, 2).toUpperCase()}
        </Text>
      </Gradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primary,
  },
  circle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.onPrimary,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
});
