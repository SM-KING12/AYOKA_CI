// ============================================================
// PARTNERCONTEXT.TSX - CONTEXTE DES PARTENAIRES
// ============================================================
// Ce fichier gère l'état des partenaires dans l'application AYOKA CI.
// Il utilise React Context API pour partager les données partenaires
// à travers toute l'application.
//
// Fonctionnalités:
// - Gestion des services (ajout, modification, suppression)
// - Gestion des réservations
// - Gestion du profil partenaire
// - Gestion des messages et notifications
// - Gestion du calendrier
// - Gestion de la liste des partenaires (admin)
// ============================================================

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  PartnerService,
  PartnerBooking,
  PartnerProfile,
  PartnerCalendarEvent,
  PartnerState,
  PartnerListItem,
  AdminNotification,
} from '../types';
import { loadState, saveState, STORAGE_KEYS } from '../storage/asyncStorage';
import {
  mockPartnerServices,
  mockPartnerBookings,
  mockPartnerProfile,
  mockPartnerStats,
  mockPartnerMessages,
  mockPartnerReviews,
  mockCalendarEvents,
  mockPartnerList,
  mockAdminNotifications,
} from '../services/mockData';

// ============================================================
// ÉTAT PAR DÉFAUT
// ============================================================
// État initial du contexte avec les données mockées
const defaultState: PartnerState = {
  services: mockPartnerServices, // Services du partenaire
  bookings: mockPartnerBookings, // Réservations du partenaire
  profile: mockPartnerProfile, // Profil du partenaire
  stats: mockPartnerStats, // Statistiques du partenaire
  messages: mockPartnerMessages, // Messages du partenaire
  reviews: mockPartnerReviews, // Avis des clients
  calendarEvents: mockCalendarEvents, // Événements du calendrier
};

/**
 * Interface définissant le type du contexte partenaire
 * Étend PartnerState avec les fonctions de gestion
 */
interface PartnerContextType extends PartnerState {
  // Gestion des services
  addService: (service: PartnerService) => void; // Ajouter un service
  updateService: (id: string, data: Partial<PartnerService>) => void; // Modifier un service
  removeService: (id: string) => void; // Supprimer un service
  toggleServiceStatus: (id: string) => void; // Activer/désactiver un service
  validateService: (id: string) => void; // Valider un service
  
  // Gestion des réservations
  updateBookingStatus: (id: string, status: PartnerBooking['status']) => void; // Modifier le statut d'une réservation
  
  // Gestion du profil
  updateProfile: (data: Partial<PartnerProfile>) => void; // Modifier le profil
  
  // Gestion des messages
  markMessageRead: (id: string) => void; // Marquer un message comme lu
  markAllMessagesRead: () => void; // Marquer tous les messages comme lus
  unreadMessageCount: number; // Nombre de messages non lus
  
  // Gestion du calendrier
  addCalendarEvent: (event: PartnerCalendarEvent) => void; // Ajouter un événement
  removeCalendarEvent: (id: string) => void; // Supprimer un événement
  
  // Gestion admin (liste des partenaires)
  partnerList: PartnerListItem[]; // Liste des partenaires
  blockPartner: (id: string) => void; // Bloquer un partenaire
  unblockPartner: (id: string) => void; // Débloquer un partenaire
  
