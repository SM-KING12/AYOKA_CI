import type { AdminStats, AdminBooking, Notification, SearchHistoryEntry, Itinerary } from '../types';

export const mockAdminStats: AdminStats = {
  users: { total: 12482, growth: 14 },
  bookings: { total: 3247, growth: 22 },
  revenue: { total: '142M FCFA', growth: 18 },
  rating: { average: 4.8, growth: 0.2 },
};

export const mockAdminBookings: AdminBooking[] = [
  { id: 'BK-001', user: 'Aminata Koné', destination: 'Grand-Bassam', date: '15 Mars 2026', amount: '150K FCFA', status: 'confirmed' },
  { id: 'BK-002', user: 'Jean-Pierre Martin', destination: 'Parc de Taï', date: '12 Mars 2026', amount: '250K FCFA', status: 'pending' },
  { id: 'BK-003', user: 'Sophie Laurent', destination: 'Assinie-Mafia', date: '10 Mars 2026', amount: '350K FCFA', status: 'confirmed' },
  { id: 'BK-004', user: 'Moussa Diabaté', destination: 'Basilique de Yamoussoukro', date: '8 Mars 2026', amount: '50K FCFA', status: 'cancelled' },
  { id: 'BK-005', user: 'Fatou Bamba', destination: 'Mont Tonkoui', date: '5 Mars 2026', amount: '200K FCFA', status: 'confirmed' },
  { id: 'BK-006', user: 'Kouadio Yao', destination: 'Lagune Ébrié', date: '3 Mars 2026', amount: '100K FCFA', status: 'pending' },
  { id: 'BK-007', user: 'Marie Coulibaly', destination: 'Assinie-Mafia', date: '1 Mars 2026', amount: '280K FCFA', status: 'confirmed' },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Réservation confirmée',
    message: 'Votre réservation pour Grand-Bassam du 15-17 Mars est confirmée.',
    read: false,
    createdAt: 'Il y a 2h',
    actionUrl: '/reservations',
  },
  {
    id: 'n2',
    type: 'ai',
    title: 'Nouvelle suggestion IA',
    message: 'Basé sur vos recherches, l\'IA vous recommande le Parc de Taï. Découvrez pourquoi !',
    read: false,
    createdAt: 'Il y a 5h',
    actionUrl: '/assistant',
  },
  {
    id: 'n3',
    type: 'promotion',
    title: 'Offre spéciale Assinie',
    message: '-20% sur les séjours à Assinie-Mafia cette semaine. Réservez maintenant !',
    read: true,
    createdAt: 'Il y a 1j',
    actionUrl: '/explorer',
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Bienvenue sur AYOKA CI',
    message: 'Votre compte a été créé avec succès. Explorez les destinations !',
    read: true,
    createdAt: 'Il y a 3j',
    actionUrl: '/explorer',
  },
  {
    id: 'n5',
    type: 'booking',
    title: 'Rappel de voyage',
    message: 'Votre voyage à Assinie commence dans 3 jours. Préparez vos bagages !',
    read: false,
    createdAt: 'Il y a 4h',
    actionUrl: '/reservations',
  },
  {
    id: 'n6',
    type: 'promotion',
    title: 'Festival des Masques',
    message: 'Le Festival des Masques de Man approche ! Réservez votre itinéraire culturel.',
    read: true,
    createdAt: 'Il y a 2j',
    actionUrl: '/itineraires',
  },
];

export const mockSearchHistory: SearchHistoryEntry[] = [
  { id: 'sh1', query: 'Plages Abidjan', timestamp: 'Il y a 2h', results: 5 },
  { id: 'sh2', query: 'Hôtels Grand-Bassam', timestamp: 'Il y a 5h', results: 8 },
  { id: 'sh3', query: 'Parc national Taï', timestamp: 'Hier', results: 3 },
  { id: 'sh4', query: 'Restaurant Plateau', timestamp: 'Hier', results: 12 },
  { id: 'sh5', query: 'Randonnée Man', timestamp: 'Il y a 2j', results: 4 },
];

export const mockSavedItineraries: Itinerary[] = [
  {
    id: 'itin-1',
    name: 'Week-end à Grand-Bassam',
    destination: 'Grand-Bassam',
    days: [
      {
        day: 1,
        title: 'Histoire & Patrimoine',
        activities: [
          { time: '09:00', name: 'Quartier Colonial', description: 'Visite guidée UNESCO', location: 'Grand-Bassam', duration: '3h', cost: 5000 },
          { time: '13:00', name: 'Déjeuner lagune', description: 'Restaurant vue lagune', location: 'Grand-Bassam', duration: '1h30', cost: 8000 },
          { time: '15:00', name: 'Musée du Costume', description: 'Traditions vestimentaires', location: 'Grand-Bassam', duration: '1h30', cost: 2000 },
        ],
      },
      {
        day: 2,
        title: 'Plage & Artisanat',
        activities: [
          { time: '08:00', name: 'Baignade matinale', description: 'Plage tranquille', location: 'Grand-Bassam', duration: '2h', cost: 0 },
          { time: '10:30', name: 'Atelier artisanal', description: 'Tissage et poterie', location: 'Grand-Bassam', duration: '2h', cost: 8000 },
          { time: '13:00', name: 'Fruits de mer', description: 'Crevettes et poisson', location: 'Grand-Bassam', duration: '1h30', cost: 10000 },
        ],
      },
    ],
    totalBudget: 33000,
    createdAt: '10 Mars 2026',
    isSaved: true,
  },
  {
    id: 'itin-2',
    name: 'Escapade Abidjan 3 jours',
    destination: 'Abidjan',
    days: [
      {
        day: 1,
        title: 'Abidjan Discovery',
        activities: [
          { time: '09:00', name: 'Marché de Cocody', description: 'Tissus wax et artisanat', location: 'Cocody', duration: '2h', cost: 0 },
          { time: '12:00', name: 'Maquis du Plateau', description: 'Attiéké et poisson', location: 'Plateau', duration: '1h30', cost: 5000 },
          { time: '14:30', name: 'Croisière Lagune', description: 'Vue sur le Plateau', location: 'Zone 4', duration: '2h', cost: 10000 },
        ],
      },
    ],
    totalBudget: 15000,
    createdAt: '5 Mars 2026',
    isSaved: true,
  },
];
