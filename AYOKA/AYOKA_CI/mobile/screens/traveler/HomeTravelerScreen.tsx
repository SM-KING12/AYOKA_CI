import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTraveler } from '../../contexts/TravelerContext';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, Badge, SectionHeader, Button } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeTravelerScreen() {
  const { profile, reservations, favorites, tripPlans, unreadNotificationCount } = useTraveler();
  const { user } = useAuth();
  
  const upcomingReservations = reservations.filter((r) => r.status === 'confirmed').slice(0, 3);
  const nextReservation = upcomingReservations[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.firstName || profile.firstName}</Text>
          <Text style={styles.subtitle}>Prêt pour votre prochaine aventure ?</Text>
        </View>
        <View style={styles.headerRight}>
          <Avatar initials={profile.avatar} size={48} />
          {unreadNotificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadNotificationCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Next Reservation Card */}
      {nextReservation ? (
        <View style={styles.nextReservationCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Prochaine réservation</Text>
            <Badge label="Confirmée" variant="success" />
          </View>
          <View style={styles.reservationContent}>
            <View style={styles.reservationMain}>
              <Text style={styles.reservationService}>{nextReservation.serviceName}</Text>
              <Text style={styles.reservationDestination}>{nextReservation.destination}</Text>
            </View>
            <View style={styles.reservationDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={16} color={colors.gray[500]} />
                <Text style={styles.detailText}>{nextReservation.startDate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people" size={16} color={colors.gray[500]} />
                <Text style={styles.detailText}>{nextReservation.guests} pers.</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.viewDetailsBtn}>
            <Text style={styles.viewDetailsText}>Voir les détails</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.ai[400]} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.noReservationCard}>
          <Ionicons name="airplane" size={48} color={colors.ai[400]} />
          <Text style={styles.noReservationTitle}>Aucune réservation</Text>
          <Text style={styles.noReservationText}>Commencez à explorer les destinations</Text>
          <Button title="Explorer" onPress={() => {}} variant="ai" />
        </View>
      )}

      {/* Quick Actions */}
      <SectionHeader title="Actions rapides" />
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.ai[50] }]}>
            <Ionicons name="search" size={24} color={colors.ai[400]} />
          </View>
          <Text style={styles.quickActionLabel}>Explorer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.nature[50] }]}>
            <Ionicons name="map" size={24} color={colors.nature[400]} />
          </View>
          <Text style={styles.quickActionLabel}>Planifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.gold[50] }]}>
            <Ionicons name="sparkles" size={24} color={colors.gold[500]} />
          </View>
          <Text style={styles.quickActionLabel}>Assistant IA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <View style={[styles.quickActionIcon, { backgroundColor: colors.navy[50] }]}>
            <Ionicons name="heart" size={24} color={colors.navy[500]} />
          </View>
          <Text style={styles.quickActionLabel}>Favoris</Text>
        </TouchableOpacity>
      </View>

      {/* Favorites */}
      {favorites.length > 0 && (
        <>
          <SectionHeader title="Vos favoris" action="Voir tout" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesScroll}>
            {favorites.slice(0, 3).map((service) => (
              <TouchableOpacity key={service.id} style={styles.favoriteCard}>
                <Text style={styles.favoriteName}>{service.name}</Text>
                <Text style={styles.favoriteDestination}>{service.destination}</Text>
                <View style={styles.favoriteFooter}>
                  <Text style={styles.favoritePrice}>{service.price.toLocaleString()} FCFA</Text>
                  <Text style={styles.favoriteRating}>★ {service.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Trip Plans */}
      {tripPlans.length > 0 && (
        <>
          <SectionHeader title="Vos itinéraires" action="Voir tout" />
          {tripPlans.slice(0, 2).map((plan) => (
            <TouchableOpacity key={plan.id} style={styles.tripPlanCard}>
              <View style={styles.tripPlanHeader}>
                <Text style={styles.tripPlanName}>{plan.name}</Text>
                <Badge label={`${plan.days.length} jours`} variant="info" />
              </View>
              <Text style={styles.tripPlanDestination}>{plan.destination}</Text>
              <View style={styles.tripPlanFooter}>
                <Text style={styles.tripPlanBudget}>{(plan.budget / 1000).toFixed(0)}K FCFA</Text>
                <Text style={styles.tripPlanDate}>{plan.startDate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500], marginTop: spacing.xs },
  headerRight: { position: 'relative' },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.red[500],
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xs, color: colors.white },
  nextReservationCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  cardTitle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
  reservationContent: { marginBottom: spacing.md },
  reservationMain: { marginBottom: spacing.sm },
  reservationService: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  reservationDestination: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500] },
  reservationDetails: { flexDirection: 'row', gap: spacing.lg },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  detailText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500] },
  viewDetailsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm },
  viewDetailsText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.ai[400] },
  noReservationCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    ...shadows.card,
  },
  noReservationTitle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800], marginTop: spacing.md },
  noReservationText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500], textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.md },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: spacing.sm },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  quickActionLabel: { fontFamily: 'Inter_500Medium', fontSize: fontSize.xs, color: colors.navy[800] },
  favoritesScroll: { marginBottom: spacing.md },
  favoriteCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    ...shadows.soft,
  },
  favoriteName: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  favoriteDestination: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500], marginTop: spacing.xs },
  favoriteFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  favoritePrice: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.sm, color: colors.navy[800] },
  favoriteRating: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.gold[500] },
  tripPlanCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  tripPlanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  tripPlanName: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  tripPlanDestination: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500] },
  tripPlanFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  tripPlanBudget: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.sm, color: colors.navy[800] },
  tripPlanDate: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500] },
});
