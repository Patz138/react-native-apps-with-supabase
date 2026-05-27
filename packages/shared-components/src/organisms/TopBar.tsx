import { Pressable, StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { Avatar } from '../molecules/Avatar';

const { colors, spacing, radius } = kineticTheme;

export interface TopBarProps {
  /** Begrüßungstext — z.B. "Good morning," */
  greeting?: string;
  /** Vollständiger Benutzername */
  userName: string;
  /** 1–2 Initialen für den Avatar */
  initials: string;
  onNotifications?: () => void;
  onSettings?: () => void;
}

export function TopBar({
  greeting = 'Good morning,',
  userName,
  initials,
  onNotifications,
  onSettings,
}: TopBarProps) {
  return (
    <View style={styles.bar}>
      {/* ── Left: Avatar + Greeting ─────────────────────── */}
      <View style={styles.userRow}>
        <Avatar initials={initials} size={44} />
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingText}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      {/* ── Right: Action Buttons ───────────────────────── */}
      <View style={styles.actions}>
        <Pressable
          onPress={onNotifications}
          style={styles.iconBtn}
          accessibilityLabel="Notifications"
        >
          <Text style={styles.iconBtnText}>🔔</Text>
        </Pressable>
        <Pressable
          onPress={onSettings}
          style={styles.iconBtn}
          accessibilityLabel="Settings"
        >
          <Text style={styles.iconBtnText}>⚙️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greetingBlock: {
    gap: 2,
  },
  greetingText: {
    fontSize: 13,
    color: colors.onSurfaceVariant,
    fontWeight: '400' as const,
  },
  userName: {
    fontSize: 18,
    color: colors.onBackground,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontSize: 18,
  },
});
