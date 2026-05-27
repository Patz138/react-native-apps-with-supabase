import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { kineticTheme } from '../kineticTheme';
import { Gradient } from '../atoms/Gradient';
import { Avatar } from '../molecules/Avatar';

const { colors, gradients, spacing, radius, shadows } = kineticTheme;

export interface Badge {
  icon: string;
  label: string;
  /** true = freigeschaltet, false = gesperrt/ausgegraut */
  earned?: boolean;
}

export interface SettingsItem {
  key: string;
  icon: string;
  label: string;
}

export interface ProfileScreenProps {
  userName?: string;
  initials?: string;
  /** Level-/Rang-Text, z.B. "Intermediate Athlete" */
  level?: string;
  memberSince?: string;
  streak?: number;
  sessions?: number;
  volumeTons?: number;
  badges?: Badge[];
  settings?: SettingsItem[];
  onSettingPress?: (key: string) => void;
  onLogout?: () => void;
}

const SAMPLE_BADGES: Badge[] = [
  { icon: '🔥', label: '7-Day Streak', earned: true },
  { icon: '💪', label: '50 Sessions',  earned: true },
  { icon: '🏆', label: 'PR Crusher',   earned: true },
  { icon: '🌅', label: 'Early Bird',   earned: false },
  { icon: '⚡', label: '10t Volume',   earned: false },
  { icon: '🎯', label: 'Goal Master',  earned: false },
];

const DEFAULT_SETTINGS: SettingsItem[] = [
  { key: 'account',       icon: '👤', label: 'Account & Profile' },
  { key: 'notifications', icon: '🔔', label: 'Notifications' },
  { key: 'units',         icon: '📐', label: 'Units & Measurements' },
  { key: 'connected',     icon: '🔗', label: 'Connected Apps' },
  { key: 'help',          icon: '❓', label: 'Help & Support' },
];

export function ProfileScreen({
  userName    = 'Max Mustermann',
  initials    = 'MM',
  level       = 'Intermediate Athlete',
  memberSince = 'Member since Jan 2026',
  streak      = 12,
  sessions    = 48,
  volumeTons  = 2.4,
  badges      = SAMPLE_BADGES,
  settings    = DEFAULT_SETTINGS,
  onSettingPress,
  onLogout,
}: ProfileScreenProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ──────────────────────────────────────────── */}
      <Gradient colors={gradients.hero} style={styles.hero}>
        <Avatar initials={initials} size={84} ring />
        <Text style={styles.name}>{userName}</Text>
        <View style={styles.levelPill}>
          <Text style={styles.levelText}>⭐  {level}</Text>
        </View>
        <Text style={styles.memberSince}>{memberSince}</Text>

        <View style={styles.heroStats}>
          <HeroStat value={streak} label="Day Streak" />
          <View style={styles.heroDivider} />
          <HeroStat value={sessions} label="Sessions" />
          <View style={styles.heroDivider} />
          <HeroStat value={`${volumeTons.toFixed(1)}t`} label="Volume" />
        </View>
      </Gradient>

      {/* ── Achievements ──────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badgeGrid}>
          {badges.map((b) => (
            <View
              key={b.label}
              style={[styles.badge, !b.earned && styles.badgeLocked]}
            >
              <Text style={[styles.badgeIcon, !b.earned && styles.badgeIconLocked]}>
                {b.earned ? b.icon : '🔒'}
              </Text>
              <Text style={[styles.badgeLabel, !b.earned && styles.badgeLabelLocked]}>
                {b.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Settings ──────────────────────────────────────── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {settings.map((item, i) => (
            <Pressable
              key={item.key}
              onPress={() => onSettingPress?.(item.key)}
              style={({ pressed }) => [
                styles.settingRow,
                i < settings.length - 1 && styles.settingDivider,
                pressed && styles.settingPressed,
              ]}
            >
              <Text style={styles.settingIcon}>{item.icon}</Text>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.settingChevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Logout ────────────────────────────────────────── */}
      <Pressable
        onPress={onLogout}
        style={({ pressed }) => [styles.logout, pressed && styles.settingPressed]}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

function HeroStat({ value, label }: { value: string | number; label: string }) {
  return (
    <View style={styles.heroStat}>
      <Text style={styles.heroStatValue}>{value}</Text>
      <Text style={styles.heroStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 140,
    gap: spacing.stackGap,
  },
  hero: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.containerMargin,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.primaryGlow,
  },
  name: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.onPrimary,
    letterSpacing: -0.3,
    marginTop: spacing.xs,
  },
  levelPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.onPrimary,
  },
  memberSince: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  heroStatValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.onPrimary,
  },
  heroStatLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.8)',
  },
  heroDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  section: {
    paddingHorizontal: spacing.containerMargin,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.onBackground,
    letterSpacing: -0.2,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    width: '31%',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 6,
    ...shadows.sm,
  },
  badgeLocked: {
    backgroundColor: colors.surfaceVariant,
    shadowOpacity: 0,
    elevation: 0,
  },
  badgeIcon: {
    fontSize: 26,
  },
  badgeIconLocked: {
    opacity: 0.6,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: colors.onBackground,
    textAlign: 'center',
  },
  badgeLabelLocked: {
    color: colors.onSurfaceVariant,
  },
  settingsCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.lg,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  settingPressed: {
    opacity: 0.6,
  },
  settingIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.onBackground,
  },
  settingChevron: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.outlineVariant,
  },
  logout: {
    marginHorizontal: spacing.containerMargin,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.error,
  },
});
