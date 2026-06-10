// ============================================================
// TYPES/INDEX.TS - DÉFINITIONS DES TYPES
// ============================================================
// Ce fichier définit tous les types TypeScript utilisés dans l'application.
// Il contient les interfaces pour l'authentification, les partenaires,
// les administrateurs, les voyageurs et la navigation.
//
// Organisation:
// - Auth & Role types: Types d'authentification et rôles utilisateurs
// - Partner domain types: Types spécifiques aux partenaires
// - Admin types: Types spécifiques aux administrateurs
// - Navigation route types: Types pour la navigation
// - Traveler domain types: Types spécifiques aux voyageurs
// ============================================================

// ── AUTH & ROLE TYPES ──
// ============================================================
// Types d'authentification partagés avec l'application web
// ============================================================

/**
 * Rôles utilisateurs dans l'application
 * - admin: Administrateur avec accès complet
 * - partner: Partenaire offrant des services
 * - traveler: Voyageur utilisant les services
 */
export type UserRole = 'admin' | 'partner' | 'traveler';

/**
 * Interface définissant un utilisateur authentifié
 * Contient les informations de base et les métadonnées
 */
export interface AuthUser {
  id: string; // Identifiant unique
  firstName: string; // Prénom
  lastName: string; // Nom
  email: string; // Email
  phone: string; // Téléphone
  city: string; // Ville
  avatar: string; // Avatar (initiales ou image)
  role: UserRole; // Rôle utilisateur
  membership: 'standard' | 'premium'; // Type d'adhésion
  joinedAt: string; // Date d'inscription
  bookingsCount: number; // Nombre de réservations
  favoritesCount: number; // Nombre de favoris
  businessName?: string; // Nom de l'entreprise (partenaires)
  category?: string; // Catégorie (partenaires)
  verified?: boolean; // Statut de vérification
  blocked?: boolean; // Statut de blocage
}

// ── PARTNER DOMAIN TYPES ──
// ============================================================
// Types spécifiques aux partenaires (services, réservations, profil, etc.)
// ============================================================

/**
 * Interface définissant un service partenaire
 * Représente un service offert par un partenaire (tour, hôtel, restaurant, etc.)
 */
export interface PartnerService {
  id: string; // Identifiant unique
  name: string; // Nom du service
  type: 'tour' | 'hotel' | 'restaurant' | 'transport' | 'activity'; // Type de service
  destination: string; // Destination
  price: number; // Prix
  priceUnit: string; // Unité de prix (FCFA, EUR, etc.)
  capacity: number; // Capacité maximale
  bookings: number; // Nombre de réservations
  rating: number; // Note moyenne
  status: 'active' | 'draft' | 'paused'; // Statut du service
  image: string; // URL de l'image
  description: string; // Description du service
}

/**
 * Interface définissant une réservation partenaire
 * Représente une réservation faite par un voyageur
 */
export interface PartnerBooking {
  id: string; // Identifiant unique
  guestName: string; // Nom du client
  guestAvatar: string; // Avatar du client
  serviceName: string; // Nom du service réservé
  serviceType: PartnerService['type']; // Type de service
  date: string; // Date de la réservation
  guests: number; // Nombre de personnes
  amount: number; // Montant total
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'; // Statut
  notes: string; // Notes additionnelles
}

/**
 * Interface définissant le profil d'un partenaire
 * Contient les informations professionnelles et statistiques
 */
export interface PartnerProfile {
  businessName: string; // Nom de l'entreprise
  ownerName: string; // Nom du propriétaire
  email: string; // Email professionnel
  phone: string; // Téléphone professionnel
  city: string; // Ville
  avatar: string; // Avatar
  category: string; // Catégorie d'activité
  description: string; // Description de l'entreprise
  rating: number; // Note moyenne
  reviewCount: number; // Nombre d'avis
  completedBookings: number; // Réservations complétées
  revenue: number; // Revenus totaux
  joinedAt: string; // Date d'inscription
  verified: boolean; // Statut de vérification
}

