// ============================================================
// TRAVELERCONTEXT.TSX - CONTEXTE DES VOYAGEURS
// ============================================================
// Ce fichier gère l'état des voyageurs dans l'application AYOKA CI.
// Il utilise React Context API pour partager les données voyageurs
// à travers toute l'application.
//
// Fonctionnalités:
// - Gestion du profil voyageur
// - Gestion des réservations
// - Gestion des favoris
// - Gestion des plans de voyage
// - Gestion des notifications
// ============================================================

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  Traveler,
  TravelerReservation,
  TravelerState,
  TripPlan,
  TravelerNotification,
  PartnerService,
} from '../types';
import { loadState, saveState, STORAGE_KEYS } from '../storage/asyncStorage';
import { mockPartnerServices } from '../services/mockData';

// ============================================================
// VOYAGEUR PAR DÉFAUT
// ============================================================
// Profil voyageur par défaut avec données mockées
const defaultTraveler: Traveler = {
  id: 'traveler-1',
  firstName: 'Jean',
  lastName: 'Kouassi',
  email: 'jean.kouassi@email.com',
  phone: '+225 07 98 76 54',
  avatar: 'JK',
  language: 'fr',
  interests: ['Culture', 'Nature', 'Gastronomie'],
  travelPreferences: {
    budget: 200000,
    accommodationType: 'mid-range',
    travelStyle: 'cultural',
    groupSize: 2,
    dietaryRestrictions: [],
  },
  createdAt: 'Mai 2026',
};

// ============================================================
// ÉTAT PAR DÉFAUT
// ============================================================
// État initial du contexte avec les données mockées
const defaultState: TravelerState = {
  profile: defaultTraveler, // Profil du voyageur
  reservations: [], // Réservations du voyageur
  favorites: mockPartnerServices.slice(0, 3), // Favoris du voyageur
  tripPlans: [], // Plans de voyage du voyageur
  notifications: [], // Notifications du voyageur
};

/**
 * Interface définissant le type du contexte voyageur
 * Étend TravelerState avec les fonctions de gestion
 */
interface TravelerContextType extends TravelerState {
  // Gestion du profil
  updateProfile: (data: Partial<Traveler>) => void; // Modifier le profil
  
  // Gestion des réservations
  addReservation: (reservation: TravelerReservation) => void; // Ajouter une réservation
  updateReservationStatus: (id: string, status: TravelerReservation['status']) => void; // Modifier le statut
  cancelReservation: (id: string) => void; // Annuler une réservation
  
  // Gestion des favoris
  addFavorite: (service: PartnerService) => void; // Ajouter un favori
  removeFavorite: (serviceId: string) => void; // Supprimer un favori
  
  // Gestion des plans de voyage
  addTripPlan: (plan: TripPlan) => void; // Ajouter un plan de voyage
  updateTripPlan: (id: string, plan: Partial<TripPlan>) => void; // Modifier un plan
  removeTripPlan: (id: string) => void; // Supprimer un plan
  
  // Gestion des notifications
  addNotification: (notif: Omit<TravelerNotification, 'id' | 'createdAt' | 'read'>) => void; // Ajouter une notification
  markNotificationRead: (id: string) => void; // Marquer comme lue
  markAllNotificationsRead: () => void; // Marquer toutes comme lues
  unreadNotificationCount: number; // Nombre de notifications non lues
}

// Création du contexte React
const TravelerContext = createContext<TravelerContextType | null>(null);

/**
 * Provider du contexte voyageur
 * Gère l'état global des voyageurs et le partage aux composants enfants
 * 
 * @param children - Composants enfants à envelopper
 */
