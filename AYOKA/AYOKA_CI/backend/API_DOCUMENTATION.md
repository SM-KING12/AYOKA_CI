# AYOKA CI - API DOCUMENTATION

## 🌍 BASE URL

```
Production: https://your-project.supabase.co/functions/v1
Development: http://localhost:54321/functions/v1
```

## 🔐 AUTHENTICATION

Toutes les requêtes (sauf login/register) nécessitent un header Authorization:

```
Authorization: Bearer <token>
```

---

## 📋 ENDPOINTS

### AUTHENTICATION

#### POST /auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Kouassi",
  "phone": "+225 07 12 34 56",
  "city": "Abidjan",
  "role": "user" // "user", "partner", "admin"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user"
  },
  "message": "Registration successful"
}
```

---

#### POST /auth/login
Connexion utilisateur

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "token",
    "refresh_token": "token"
  },
  "role": "user"
}
```

---

#### GET /auth/me
Récupérer les informations de l'utilisateur connecté

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "Jean",
  "last_name": "Kouassi",
  "role": "user",
  "profiles": {},
  "partners": null
}
```

---

#### POST /auth/logout
Déconnexion

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

#### POST /auth/forgot-password
Demande de réinitialisation de mot de passe

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

---

#### POST /auth/reset-password
Réinitialisation du mot de passe

**Body:**
```json
{
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

### DESTINATIONS

#### GET /destinations
Liste des destinations

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `region` (string, optional)
- `search` (string, optional)
- `featured` (boolean, optional)

**Response (200):**
```json
{
  "destinations": [
    {
      "id": "uuid",
      "name": "Assinie",
      "slug": "assinie",
      "description": "Station balnéaire...",
      "region": "Sud-Est",
      "highlights": ["Lagune d'Assinie", "Plages"],
      "rating": 4.5,
      "is_featured": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

#### GET /destinations/:id
Détails d'une destination

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Assinie",
  "description": "...",
  "services": [
    {
      "id": "uuid",
      "name": "Hotel Assinie",
      "type": "hotel",
      "price": 50000,
      "rating": 4.5
    }
  ]
}
```

---

#### POST /destinations (Admin only)
Créer une nouvelle destination

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "name": "Nouvelle Destination",
  "slug": "nouvelle-destination",
  "description": "Description...",
  "region": "Sud",
  "highlights": ["Highlight 1", "Highlight 2"],
  "best_season": "Novembre à mars",
  "budget_level": "moderate"
}
```

---

#### PUT /destinations/:id (Admin only)
Modifier une destination

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

#### DELETE /destinations/:id (Admin only)
Désactiver une destination

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

### SERVICES

#### GET /services
Liste des services

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `type` (string: hotel, activity, restaurant, transport, tour)
- `destination` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)
- `search` (string, optional)

**Response (200):**
```json
{
  "services": [
    {
      "id": "uuid",
      "name": "Hotel Assinie",
      "type": "hotel",
      "price": 50000,
      "price_unit": "FCFA/nuit",
      "rating": 4.5,
      "partners": {
        "business_name": "African Tours CI",
        "rating": 4.7,
        "verified": true
      },
      "destinations": {
        "name": "Assinie",
        "region": "Sud-Est"
      }
    }
  ],
  "pagination": { ... }
}
```

---

#### GET /services/:id
Détails d'un service

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Hotel Assinie",
  "type": "hotel",
  "description": "...",
  "price": 50000,
  "partners": { ... },
  "destinations": { ... },
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Excellent!",
      "created_at": "2026-06-10"
    }
  ]
}
```

---

#### POST /partner/services (Partner only)
Créer un nouveau service

**Headers:**
```
Authorization: Bearer <partner_token>
```

**Body:**
```json
{
  "name": "Mon Service",
  "type": "hotel",
  "destination_id": "uuid",
  "description": "Description...",
  "price": 50000,
  "price_unit": "FCFA/nuit",
  "capacity": 10,
  "images": ["url1", "url2"],
  "amenities": ["WiFi", "Pool"]
}
```

---

#### PUT /partner/services/:id (Partner only)
Modifier un service

**Headers:**
```
Authorization: Bearer <partner_token>
```

---

#### DELETE /partner/services/:id (Partner only)
Archiver un service

**Headers:**
```
Authorization: Bearer <partner_token>
```

