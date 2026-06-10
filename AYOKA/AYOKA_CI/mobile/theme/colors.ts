// Design system shared with web version (tailwind.config.js colors)
// React Native uses hex colors directly

export const colors = {
  navy: {
    50: '#E8EDF5',
    100: '#C5D0E6',
    200: '#9BAFD3',
    300: '#718EC0',
    400: '#4D73B1',
    500: '#123A6B',
    600: '#0F3060',
    700: '#0C2754',
    800: '#0A1F44',
    900: '#071633',
    950: '#040D22',
  },
  ai: {
    50: '#EBF3FF',
    100: '#D6E7FF',
    200: '#ADCEFF',
    300: '#85B6FF',
    400: '#4DA3FF',
    500: '#3B82F6',
    600: '#2563EB',
  },
  gold: {
    50: '#FBF6E8',
    300: '#E9D270',
    400: '#E3C548',
    500: '#D4AF37',
    600: '#B8952D',
  },
  nature: {
    50: '#E6F2ED',
    400: '#26925F',
    500: '#0B3D2E',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  red: {
    400: '#F87171',
    500: '#EF4444',
  },
  white: '#FFFFFF',
  black: '#000000',
  dark: '#1E1E1E',
  transparent: 'transparent',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
} as const;

export const fontFamily = {
  heading: 'Poppins_600SemiBold',
  headingBold: 'Poppins_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;
