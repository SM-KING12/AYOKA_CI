import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTraveler } from '../../contexts/TravelerContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button, SectionHeader } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import type { PartnerService } from '../../types';

interface CheckoutScreenProps {
  route: { params: { service: PartnerService; bookingDetails: any } };
  navigation: any;
}

export default function CheckoutScreen({ route, navigation }: CheckoutScreenProps) {
  const { service, bookingDetails } = route.params;
  const { addReservation } = useTraveler();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simuler le traitement du paiement
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newReservation = {
      id: `res-${Date.now()}`,
      travelerId: user?.id || '',
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.type,
      destination: service.destination,
      startDate: bookingDetails.startDate,
      endDate: bookingDetails.endDate,
      guests: bookingDetails.guests,
      total: bookingDetails.total,
      status: 'confirmed' as const,
      paymentStatus: 'paid' as const,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addReservation(newReservation);
    setIsProcessing(false);
    navigation.navigate('BookingSuccess');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Paiement</Text>

      <SectionHeader title="Récapitulatif de la réservation" />
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service</Text>
          <Text style={styles.summaryValue}>{service.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Destination</Text>
          <Text style={styles.summaryValue}>{service.destination}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Dates</Text>
          <Text style={styles.summaryValue}>{bookingDetails.startDate} - {bookingDetails.endDate}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Personnes</Text>
          <Text style={styles.summaryValue}>{bookingDetails.guests}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotal}>Total à payer</Text>
          <Text style={styles.summaryTotalValue}>{bookingDetails.total.toLocaleString()} FCFA</Text>
        </View>
      </View>

      <SectionHeader title="Méthode de paiement" />
      <View style={styles.paymentMethods}>
        <TouchableOpacity
          style={[styles.paymentMethod, paymentMethod === 'mobile_money' && styles.paymentMethodActive]}
          onPress={() => setPaymentMethod('mobile_money')}
        >
          <View style={styles.paymentIcon}>
            <Ionicons name="phone-portrait" size={24} color={paymentMethod === 'mobile_money' ? colors.ai[400] : colors.gray[400]} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Mobile Money</Text>
            <Text style={styles.paymentSubtitle}>Orange Money, MTN Money, Wave</Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'mobile_money' && styles.radioActive]} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentMethod, paymentMethod === 'card' && styles.paymentMethodActive]}
          onPress={() => setPaymentMethod('card')}
        >
          <View style={styles.paymentIcon}>
            <Ionicons name="card" size={24} color={paymentMethod === 'card' ? colors.ai[400] : colors.gray[400]} />
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>Carte bancaire</Text>
            <Text style={styles.paymentSubtitle}>Visa, Mastercard</Text>
          </View>
          <View style={[styles.radio, paymentMethod === 'card' && styles.radioActive]} />
        </TouchableOpacity>
      </View>

      <SectionHeader title="Informations de paiement" />
      <View style={styles.paymentInfoCard}>
        <Text style={styles.infoText}>
          Pour compléter votre réservation, vous serez redirigé vers la passerelle de paiement sécurisée.
        </Text>
        <View style={styles.securityBadges}>
          <View style={styles.securityBadge}>
            <Ionicons name="lock-closed" size={16} color={colors.nature[400]} />
            <Text style={styles.securityText}>Paiement sécurisé</Text>
          </View>
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={16} color={colors.nature[400]} />
            <Text style={styles.securityText}>SSL 256-bit</Text>
          </View>
        </View>
      </View>

      <Button
        title={isProcessing ? 'Traitement en cours...' : `Payer ${bookingDetails.total.toLocaleString()} FCFA`}
        onPress={handlePayment}
        variant="ai"
        loading={isProcessing}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.lg },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
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
  paymentMethods: { gap: spacing.sm },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.soft,
  },
  paymentMethodActive: { borderWidth: 2, borderColor: colors.ai[400] },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: { flex: 1 },
  paymentTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  paymentSubtitle: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500] },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[300],
  },
  radioActive: { backgroundColor: colors.ai[400], borderColor: colors.ai[400] },
  paymentInfoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[600], lineHeight: 22 },
  securityBadges: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  securityBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  securityText: { fontFamily: 'Inter_500Medium', fontSize: fontSize.xs, color: colors.nature[400] },
});
