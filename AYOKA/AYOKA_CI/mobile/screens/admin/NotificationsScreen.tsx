import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { usePartner } from '../../contexts/PartnerContext';
import { Avatar, Badge, EmptyState } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import type { AdminNotification } from '../../types';

const typeVariant: Record<AdminNotification['type'], 'info' | 'warning' | 'success' | 'danger'> = {
  info: 'info', warning: 'warning', success: 'success', alert: 'danger',
};

export default function NotificationsScreen() {
  const { adminNotifications, sendAdminNotification, markAdminNotificationRead, unreadAdminNotifications } = usePartner();
  const [showSend, setShowSend] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info' as AdminNotification['type'], target: 'all' });

  const handleSend = () => {
    if (!form.title || !form.message) return;
    sendAdminNotification(form);
    setForm({ title: '', message: '', type: 'info', target: 'all' });
    setShowSend(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadAdminNotifications > 0 && (
          <Badge label={`${unreadAdminNotifications} non lue${unreadAdminNotifications > 1 ? 's' : ''}`} variant="info" />
        )}
      </View>

      <TouchableOpacity style={styles.sendBtn} onPress={() => setShowSend(true)}>
        <Text style={styles.sendBtnText}>Envoyer une notification</Text>
      </TouchableOpacity>

      {/* Send Modal */}
      <Modal visible={showSend} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle notification</Text>
            <TextInput style={styles.input} placeholder="Titre" placeholderTextColor={colors.gray[400]} value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))} />
            <TextInput style={[styles.input, { height: 80 }]} placeholder="Message" placeholderTextColor={colors.gray[400]} value={form.message} onChangeText={(v) => setForm((f) => ({ ...f, message: v }))} multiline />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowSend(false)}>
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSend} onPress={handleSend}>
                <Text style={styles.modalSendText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {adminNotifications.length === 0 ? (
        <EmptyState title="Aucune notification" description="Les notifications apparaîtront ici" />
      ) : (
        adminNotifications.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[styles.notifCard, !n.read && styles.notifCardUnread]}
            onPress={() => markAdminNotificationRead(n.id)}
          >
            <View style={styles.notifTop}>
              <Text style={styles.notifTitle}>{n.title}</Text>
              <Badge label={n.type} variant={typeVariant[n.type]} />
            </View>
            <Text style={styles.notifMessage}>{n.message}</Text>
            <Text style={styles.notifMeta}>
              {n.target === 'all' ? 'Tous les partenaires' : `Partenaire`} · {n.createdAt}
            </Text>
            {!n.read && <View style={styles.notifDot} />}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.navy[800] },
  sendBtn: { backgroundColor: colors.navy[800], borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center', ...shadows.soft },
  sendBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.xl, gap: spacing.md },
  modalTitle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xl, color: colors.navy[800] },
  input: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, borderWidth: 1, borderColor: colors.gray[200], borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md - 2, color: colors.dark, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: spacing.md },
  modalCancel: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.gray[200], alignItems: 'center' },
  modalCancelText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.gray[600] },
  modalSend: { flex: 1, paddingVertical: spacing.md, borderRadius: borderRadius.md, backgroundColor: colors.ai[400], alignItems: 'center' },
  modalSendText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.white },
  notifCard: { backgroundColor: colors.white, borderRadius: borderRadius.xl, padding: spacing.lg, ...shadows.soft },
  notifCardUnread: { borderLeftWidth: 3, borderLeftColor: colors.ai[400] },
  notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  notifTitle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.md, color: colors.navy[800], flex: 1, marginRight: spacing.sm },
  notifMessage: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.gray[600], marginBottom: spacing.xs },
  notifMeta: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[400] },
  notifDot: { position: 'absolute', top: spacing.lg, right: spacing.lg, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ai[400] },
});
