import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { Avatar, EmptyState } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';

export default function NotificationsScreen() {
  const { reviews } = usePartner();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Avis et mises à jour</Text>

      {reviews.length === 0 ? (
        <EmptyState title="Aucune notification" description="Vos notifications apparaîtront ici" />
      ) : (
        reviews.map((r) => (
          <View key={r.id} style={styles.notifCard}>
            <Avatar initials={r.avatar} size={36} />
            <View style={styles.notifInfo}>
              <Text style={styles.notifAuthor}>{r.author}</Text>
              <Text style={styles.notifService}>{r.serviceName}</Text>
              <Text style={styles.notifComment}>{r.comment}</Text>
              <View style={styles.notifMeta}>
                <Text style={styles.notifRating}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</Text>
                <Text style={styles.notifDate}>{r.date}</Text>
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
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginBottom: spacing.sm },
  notifCard: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.soft },
  notifInfo: { flex: 1 },
  notifAuthor: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.sm, color: colors.navy[800] },
  notifService: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.ai[400], marginTop: 2 },
  notifComment: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[600], marginTop: spacing.xs },
  notifMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  notifRating: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: colors.gold[500] },
  notifDate: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
});