export function TravelerProvider({ children }: { children: ReactNode }) {
  // État local
  const [state, setState] = useState<TravelerState>(defaultState); // État principal du voyageur

  // ============================================================
  // CHARGEMENT DE L'ÉTAT PERSISTÉ
  // ============================================================
  // Au montage du composant, charge l'état voyageur depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const stored = await loadState<TravelerState>(STORAGE_KEYS.TRAVELER);
      if (stored) setState(stored);
    })();
  }, []);

  // ============================================================
  // PERSISTANCE DE L'ÉTAT
  // ============================================================
  // Sauvegarde l'état voyageur dans AsyncStorage à chaque changement
  useEffect(() => {
    saveState(STORAGE_KEYS.TRAVELER, state);
  }, [state]);

  // ============================================================
  // GESTION DU PROFIL
  // ============================================================
  
  // Met à jour le profil du voyageur
  const updateProfile = useCallback((data: Partial<Traveler>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...data } }));
  }, []);

  // ============================================================
  // GESTION DES RÉSERVATIONS
  // ============================================================
  
  // Ajoute une nouvelle réservation
  const addReservation = useCallback((reservation: TravelerReservation) => {
    setState((s) => ({ ...s, reservations: [reservation, ...s.reservations] }));
  }, []);
  
  // Met à jour le statut d'une réservation
  const updateReservationStatus = useCallback((id: string, status: TravelerReservation['status']) => {
    setState((s) => ({
      ...s,
      reservations: s.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  }, []);
  
  // Annule une réservation (passe le statut à cancelled et paymentStatus à refunded)
  const cancelReservation = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      reservations: s.reservations.map((r) =>
        r.id === id ? { ...r, status: 'cancelled', paymentStatus: 'refunded' } : r
      ),
    }));
  }, []);

  // ============================================================
  // GESTION DES FAVORIS
  // ============================================================
  
  // Ajoute un service aux favoris (évite les doublons)
  const addFavorite = useCallback((service: PartnerService) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.some((f) => f.id === service.id) ? s.favorites : [...s.favorites, service],
    }));
  }, []);
  
  // Supprime un service des favoris
  const removeFavorite = useCallback((serviceId: string) => {
    setState((s) => ({ ...s, favorites: s.favorites.filter((f) => f.id !== serviceId) }));
  }, []);

  // ============================================================
  // GESTION DES PLANS DE VOYAGE
  // ============================================================
  
  // Ajoute un nouveau plan de voyage
  const addTripPlan = useCallback((plan: TripPlan) => {
    setState((s) => ({ ...s, tripPlans: [plan, ...s.tripPlans] }));
  }, []);
  
  // Met à jour un plan de voyage existant
  const updateTripPlan = useCallback((id: string, plan: Partial<TripPlan>) => {
    setState((s) => ({
      ...s,
      tripPlans: s.tripPlans.map((p) => (p.id === id ? { ...p, ...plan } : p)),
    }));
  }, []);
  
  // Supprime un plan de voyage
  const removeTripPlan = useCallback((id: string) => {
    setState((s) => ({ ...s, tripPlans: s.tripPlans.filter((p) => p.id !== id) }));
  }, []);

  // ============================================================
  // GESTION DES NOTIFICATIONS
  // ============================================================
  
  // Ajoute une nouvelle notification
  const addNotification = useCallback((notif: Omit<TravelerNotification, 'id' | 'createdAt' | 'read'>) => {
    setState((s) => ({
      ...s,
      notifications: [{ ...notif, id: `tn-${Date.now()}`, createdAt: 'À l\'instant', read: false }, ...s.notifications],
    }));
  }, []);
  
  // Marque une notification spécifique comme lue
  const markNotificationRead = useCallback((id: string) => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
  }, []);
  
  // Marque toutes les notifications comme lues
  const markAllNotificationsRead = useCallback(() => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);
  
  // Calcul du nombre de notifications non lues
  const unreadNotificationCount = state.notifications.filter((n) => !n.read).length;

  // Fournit le contexte aux composants enfants
  return (
    <TravelerContext.Provider
      value={{
        ...state,
        updateProfile,
        addReservation,
        updateReservationStatus,
        cancelReservation,
        addFavorite,
        removeFavorite,
        addTripPlan,
        updateTripPlan,
        removeTripPlan,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationCount,
      }}
    >
      {children}
    </TravelerContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le contexte voyageur
 * Doit être utilisé à l'intérieur d'un TravelerProvider
 * 
 * @returns Le contexte voyageur
 * @throws Error si utilisé hors du TravelerProvider
 */
export function useTraveler() {
  const ctx = useContext(TravelerContext);
  if (!ctx) throw new Error('useTraveler must be used within TravelerProvider');
  return ctx;
}
