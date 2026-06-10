import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Ionicons name="map" size={80} color={colors.gray[300]} />
        <Text style={styles.title}>Carte interactive</Text>
        <Text style={styles.subtitle}>Cette fonctionnalité nécessite react-native-maps</Text>
        <Text style={styles.note}>
          À implémenter avec:
          {'\n'}- react-native-maps
          {'\n'}- expo-location
          {'\n'}- Géolocalisation
          {'\n'}- Points d'intérêt
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: fontSize.xxl,
    color: colors.navy[800],
    marginTop: spacing.lg,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    color: colors.gray[500],
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  note: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.sm,
    color: colors.gray[400],
    marginTop: spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
});