---

#### PATCH /partner/services/:id/status (Partner only)
Changer le statut d'un service

**Headers:**
```
Authorization: Bearer <partner_token>
```

**Body:**
```json
{
  "status": "active" // draft, active, paused, archived
}
```

---

### BOOKINGS

#### POST /bookings (User only)
Créer une réservation

**Headers:**
```
Authorization: Bearer <user_token>
```

**Body:**
```json
{
  "serviceId": "uuid",
  "guestName": "Jean Kouassi",
  "guestEmail": "jean@example.com",
  "guestPhone": "+225 07 12 34 56",
  "guestCount": 2,
  "startDate": "2026-07-01",
  "endDate": "2026-07-03",
  "totalPrice": 150000,
  "specialRequests": "Vue sur mer"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "service_id": "uuid",
  "partner_id": "uuid",
  "guest_name": "Jean Kouassi",
  "guest_count": 2,
  "total_price": 150000,
  "status": "pending",
  "payment_status": "pending",
  "services": { ... },
  "partners": { ... }
}
```

---

#### GET /bookings/user (User only)
Liste des réservations de l'utilisateur

**Headers:**
```
Authorization: Bearer <user_token>
```

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional: pending, confirmed, completed, cancelled)

**Response (200):**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "status": "confirmed",
      "total_price": 150000,
      "services": { ... },
      "partners": { ... },
      "payments": { ... }
    }
  ],
  "pagination": { ... }
}
```

---

#### GET /partner/bookings (Partner only)
Liste des réservations du partenaire

**Headers:**
```
Authorization: Bearer <partner_token>
```

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional)

---

#### GET /bookings/:id
Détails d'une réservation

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "status": "confirmed",
  "services": { ... },
  "partners": { ... },
  "users": { ... },
  "payments": { ... }
}
```

---

#### PATCH /bookings/:id/status (Partner only)
Modifier le statut d'une réservation

**Headers:**
```
Authorization: Bearer <partner_token>
```

**Body:**
```json
{
  "status": "confirmed",
  "cancellationReason": "..." // si status = cancelled
}
```

---

#### DELETE /bookings/:id (User only)
Annuler une réservation

**Headers:**
```
Authorization: Bearer <user_token>
```

---

### ITINERARIES

#### POST /itineraries/generate (User only)
Générer un itinéraire

**Headers:**
```
Authorization: Bearer <user_token>
```

**Body:**
```json
{
  "destination": "Assinie",
  "startDate": "2026-07-01",
  "endDate": "2026-07-07",
  "budget": 500000,
  "travelers": 2,
  "name": "Voyage à Assinie",
  "interests": ["Plage", "Nature"]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Voyage à Assinie",
  "destination": "Assinie",
  "start_date": "2026-07-01",
  "end_date": "2026-07-07",
  "budget": 500000,
  "status": "draft"
}
```

---

#### GET /itineraries/user (User only)
Liste des itinéraires de l'utilisateur

**Headers:**
```
Authorization: Bearer <user_token>
```

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional)

---

#### GET /itineraries/:id
Détails d'un itinéraire

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Voyage à Assinie",
  "itinerary_items": [
    {
      "id": "uuid",
      "day_number": 1,
      "date": "2026-07-01",
      "activity_name": "Arrivée",
      "time": "10:00",
      "services": { ... }
    }
  ]
}
```

---

#### PUT /itineraries/:id (User only)
Modifier un itinéraire

**Headers:**
```
Authorization: Bearer <user_token>
```

---

#### DELETE /itineraries/:id (User only)
Supprimer un itinéraire

**Headers:**
```
Authorization: Bearer <user_token>
```

---

#### POST /itineraries/:id/items (User only)
Ajouter une activité à un itinéraire

**Headers:**
```
Authorization: Bearer <user_token>
```

**Body:**
```json
{
  "dayNumber": 1,
  "date": "2026-07-01",
  "serviceId": "uuid",
  "activityName": "Visite lagune",
  "activityType": "activity",
  "time": "10:00",
  "duration": 120,
  "price": 15000
}
```

---

#### PUT /itinerary-items/:id (User only)
Modifier une activité

**Headers:**
```
Authorization: Bearer <user_token>
```

---

#### DELETE /itinerary-items/:id (User only)
Supprimer une activité

**Headers:**
```
Authorization: Bearer <user_token>
```

---

### ADMIN

#### GET /admin/partners (Admin only)
Liste des partenaires

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string: verified, blocked)
- `search` (string, optional)

---

#### PATCH /admin/partners/:id/verify (Admin only)
Vérifier un partenaire

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

#### PATCH /admin/partners/:id/block (Admin only)
Bloquer/Débloquer un partenaire

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "blocked": true
}
```

