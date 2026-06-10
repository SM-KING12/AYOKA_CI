import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTraveler } from '../../contexts/TravelerContext';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, Badge, SectionHeader, Button } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function TravelerProfileScreen() {
  const { profile, favorites, tripPlans } = useTraveler();
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar initials={profile.avatar} size={80} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.memberSince}>Membre depuis {profile.createdAt}</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{favorites.length}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{tripPlans.length}</Text>
          <Text style={styles.statLabel}>Itinéraires</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.language}</Text>
          <Text style={styles.statLabel}>Langue</Text>
        </View>
      </View>

      <SectionHeader title="Préférences de voyage" />
      <View style={styles.preferencesCard}>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Budget</Text>
          <Text style={styles.preferenceValue}>{(profile.travelPreferences.budget / 1000).toFixed(0)}K FCFA</Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Style</Text>
          <Text style={styles.preferenceValue}>{profile.travelPreferences.travelStyle}</Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Hébergement</Text>
          <Text style={styles.preferenceValue}>{profile.travelPreferences.accommodationType}</Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Groupe</Text>
          <Text style={styles.preferenceValue}>{profile.travelPreferences.groupSize} pers.</Text>
        </View>
      </View>

      <SectionHeader title="Centres d'intérêt" />
      <View style={styles.interestsContainer}>
        {profile.interests.map((interest) => (
          <View key={interest} style={styles.interestBadge}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>

      <SectionHeader title="Paramètres" />
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="person" size={24} color={colors.navy[800]} />
          <Text style={styles.settingText}>Informations personnelles</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="card" size={24} color={colors.navy[800]} />
          <Text style={styles.settingText}>Moyens de paiement</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications" size={24} color={colors.navy[800]} />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="shield" size={24} color={colors.navy[800]} />
          <Text style={styles.settingText}>Sécurité</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle" size={24} color={colors.navy[800]} />
          <Text style={styles.settingText}>Aide et support</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>

      <Button title="Déconnexion" onPress={logout} variant="danger" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  headerInfo: { flex: 1 },
  name: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  email: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500], marginTop: spacing.xs },
  memberSince: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[400], marginTop: spacing.xs },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500], marginTop: spacing.xs },
  statDivider: { width: 1, backgroundColor: colors.gray[200] },
  preferencesCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  preferenceItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  preferenceLabel: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500] },
  preferenceValue: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  interestsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  interestBadge: {
    backgroundColor: colors.ai[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  interestText: { fontFamily: 'Inter_500Medium', fontSize: fontSize.sm, color: colors.ai[400] },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    ...shadows.card,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: fontSize.md, color: colors.navy[800] },
});
