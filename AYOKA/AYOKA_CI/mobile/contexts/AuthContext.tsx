// ============================================================
// AUTHCONTEXT.TSX - CONTEXTE D'AUTHENTIFICATION
// ============================================================
// Ce fichier gère l'état d'authentification de l'application AYOKA CI.
// Il utilise React Context API pour partager l'état d'authentification
// à travers toute l'application.
//
// Fonctionnalités:
// - Login: Connexion des utilisateurs (admin, partner, traveler)
// - Register: Inscription des nouveaux utilisateurs
// - Logout: Déconnexion et nettoyage de la session
// - Persistence: Sauvegarde de l'état dans AsyncStorage
// - Role checking: Vérification du rôle utilisateur
// ============================================================

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthUser, UserRole, Traveler } from '../types';
import { loadState, saveState, removeState, STORAGE_KEYS } from '../storage/asyncStorage';
import { mockUsers } from '../services/mockData';

/**
 * Interface définissant le type du contexte d'authentification
 * Contient l'état utilisateur et les fonctions d'authentification
 */
interface AuthContextType {
  user: AuthUser | null; // Utilisateur connecté ou null
  isAuthenticated: boolean; // État de connexion
  isLoading: boolean; // État de chargement
  error: string | null; // Message d'erreur
  login: (email: string, password: string) => Promise<void>; // Fonction de connexion
  register: (data: Partial<AuthUser> & { password: string; role: UserRole }) => Promise<void>; // Fonction d'inscription
  logout: () => Promise<void>; // Fonction de déconnexion
  hasRole: (role: UserRole) => boolean; // Vérification du rôle
}

// Création du contexte React
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provider du contexte d'authentification
 * Gère l'état global d'authentification et le partage aux composants enfants
 * 
 * @param children - Composants enfants à envelopper
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // États locaux
  const [user, setUser] = useState<AuthUser | null>(null); // Utilisateur connecté
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État de connexion
  const [isLoading, setIsLoading] = useState(true); // État de chargement initial
  const [error, setError] = useState<string | null>(null); // Message d'erreur

  // ============================================================
  // CHARGEMENT DE L'ÉTAT PERSISTÉ
  // ============================================================
  // Au montage du composant, charge l'état d'authentification depuis AsyncStorage
  // Cela permet de maintenir la session entre les redémarrages de l'application
  useEffect(() => {
    (async () => {
      const stored = await loadState<AuthUser>(STORAGE_KEYS.AUTH);
      if (stored) {
        setUser(stored);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    })();
  }, []);

  // ============================================================
  // PERSISTANCE DE L'ÉTAT
  // ============================================================
  // Sauvegarde l'état d'authentification dans AsyncStorage à chaque changement
  useEffect(() => {
    if (user) saveState(STORAGE_KEYS.AUTH, user);
  }, [user]);

  // ============================================================
  // SIMULATION DE CHARGEMENT
  // ============================================================
  // Simule un délai de chargement pour une meilleure expérience utilisateur
  const simulateLoading = () => {
    setIsLoading(true);
    setError(null);
    return new Promise<void>((resolve) => setTimeout(resolve, 1000));
  };

  // ============================================================
  // FONCTION DE CONNEXION
  // ============================================================
  // Connecte un utilisateur avec son email et mot de passe
  // Mode démo: auto-création d'utilisateur basée sur le pattern de l'email
  const login = useCallback(async (email: string, _password: string) => {
    await simulateLoading();
    
    // Recherche de l'utilisateur dans les données mockées
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      // Vérification si le compte est bloqué
      if (found.blocked) {
        setError('Compte bloqué. Contactez le support.');
        setIsLoading(false);
        return;
      }
      setUser(found);
      setIsAuthenticated(true);
      await saveState(STORAGE_KEYS.AUTH, found);
      setIsLoading(false);
      return;
    }
    
    // Mode démo: auto-création basée sur le pattern de l'email
    let role: UserRole;
    if (email.includes('admin')) role = 'admin';
    else if (email.includes('partner')) role = 'partner';
    else role = 'traveler';

    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      firstName: role === 'admin' ? 'Admin' : role === 'partner' ? 'Utilisateur' : 'Voyageur',
      lastName: 'Demo',
      email,
      phone: '',
      city: 'Abidjan',
      avatar: role === 'admin' ? 'AD' : role === 'partner' ? 'UD' : 'VD',
      role,
      membership: 'standard',
      joinedAt: 'Juin 2026',
      bookingsCount: 0,
      favoritesCount: 0,
      businessName: role === 'partner' ? 'Mon Entreprise' : undefined,
      category: role === 'partner' ? 'Tourisme' : undefined,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    await saveState(STORAGE_KEYS.AUTH, newUser);
    setIsLoading(false);
  }, []);

  // ============================================================
  // FONCTION D'INSCRIPTION
  // ============================================================
  // Crée un nouvel utilisateur avec les données fournies
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
      role: data.role || 'traveler',
      membership: 'standard',
      joinedAt: 'Juin 2026',
      bookingsCount: 0,
      favoritesCount: 0,
      businessName: data.businessName,
      category: data.category,
      verified: false,
      blocked: false,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    await saveState(STORAGE_KEYS.AUTH, newUser);
    setIsLoading(false);
  }, []);

  // ============================================================
  // FONCTION DE DÉCONNEXION
  // ============================================================
  // Déconnecte l'utilisateur et nettoie la session
  const logout = useCallback(async () => {
    setUser(null);
    setIsAuthenticated(false);
    await removeState(STORAGE_KEYS.AUTH);
  }, []);

  // ============================================================
  // VÉRIFICATION DU RÔLE
  // ============================================================
  // Vérifie si l'utilisateur connecté a un rôle spécifique
  const hasRole = useCallback((role: UserRole) => user?.role === role, [user?.role]);

  // Fournit le contexte aux composants enfants
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * Doit être utilisé à l'intérieur d'un AuthProvider
 * 
 * @returns Le contexte d'authentification
 * @throws Error si utilisé hors du AuthProvider
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
