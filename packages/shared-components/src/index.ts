// ── Theme ──────────────────────────────────────────────────────────
export { kineticTheme } from './kineticTheme';

// ── Atoms ──────────────────────────────────────────────────────────
export { Gradient, interpolate } from './atoms/Gradient';
export type { GradientProps, GradientDirection } from './atoms/Gradient';

export { ProgressBar } from './atoms/ProgressBar';
export type { ProgressBarProps } from './atoms/ProgressBar';

export { DifficultyBadge } from './atoms/DifficultyBadge';
export type { DifficultyBadgeProps } from './atoms/DifficultyBadge';

export { DurationLabel } from './atoms/DurationLabel';
export type { DurationLabelProps } from './atoms/DurationLabel';

export { NavButton } from './atoms/NavButton';
export type { NavButtonProps } from './atoms/NavButton';

export { StatusPill } from './atoms/StatusPill';
export type { StatusPillProps, StatusPillStatus } from './atoms/StatusPill';

// ── Molecules ──────────────────────────────────────────────────────
export { WorkoutCard } from './WorkoutCard';
export type { WorkoutCardProps } from './WorkoutCard';

export { HealthCard } from './molecules/HealthCard';
export type { HealthCardProps } from './molecules/HealthCard';

export { Avatar } from './molecules/Avatar';
export type { AvatarProps } from './molecules/Avatar';

export { StatCard } from './molecules/StatCard';
export type { StatCardProps } from './molecules/StatCard';

// ── Organisms ──────────────────────────────────────────────────────
export { BottomNav, DEFAULT_TABS } from './organisms/BottomNav';
export type { BottomNavProps, NavTab } from './organisms/BottomNav';

export { TopBar } from './organisms/TopBar';
export type { TopBarProps } from './organisms/TopBar';

export { StatsRow } from './organisms/StatsRow';
export type { StatsRowProps } from './organisms/StatsRow';

export { StreakBanner } from './organisms/StreakBanner';
export type { StreakBannerProps } from './organisms/StreakBanner';

export { WorkoutDashboard } from './organisms/WorkoutDashboard';
export type { WorkoutDashboardProps, WorkoutItem } from './organisms/WorkoutDashboard';

export { HealthScreen } from './organisms/HealthScreen';
export type { HealthScreenProps } from './organisms/HealthScreen';

export { WorkoutDetailScreen } from './organisms/WorkoutDetailScreen';
export type { WorkoutDetailScreenProps, Exercise } from './organisms/WorkoutDetailScreen';

export { ProgressScreen } from './organisms/ProgressScreen';
export type { ProgressScreenProps, Goal } from './organisms/ProgressScreen';

export { ProfileScreen } from './organisms/ProfileScreen';
export type { ProfileScreenProps, Badge, SettingsItem } from './organisms/ProfileScreen';
