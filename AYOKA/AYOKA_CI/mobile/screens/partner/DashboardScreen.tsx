import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard, Avatar, Badge, SectionHeader } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const bookingStatusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  confirmed: 'success', pending: 'warning', cancelled: 'danger', completed: 'info',
};
const bookingStatusLabel: Record<string, string> = {
  confirmed: 'Confirmée', pending: 'En attente', cancelled: 'Annulée', completed: 'Terminée',
};

export default function DashboardScreen({ navigation }: any) {
  const { stats, bookings, services, profile, reviews } = usePartner();
  const { user, logout } = useAuth();
  const recentBookings = bookings.slice(0, 5);
  const activeServices = services.filter((s) => s.status === 'active').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bienvenue, {user?.firstName || profile.ownerName}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.navy[800]} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((s) => (
          <View key={s.label} style={styles.statWrapper}>
            <StatCard label={s.label} value={s.value} change={s.change} trend={s.trend} />
          </View>
        ))}
      </View>

      {/* Revenue Card */}
      <View style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Revenu total</Text>
        <Text style={styles.revenueValue}>
          {(profile.revenue / 1000000).toFixed(1)}M <Text style={styles.revenueUnit}>FCFA</Text>
        </Text>
        <Text style={styles.revenueSince}>Depuis {profile.joinedAt}</Text>
      </View>

      {/* Overview */}
      <View style={styles.overviewCard}>
        <SectionHeader title="Aperçu" />
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Services actifs</Text>
          <Text style={styles.overviewValue}>{activeServices}/{services.length}</Text>
        </View>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>En attente</Text>
          <Text style={[styles.overviewValue, { color: colors.gold[500] }]}>{pendingBookings}</Text>
        </View>
        <View style={styles.overviewRow}>
          <Text style={styles.overviewLabel}>Note</Text>
          <Text style={styles.overviewValue}>{profile.rating}/5</Text>
        </View>
      </View>

      {/* Recent Bookings */}
      <SectionHeader title="Réservations récentes" action="Voir tout" />
      {recentBookings.map((b) => (
        <View key={b.id} style={styles.bookingRow}>
          <Avatar initials={b.guestAvatar} size={36} />
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingName}>{b.guestName}</Text>
            <Text style={styles.bookingService}>{b.serviceName}</Text>
          </View>
          <View style={styles.bookingRight}>
            <Text style={styles.bookingAmount}>{(b.amount / 1000).toFixed(0)}K FCFA</Text>
            <Badge label={bookingStatusLabel[b.status]} variant={bookingStatusVariant[b.status]} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  greeting: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statWrapper: { width: '48%' },
  revenueCard: { backgroundColor: colors.navy[800], borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.aiGlow },
  revenueLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.white, marginBottom: spacing.xs },
  revenueValue: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxxl, color: colors.white },
  revenueUnit: { fontSize: fontSize.lg, color: 'rgba(255,255,255,0.6)' },
  revenueSince: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: 'rgba(255,255,255,0.5)', marginTop: spacing.xs },
  overviewCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.card },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  overviewLabel: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500] },
  overviewValue: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.sm, color: colors.navy[800] },
  bookingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, ...shadows.soft },
  bookingInfo: { flex: 1 },
  bookingName: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.navy[800] },
  bookingService: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500], marginTop: 2 },
  bookingRight: { alignItems: 'flex-end', gap: spacing.xs },
  bookingAmount: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.sm, color: colors.navy[800] },
});
