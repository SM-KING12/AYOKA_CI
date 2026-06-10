// ── Partner domain types ──
// Shared between web and future React Native screens.
// All business logic operates on these types via PartnerContext.

export interface PartnerService {
  id: string;
  name: string;
  type: 'tour' | 'hotel' | 'restaurant' | 'transport' | 'activity';
  destination: string;
  price: number;
  priceUnit: string;
  capacity: number;
  bookings: number;
  rating: number;
  status: 'active' | 'draft' | 'paused';
  image: string;
  description: string;
}

export interface PartnerBooking {
  id: string;
  guestName: string;
  guestAvatar: string;
  serviceName: string;
  serviceType: PartnerService['type'];
  date: string;
  guests: number;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes: string;
}

export interface PartnerProfile {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  avatar: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  completedBookings: number;
  revenue: number;
  joinedAt: string;
  verified: boolean;
}

export interface PartnerStat {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PartnerMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  conversationId: string;
}

export interface PartnerReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  serviceName: string;
}

export interface PartnerCalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'booking' | 'block' | 'availability';
  guests: number;
  status: PartnerBooking['status'];
}

// ── Context shape ──
export interface PartnerState {
  services: PartnerService[];
  bookings: PartnerBooking[];
  profile: PartnerProfile;
  stats: PartnerStat[];
  messages: PartnerMessage[];
  reviews: PartnerReview[];
  calendarEvents: PartnerCalendarEvent[];
}
