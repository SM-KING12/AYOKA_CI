import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { useAuth } from '../../contexts/AuthContext';
import { Badge, EmptyState, SectionHeader } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import type { PartnerService } from '../../types';

const typeLabels: Record<PartnerService['type'], string> = {
  tour: 'Tour', hotel: 'Hôtel', restaurant: 'Restaurant', transport: 'Transport', activity: 'Activité',
};
const statusVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
  active: 'success', draft: 'warning', paused: 'neutral',
};
const statusLabel: Record<string, string> = {
  active: 'Actif', draft: 'En attente', paused: 'En pause',
};

export default function ServicesScreen() {
  const { services, removeService, toggleServiceStatus, validateService } = usePartner();
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    return matchSearch && matchType;
  });

  const types = ['all', ...new Set(services.map((s) => s.type))];

  const handleDelete = (id: string) => {
    Alert.alert('Supprimer', 'Ce service sera définitivement supprimé.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => removeService(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un service..."
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
        <EmptyState title="Aucun service trouvé" description="Ajustez vos filtres" />
      ) : (
        filtered.map((s) => (
          <View key={s.id} style={styles.serviceCard}>
            <Image source={{ uri: s.image }} style={styles.serviceImage} />
            <View style={styles.serviceBody}>
              <View style={styles.serviceHeader}>
                <Badge label={typeLabels[s.type]} variant="info" />
                <Badge label={statusLabel[s.status]} variant={statusVariant[s.status]} />
              </View>
              <Text style={styles.serviceName}>{s.name}</Text>
              <View style={styles.serviceMeta}>
                <Text style={styles.serviceDest}>{s.destination}</Text>
                <Text style={styles.serviceRating}>★ {s.rating}</Text>
              </View>
              <View style={styles.serviceFooter}>
                <Text style={styles.servicePrice}>{s.price.toLocaleString()} {s.priceUnit}</Text>
                <Text style={styles.serviceBookings}>{s.bookings} réserv.</Text>
              </View>
              <View style={styles.serviceActions}>
                {isAdmin && s.status === 'draft' && (
                  <TouchableOpacity style={styles.validateBtn} onPress={() => validateService(s.id)}>
                    <Text style={styles.validateBtnText}>Valider</Text>
                  </TouchableOpacity>
                )}
                {!isAdmin && (
                  <TouchableOpacity style={styles.toggleBtn} onPress={() => toggleServiceStatus(s.id)}>
                    <Text style={styles.toggleBtnText}>{s.status === 'active' ? 'Pause' : 'Activer'}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(s.id)}>
                  <Text style={styles.deleteBtnText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.md },
  searchInput: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[200], borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md - 2, color: colors.dark, ...shadows.soft },
  filterRow: { marginBottom: spacing.sm },
  filterBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.white, marginRight: spacing.sm, ...shadows.soft },
  filterBtnActive: { backgroundColor: colors.navy[800] },
  filterBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.gray[600] },
  filterBtnTextActive: { color: colors.white },
  serviceCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, overflow: 'hidden', ...shadows.card },
  serviceImage: { width: '100%', height: 140, resizeMode: 'cover' },
  serviceBody: { padding: spacing.md },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  serviceName: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800], marginBottom: spacing.xs },
  serviceMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  serviceDest: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500] },
  serviceRating: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.gold[500] },
  serviceFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  servicePrice: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800] },
  serviceBookings: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
  serviceActions: { flexDirection: 'row', gap: spacing.sm },
  validateBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.nature[50], alignItems: 'center' },
  validateBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.nature[400] },
  toggleBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, backgroundColor: colors.gray[100], alignItems: 'center' },
  toggleBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.gray[600] },
  deleteBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, backgroundColor: '#FEF2F2', alignItems: 'center' },
  deleteBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.red[500] },
});
