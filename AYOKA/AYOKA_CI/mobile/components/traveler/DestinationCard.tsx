import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface DestinationCardProps {
  name: string;
  image: string;
  rating: number;
  description: string;
  price: number;
  onPress: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export function DestinationCard({
  name,
  image,
  rating,
  description,
  price,
  onPress,
  isFavorite = false,
  onFavoriteToggle,
}: DestinationCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />
      {onFavoriteToggle && (
        <TouchableOpacity style={styles.favoriteBtn} onPress={onFavoriteToggle}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? colors.red[500] : colors.white}
          />
        </TouchableOpacity>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.gold[500]} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{price.toLocaleString()} FCFA</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.ai[400]} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  image: { width: '100%', height: 160, resizeMode: 'cover' },
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
  content: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  name: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ratingText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.gold[500] },
  description: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginBottom: spacing.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800] },
});
