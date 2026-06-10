import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  PartnerService,
  PartnerBooking,
  PartnerProfile,
  PartnerCalendarEvent,
  PartnerState,
} from '../types/partner';
import type { PartnerListItem, AdminNotification } from '../types/auth';
import {
  mockPartnerServices,
  mockPartnerBookings,
  mockPartnerProfile,
  mockPartnerStats,
  mockPartnerMessages,
  mockPartnerReviews,
  mockCalendarEvents,
} from '../mock/mockPartnerData';

const STORAGE_KEY = 'ayoka_partner_state';

function loadState(): PartnerState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function saveState(state: PartnerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const defaultState: PartnerState = {
  services: mockPartnerServices,
  bookings: mockPartnerBookings,
  profile: mockPartnerProfile,
  stats: mockPartnerStats,
  messages: mockPartnerMessages,
  reviews: mockPartnerReviews,
  calendarEvents: mockCalendarEvents,
};

// ── Mock partner list (for admin) ──

const mockPartnerList: PartnerListItem[] = [
  {
    id: 'partner-1',
    businessName: 'African Tours CI',
    ownerName: 'Aminata Koné',
    email: 'partner@ayoka.ci',
    avatar: 'AK',
    city: 'Abidjan',
    category: 'Tour Opérateur',
    services: 6,
    bookings: 893,
    revenue: 12450000,
    rating: 4.7,
    verified: true,
    blocked: false,
    joinedAt: 'Jan 2026',
  },
  {
    id: 'partner-2',
    businessName: 'Bouaké Tours',
    ownerName: 'Jean-Pierre Martin',
    email: 'jp@ayoka.ci',
    avatar: 'JM',
    city: 'Bouaké',
    category: 'Transport',
    services: 2,
    bookings: 156,
    revenue: 2800000,
    rating: 4.2,
    verified: false,
    blocked: false,
    joinedAt: 'Fév 2026',
  },
  {
    id: 'partner-3',
    businessName: 'San Pedro Plages',
    ownerName: 'Fatou Bamba',
    email: 'fatou@ayoka.ci',
    avatar: 'FB',
    city: 'San Pedro',
    category: 'Hôtellerie',
    services: 4,
    bookings: 412,
    revenue: 8900000,
    rating: 4.5,
    verified: true,
    blocked: false,
    joinedAt: 'Nov 2025',
  },
  {
    id: 'partner-4',
    businessName: 'Man Adventures',
    ownerName: 'Moussa Diabaté',
    email: 'moussa@ayoka.ci',
    avatar: 'MD',
    city: 'Man',
    category: 'Aventure',
    services: 3,
    bookings: 89,
    revenue: 1200000,
    rating: 4.0,
    verified: false,
    blocked: true,
    joinedAt: 'Mar 2026',
  },
];

const mockAdminNotifications: AdminNotification[] = [
  { id: 'an1', type: 'warning', title: 'Service en attente', message: 'Bouaké Tours a ajouté un nouveau service nécessitant validation.', target: 'partner-2', read: false, createdAt: 'Il y a 2h' },
  { id: 'an2', type: 'alert', title: 'Partenaire bloqué', message: 'Man Adventures a été bloqué pour non-respect des conditions.', target: 'partner-4', read: false, createdAt: 'Il y a 5h' },
  { id: 'an3', type: 'success', title: 'Nouveau partenaire', message: 'San Pedro Plages a rejoint la plateforme.', target: 'partner-3', read: true, createdAt: 'Hier' },
  { id: 'an4', type: 'info', title: 'Mise à jour plateforme', message: 'Nouvelles fonctionnalités IA disponibles.', target: 'all', read: true, createdAt: 'Il y a 2j' },
];

interface PartnerContextType extends PartnerState {
  // Services
  addService: (service: PartnerService) => void;
  updateService: (id: string, data: Partial<PartnerService>) => void;
  removeService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;
  validateService: (id: string) => void;
  // Bookings
  updateBookingStatus: (id: string, status: PartnerBooking['status']) => void;
  // Profile
  updateProfile: (data: Partial<PartnerProfile>) => void;
  // Messages
  markMessageRead: (id: string) => void;
  markAllMessagesRead: () => void;
  unreadMessageCount: number;
  // Calendar
  addCalendarEvent: (event: PartnerCalendarEvent) => void;
  removeCalendarEvent: (id: string) => void;
  // Admin controls
  partnerList: PartnerListItem[];
  blockPartner: (id: string) => void;
  unblockPartner: (id: string) => void;
  adminNotifications: AdminNotification[];
  sendAdminNotification: (notif: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => void;
  markAdminNotificationRead: (id: string) => void;
  unreadAdminNotifications: number;
}

const PartnerContext = createContext<PartnerContextType | null>(null);

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PartnerState>(() => loadState() || defaultState);
  const [partnerList, setPartnerList] = useState<PartnerListItem[]>(mockPartnerList);
  const [adminNotifs, setAdminNotifs] = useState<AdminNotification[]>(mockAdminNotifications);

  useEffect(() => { saveState(state); }, [state]);

  // Partner CRUD
  const addService = useCallback((service: PartnerService) => {
    setState((s) => ({ ...s, services: [...s.services, service] }));
  }, []);
  const updateService = useCallback((id: string, data: Partial<PartnerService>) => {
    setState((s) => ({ ...s, services: s.services.map((svc) => (svc.id === id ? { ...svc, ...data } : svc)) }));
  }, []);
  const removeService = useCallback((id: string) => {
    setState((s) => ({ ...s, services: s.services.filter((svc) => svc.id !== id) }));
  }, []);
  const toggleServiceStatus = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      services: s.services.map((svc) =>
        svc.id === id ? { ...svc, status: svc.status === 'active' ? 'paused' : 'active' } : svc
      ),
    }));
  }, []);
  const validateService = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      services: s.services.map((svc) =>
        svc.id === id ? { ...svc, status: 'active' } : svc
      ),
    }));
  }, []);

  const updateBookingStatus = useCallback((id: string, status: PartnerBooking['status']) => {
    setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }));
  }, []);
  const updateProfile = useCallback((data: Partial<PartnerProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...data } }));
  }, []);
  const markMessageRead = useCallback((id: string) => {
    setState((s) => ({ ...s, messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) }));
  }, []);
  const markAllMessagesRead = useCallback(() => {
    setState((s) => ({ ...s, messages: s.messages.map((m) => ({ ...m, read: true })) }));
  }, []);
  const unreadMessageCount = state.messages.filter((m) => !m.read).length;
  const addCalendarEvent = useCallback((event: PartnerCalendarEvent) => {
    setState((s) => ({ ...s, calendarEvents: [...s.calendarEvents, event] }));
  }, []);
  const removeCalendarEvent = useCallback((id: string) => {
    setState((s) => ({ ...s, calendarEvents: s.calendarEvents.filter((e) => e.id !== id) }));
  }, []);

  // Admin controls
  const blockPartner = useCallback((id: string) => {
    setPartnerList((prev) => prev.map((p) => (p.id === id ? { ...p, blocked: true } : p)));
  }, []);
  const unblockPartner = useCallback((id: string) => {
    setPartnerList((prev) => prev.map((p) => (p.id === id ? { ...p, blocked: false } : p)));
  }, []);
  const sendAdminNotification = useCallback((notif: Omit<AdminNotification, 'id' | 'createdAt' | 'read'>) => {
    setAdminNotifs((prev) => [
      { ...notif, id: `an-${Date.now()}`, createdAt: 'À l\'instant', read: false },
      ...prev,
    ]);
  }, []);
  const markAdminNotificationRead = useCallback((id: string) => {
    setAdminNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);
  const unreadAdminNotifications = adminNotifs.filter((n) => !n.read).length;

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

export function usePartner() {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error('usePartner must be used within PartnerProvider');
  return ctx;
}
