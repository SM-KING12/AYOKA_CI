import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  MapPin,
  CalendarCheck,
  CalendarDays,
  MessageSquare,
  UserCircle,
  BarChart3,
  Shield,
  Bell,
  Eye,
} from 'lucide-react';

// ── Route definitions (single source of truth) ──
// Web: React Router paths
// React Native: map to Tab/Stack screens

export interface AppRoute {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  index?: boolean;
  adminOnly?: boolean;
  partnerOnly?: boolean;
}

// ── Partner routes ──
export const partnerRoutes: AppRoute[] = [
  { path: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, index: true },
  { path: 'services', label: 'Services', icon: MapPin },
  { path: 'reservations', label: 'Réservations', icon: CalendarCheck },
  { path: 'calendar', label: 'Calendrier', icon: CalendarDays },
  { path: 'messages', label: 'Messages', icon: MessageSquare },
  { path: 'profile', label: 'Profil', icon: UserCircle, partnerOnly: true },
  { path: 'statistics', label: 'Statistiques', icon: BarChart3 },
];

export const defaultPartnerRoute = partnerRoutes.find((r) => r.index) || partnerRoutes[0];

// ── Admin routes ──
export const adminRoutes: AppRoute[] = [
  { path: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, index: true },
  { path: 'partners', label: 'Partenaires', icon: Users },
  { path: 'services', label: 'Services', icon: MapPin },
  { path: 'reservations', label: 'Réservations', icon: CalendarCheck },
  { path: 'monitoring', label: 'Monitoring', icon: Eye },
  { path: 'notifications', label: 'Notifications', icon: Bell },
  { path: 'statistics', label: 'Statistiques', icon: BarChart3 },
  { path: 'settings', label: 'Paramètres', icon: Shield },
];

export const defaultAdminRoute = adminRoutes.find((r) => r.index) || adminRoutes[0];

// ── Auth routes ──
export const authRoutes = [
  { path: '/auth/login', label: 'Connexion' },
  { path: '/auth/register', label: 'Inscription' },
  { path: '/auth/forgot-password', label: 'Mot de passe oublié' },
  { path: '/auth/reset-password', label: 'Réinitialisation' },
] as const;

export function getRoutePath(base: '/partner' | '/admin', route: AppRoute) {
  return `${base}/${route.path}`;
}
