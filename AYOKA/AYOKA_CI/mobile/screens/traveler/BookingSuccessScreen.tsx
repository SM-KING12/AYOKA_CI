import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function BookingSuccessScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={80} color={colors.nature[400]} />
        </View>
        <Text style={styles.title}>Réservation confirmée !</Text>
        <Text style={styles.subtitle}>
          Votre réservation a été effectuée avec succès. Vous recevrez une confirmation par email.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color={colors.ai[400]} />
            <Text style={styles.infoText}>Email de confirmation envoyé</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="qr-code" size={20} color={colors.ai[400]} />
            <Text style={styles.infoText}>QR code disponible dans Mes réservations</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color={colors.ai[400]} />
            <Text style={styles.infoText}>Rappel envoyé 24h avant</Text>
          </View>
        </View>

        <Button title="Voir mes réservations" onPress={() => navigation.navigate('Reservations')} variant="ai" />
        <Button
          title="Retour à l'accueil"
          onPress={() => navigation.navigate('HomeTraveler')}
          variant="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: { marginBottom: spacing.xl },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: fontSize.xxl,
    color: colors.navy[800],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  infoText: { fontFamily: 'Inter_500Medium', fontSize: fontSize.md, color: colors.navy[800] },
});
