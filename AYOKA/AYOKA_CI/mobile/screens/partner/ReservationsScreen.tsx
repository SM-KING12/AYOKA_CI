import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { Avatar, Badge, EmptyState } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  confirmed: 'success', pending: 'warning', cancelled: 'danger', completed: 'info',
};
const statusLabel: Record<string, string> = {
  confirmed: 'Confirmée', pending: 'En attente', cancelled: 'Annulée', completed: 'Terminée',
};

export default function ReservationsScreen() {
  const { bookings, updateBookingStatus } = usePartner();
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  const tabs = [
    { key: 'all', label: 'Tout', count: bookings.length },
    { key: 'pending', label: 'En attente', count: bookings.filter((b) => b.status === 'pending').length },
    { key: 'confirmed', label: 'Confirmées', count: bookings.filter((b) => b.status === 'confirmed').length },
    { key: 'completed', label: 'Terminées', count: bookings.filter((b) => b.status === 'completed').length },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, filter === t.key && styles.tabActive]}
            onPress={() => setFilter(t.key)}
          >
            <Text style={[styles.tabText, filter === t.key && styles.tabTextActive]}>{t.label}</Text>
            <View style={[styles.tabBadge, filter === t.key && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, filter === t.key && styles.tabBadgeTextActive]}>{t.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <EmptyState title="Aucune réservation" description="Les réservations apparaîtront ici" />
      ) : (
        filtered.map((b) => (
          <View key={b.id} style={styles.bookingCard}>
            <View style={styles.bookingRow}>
              <Avatar initials={b.guestAvatar} size={44} />
              <View style={styles.bookingInfo}>
                <View style={styles.bookingTop}>
                  <Text style={styles.bookingName}>{b.guestName}</Text>
                  <Badge label={statusLabel[b.status]} variant={statusVariant[b.status]} />
                </View>
                <Text style={styles.bookingService}>{b.serviceName}</Text>
                <View style={styles.bookingMeta}>
                  <Text style={styles.bookingMetaText}>{b.date}</Text>
                  <Text style={styles.bookingMetaText}>{b.guests} pers.</Text>
                </View>
                {b.notes && <Text style={styles.bookingNotes}>"{b.notes}"</Text>}
              </View>
              <Text style={styles.bookingAmount}>{(b.amount / 1000).toFixed(0)}K{'\n'}FCFA</Text>
            </View>
            {b.status === 'pending' && (
              <View style={styles.bookingActions}>
                <TouchableOpacity style={styles.confirmBtn} onPress={() => updateBookingStatus(b.id, 'confirmed')}>
                  <Text style={styles.confirmBtnText}>Confirmer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => updateBookingStatus(b.id, 'cancelled')}>
                  <Text style={styles.cancelBtnText}>Refuser</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.md },
  tabsRow: { marginBottom: spacing.sm },
  tab: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, borderRadius: borderRadius.md, backgroundColor: colors.white, marginRight: spacing.sm, ...shadows.soft },
  tabActive: { backgroundColor: colors.navy[800] },
  tabText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.gray[600] },
  tabTextActive: { color: colors.white },
  tabBadge: { backgroundColor: colors.gray[100], borderRadius: borderRadius.sm, paddingHorizontal: spacing.xs, paddingVertical: 2 },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabBadgeText: { fontFamily: 'Poppins_700Bold', fontSize: 10, color: colors.gray[500] },
  tabBadgeTextActive: { color: colors.white },
  bookingCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.card, gap: spacing.md },
  bookingRow: { flexDirection: 'row', gap: spacing.md },
  bookingInfo: { flex: 1 },
  bookingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  bookingName: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800] },
  bookingService: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginBottom: spacing.xs },
  bookingMeta: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xs },
  bookingMetaText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
  bookingNotes: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400], fontStyle: 'italic' },
  bookingAmount: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800], textAlign: 'right' },
  bookingActions: { flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray[100] },
  confirmBtn: { flex: 1, paddingVertical: spacing.sm + 2, borderRadius: borderRadius.md, backgroundColor: colors.nature[50], alignItems: 'center' },
  confirmBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.nature[400] },
  cancelBtn: { flex: 1, paddingVertical: spacing.sm + 2, borderRadius: borderRadius.md, backgroundColor: '#FEF2F2', alignItems: 'center' },
  cancelBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.red[500] },
});
