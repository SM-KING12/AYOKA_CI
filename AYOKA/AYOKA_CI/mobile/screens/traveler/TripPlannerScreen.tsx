import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useTraveler } from '../../contexts/TravelerContext';
import { Button, SectionHeader, EmptyState } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function TripPlannerScreen() {
  const { addTripPlan } = useTraveler();
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleCreatePlan = () => {
    if (!destination || !budget || !duration || !startDate) return;

    const newPlan = {
      id: `trip-${Date.now()}`,
      name: `Voyage à ${destination}`,
      destination,
      budget: parseInt(budget) || 0,
      startDate,
      endDate: new Date(new Date(startDate).getTime() + (parseInt(duration) || 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      days: Array.from({ length: parseInt(duration) || 1 }, (_, i) => ({
        day: i + 1,
        date: new Date(new Date(startDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        activities: [],
      })),
      createdAt: new Date().toISOString().split('T')[0],
    };

    addTripPlan(newPlan);
    setDestination('');
    setBudget('');
    setDuration('');
    setStartDate('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Planificateur de voyage</Text>
      <Text style={styles.subtitle}>Créez votre itinéraire personnalisé en Côte d'Ivoire</Text>

      <View style={styles.formCard}>
        <SectionHeader title="Détails du voyage" />
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Assinie, Grand-Bassam..."
            value={destination}
            onChangeText={setDestination}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget (FCFA)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 200000"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Durée (jours)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 3"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date de début</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>

        <Button title="Créer l'itinéraire" onPress={handleCreatePlan} variant="ai" />
      </View>

      <SectionHeader title="Conseils IA" />
      <View style={styles.tipsCard}>
        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={24} color={colors.gold[500]} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Meilleure période</Text>
            <Text style={styles.tipText}>Novembre à mars pour le climat idéal</Text>
          </View>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="wallet" size={24} color={colors.gold[500]} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Budget recommandé</Text>
            <Text style={styles.tipText}>150K-200K FCFA/semaine par personne</Text>
          </View>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="car" size={24} color={colors.gold[500]} />
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Transport</Text>
            <Text style={styles.tipText}>Bus ou train pour les longues distances</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.lg },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500] },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  inputGroup: { marginBottom: spacing.md },
  label: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.navy[800], marginBottom: spacing.xs },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.dark,
  },
  tipsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  tipItem: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  tipContent: { flex: 1 },
  tipTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginTop: spacing.xs },
});
