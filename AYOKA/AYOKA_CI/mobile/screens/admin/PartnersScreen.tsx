import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { Avatar, Badge, EmptyState } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';

export default function PartnersScreen() {
  const { partnerList, blockPartner, unblockPartner } = usePartner();
  const [search, setSearch] = useState('');

  const filtered = partnerList.filter((p) =>
    p.businessName.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = (id: string, name: string, block: boolean) => {
    Alert.alert(
      block ? 'Bloquer le partenaire' : 'Débloquer le partenaire',
      block ? `${name} ne pourra plus accéder à la plateforme.` : `${name} pourra à nouveau accéder à la plateforme.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: block ? 'Bloquer' : 'Débloquer', style: block ? 'destructive' : 'default', onPress: () => block ? blockPartner(id) : unblockPartner(id) },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un partenaire..."
        placeholderTextColor={colors.gray[400]}
        value={search}
        onChangeText={setSearch}
      />

      {filtered.length === 0 ? (
        <EmptyState title="Aucun partenaire" description="Ajustez votre recherche" />
      ) : (
        filtered.map((p) => (
          <View key={p.id} style={[styles.partnerCard, p.blocked && styles.partnerBlocked]}>
            <Avatar initials={p.avatar} size={48} />
            <View style={styles.partnerInfo}>
              <View style={styles.partnerTop}>
                <Text style={styles.partnerName}>{p.businessName}</Text>
                {p.verified && <Badge label="Vérifié" variant="info" />}
                {p.blocked && <Badge label="Bloqué" variant="danger" />}
              </View>
              <Text style={styles.partnerOwner}>{p.ownerName} · {p.city}</Text>
              <View style={styles.partnerStats}>
                <View style={styles.partnerStat}>
                  <Text style={styles.partnerStatValue}>{p.services}</Text>
                  <Text style={styles.partnerStatLabel}>Services</Text>
                </View>
                <View style={styles.partnerStat}>
                  <Text style={styles.partnerStatValue}>{p.bookings}</Text>
                  <Text style={styles.partnerStatLabel}>Réserv.</Text>
                </View>
                <View style={styles.partnerStat}>
                  <Text style={styles.partnerStatValue}>{(p.revenue / 1000000).toFixed(1)}M</Text>
                  <Text style={styles.partnerStatLabel}>FCFA</Text>
                </View>
                <View style={styles.partnerStat}>
                  <Text style={styles.partnerStatValue}>★ {p.rating}</Text>
                  <Text style={styles.partnerStatLabel}>Note</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.actionBtn, p.blocked ? styles.unblockBtn : styles.blockBtn]}
                onPress={() => handleBlock(p.id, p.businessName, !p.blocked)}
              >
                <Text style={[styles.actionBtnText, p.blocked ? styles.unblockBtnText : styles.blockBtnText]}>
                  {p.blocked ? 'Débloquer' : 'Bloquer'}
                </Text>
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
  partnerCard: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.card },
  partnerBlocked: { opacity: 0.7, borderLeftWidth: 3, borderLeftColor: colors.red[500] },
  partnerInfo: { flex: 1 },
  partnerTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs, flexWrap: 'wrap' },
  partnerName: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800] },
  partnerOwner: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500], marginBottom: spacing.sm },
  partnerStats: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  partnerStat: { alignItems: 'center' },
  partnerStatValue: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.sm, color: colors.navy[800] },
  partnerStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.gray[400] },
  actionBtn: { alignSelf: 'flex-start', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
  blockBtn: { backgroundColor: '#FEF2F2' },
  unblockBtn: { backgroundColor: colors.nature[50] },
  blockBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.red[500] },
  unblockBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.nature[400] },
});
