import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard, Avatar, Badge, SectionHeader } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen({ navigation }: any) {
  const { partnerList, services, bookings, adminNotifications } = usePartner();
  const { logout } = useAuth();
  const activePartners = partnerList.filter((p) => !p.blocked).length;
  const totalRevenue = partnerList.reduce((sum, p) => sum + p.revenue, 0);
  const pendingServices = services.filter((s) => s.status === 'draft').length;
  const unreadNotifs = adminNotifications.filter((n) => !n.read).length;

  const adminStats = [
    { label: 'Partenaires', value: activePartners, change: 2, trend: 'up' as const },
    { label: 'Revenus', value: `${(totalRevenue / 1000000).toFixed(1)}M FCFA`, change: 15, trend: 'up' as const },
    { label: 'Services en attente', value: pendingServices, change: 0, trend: 'stable' as const },
    { label: 'Non lues', value: unreadNotifs, change: 1, trend: 'up' as const },
  ];

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
        <Text style={styles.greeting}>Admin AYOKA CI</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.navy[800]} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {adminStats.map((s) => (
          <View key={s.label} style={styles.statWrapper}>
            <StatCard label={s.label} value={s.value} change={s.change} trend={s.trend} />
          </View>
        ))}
      </View>

      <SectionHeader title="Partenaires récents" action="Voir tout" />
      {partnerList.slice(0, 3).map((p) => (
        <View key={p.id} style={[styles.partnerCard, p.blocked && styles.partnerBlocked]}>
          <Avatar initials={p.avatar} size={44} />
          <View style={styles.partnerInfo}>
            <View style={styles.partnerTop}>
              <Text style={styles.partnerName}>{p.businessName}</Text>
              {p.blocked ? (
                <Badge label="Bloqué" variant="danger" />
              ) : p.verified ? (
                <Badge label="Vérifié" variant="info" />
              ) : null}
            </View>
            <Text style={styles.partnerMeta}>{p.ownerName} · {p.city}</Text>
            <View style={styles.partnerStats}>
              <Text style={styles.partnerStat}>{p.services} services</Text>
              <Text style={styles.partnerStat}>{p.bookings} réserv.</Text>
              <Text style={styles.partnerStat}>{(p.revenue / 1000000).toFixed(1)}M FCFA</Text>
            </View>
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
  partnerCard: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.soft },
  partnerBlocked: { opacity: 0.6, borderLeftWidth: 3, borderLeftColor: colors.red[500] },
  partnerInfo: { flex: 1 },
  partnerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  partnerName: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800] },
  partnerMeta: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500], marginBottom: spacing.xs },
  partnerStats: { flexDirection: 'row', gap: spacing.md },
  partnerStat: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
});
