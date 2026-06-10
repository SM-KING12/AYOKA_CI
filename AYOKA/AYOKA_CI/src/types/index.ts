export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  membership: 'standard' | 'premium';
  joinedAt: string;
  bookingsCount: number;
  favoritesCount: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Notification {
  id: string;
  type: 'booking' | 'promotion' | 'ai' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Itinerary {
  id: string;
  name: string;
  destination: string;
  days: ItineraryDay[];
  totalBudget: number;
  createdAt: string;
  isSaved: boolean;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  time: string;
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: number;
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  timestamp: string;
  results: number;
}

export interface AdminStats {
  users: { total: number; growth: number };
  bookings: { total: number; growth: number };
  revenue: { total: string; growth: number };
  rating: { average: number; growth: number };
}

export interface AdminBooking {
  id: string;
  user: string;
  destination: string;
  date: string;
  amount: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}
