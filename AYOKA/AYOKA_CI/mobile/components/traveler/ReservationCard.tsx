import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../index';

interface ReservationCardProps {
  serviceName: string;
  destination: string;
  date: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  onPress: () => void;
  onCancel?: () => void;
}

const statusConfig = {
  confirmed: { label: 'Confirmée', color: colors.nature[400], bg: colors.nature[50] },
  pending: { label: 'En attente', color: colors.gold[500], bg: colors.gold[50] },
  cancelled: { label: 'Annulée', color: colors.red[500], bg: '#FEF2F2' },
  completed: { label: 'Terminée', color: colors.gray[500], bg: colors.gray[100] },
};

export function ReservationCard({
  serviceName,
  destination,
  date,
  guests,
  total,
  status,
  onPress,
  onCancel,
}: ReservationCardProps) {
  const config = statusConfig[status];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{serviceName}</Text>
          <Text style={styles.destination}>{destination}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
          <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color={colors.gray[500]} />
          <Text style={styles.detailText}>{date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people" size={16} color={colors.gray[500]} />
          <Text style={styles.detailText}>{guests} pers.</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash" size={16} color={colors.gray[500]} />
          <Text style={styles.detailText}>{(total / 1000).toFixed(0)}K FCFA</Text>
        </View>
      </View>

      {status === 'confirmed' && onCancel && (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>Annuler</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  serviceInfo: { flex: 1 },
  serviceName: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  destination: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginTop: spacing.xs },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  statusText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs },
  details: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.md },
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
