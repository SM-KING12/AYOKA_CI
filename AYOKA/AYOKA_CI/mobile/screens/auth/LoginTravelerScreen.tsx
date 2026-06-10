import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginTravelerScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenue voyageur</Text>
        <Text style={styles.subtitle}>Connectez-vous pour découvrir la Côte d'Ivoire</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <Button title="Se connecter" onPress={handleLogin} loading={loading} variant="ai" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Pas encore de compte ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterTraveler')}>
          <Text style={styles.footerLink}>S'inscrire</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.navy[800]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  header: { padding: spacing.xl, paddingTop: spacing.xxl * 2 },
  title: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.xxxl, color: colors.navy[800], marginBottom: spacing.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500] },
  form: { padding: spacing.xl },
  inputGroup: { marginBottom: spacing.lg },
  label: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.sm, color: colors.navy[800], marginBottom: spacing.sm },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.dark,
    ...shadows.soft,
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: spacing.xl },
  forgotPasswordText: { fontFamily: 'Inter_500Medium', fontSize: fontSize.sm, color: colors.ai[400] },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: spacing.xl, gap: spacing.xs },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, color: colors.gray[500] },
  footerLink: { fontFamily: 'Poppins_600SemiBold', fontSize: fontSize.md, color: colors.ai[400] },
  backBtn: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
});
