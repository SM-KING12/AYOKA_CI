import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import type { UserRole } from '../../types';

export default function RegisterScreen({ navigation }: any) {
  const [role, setRole] = useState<UserRole>('partner');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', businessName: '', category: '',
  });
  const { register, isLoading, error } = useAuth();
  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async () => {
    if (!form.firstName || !form.email || !form.password) return;
    await register({ ...form, role, password: form.password });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>A</Text>
          </View>
          <Text style={styles.logoText}>AYOKA<Text style={styles.logoAccent}>CI</Text></Text>
        </View>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Rejoignez la plateforme</Text>

        {/* Role Selection */}
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'partner' && styles.roleBtnActive]}
            onPress={() => setRole('partner')}
          >
            <Text style={[styles.roleBtnText, role === 'partner' && styles.roleBtnTextActive]}>Partenaire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'admin' && styles.roleBtnAdminActive]}
            onPress={() => setRole('admin')}
          >
            <Text style={[styles.roleBtnText, role === 'admin' && styles.roleBtnAdminTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.nameRow}>
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Prénom" placeholderTextColor={colors.gray[400]} value={form.firstName} onChangeText={(v) => update('firstName', v)} />
          <View style={{ width: spacing.sm }} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Nom" placeholderTextColor={colors.gray[400]} value={form.lastName} onChangeText={(v) => update('lastName', v)} />
        </View>

        {role === 'partner' && (
          <>
            <TextInput style={styles.input} placeholder="Nom de l'entreprise" placeholderTextColor={colors.gray[400]} value={form.businessName} onChangeText={(v) => update('businessName', v)} />
            <TextInput style={styles.input} placeholder="Catégorie (Tour, Hôtel, Restaurant...)" placeholderTextColor={colors.gray[400]} value={form.category} onChangeText={(v) => update('category', v)} />
          </>
        )}

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.gray[400]} value={form.email} onChangeText={(v) => update('email', v)} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Téléphone" placeholderTextColor={colors.gray[400]} value={form.phone} onChangeText={(v) => update('phone', v)} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Mot de passe (6 car. min)" placeholderTextColor={colors.gray[400]} value={form.password} onChangeText={(v) => update('password', v)} secureTextEntry />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryBtnText}>Créer mon compte</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            Déjà un compte ? <Text style={styles.loginLinkAccent}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy[800] },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  logoIcon: { width: 40, height: 40, borderRadius: borderRadius.md, backgroundColor: colors.ai[400], alignItems: 'center', justifyContent: 'center', ...shadows.aiGlow },
  logoIconText: { color: colors.white, fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg },
  logoText: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxl, color: colors.white },
  logoAccent: { color: colors.gold[500] },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxxl, color: colors.white, marginBottom: spacing.xs },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: 'rgba(255,255,255,0.5)', marginBottom: spacing.xl },
  roleRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  roleBtn: { flex: 1, paddingVertical: spacing.md - 2, borderRadius: borderRadius.md, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  roleBtnActive: { backgroundColor: colors.ai[400], borderColor: colors.ai[400], ...shadows.aiGlow },
  roleBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.xs, color: 'rgba(255,255,255,0.6)' },
  roleBtnTextActive: { color: colors.white },
  roleBtnAdminActive: { backgroundColor: colors.gold[500], borderColor: colors.gold[500] },
  roleBtnAdminTextActive: { color: colors.navy[800] },
  error: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: colors.red[400], marginBottom: spacing.md, textAlign: 'center' },
  nameRow: { flexDirection: 'row' },
  input: { flex: undefined, fontFamily: 'Inter_400Regular', fontSize: fontSize.md, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md - 2, color: colors.white, marginBottom: spacing.md },
  primaryBtn: { backgroundColor: colors.ai[400], borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center', ...shadows.aiGlow, marginBottom: spacing.lg },
  primaryBtnText: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.white },
  loginLink: { fontFamily: 'Inter_400Regular', fontSize: fontSize.sm, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },
  loginLinkAccent: { color: colors.ai[400], fontFamily: 'Poppins_600SemiBold' },
});
