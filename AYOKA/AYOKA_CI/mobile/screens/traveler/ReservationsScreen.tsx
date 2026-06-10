import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTraveler } from '../../contexts/TravelerContext';
import { Avatar, Badge, SectionHeader, EmptyState } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  confirmed: 'success', pending: 'warning', cancelled: 'danger', completed: 'info',
};
const statusLabel: Record<string, string> = {
  confirmed: 'Confirmée', pending: 'En attente', cancelled: 'Annulée', completed: 'Terminée',
};

export default function TravelerReservationsScreen() {
  const { reservations, cancelReservation } = useTraveler();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const filtered = reservations.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return r.status === 'confirmed' || r.status === 'pending';
    if (filter === 'past') return r.status === 'completed' || r.status === 'cancelled';
    return true;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mes réservations</Text>

      <View style={styles.filterRow}>
        {(['all', 'upcoming', 'past'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
              {f === 'all' ? 'Toutes' : f === 'upcoming' ? 'À venir' : 'Passées'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <EmptyState title="Aucune réservation" description="Commencez par explorer les destinations" />
      ) : (
        filtered.map((r) => (
          <View key={r.id} style={styles.reservationCard}>
            <View style={styles.reservationHeader}>
              <View style={styles.reservationInfo}>
                <Text style={styles.reservationService}>{r.serviceName}</Text>
                <Text style={styles.reservationDestination}>{r.destination}</Text>
              </View>
              <Badge label={statusLabel[r.status]} variant={statusVariant[r.status]} />
            </View>
            <View style={styles.reservationDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={16} color={colors.gray[500]} />
                <Text style={styles.detailText}>{r.startDate} - {r.endDate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people" size={16} color={colors.gray[500]} />
                <Text style={styles.detailText}>{r.guests} pers.</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="cash" size={16} color={colors.gray[500]} />
                <Text style={styles.detailText}>{(r.total / 1000).toFixed(0)}K FCFA</Text>
              </View>
            </View>
            {r.status === 'confirmed' && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => cancelReservation(r.id)}
              >
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
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
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800], marginBottom: spacing.md },
  filterRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  filterBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    ...shadows.soft,
  },
  filterBtnActive: { backgroundColor: colors.navy[800] },
  filterBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.gray[600] },
  filterBtnTextActive: { color: colors.white },
  reservationCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  reservationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  reservationInfo: { flex: 1 },
  reservationService: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  reservationDestination: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginTop: spacing.xs },
  reservationDetails: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  detailText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500] },
  cancelBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: '#FEF2F2',
  },
  cancelBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.red[500] },
});
