import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { Badge, EmptyState } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import type { PartnerService } from '../../types';

const typeLabels: Record<PartnerService['type'], string> = {
  tour: 'Tour', hotel: 'Hôtel', restaurant: 'Restaurant', transport: 'Transport', activity: 'Activité',
};

export default function ServicesScreen() {
  const { services, removeService, validateService } = usePartner();
  const [search, setSearch] = useState('');

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

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

      {filtered.length === 0 ? (
        <EmptyState title="Aucun service" description="Ajustez votre recherche" />
      ) : (
        filtered.map((s) => (
          <View key={s.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <Badge label={typeLabels[s.type]} variant="info" />
              <Badge
                label={s.status === 'active' ? 'Actif' : s.status === 'draft' ? 'En attente' : 'En pause'}
                variant={s.status === 'active' ? 'success' : s.status === 'draft' ? 'warning' : 'neutral'}
              />
            </View>
            <Text style={styles.serviceName}>{s.name}</Text>
            <Text style={styles.serviceDest}>{s.destination}</Text>
            <View style={styles.serviceRow}>
              <Text style={styles.servicePrice}>{s.price.toLocaleString()} {s.priceUnit}</Text>
              <Text style={styles.serviceBookings}>{s.bookings} réserv.</Text>
            </View>
            <View style={styles.serviceActions}>
              {s.status === 'draft' && (
                <TouchableOpacity style={styles.validateBtn} onPress={() => validateService(s.id)}>
                  <Text style={styles.validateBtnText}>Valider</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(s.id)}>
                <Text style={styles.deleteBtnText}>Supprimer</Text>
              </TouchableOpacity>
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
  searchInput: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[200], borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md - 2, color: colors.dark, ...shadows.soft, marginBottom: spacing.md },
  serviceCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.card },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  serviceName: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800], marginBottom: spacing.xs },
  serviceDest: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginBottom: spacing.sm },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  servicePrice: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800] },
  serviceBookings: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
  serviceActions: { flexDirection: 'row', gap: spacing.sm },
  validateBtn: { flex: 1, paddingVertical: spacing.sm + 2, borderRadius: borderRadius.md, backgroundColor: colors.nature[50], alignItems: 'center' },
  validateBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.nature[400] },
  deleteBtn: { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg, borderRadius: borderRadius.md, backgroundColor: '#FEF2F2', alignItems: 'center' },
  deleteBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.red[500] },
});
