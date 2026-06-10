import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { Avatar, EmptyState } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';

export default function MessagesScreen() {
  const { messages, markMessageRead, unreadMessageCount } = usePartner();

  const conversations = messages.reduce<Record<string, typeof messages>>((acc, msg) => {
    if (!acc[msg.conversationId]) acc[msg.conversationId] = [];
    acc[msg.conversationId].push(msg);
    return acc;
  }, {});

  const convEntries = Object.entries(conversations);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        {unreadMessageCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadMessageCount}</Text>
          </View>
        )}
      </View>

      {convEntries.length === 0 ? (
        <EmptyState title="Aucun message" description="Vos conversations apparaîtront ici" />
      ) : (
        convEntries.map(([convId, msgs]) => {
          const latest = msgs[msgs.length - 1];
          const unread = msgs.filter((m) => !m.read).length;
          return (
            <TouchableOpacity
              key={convId}
              style={[styles.convCard, unread > 0 && styles.convCardUnread]}
              onPress={() => msgs.forEach((m) => !m.read && markMessageRead(m.id))}
            >
              <Avatar initials={latest.senderAvatar} size={44} />
              <View style={styles.convInfo}>
                <View style={styles.convTop}>
                  <Text style={styles.convSender}>{latest.sender}</Text>
                  <Text style={styles.convTime}>{latest.timestamp}</Text>
                </View>
                <Text style={styles.convMessage} numberOfLines={2}>{latest.content}</Text>
              </View>
              {unread > 0 && (
                <View style={styles.convBadge}>
                  <Text style={styles.convBadgeText}>{unread}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  unreadBadge: { backgroundColor: colors.ai[400], borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  unreadBadgeText: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xs, color: colors.white },
  convCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.soft },
  convCardUnread: { borderLeftWidth: 3, borderLeftColor: colors.ai[400] },
  convInfo: { flex: 1 },
  convTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  convSender: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800] },
  convTime: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
  convMessage: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[500] },
  convBadge: { backgroundColor: colors.ai[400], width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  convBadgeText: { fontFamily: 'Poppins_700Bold', fontSize: 10, color: colors.white },
});
