# AYOKA CI - BACKEND

Backend complet de la plateforme AYOKA CI, utilisant Supabase (PostgreSQL + Auth + Storage + Edge Functions).

## 📁 STRUCTURE

```
backend/
├── supabase/
│   ├── schema.sql                    # Schéma PostgreSQL complet
│   └── functions/
│       ├── _shared/
│       │   └── index.ts              # Utilitaires partagés
│       ├── auth/
│       │   └── index.ts              # Authentification
│       ├── destinations/
│       │   └── index.ts              # Gestion des destinations
│       ├── services/
│       │   └── index.ts              # Gestion des services
│       ├── bookings/
│       │   └── index.ts              # Gestion des réservations
│       ├── itineraries/
│       │   └── index.ts              # Gestion des itinéraires
│       ├── admin/
│       │   └── index.ts              # Admin & monitoring
│       ├── notifications/
│       │   └── index.ts              # Notifications
│       └── ai/
│           └── index.ts              # Assistant IA (Gemini)
├── API_DOCUMENTATION.md              # Documentation API complète
└── DEPLOYMENT_GUIDE.md               # Guide de déploiement
```

## 🚀 TECHNOLOGIES

- **Base de données**: PostgreSQL (Supabase)
- **Authentification**: Supabase Auth + JWT
- **API**: Supabase Edge Functions (Deno)
- **IA**: Google Gemini API
- **Sécurité**: Row Level Security (RLS)
- **Storage**: Supabase Storage

## 📋 FONCTIONNALITÉS

### Authentification
- Inscription (user, partner, admin)
- Connexion / Déconnexion
- Réinitialisation mot de passe
- Gestion des tokens JWT

### Destinations
- Liste des destinations avec pagination
- Recherche et filtres
- CRUD (Admin only)
- Informations détaillées

### Services
- Liste des services (hôtels, activités, restaurants, transport, tours)
- Filtres par type, destination, prix
- CRUD pour les partenaires
- Validation par admin

### Réservations
- Création de réservations
- Workflow (pending → confirmed → completed/cancelled)
- Gestion par utilisateurs et partenaires
- Notifications automatiques

### Itinéraires
- Génération d'itinéraires
- Gestion des activités par jour
- CRUD pour les utilisateurs
- Planification personnalisée

### Admin
- Gestion des partenaires (vérification, blocage)
- Gestion des utilisateurs
- Analytics et statistiques
- Monitoring de la plateforme
- Logs système

### Notifications
- Notifications en temps réel
- Marquer comme lu/non lu
- Types: réservation, système, message
- Bulk actions

### IA (Assistant Voyage)
- Chat avec mémoire conversationnelle
- Conversion de devises
- Informations destinations
- Recommandations personnalisées
- Génération de suggestions

## 🔒 SÉCURITÉ

- **Row Level Security (RLS)**: Isolation des données par rôle
- **JWT Tokens**: Authentification sécurisée
- **Role-based Access Control**: user, partner, admin
- **CORS**: Configuration des origines autorisées
- **Rate Limiting**: Protection contre abus
- **Input Validation**: Validation des données

## 📊 BASE DE DONNÉES

### Tables principales
- `users` - Utilisateurs
- `profiles` - Profils utilisateurs
- `partners` - Partenaires
- `destinations` - Destinations touristiques
- `services` - Services (hôtels, activités, etc.)
- `bookings` - Réservations
- `payments` - Paiements
- `itineraries` - Itinéraires de voyage
- `itinerary_items` - Activités d'itinéraire
- `notifications` - Notifications
- `reviews` - Avis
- `messages` - Messages
- `admin_logs` - Logs admin
- `ai_conversations` - Conversations IA
- `ai_messages` - Messages IA

### Enums
- `user_role`: user, partner, admin
- `service_type`: hotel, activity, restaurant, transport, tour
- `booking_status`: pending, confirmed, completed, cancelled
- `payment_status`: pending, paid, refunded, failed
- `notification_type`: reservation, system, message, review

## 📖 DOCUMENTATION

- **API Documentation**: Voir `API_DOCUMENTATION.md`
- **Déploiement**: Voir `DEPLOYMENT_GUIDE.md`
- **Schéma DB**: Voir `supabase/schema.sql`

## 🛠️ DÉVELOPPEMENT LOCAL

### Prérequis
- Node.js 18+
- Supabase CLI
- Compte Supabase

### Installation

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lancer le stack local
supabase start
```

### Déploiement des functions

```bash
# Déployer toutes les functions
supabase functions deploy auth
supabase functions deploy destinations
supabase functions deploy services
supabase functions deploy bookings
supabase functions deploy itineraries
supabase functions deploy admin
supabase functions deploy notifications
supabase functions deploy ai
```

### Variables d'environnement

```bash
GEMINI_API_KEY=your-gemini-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
APP_URL=http://localhost:3000
```

## 🧪 TESTING

```bash
# Tester une function localement
supabase functions serve

# Voir les logs
supabase functions logs --follow

# Tester avec curl
curl -X POST http://localhost:54321/functions/v1/auth/register \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","role":"user"}'
```

## 📦 DÉPLOIEMENT

Voir le guide complet dans `DEPLOYMENT_GUIDE.md`

### Étapes rapides

1. Créer un projet Supabase
2. Exécuter `schema.sql`
3. Configurer les environment variables
4. Déployer les Edge Functions
5. Configurer Auth et Storage
6. Tester les endpoints

## 🔗 ENDPOINTS

### Base URL
```
Production: https://your-project.supabase.co/functions/v1
Development: http://localhost:54321/functions/v1
```

### Endpoints principaux
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/me` - Profil utilisateur
- `GET /destinations` - Liste destinations
- `GET /services` - Liste services
- `POST /bookings` - Créer réservation
- `POST /itineraries/generate` - Générer itinéraire
- `GET /admin/analytics` - Stats admin
- `GET /notifications` - Notifications
- `POST /ai/chat` - Chat IA

## 💡 EXEMPLES D'UTILISATION

### Inscription
```typescript
const { data, error } = await supabase.functions.invoke('auth', {
  body: {
    email: 'user@example.com',
    password: 'password123',
    firstName: 'Jean',
    lastName: 'Kouassi',
    role: 'user'
  }
})
```

### Liste des destinations
```typescript
const { data, error } = await supabase.functions.invoke('destinations', {
  query: { page: 1, limit: 20, region: 'Sud' }
})
```

### Chat IA
```typescript
const { data, error } = await supabase.functions.invoke('ai', {
  body: {
    message: 'Quelles sont les destinations populaires?'
  }
})
```

## 📈 MONITORING

- **Supabase Dashboard**: Monitoring en temps réel
- **Logs**: Disponibles dans Edge Functions → Logs
- **Analytics**: Stats d'utilisation et performance

## 🆘 SUPPORT

- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Gemini API Docs](https://ai.google.dev/docs)

## 📝 LICENCE

Propriété de AYOKA CI - Tous droits réservés.

---

**Développé avec ❤️ pour le tourisme en Côte d'Ivoire**