/**
 * Interface définissant une statistique partenaire
 * Utilisée pour afficher les statistiques sur le dashboard
 */
export interface PartnerStat {
  label: string; // Libellé de la statistique
  value: string | number; // Valeur de la statistique
  change: number; // Changement en pourcentage
  trend: 'up' | 'down' | 'stable'; // Tendance (hausse, baisse, stable)
}

/**
 * Interface définissant un message partenaire
 * Représente un message reçu par un partenaire
 */
export interface PartnerMessage {
  id: string; // Identifiant unique
  sender: string; // Nom de l'expéditeur
  senderAvatar: string; // Avatar de l'expéditeur
  content: string; // Contenu du message
  timestamp: string; // Horodatage
  read: boolean; // Statut de lecture
  conversationId: string; // Identifiant de la conversation
}

/**
 * Interface définissant un avis client
 * Représente un avis laissé par un client
 */
export interface PartnerReview {
  id: string; // Identifiant unique
  author: string; // Nom de l'auteur
  avatar: string; // Avatar de l'auteur
  rating: number; // Note donnée
  date: string; // Date de l'avis
  comment: string; // Commentaire de l'avis
  serviceName: string; // Nom du service concerné
}

/**
 * Interface définissant un événement du calendrier partenaire
 * Représente un événement dans le calendrier (réservation, blocage, disponibilité)
 */
export interface PartnerCalendarEvent {
  id: string; // Identifiant unique
  title: string; // Titre de l'événement
  date: string; // Date de l'événement
  time: string; // Heure de l'événement
  type: 'booking' | 'block' | 'availability'; // Type d'événement
  guests: number; // Nombre de personnes
  status: PartnerBooking['status']; // Statut
}

/**
 * Interface définissant l'état global du partenaire
 * Contient toutes les données partenaire utilisées dans le contexte
 */
export interface PartnerState {
  services: PartnerService[]; // Liste des services
  bookings: PartnerBooking[]; // Liste des réservations
  profile: PartnerProfile; // Profil du partenaire
  stats: PartnerStat[]; // Statistiques
  messages: PartnerMessage[]; // Messages
  reviews: PartnerReview[]; // Avis clients
  calendarEvents: PartnerCalendarEvent[]; // Événements du calendrier
}

// ── ADMIN TYPES ──
// ============================================================
// Types spécifiques aux administrateurs (gestion des partenaires, notifications)
// ============================================================

/**
 * Interface définissant un partenaire dans la liste admin
 * Représente un partenaire tel qu'affiché dans l'interface admin
 */
export interface PartnerListItem {
  id: string; // Identifiant unique
  businessName: string; // Nom de l'entreprise
  ownerName: string; // Nom du propriétaire
  email: string; // Email
  avatar: string; // Avatar
  city: string; // Ville
  category: string; // Catégorie
  services: number; // Nombre de services
  bookings: number; // Nombre de réservations
  revenue: number; // Revenus
  rating: number; // Note
  verified: boolean; // Statut de vérification
  blocked: boolean; // Statut de blocage
  joinedAt: string; // Date d'inscription
}

/**
 * Interface définissant une notification admin
 * Représente une notification envoyée par l'admin
 */
export interface AdminNotification {
  id: string; // Identifiant unique
  type: 'info' | 'warning' | 'success' | 'alert'; // Type de notification
  title: string; // Titre
  message: string; // Message
  target: 'all' | 'partner' | string; // Cible (tous, partenaires, ou ID spécifique)
  read: boolean; // Statut de lecture
  createdAt: string; // Date de création
}

// ── NAVIGATION ROUTE TYPES ──
// ============================================================
// Types pour la navigation de l'application
// ============================================================

/**
 * Interface définissant une route de navigation
 * Utilisée pour configurer les routes de l'application
 */
