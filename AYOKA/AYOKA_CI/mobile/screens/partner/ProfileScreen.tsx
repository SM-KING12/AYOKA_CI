import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { Avatar, Badge } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';

export default function ProfileScreen() {
  const { profile, updateProfile } = usePartner();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Avatar initials={profile.avatar} size={72} />
        <Text style={styles.businessName}>{profile.businessName}</Text>
        <Text style={styles.category}>{profile.category}</Text>
        {profile.verified && <Badge label="Vérifié" variant="info" />}
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>★ {profile.rating}</Text>
          <Text style={styles.statLabel}>Note</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.completedBookings}</Text>
          <Text style={styles.statLabel}>Réservations</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(profile.revenue / 1000000).toFixed(1)}M</Text>
          <Text style={styles.statLabel}>FCFA</Text>
        </View>
      </View>

      {/* Edit Form */}
      <View style={styles.formCard}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>Informations</Text>
          <TouchableOpacity onPress={editing ? handleSave : () => setEditing(true)}>
            <Text style={styles.formAction}>{editing ? 'Sauvegarder' : 'Modifier'}</Text>
          </TouchableOpacity>
        </View>
        {[
          { label: 'Entreprise', field: 'businessName' },
          { label: 'Propriétaire', field: 'ownerName' },
          { label: 'Email', field: 'email' },
          { label: 'Téléphone', field: 'phone' },
          { label: 'Ville', field: 'city' },
        ].map(({ label, field }) => (
          <View key={field} style={styles.formRow}>
            <Text style={styles.formLabel}>{label}</Text>
            <TextInput
              style={[styles.formInput, !editing && styles.formInputDisabled]}
              value={editing ? (form as any)[field] : (profile as any)[field]}
              onChangeText={(v) => editing && update(field, v)}
              editable={editing}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.lg },
  profileHeader: { alignItems: 'center', gap: spacing.sm, backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.xl, ...shadows.card },
  businessName: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xl, color: colors.navy[800] },
  category: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500] },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.card },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400], marginTop: spacing.xs },
  formCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.card },
  formHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  formTitle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
  formAction: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.ai[400] },
  formRow: { marginBottom: spacing.md },
  formLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.navy[800], marginBottom: spacing.xs },
  formInput: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, backgroundColor: colors.gray[50], borderWidth: 1, borderColor: colors.gray[200], borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, color: colors.dark },
  formInputDisabled: { backgroundColor: colors.gray[50], color: colors.gray[500] },
});
