import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../theme';

// ── StatCard ──

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export function StatCard({ label, value, change, trend }: StatCardProps) {
  const trendColor = trend === 'up' ? colors.nature[400] : trend === 'down' ? colors.red[500] : colors.gray[400];
  return (
    <View style={styles.card}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {change !== undefined && (
        <Text style={[styles.statChange, { color: trendColor }]}>
          {change > 0 ? '+' : ''}{change}{typeof value === 'number' ? '' : '%'}
        </Text>
      )}
    </View>
  );
}

// ── Badge ──

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const badgeColors = {
  success: { bg: colors.nature[50], text: colors.nature[400] },
  warning: { bg: colors.gold[50], text: colors.gold[500] },
  danger: { bg: '#FEE2E2', text: colors.red[500] },
  info: { bg: colors.ai[50], text: colors.ai[400] },
  neutral: { bg: colors.gray[100], text: colors.gray[600] },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const c = badgeColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{label}</Text>
    </View>
  );
}

// ── Avatar ──

interface AvatarProps {
  initials: string;
  size?: number;
  gradient?: boolean;
}

export function Avatar({ initials, size = 40, gradient = true }: AvatarProps) {
  return (
    <View style={[
      styles.avatar,
      { width: size, height: size, borderRadius: size / 2 },
      gradient ? styles.avatarGradient : styles.avatarPlain,
    ]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

// ── EmptyState ──

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDesc}>{description}</Text>
    </View>
  );
}

// ── Button ──

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ai' | 'outline' | 'danger';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', loading, icon }: ButtonProps) {
  const bgMap = {
    primary: colors.navy[800],
    ai: colors.ai[400],
    outline: colors.transparent,
    danger: colors.red[500],
  };
  const textMap = {
    primary: colors.white,
    ai: colors.white,
    outline: colors.navy[500],
    danger: colors.white,
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[
        styles.button,
        { backgroundColor: bgMap[variant] },
        variant === 'outline' && styles.buttonOutline,
        variant === 'ai' && shadows.aiGlow,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textMap[variant]} />
      ) : (
        <>
          {icon}
          <Text style={[styles.buttonText, { color: textMap[variant] }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// ── SectionHeader ──

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md + 4,
    ...shadows.soft,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    fontFamily: 'Inter_400Regular',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontFamily: 'Poppins_700Bold',
    color: colors.navy[800],
  },
  statChange: {
    fontSize: fontSize.xs,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontFamily: 'Poppins_600SemiBold',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGradient: {
    backgroundColor: colors.ai[400],
  },
  avatarPlain: {
    backgroundColor: colors.gray[200],
  },
  avatarText: {
    color: colors.white,
    fontFamily: 'Poppins_700Bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontFamily: 'Poppins_700Bold',
    color: colors.navy[800],
    marginBottom: spacing.xs,
  },
  emptyDesc: {
    fontSize: fontSize.md,
    fontFamily: 'Inter_400Regular',
    color: colors.gray[400],
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: colors.navy[500],
  },
  buttonText: {
    fontSize: fontSize.md,
    fontFamily: 'Poppins_600SemiBold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontFamily: 'Poppins_700Bold',
    color: colors.navy[800],
  },
  sectionAction: {
    fontSize: fontSize.sm,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.ai[400],
  },
});
