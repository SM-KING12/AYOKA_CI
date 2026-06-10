// ── Auth & Role types ──
// Shared between web and React Native.
// Role-based access: admin sees all, partner sees own data.

export type UserRole = 'admin' | 'partner';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  role: UserRole;
  membership: 'standard' | 'premium';
  joinedAt: string;
  bookingsCount: number;
  favoritesCount: number;
  // Partner-specific fields
  businessName?: string;
  category?: string;
  verified?: boolean;
  blocked?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ── Extended Partner types (admin controls) ──

export interface PartnerListItem {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  avatar: string;
  city: string;
  category: string;
  services: number;
  bookings: number;
  revenue: number;
  rating: number;
  verified: boolean;
  blocked: boolean;
  joinedAt: string;
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
  target: 'all' | 'partner' | string; // partner id or 'all'
  read: boolean;
  createdAt: string;
}