---

#### GET /admin/users (Admin only)
Liste des utilisateurs

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `role` (string: user, partner, admin)
- `search` (string, optional)

---

#### GET /admin/analytics (Admin only)
Statistiques de la plateforme

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Params:**
- `period` (string: 7d, 30d, 90d, default: 7d)

**Response (200):**
```json
{
  "period": "7d",
  "stats": {
    "totalUsers": 150,
    "totalPartners": 25,
    "totalBookings": 89,
    "totalRevenue": 4500000
  },
  "recentBookings": [ ... ]
}
```

---

#### GET /admin/monitoring (Admin only)
Monitoring de la plateforme

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "health": {
    "activeServices": 150,
    "pendingBookings": 12,
    "unverifiedPartners": 5
  },
  "recentLogs": [ ... ]
}
```

---

#### GET /admin/services (Admin only)
Liste de tous les services

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional)

---

#### PATCH /admin/services/:id/status (Admin only)
Modifier le statut d'un service

**Headers:**
```
Authorization: Bearer <admin_token>
```

---

### NOTIFICATIONS

#### GET /notifications
Liste des notifications de l'utilisateur

**Headers:**
```
Authorization: Bearer <token>
```

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `unreadOnly` (boolean, optional)

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "reservation",
      "title": "Nouvelle réservation",
      "message": "Vous avez une nouvelle réservation",
      "is_read": false,
      "created_at": "2026-06-10T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

#### GET /notifications/unread-count
Nombre de notifications non lues

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "unreadCount": 5
}
```

---

#### PATCH /notifications/:id/read
Marquer une notification comme lue

**Headers:**
```
Authorization: Bearer <token>
```

---

#### PATCH /notifications/read-all
Marquer toutes les notifications comme lues

**Headers:**
```
Authorization: Bearer <token>
```

---

#### DELETE /notifications/:id
Supprimer une notification

**Headers:**
```
Authorization: Bearer <token>
```

---

#### POST /notifications (Admin only)
Envoyer une notification

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Body:**
```json
{
  "userId": "uuid",
  "type": "system",
  "title": "Notification système",
  "message": "Message de notification",
  "data": {}
}
```

---

### AI CHAT

#### POST /ai/chat
Envoyer un message à l'IA

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "message": "Quelles sont les destinations populaires?",
  "conversationId": "uuid" // optional
}
```

**Response (200):**
```json
{
  "response": "Les destinations populaires en Côte d'Ivoire sont...",
  "conversationId": "uuid",
  "suggestions": ["Voir Assinie", "Voir Grand-Bassam", "Planifier un voyage"],
  "actions": []
}
```

---

#### GET /ai/conversations
Liste des conversations IA

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "title": "Voyage à Assinie",
      "created_at": "2026-06-10",
      "ai_messages": [
        {
          "role": "user",
          "content": "...",
          "created_at": "..."
        }
      ]
    }
  ]
}
```

---

#### GET /ai/conversations/:id
Détails d'une conversation

**Headers:**
```
Authorization: Bearer <token>
```

---

#### DELETE /ai/conversations/:id
Supprimer une conversation

**Headers:**
```
Authorization: Bearer <token>
```

---

## 🔒 ERROR RESPONSES

Toutes les erreurs suivent ce format:

```json
{
  "error": "Error message"
}
```

**Codes d'erreur:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📊 PAGINATION

Tous les endpoints de liste supportent la pagination:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 🔍 FILTRES

Les filtres sont passés en query params:

```
?status=active&type=hotel&minPrice=10000&maxPrice=50000
```

---

## 🚀 RATE LIMITING

- 100 requêtes/minute par utilisateur
- 1000 requêtes/minute par IP

---

## 📝 NOTES

- Tous les prix sont en XOF (Franc CFA)
- Toutes les dates sont en ISO 8601 format
- Les IDs sont des UUIDs
- L'authentification utilise JWT tokens de Supabase