  // Notifications admin
  adminNotifications: AdminNotification[]; // Notifications admin
  sendAdminNotification: (notif: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => void; // Envoyer une notification
  markAdminNotificationRead: (id: string) => void; // Marquer une notification comme lue
  unreadAdminNotifications: number; // Nombre de notifications non lues
}

// Création du contexte React
const PartnerContext = createContext<PartnerContextType | null>(null);

/**
 * Provider du contexte partenaire
 * Gère l'état global des partenaires et le partage aux composants enfants
 * 
 * @param children - Composants enfants à envelopper
 */
export function PartnerProvider({ children }: { children: ReactNode }) {
  // États locaux
  const [state, setState] = useState<PartnerState>(defaultState); // État principal du partenaire
  const [partnerList, setPartnerList] = useState<PartnerListItem[]>(mockPartnerList); // Liste des partenaires (admin)
  const [adminNotifs, setAdminNotifs] = useState<AdminNotification[]>(mockAdminNotifications); // Notifications admin

  // ============================================================
  // CHARGEMENT DE L'ÉTAT PERSISTÉ
  // ============================================================
  // Au montage du composant, charge l'état partenaire depuis AsyncStorage
  useEffect(() => {
    (async () => {
      const stored = await loadState<PartnerState>(STORAGE_KEYS.PARTNER);
      if (stored) setState(stored);
    })();
  }, []);

  // ============================================================
  // PERSISTANCE DE L'ÉTAT
  // ============================================================
  // Sauvegarde l'état partenaire dans AsyncStorage à chaque changement
  useEffect(() => {
    saveState(STORAGE_KEYS.PARTNER, state);
  }, [state]);

  // ============================================================
  // GESTION DES SERVICES
  // ============================================================
  
  // Ajoute un nouveau service à la liste
  const addService = useCallback((service: PartnerService) => {
    setState((s) => ({ ...s, services: [...s.services, service] }));
  }, []);
  
  // Met à jour un service existant
  const updateService = useCallback((id: string, data: Partial<PartnerService>) => {
    setState((s) => ({ ...s, services: s.services.map((svc) => (svc.id === id ? { ...svc, ...data } : svc)) }));
  }, []);
  
  // Supprime un service de la liste
  const removeService = useCallback((id: string) => {
    setState((s) => ({ ...s, services: s.services.filter((svc) => svc.id !== id) }));
  }, []);
  
  // Bascule le statut d'un service (active ↔ paused)
  const toggleServiceStatus = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      services: s.services.map((svc) =>
        svc.id === id ? { ...svc, status: svc.status === 'active' ? 'paused' : 'active' } : svc
      ),
    }));
  }, []);
  
  // Valide un service (passe le statut à active)
  const validateService = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      services: s.services.map((svc) => (svc.id === id ? { ...svc, status: 'active' } : svc)),
    }));
  }, []);
  // ============================================================
  // GESTION DES RÉSERVATIONS
  // ============================================================
  
  // Met à jour le statut d'une réservation
  const updateBookingStatus = useCallback((id: string, status: PartnerBooking['status']) => {
    setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }));
  }, []);
  
  // ============================================================
  // GESTION DU PROFIL
  // ============================================================
  
  // Met à jour le profil du partenaire
  const updateProfile = useCallback((data: Partial<PartnerProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...data } }));
  }, []);
  // ============================================================
  // GESTION DES MESSAGES
  // ============================================================
  
  // Marque un message spécifique comme lu
  const markMessageRead = useCallback((id: string) => {
    setState((s) => ({ ...s, messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) }));
  }, []);
  
  // Marque tous les messages comme lus
  const markAllMessagesRead = useCallback(() => {
    setState((s) => ({ ...s, messages: s.messages.map((m) => ({ ...m, read: true })) }));
  }, []);
  
  // Calcul du nombre de messages non lus
  const unreadMessageCount = state.messages.filter((m) => !m.read).length;
  // ============================================================
  // GESTION DU CALENDRIER
  // ============================================================
  
  // Ajoute un événement au calendrier
  const addCalendarEvent = useCallback((event: PartnerCalendarEvent) => {
    setState((s) => ({ ...s, calendarEvents: [...s.calendarEvents, event] }));
  }, []);
  
  // Supprime un événement du calendrier
  const removeCalendarEvent = useCallback((id: string) => {
    setState((s) => ({ ...s, calendarEvents: s.calendarEvents.filter((e) => e.id !== id) }));
  }, []);
  // ============================================================
  // GESTION ADMIN (LISTE DES PARTENAIRES)
  // ============================================================
  
  // Bloque un partenaire (admin)
  const blockPartner = useCallback((id: string) => {
    setPartnerList((prev) => prev.map((p) => (p.id === id ? { ...p, blocked: true } : p)));
  }, []);
  
  // Débloque un partenaire (admin)
  const unblockPartner = useCallback((id: string) => {
    setPartnerList((prev) => prev.map((p) => (p.id === id ? { ...p, blocked: false } : p)));
  }, []);
  // ============================================================
  // GESTION DES NOTIFICATIONS ADMIN
  // ============================================================
  
  // Envoie une notification aux partenaires
  const sendAdminNotification = useCallback((notif: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => {
    setAdminNotifs((prev) => [{ ...notif, id: `an-${Date.now()}`, createdAt: 'À l\'instant', read: false }, ...prev]);
  }, []);
  
  // Marque une notification comme lue
  const markAdminNotificationRead = useCallback((id: string) => {
    setAdminNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  
  // Calcul du nombre de notifications non lues
  const unreadAdminNotifications = adminNotifs.filter((n) => !n.read).length;

  // Fournit le contexte aux composants enfants
  return (
    <PartnerContext.Provider
      value={{
        ...state,
        addService, updateService, removeService, toggleServiceStatus, validateService,
        updateBookingStatus, updateProfile,
        markMessageRead, markAllMessagesRead, unreadMessageCount,
        addCalendarEvent, removeCalendarEvent,
        partnerList, blockPartner, unblockPartner,
        adminNotifications: adminNotifs, sendAdminNotification, markAdminNotificationRead,
        unreadAdminNotifications,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
}

/**
 * Hook personnalisé pour utiliser le contexte partenaire
 * Doit être utilisé à l'intérieur d'un PartnerProvider
 * 
 * @returns Le contexte partenaire
 * @throws Error si utilisé hors du PartnerProvider
 */
export function usePartner() {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error('usePartner must be used within PartnerProvider');
  return ctx;
}
