export { colors, spacing, borderRadius, fontSize, fontFamily } from './colors';

import { colors, spacing, borderRadius, fontSize } from './colors';
import { StyleSheet } from 'react-native';

export const shadows = {
  soft: {
    shadowColor: colors.navy[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  card: {
    shadowColor: colors.navy[800],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 5,
  },
  aiGlow: {
    shadowColor: colors.ai[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.soft,
  },
  cardLarge: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.card,
  },
  heading: {
    fontFamily: 'Poppins_700Bold',
    color: colors.navy[800],
  },
  body: {
    fontFamily: 'Inter_400Regular',
    color: colors.gray[700],
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.dark,
  },
  buttonPrimary: {
    backgroundColor: colors.navy[800],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAI: {
    backgroundColor: colors.ai[400],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.aiGlow,
  },
});
