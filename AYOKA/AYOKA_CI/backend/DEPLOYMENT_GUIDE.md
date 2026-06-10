# AYOKA CI - GUIDE DE DÉPLOIEMENT

## 🚀 DÉPLOIEMENT SUPABASE

### ÉTAPE 1: CRÉER UN PROJET SUPABASE

1. Aller sur [https://supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Choisir la région la plus proche (Afrique du Sud ou Europe)
4. Attendre le déploiement (2-3 minutes)

---

### ÉTAPE 2: CONFIGURER LA BASE DE DONNÉES

1. Ouvrir le SQL Editor dans Supabase
2. Copier le contenu de `backend/supabase/schema.sql`
3. Exécuter le script SQL
4. Vérifier que toutes les tables sont créées

**Commande CLI alternative:**
```bash
supabase db push
```

---

### ÉTAPE 3: CONFIGURER LES ENVIRONNEMENT VARIABLES

Dans le dashboard Supabase → Settings → Edge Functions:

```bash
GEMINI_API_KEY=AIzaSyDMD5jpfuYtbLBnP_tz6HZLO_UUXhg1JnI
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
APP_URL=https://your-app-url.com
```

---

### ÉTAPE 4: DÉPLOYER LES EDGE FUNCTIONS

**Option A: Via CLI (Recommandé)**

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter au projet
supabase login
supabase link --project-ref your-project-ref

# Déployer les functions
supabase functions deploy auth
supabase functions deploy destinations
supabase functions deploy services
supabase functions deploy bookings
supabase functions deploy itineraries
supabase functions deploy admin
supabase functions deploy notifications
supabase functions deploy ai
```

**Option B: Via Dashboard**

1. Aller dans Edge Functions dans Supabase
2. Créer une nouvelle fonction pour chaque endpoint
3. Copier le code depuis `backend/supabase/functions/`
4. Déployer

---

### ÉTAPE 5: CONFIGURER L'AUTHENTIFICATION

Dans Supabase → Authentication → Settings:

1. **Email Provider**: Activer
2. **Email Templates**: Configurer les templates de confirmation
3. **URL de redirection**: Ajouter vos URLs (web + mobile)
4. **JWT Settings**: Configurer l'expiration (7 jours recommandé)

---

### ÉTAPE 6: CONFIGURER LE STORAGE

1. Créer un bucket "services-images"
2. Créer un bucket "avatars"
3. Créer un bucket "documents"
4. Configurer les policies RLS pour chaque bucket

**Policy example:**
```sql
-- Public read for services images
CREATE POLICY "Public read services images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'services-images');

-- Authenticated users can upload
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

### ÉTAPE 7: CONFIGURER REALTIME (OPTIONNEL)

Pour les notifications en temps réel:

1. Activer Realtime dans Supabase
2. Activer les tables: notifications, messages, bookings
3. Configurer les permissions

---

### ÉTAPE 8: TESTER LES ENDPOINTS

**Tester l'auth:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth/register \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "user"
  }'
```

**Tester les destinations:**
```bash
curl https://your-project.supabase.co/functions/v1/destinations
```

**Tester l'IA:**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/ai/chat \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Bonjour, quelles sont les destinations populaires?"
  }'
```

---

## 🔧 CONFIGURATION WEB + MOBILE

### WEB (React + Vite)

Créer un fichier `.env`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-web-app.com
```

Installer Supabase client:
```bash
npm install @supabase/supabase-js
```

Configuration dans `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

### MOBILE (React Native + Expo)

