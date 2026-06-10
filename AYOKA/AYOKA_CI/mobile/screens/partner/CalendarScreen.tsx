import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { Badge } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';

const eventTypeColors: Record<string, string> = {
  booking: colors.ai[400], block: colors.gold[500], availability: colors.nature[400],
};
const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  confirmed: 'success', pending: 'warning', cancelled: 'danger', completed: 'neutral',
};
const statusLabel: Record<string, string> = {
  confirmed: 'Confirmé', pending: 'En attente', cancelled: 'Annulé', completed: 'Terminé',
};

export default function CalendarScreen() {
  const { calendarEvents } = usePartner();

  // Group events by date
  const grouped = calendarEvents.reduce<Record<string, typeof calendarEvents>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Calendrier</Text>
      <Text style={styles.subtitle}>{calendarEvents.length} événement{calendarEvents.length !== 1 ? 's' : ''}</Text>

      {sortedDates.map((date) => {
        const events = grouped[date];
        const d = new Date(date + 'T12:00');
        const dayName = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

        return (
          <View key={date} style={styles.dateSection}>
            <Text style={styles.dateLabel}>{dayName}</Text>
            {events.map((e) => (
              <View key={e.id} style={styles.eventCard}>
                <View style={[styles.eventDot, { backgroundColor: eventTypeColors[e.type] }]} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{e.title}</Text>
                  <View style={styles.eventMeta}>
                    <Text style={styles.eventTime}>{e.time}</Text>
                    {e.guests > 0 && <Text style={styles.eventGuests}>{e.guests} pers.</Text>}
                  </View>
                </View>
                <Badge label={statusLabel[e.status]} variant={statusVariant[e.status]} />
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.lg },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500], marginBottom: spacing.sm },
  dateSection: { gap: spacing.sm },
  dateLabel: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800], marginBottom: spacing.xs },
  eventCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, ...shadows.soft },
  eventDot: { width: 10, height: 10, borderRadius: 5 },
  eventInfo: { flex: 1 },
  eventTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.navy[800] },
  eventMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  eventTime: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
  eventGuests: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
});
