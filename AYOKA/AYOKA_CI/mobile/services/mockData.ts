// Same mock data as web: src/mock/mockPartnerData.ts + src/contexts/AuthContext.tsx
// Kept in sync for web + mobile parity.

import type {
  PartnerService,
  PartnerBooking,
  PartnerProfile,
  PartnerStat,
  PartnerMessage,
  PartnerReview,
  PartnerCalendarEvent,
  PartnerListItem,
  AdminNotification,
  AuthUser,
} from '../types';

export const mockPartnerServices: PartnerService[] = [
  { id: 's1', name: 'Visite du Quartier Colonial', type: 'tour', destination: 'Grand-Bassam', price: 15000, priceUnit: 'FCFA/pers', capacity: 20, bookings: 156, rating: 4.8, status: 'active', image: 'https://images.pexels.com/photos/17749102/pexels-photo-17749102.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Découvrez l\'architecture coloniale classée UNESCO.' },
  { id: 's2', name: 'Randonnée Forêt Primaire', type: 'activity', destination: 'Parc de Taï', price: 25000, priceUnit: 'FCFA/pers', capacity: 8, bookings: 64, rating: 4.9, status: 'active', image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Trek dans la forêt tropicale avec observation des chimpanzés.' },
  { id: 's3', name: 'Suite Lagune Premium', type: 'hotel', destination: 'Assinie-Mafia', price: 85000, priceUnit: 'FCFA/nuit', capacity: 2, bookings: 89, rating: 4.6, status: 'active', image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Suite luxueuse avec vue panoramique sur la lagune.' },
  { id: 's4', name: 'Transfert Aéroport Abidjan', type: 'transport', destination: 'Abidjan', price: 12000, priceUnit: 'FCFA/trajet', capacity: 4, bookings: 230, rating: 4.4, status: 'active', image: 'https://images.pexels.com/photos/15961309/pexels-photo-15961309.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Transport privé aéroport Felix Houphouet-Boigny.' },
  { id: 's5', name: 'Dîner Gastronomique Ivoirien', type: 'restaurant', destination: 'Abidjan', price: 22000, priceUnit: 'FCFA/pers', capacity: 30, bookings: 312, rating: 4.7, status: 'active', image: 'https://images.pexels.com/photos/5463314/pexels-photo-5463314.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Menu dégustation fusion afro-contemporaine.' },
  { id: 's6', name: 'Excursion Mont Tonkoui', type: 'tour', destination: 'Man', price: 30000, priceUnit: 'FCFA/pers', capacity: 10, bookings: 42, rating: 4.8, status: 'draft', image: 'https://images.pexels.com/photos/16555348/pexels-photo-16555348.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Ascension du 2e plus haut sommet de CI.' },
];

export const mockPartnerBookings: PartnerBooking[] = [
  { id: 'b1', guestName: 'Aminata Koné', guestAvatar: 'AK', serviceName: 'Visite du Quartier Colonial', serviceType: 'tour', date: '2026-06-15', guests: 4, amount: 60000, status: 'confirmed', notes: 'Arrive à 9h' },
  { id: 'b2', guestName: 'Jean-Pierre Martin', guestAvatar: 'JM', serviceName: 'Suite Lagune Premium', serviceType: 'hotel', date: '2026-06-12', guests: 2, amount: 170000, status: 'pending', notes: 'Demande vue lagune' },
  { id: 'b3', guestName: 'Sophie Laurent', guestAvatar: 'SL', serviceName: 'Dîner Gastronomique', serviceType: 'restaurant', date: '2026-06-10', guests: 6, amount: 132000, status: 'confirmed', notes: 'Anniversaire' },
  { id: 'b4', guestName: 'Moussa Diabaté', guestAvatar: 'MD', serviceName: 'Randonnée Forêt', serviceType: 'activity', date: '2026-06-08', guests: 3, amount: 75000, status: 'cancelled', notes: 'Annulé' },
  { id: 'b5', guestName: 'Fatou Bamba', guestAvatar: 'FB', serviceName: 'Transfert Aéroport', serviceType: 'transport', date: '2026-06-07', guests: 2, amount: 12000, status: 'completed', notes: 'Vol AF 714' },
];

export const mockPartnerProfile: PartnerProfile = {
  businessName: 'African Tours CI',
  ownerName: 'Aminata Koné',
  email: 'contact@africantours.ci',
  phone: '+225 07 12 34 56',
  city: 'Abidjan',
  avatar: 'AK',
  category: 'Tour Opérateur',
  description: 'Tour opérateur spécialisé dans les expériences authentiques ivoiriennes.',
  rating: 4.7,
  reviewCount: 234,
  completedBookings: 893,
  revenue: 12450000,
  joinedAt: 'Janvier 2026',
  verified: true,
};

export const mockPartnerStats: PartnerStat[] = [
  { label: 'Réservations', value: 156, change: 22, trend: 'up' },
  { label: 'Revenus', value: '12.4M FCFA', change: 18, trend: 'up' },
  { label: 'Note moyenne', value: 4.7, change: 0.2, trend: 'up' },
  { label: 'Taux occupation', value: '78%', change: -3, trend: 'down' },
];

export const mockPartnerMessages: PartnerMessage[] = [
  { id: 'm1', sender: 'Aminata K.', senderAvatar: 'AK', content: 'Bonjour, la visite est-elle disponible le 20 juin ?', timestamp: '14:30', read: false, conversationId: 'c1' },
  { id: 'm2', sender: 'Jean-Pierre M.', senderAvatar: 'JM', content: 'Merci pour la confirmation !', timestamp: '12:15', read: false, conversationId: 'c2' },
  { id: 'm3', sender: 'Sophie L.', senderAvatar: 'SL', content: 'Pouvez-vous ajouter un gâteau ?', timestamp: '09:45', read: true, conversationId: 'c3' },
  { id: 'm4', sender: 'Support AYOKA', senderAvatar: 'AY', content: 'Votre vérification est approuvée !', timestamp: 'Hier', read: true, conversationId: 'c4' },
];

export const mockPartnerReviews: PartnerReview[] = [
  { id: 'r1', author: 'Aminata K.', avatar: 'AK', rating: 5, date: '15 Juin 2026', comment: 'Guide exceptionnel !', serviceName: 'Visite Colonial' },
  { id: 'r2', author: 'Jean-Pierre M.', avatar: 'JM', rating: 4, date: '12 Juin 2026', comment: 'Chambre confortable.', serviceName: 'Suite Lagune' },
  { id: 'r3', author: 'Sophie L.', avatar: 'SL', rating: 5, date: '10 Juin 2026', comment: 'Le dîner était divin !', serviceName: 'Dîner Gastronomique' },
];

export const mockCalendarEvents: PartnerCalendarEvent[] = [
  { id: 'ce1', title: 'Visite - Aminata K.', date: '2026-06-15', time: '09:00', type: 'booking', guests: 4, status: 'confirmed' },
  { id: 'ce2', title: 'Suite - Jean-Pierre', date: '2026-06-12', time: '14:00', type: 'booking', guests: 2, status: 'pending' },
  { id: 'ce3', title: 'Dîner - Sophie L.', date: '2026-06-10', time: '19:30', type: 'booking', guests: 6, status: 'confirmed' },
  { id: 'ce4', title: 'Transfert - Fatou B.', date: '2026-06-07', time: '22:30', type: 'booking', guests: 2, status: 'completed' },
];

export const mockPartnerList: PartnerListItem[] = [
  { id: 'partner-1', businessName: 'African Tours CI', ownerName: 'Aminata Koné', email: 'partner@ayoka.ci', avatar: 'AK', city: 'Abidjan', category: 'Tour Opérateur', services: 6, bookings: 893, revenue: 12450000, rating: 4.7, verified: true, blocked: false, joinedAt: 'Jan 2026' },
  { id: 'partner-2', businessName: 'Bouaké Tours', ownerName: 'Jean-Pierre Martin', email: 'jp@ayoka.ci', avatar: 'JM', city: 'Bouaké', category: 'Transport', services: 2, bookings: 156, revenue: 2800000, rating: 4.2, verified: false, blocked: false, joinedAt: 'Fév 2026' },
  { id: 'partner-3', businessName: 'San Pedro Plages', ownerName: 'Fatou Bamba', email: 'fatou@ayoka.ci', avatar: 'FB', city: 'San Pedro', category: 'Hôtellerie', services: 4, bookings: 412, revenue: 8900000, rating: 4.5, verified: true, blocked: false, joinedAt: 'Nov 2025' },
  { id: 'partner-4', businessName: 'Man Adventures', ownerName: 'Moussa Diabaté', email: 'moussa@ayoka.ci', avatar: 'MD', city: 'Man', category: 'Aventure', services: 3, bookings: 89, revenue: 1200000, rating: 4.0, verified: false, blocked: true, joinedAt: 'Mar 2026' },
];

export const mockAdminNotifications: AdminNotification[] = [
  { id: 'an1', type: 'warning', title: 'Service en attente', message: 'Bouaké Tours a ajouté un nouveau service.', target: 'partner-2', read: false, createdAt: 'Il y a 2h' },
  { id: 'an2', type: 'alert', title: 'Partenaire bloqué', message: 'Man Adventures a été bloqué.', target: 'partner-4', read: false, createdAt: 'Il y a 5h' },
  { id: 'an3', type: 'success', title: 'Nouveau partenaire', message: 'San Pedro Plages a rejoint la plateforme.', target: 'partner-3', read: true, createdAt: 'Hier' },
];

export const mockUsers: AuthUser[] = [
  { id: 'admin-1', firstName: 'Admin', lastName: 'AYOKA', email: 'admin@ayoka.ci', phone: '+225 01 00 00 00', city: 'Abidjan', avatar: 'AY', role: 'admin', membership: 'premium', joinedAt: 'Janvier 2026', bookingsCount: 0, favoritesCount: 0 },
  { id: 'partner-1', firstName: 'Aminata', lastName: 'Koné', email: 'partner@ayoka.ci', phone: '+225 07 12 34 56', city: 'Abidjan', avatar: 'AK', role: 'partner', membership: 'premium', joinedAt: 'Janvier 2026', bookingsCount: 8, favoritesCount: 12, businessName: 'African Tours CI', category: 'Tour Opérateur', verified: true, blocked: false },
];
