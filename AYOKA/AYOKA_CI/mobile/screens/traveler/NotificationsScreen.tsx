import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useTraveler } from '../../contexts/TravelerContext';
import { Badge, EmptyState, SectionHeader } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const notificationTypeIcon: Record<string, string> = {
  reservation: 'calendar',
  reminder: 'time',
  ai: 'sparkles',
  promotion: 'pricetag',
};

const notificationTypeColor: Record<string, any> = {
  reservation: colors.ai[400],
  reminder: colors.gold[500],
  ai: colors.nature[400],
  promotion: colors.red[500],
};

export default function TravelerNotificationsScreen() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useTraveler();

  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState title="Aucune notification" description="Vous serez notifié des mises à jour importantes" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={markAllNotificationsRead}>
          <Text style={styles.markAllRead}>Tout marquer comme lu</Text>
        </TouchableOpacity>
      </View>

      {notifications.map((notif) => (
        <TouchableOpacity
          key={notif.id}
          style={[styles.notificationCard, !notif.read && styles.notificationUnread]}
          onPress={() => markNotificationRead(notif.id)}
        >
          <View style={[styles.notificationIcon, { backgroundColor: `${notificationTypeColor[notif.type]}20` }]}>
            <Ionicons name={notificationTypeIcon[notif.type] as any} size={24} color={notificationTypeColor[notif.type]} />
          </View>
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notif.title}</Text>
              {!notif.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage}>{notif.message}</Text>
            <Text style={styles.notificationTime}>{notif.createdAt}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  markAllRead: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.ai[400] },
  notificationCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  notificationUnread: { borderLeftWidth: 3, borderLeftColor: colors.ai[400] },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: { flex: 1 },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notificationTitle: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.navy[800] },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ai[400] },
  notificationMessage: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[600], marginBottom: spacing.xs },
  notificationTime: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
});
