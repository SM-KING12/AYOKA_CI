import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { useTraveler } from '../../contexts/TravelerContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button, SectionHeader } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import type { PartnerService } from '../../types';

interface BookingScreenProps {
  route: { params: { service: PartnerService } };
  navigation: any;
}

export default function BookingScreen({ route, navigation }: BookingScreenProps) {
  const { service } = route.params;
  const { addReservation } = useTraveler();
  const { user } = useAuth();
  const [guests, setGuests] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const total = service.price * guests;

  const handleProceed = () => {
    navigation.navigate('Checkout', {
      service,
      bookingDetails: { guests, startDate, endDate, total },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Réservation</Text>

      <View style={styles.serviceCard}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDestination}>{service.destination}</Text>
        <View style={styles.serviceMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={16} color={colors.gold[500]} />
            <Text style={styles.metaText}>{service.rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people" size={16} color={colors.gray[500]} />
            <Text style={styles.metaText}>{service.capacity} max</Text>
          </View>
        </View>
      </View>

      <SectionHeader title="Détails de la réservation" />
      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de personnes</Text>
          <View style={styles.guestSelector}>
            <TouchableOpacity
              style={styles.guestBtn}
              onPress={() => setGuests(Math.max(1, guests - 1))}
            >
              <Ionicons name="remove" size={20} color={colors.navy[800]} />
            </TouchableOpacity>
            <Text style={styles.guestCount}>{guests}</Text>
            <TouchableOpacity
              style={styles.guestBtn}
              onPress={() => setGuests(Math.min(service.capacity, guests + 1))}
            >
              <Ionicons name="add" size={20} color={colors.navy[800]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date de début</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateText}>{startDate || 'Sélectionner une date'}</Text>
            <Ionicons name="calendar" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date de fin</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateText}>{endDate || 'Sélectionner une date'}</Text>
            <Ionicons name="calendar" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>
      </View>

      <SectionHeader title="Récapitulatif" />
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Prix unitaire</Text>
          <Text style={styles.summaryValue}>{service.price.toLocaleString()} {service.priceUnit}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Nombre de personnes</Text>
          <Text style={styles.summaryValue}>{guests}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotal}>Total</Text>
          <Text style={styles.summaryTotalValue}>{total.toLocaleString()} FCFA</Text>
        </View>
      </View>

      <Button title="Continuer vers le paiement" onPress={handleProceed} variant="ai" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.lg },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  serviceName: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
  serviceDestination: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500], marginTop: spacing.xs },
  serviceMeta: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { fontFamily: 'Inter_500Medium', fontSize: fontSize.sm, color: colors.gray[600] },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  inputGroup: { marginBottom: spacing.md },
  label: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.navy[800], marginBottom: spacing.xs },
  guestSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  guestBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  guestCount: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  dateText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.dark },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500] },
  summaryValue: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  summaryDivider: { height: 1, backgroundColor: colors.gray[200], marginVertical: spacing.sm },
  summaryTotal: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
  summaryTotalValue: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.ai[400] },
});
