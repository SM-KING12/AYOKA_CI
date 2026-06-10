import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    await login(email, password);
  };

  const quickLogin = async (role: 'admin' | 'partner') => {
    const mockEmail = role === 'admin' ? 'admin@ayoka.ci' : 'partner@ayoka.ci';
    await login(mockEmail, 'demo');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <View style={styles.content}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>A</Text>
          </View>
          <Text style={styles.logoText}>AYOKA<Text style={styles.logoAccent}>CI</Text></Text>
        </View>
        <Text style={styles.title}>Connexion</Text>
        <Text style={styles.subtitle}>Accédez à votre espace</Text>

        {/* Quick Demo */}
        <View style={styles.demoRow}>
          <TouchableOpacity style={styles.demoBtn} onPress={() => quickLogin('partner')}>
            <Text style={styles.demoBtnText}>Demo Partenaire</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.demoBtn, styles.demoBtnAdmin]} onPress={() => quickLogin('admin')}>
            <Text style={styles.demoBtnAdminText}>Demo Admin</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou connectez-vous</Text>
          <View style={styles.dividerLine} />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.gray[400]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={colors.gray[400]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>
            Pas encore de compte ? <Text style={styles.registerLinkAccent}>Créer un compte</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy[800],
  },
  glow1: {
    position: 'absolute',
    top: -80,
    left: 60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.ai[400],
    opacity: 0.15,
  },
  glow2: {
    position: 'absolute',
    bottom: -40,
    right: 40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.gold[500],
    opacity: 0.1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.ai[400],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.aiGlow,
  },
  logoIconText: {
    color: colors.white,
    fontFamily: 'Poppins_700Bold',
    fontSize: fontSize.lg,
  },
  logoText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: fontSize.xxl,
    color: colors.white,
  },
  logoAccent: {
    color: colors.gold[500],
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: fontSize.xxxl,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: spacing.xl,
  },
  demoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(77,163,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(77,163,255,0.2)',
    alignItems: 'center',
  },
  demoBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: fontSize.xs,
    color: colors.ai[400],
  },
  demoBtnAdmin: {
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderColor: 'rgba(212,175,55,0.2)',
  },
  demoBtnAdminText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: fontSize.xs,
    color: colors.gold[500],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.xs,
    color: 'rgba(255,255,255,0.3)',
  },
  error: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.sm,
    color: colors.red[400],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    color: colors.white,
    marginBottom: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.ai[400],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.aiGlow,
    marginBottom: spacing.lg,
  },
  primaryBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: fontSize.md,
    color: colors.white,
  },
  registerLink: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  registerLinkAccent: {
    color: colors.ai[400],
    fontFamily: 'Poppins_600SemiBold',
  },
});
