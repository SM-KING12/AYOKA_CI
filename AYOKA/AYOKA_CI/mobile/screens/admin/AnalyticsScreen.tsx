import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { SectionHeader, Badge } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';

const revenueData = [
  { month: 'Jan', value: 1.2 }, { month: 'Fév', value: 1.8 }, { month: 'Mar', value: 2.4 },
  { month: 'Avr', value: 2.0 }, { month: 'Mai', value: 2.8 }, { month: 'Jun', value: 3.2 },
];

const topServices = [
  { name: 'Dîner Gastronomique', revenue: '6.8M FCFA' },
  { name: 'Suite Lagune Premium', revenue: '7.5M FCFA' },
  { name: 'Transfert Aéroport', revenue: '2.7M FCFA' },
  { name: 'Visite Colonial', revenue: '2.3M FCFA' },
  { name: 'Randonnée Forêt', revenue: '1.6M FCFA' },
];

export default function AnalyticsScreen() {
  const { partnerList } = usePartner();
  const totalRevenue = partnerList.reduce((sum, p) => sum + p.revenue, 0);
  const totalBookings = partnerList.reduce((sum, p) => sum + p.bookings, 0);
  const avgRating = (partnerList.reduce((sum, p) => sum + p.rating, 0) / partnerList.length).toFixed(1);
  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Statistiques</Text>

      {/* Overview */}
      <View style={styles.overviewRow}>
        {[{ label: 'Revenus', value: `${(totalRevenue / 1000000).toFixed(1)}M FCFA` }, { label: 'Réservations', value: totalBookings }, { label: 'Note moy.', value: avgRating }, { label: 'Partenaires', value: partnerList.length }].map((s) => (
          <View key={s.label} style={styles.overviewCard}>
            <Text style={styles.overviewValue}>{s.value}</Text>
            <Text style={styles.overviewLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Revenue Chart (bars) */}
      <View style={styles.chartCard}>
        <SectionHeader title="Revenus mensuels" />
        <View style={styles.chartRow}>
          {revenueData.map((d) => (
            <View key={d.month} style={styles.chartBarWrapper}>
              <Text style={styles.chartBarValue}>{d.value}M</Text>
              <View style={styles.chartBarBg}>
                <View style={[styles.chartBar, { height: `${(d.value / maxRevenue) * 100}%`, backgroundColor: colors.gold[500] }]} />
              </View>
              <Text style={styles.chartBarMonth}>{d.month}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Top Services */}
      <View style={styles.listCard}>
        <SectionHeader title="Services les plus rentables" />
        {topServices.map((s, i) => (
          <View key={s.name} style={styles.listRow}>
            <View style={styles.listRank}><Text style={styles.listRankText}>{i + 1}</Text></View>
            <View style={styles.listInfo}>
              <Text style={styles.listName}>{s.name}</Text>
            </View>
            <Text style={styles.listRevenue}>{s.revenue}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.lg },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  overviewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  overviewCard: { width: '48%', backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md + 4, ...shadows.soft, alignItems: 'center' },
  overviewValue: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xl, color: colors.navy[800] },
  overviewLabel: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500], marginTop: spacing.xs },
  chartCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.card },
  chartRow: { flexDirection: 'row', justifyContent: 'space-around', height: 160, alignItems: 'flex-end' },
  chartBarWrapper: { alignItems: 'center', flex: 1 },
  chartBarValue: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.navy[800], marginBottom: spacing.xs },
  chartBarBg: { width: '70%', height: 100, backgroundColor: colors.gray[100], borderRadius: borderRadius.sm, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBar: { width: '100%', borderRadius: borderRadius.sm },
  chartBarMonth: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400], marginTop: spacing.xs },
  listCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.card },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  listRank: { width: 28, height: 28, borderRadius: borderRadius.sm, backgroundColor: colors.navy[50], alignItems: 'center', justifyContent: 'center' },
  listRankText: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xs, color: colors.navy[800] },
  listInfo: { flex: 1 },
  listName: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.navy[800] },
  listRevenue: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.navy[800] },
});
