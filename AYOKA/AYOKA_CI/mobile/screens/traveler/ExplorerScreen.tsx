import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { useTraveler } from '../../contexts/TravelerContext';
import { Badge, EmptyState, SectionHeader } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import type { PartnerService } from '../../types';

const typeLabels: Record<PartnerService['type'], string> = {
  tour: 'Tour', hotel: 'Hôtel', restaurant: 'Restaurant', transport: 'Transport', activity: 'Activité',
};

export default function ExplorerScreen() {
  const { services } = usePartner();
  const { addFavorite, removeFavorite, favorites } = useTraveler();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                       s.destination.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    return matchSearch && matchType && s.status === 'active';
  });

  const types = ['all', ...new Set(services.map((s) => s.type))];

  const isFavorite = (serviceId: string) => favorites.some((f) => f.id === serviceId);

  const toggleFavorite = (service: PartnerService) => {
    if (isFavorite(service.id)) {
      removeFavorite(service.id);
    } else {
      addFavorite(service);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Explorer</Text>
      <Text style={styles.subtitle}>Découvrez les meilleures expériences en Côte d'Ivoire</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher une destination, un service..."
        placeholderTextColor={colors.gray[400]}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {types.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.filterBtn, typeFilter === t && styles.filterBtnActive]}
            onPress={() => setTypeFilter(t)}
          >
            <Text style={[styles.filterBtnText, typeFilter === t && styles.filterBtnTextActive]}>
              {t === 'all' ? 'Tout' : typeLabels[t as PartnerService['type']] || t}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <EmptyState title="Aucun résultat" description="Essayez d'autres filtres" />
      ) : (
        filtered.map((s) => (
          <TouchableOpacity key={s.id} style={styles.serviceCard}>
            <Image source={{ uri: s.image }} style={styles.serviceImage} />
            <TouchableOpacity
              style={styles.favoriteBtn}
              onPress={() => toggleFavorite(s)}
            >
              <Ionicons
                name={isFavorite(s.id) ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite(s.id) ? colors.red[500] : colors.white}
              />
            </TouchableOpacity>
            <View style={styles.serviceBody}>
              <View style={styles.serviceHeader}>
                <Badge label={typeLabels[s.type]} variant="info" />
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={colors.gold[500]} />
                  <Text style={styles.rating}>{s.rating}</Text>
                </View>
              </View>
              <Text style={styles.serviceName}>{s.name}</Text>
              <Text style={styles.serviceDestination}>{s.destination}</Text>
              <View style={styles.serviceFooter}>
                <Text style={styles.servicePrice}>{s.price.toLocaleString()} {s.priceUnit}</Text>
                <Text style={styles.serviceBookings}>{s.bookings} réservations</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500], marginBottom: spacing.md },
  searchInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    color: colors.dark,
    ...shadows.soft,
  },
  filterRow: { marginBottom: spacing.sm },
  filterBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    ...shadows.soft,
  },
  filterBtnActive: { backgroundColor: colors.navy[800] },
  filterBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.gray[600] },
  filterBtnTextActive: { color: colors.white },
  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  serviceImage: { width: '100%', height: 160, resizeMode: 'cover' },
  favoriteBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBody: { padding: spacing.md },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  rating: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.gold[500] },
  serviceName: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800], marginBottom: spacing.xs },
  serviceDestination: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginBottom: spacing.sm },
  serviceFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  servicePrice: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800] },
  serviceBookings: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
});