Créer un fichier `.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Installer Supabase client:
```bash
npm install @supabase/supabase-js
```

Configuration dans `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
```

---

## 📊 MONITORING

### Supabase Dashboard

1. **Database**: Monitoring des requêtes, lenteurs
2. **Auth**: Connexions, inscriptions
3. **Storage**: Utilisation, bandwidth
4. **Edge Functions**: Logs, erreurs, latence

### Logs

Les logs sont disponibles dans:
- Supabase Dashboard → Edge Functions → Logs
- Via CLI: `supabase functions logs`

### Alerts

Configurer des alerts pour:
- Erreurs > 10/heure
- Latence > 2s
- Utilisation CPU > 80%

---

## 🔒 SÉCURITÉ

### 1. RLS (Row Level Security)

Déjà configuré dans `schema.sql`. Vérifier:
- Les policies sont activées
- Les permissions sont correctes

### 2. API Keys

- **Anon Key**: Pour les clients (public)
- **Service Role Key**: Pour les edge functions (secret)
- **Jamais exposer la Service Role Key côté client**

### 3. Rate Limiting

Supabase inclut un rate limiting par défaut. Configurer:
- 100 req/min par utilisateur
- 1000 req/min par IP

### 4. CORS

Déjà configuré dans les edge functions. Ajouter vos domaines:
```typescript
'Access-Control-Allow-Origin': 'https://your-domain.com'
```

---

## 💰 COÛTS

### Supabase (Free Tier)

- **Database**: 500MB
- **Auth**: Illimité
- **Storage**: 1GB
- **Edge Functions**: 500k invocations/mois
- **Bandwidth**: 2GB/mois

### Estimation Production

- **Pro Plan**: $25/mois
  - Database: 8GB
  - Storage: 100GB
  - Edge Functions: 50k invocations/mois
  - Bandwidth: 50GB/mois

### Coûts additionnels

- **Gemini API**: Gratuit jusqu'à 60 req/min
- **Domaine**: ~$10/an
- **SSL**: Gratuit (Let's Encrypt)

---

## 🔄 MISES À JOUR

### Mise à jour du schéma

```bash
# Modifier schema.sql
supabase db diff -f new_migration.sql
supabase db push
```

### Mise à jour des functions

```bash
# Modifier le code
supabase functions deploy <function-name>
```

---

## 🧪 TESTING

### Tests unitaires

Créer des tests pour chaque endpoint:

```typescript
import { describe, it, expect } from 'vitest'
import { supabase } from './lib/supabase'

describe('Auth', () => {
  it('should register a user', async () => {
    const { data, error } = await supabase.functions.invoke('auth', {
      body: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    })
    expect(error).toBeNull()
    expect(data.user).toBeDefined()
  })
})
```

### Tests d'intégration

Utiliser Supabase local:

```bash
supabase start
# Tester sur http://localhost:54321
supabase stop
```

---

## 📚 DOCUMENTATION

- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🆘 SUPPORT

### Problèmes courants

1. **Functions timeout**: Augmenter le timeout dans `supabase/config.toml`
2. **CORS errors**: Vérifier les headers CORS
3. **RLS blocking**: Vérifier les policies dans le dashboard
4. **Gemini API error**: Vérifier la clé API et le quota

### Debug

```bash
# Voir les logs en temps réel
supabase functions logs --follow

# Vérifier la connexion DB
supabase db connect

# Tester une function localement
supabase functions serve
```

---

## ✅ CHECKLIST DÉPLOIEMENT

- [ ] Projet Supabase créé
- [ ] Schéma SQL exécuté
- [ ] Environment variables configurées
- [ ] Edge functions déployées
- [ ] Auth configuré
- [ ] Storage configuré
- [ ] Realtime activé (optionnel)
- [ ] Endpoints testés
- [ ] Web configuré
- [ ] Mobile configuré
- [ ] Monitoring configuré
- [ ] Alerts configurées
- [ ] Documentation mise à jour

---

## 🎯 PROCHAINES ÉTAPES

1. **Intégration paiement**: Wave, Orange Money, MTN
2. **Notifications push**: Firebase Cloud Messaging
3. **Email transactionnel**: SendGrid ou Resend
4. **Analytics**: Mixpanel ou Amplitude
5. **Monitoring avancé**: Sentry pour les erreurs

---

## 📞 CONTACT

Pour toute question sur le déploiement:
- Documentation Supabase: https://supabase.com/docs
- Support: https://supabase.com/support
