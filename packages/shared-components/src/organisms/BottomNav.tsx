import { Pressable, StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';

const { colors, spacing, radius, shadows } = kineticTheme;

export interface NavTab {
  key: string;
  label: string;
  /** Emoji-Icon */
  icon: string;
}

export interface BottomNavProps {
  /** Schlüssel des aktiven Tabs */
  activeTab: string;
  onTabChange: (key: string) => void;
  /** Eigene Tab-Liste — default: Workouts · Progress · Health · Profile */
  tabs?: NavTab[];
  /** Schwebend am unteren Rand positionieren — default: true */
  floating?: boolean;
}

export const DEFAULT_TABS: NavTab[] = [
  { key: 'workouts', label: 'Workouts', icon: '🏋️' },
  { key: 'progress', label: 'Progress', icon: '📈' },
  { key: 'health',   label: 'Health',   icon: '💚' },
  { key: 'profile',  label: 'Profile',  icon: '👤' },
];

export function BottomNav({
  activeTab,
  onTabChange,
  tabs = DEFAULT_TABS,
  floating = true,
}: BottomNavProps) {
  return (
    <View style={[styles.bar, floating && styles.floating]}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Text style={styles.icon}>{tab.icon}</Text>
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    ...shadows.lg,
  },
  floating: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.lg,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  iconWrap: {
    width: 44,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.primaryContainer,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.2,
    color: colors.onSurfaceVariant,
  },
  labelActive: {
    color: colors.primaryDim,
  },
});
