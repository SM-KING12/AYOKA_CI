import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadState<T>(key: string): Promise<T | null> {
  try {
    const stored = await AsyncStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export async function saveState<T>(key: string, state: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Silent fail for storage errors
  }
}

export async function removeState(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // Silent fail
  }
}

export const STORAGE_KEYS = {
  AUTH: 'ayoka_auth',
  PARTNER: 'ayoka_partner_state',
  TRAVELER: 'ayoka_traveler_state',
} as const;
