import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors } = kineticTheme;

export interface SectionHeaderProps {
  title: string;
  /** rechter Link-Text (z.B. "See all", "View plan") */
  actionLabel?: string;
  onActionPress?: () => void;
  /** beliebiger rechter Slot statt Link (z.B. Chart-Toggle) */
  right?: ReactNode;
}

/**
 * Abschnitts-Kopfzeile mit Titel + optionalem Link/Slot rechts.
 * Quelle: mol-sectionheader-01 (.section-header).
 */
export function SectionHeader({ title, actionLabel, onActionPress, right }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {right ??
        (actionLabel ? (
          <Pressable onPress={onActionPress} hitSlop={8}>
            <Text style={styles.link}>{actionLabel}</Text>
          </Pressable>
        ) : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: '700', color: colors.onBackground },
  link: { fontSize: 13, color: colors.primary },
});
