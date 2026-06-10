import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthUser, AuthState, UserRole } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<AuthUser> & { password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'ayoka_auth';

function loadAuth(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function saveAuth(user: AuthUser | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

// ── Mock users for demo ──

const mockAdmin: AuthUser = {
  id: 'admin-1',
  firstName: 'Admin',
  lastName: 'AYOKA',
  email: 'admin@ayoka.ci',
  phone: '+225 01 00 00 00',
  city: 'Abidjan',
  avatar: 'AY',
  role: 'admin',
  membership: 'premium',
  joinedAt: 'Janvier 2026',
  bookingsCount: 0,
  favoritesCount: 0,
};

const mockPartner: AuthUser = {
  id: 'partner-1',
  firstName: 'Aminata',
  lastName: 'Koné',
  email: 'partner@ayoka.ci',
  phone: '+225 07 12 34 56',
  city: 'Abidjan',
  avatar: 'AK',
  role: 'partner',
  membership: 'premium',
  joinedAt: 'Janvier 2026',
  bookingsCount: 8,
  favoritesCount: 12,
  businessName: 'African Tours CI',
  category: 'Tour Opérateur',
  verified: true,
  blocked: false,
};

const mockUsers: AuthUser[] = [
  mockAdmin,
  mockPartner,
  {
    id: 'partner-2',
    firstName: 'Jean-Pierre',
    lastName: 'Martin',
    email: 'jp@ayoka.ci',
    phone: '+225 05 98 76 54',
    city: 'Bouaké',
    avatar: 'JM',
    role: 'partner',
    membership: 'standard',
    joinedAt: 'Février 2026',
    bookingsCount: 3,
    favoritesCount: 5,
    businessName: 'Bouaké Tours',
    category: 'Transport',
    verified: false,
    blocked: false,
  },
  {
    id: 'partner-3',
    firstName: 'Fatou',
    lastName: 'Bamba',
    email: 'fatou@ayoka.ci',
    phone: '+225 05 11 22 33',
    city: 'San Pedro',
    avatar: 'FB',
    role: 'partner',
    membership: 'premium',
    joinedAt: 'Novembre 2025',
    bookingsCount: 7,
    favoritesCount: 9,
    businessName: 'San Pedro Plages',
    category: 'Hôtellerie',
    verified: true,
    blocked: false,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const stored = loadAuth();
    return {
      user: stored,
      isAuthenticated: !!stored,
      isLoading: false,
      error: null,
    };
  });

  useEffect(() => { saveAuth(state.user); }, [state.user]);

  const simulateLoading = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    return new Promise<void>((resolve) => setTimeout(resolve, 1200));
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    await simulateLoading();
    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      // Demo: if email contains 'admin', create admin; otherwise partner
      const role: UserRole = email.includes('admin') ? 'admin' : 'partner';
      const demoUser: AuthUser = {
        ...mockPartner,
        id: `user-${Date.now()}`,
        email,
        role,
        firstName: role === 'admin' ? 'Admin' : 'Utilisateur',
        lastName: 'Demo',
        avatar: role === 'admin' ? 'AD' : 'UD',
        businessName: role === 'partner' ? 'Mon Entreprise' : undefined,
        category: role === 'partner' ? 'Tourisme' : undefined,
      };
      setState({ user: demoUser, isAuthenticated: true, isLoading: false, error: null });
      return;
    }
    if (user.blocked) {
      setState({ user: null, isAuthenticated: false, isLoading: false, error: 'Compte bloqué. Contactez le support.' });
      return;
    }
    setState({ user, isAuthenticated: true, isLoading: false, error: null });
  }, [simulateLoading]);

  const register = useCallback(async (data: Partial<AuthUser> & { password: string; role: UserRole }) => {
    await simulateLoading();
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || 'Abidjan',
      avatar: `${(data.firstName || 'U')[0]}${(data.lastName || 'D')[0]}`,
      role: data.role || 'partner',
      membership: 'standard',
      joinedAt: 'Juin 2026',
      bookingsCount: 0,
      favoritesCount: 0,
      businessName: data.businessName,
      category: data.category,
      verified: false,
      blocked: false,
    };
    setState({ user: newUser, isAuthenticated: true, isLoading: false, error: null });
  }, [simulateLoading]);

  const logout = useCallback(() => {
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const forgotPassword = useCallback(async (_email: string) => {
    await simulateLoading();
    setState((s) => ({ ...s, isLoading: false }));
    return true;
  }, [simulateLoading]);

  const resetPassword = useCallback(async (_token: string, _password: string) => {
    await simulateLoading();
    setState((s) => ({ ...s, isLoading: false }));
    return true;
  }, [simulateLoading]);

  const updateProfile = useCallback(async (data: Partial<AuthUser>) => {
    await simulateLoading();
    setState((s) => {
      const updated = s.user ? { ...s.user, ...data } : null;
      return { ...s, user: updated, isLoading: false };
    });
  }, [simulateLoading]);

  const hasRole = useCallback((role: UserRole) => state.user?.role === role, [state.user?.role]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, forgotPassword, resetPassword, updateProfile, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ── Re-export mock users for admin pages ──
export { mockUsers };