export interface NavRoute {
  path: string; // Chemin de la route
  label: string; // Libellé affiché
  icon: string; // Icône (nom Ionicons)
  index?: boolean; // Route par défaut
}

// ── TRAVELER DOMAIN TYPES ──
// ============================================================
// Types spécifiques aux voyageurs (profil, réservations, plans de voyage)
// ============================================================

/**
 * Interface définissant un voyageur
 * Contient les informations personnelles et préférences de voyage
 */
export interface Traveler {
  id: string; // Identifiant unique
  firstName: string; // Prénom
  lastName: string; // Nom
  email: string; // Email
  phone: string; // Téléphone
  avatar: string; // Avatar
  language: string; // Langue préférée
  interests: string[]; // Centres d'intérêt
  travelPreferences: TravelPreferences; // Préférences de voyage
  createdAt: string; // Date de création du compte
}

/**
 * Interface définissant les préférences de voyage
 * Contient les préférences de voyage d'un voyageur
 */
export interface TravelPreferences {
  budget: number; // Budget voyage
  accommodationType: 'budget' | 'mid-range' | 'luxury'; // Type d'hébergement
  travelStyle: 'adventure' | 'relaxation' | 'cultural' | 'business'; // Style de voyage
  groupSize: number; // Taille du groupe
  dietaryRestrictions: string[]; // Restrictions alimentaires
}

/**
 * Interface définissant une réservation voyageur
 * Représente une réservation faite par un voyageur
 */
export interface TravelerReservation {
  id: string; // Identifiant unique
  travelerId: string; // ID du voyageur
  serviceId: string; // ID du service
  serviceName: string; // Nom du service
  serviceType: PartnerService['type']; // Type de service
  destination: string; // Destination
  startDate: string; // Date de début
  endDate: string; // Date de fin
  guests: number; // Nombre de personnes
  total: number; // Montant total
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; // Statut
  paymentStatus: 'pending' | 'paid' | 'refunded'; // Statut de paiement
  createdAt: string; // Date de création
}

/**
 * Interface définissant l'état global du voyageur
 * Contient toutes les données voyageur utilisées dans le contexte
 */
export interface TravelerState {
  profile: Traveler; // Profil du voyageur
  reservations: TravelerReservation[]; // Réservations
  favorites: PartnerService[]; // Favoris
  tripPlans: TripPlan[]; // Plans de voyage
  notifications: TravelerNotification[]; // Notifications
}

/**
 * Interface définissant un plan de voyage
 * Représente un itinéraire de voyage planifié par un voyageur
 */
export interface TripPlan {
  id: string; // Identifiant unique
  name: string; // Nom du plan
  destination: string; // Destination
  startDate: string; // Date de début
  endDate: string; // Date de fin
  budget: number; // Budget total
  days: TripDay[]; // Jours du voyage
  createdAt: string; // Date de création
}

/**
 * Interface définissant un jour de voyage
 * Représente un jour dans un plan de voyage
 */
export interface TripDay {
  day: number; // Numéro du jour
  date: string; // Date
  activities: PlannedActivity[]; // Activités planifiées
}

/**
 * Interface définissant une activité planifiée
 * Représente une activité spécifique dans un jour de voyage
 */
export interface PlannedActivity {
  id: string; // Identifiant unique
  serviceId: string; // ID du service
  serviceName: string; // Nom du service
  type: PartnerService['type']; // Type de service
  time: string; // Heure
  duration: number; // Durée (en minutes)
  price: number; // Prix
}

/**
 * Interface définissant une notification voyageur
 * Représente une notification reçue par un voyageur
 */
export interface TravelerNotification {
  id: string; // Identifiant unique
  type: 'reservation' | 'reminder' | 'ai' | 'promotion'; // Type de notification
  title: string; // Titre
  message: string; // Message
  read: boolean; // Statut de lecture
  createdAt: string; // Date de création
}
