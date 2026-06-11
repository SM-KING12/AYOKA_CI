// ============================================================
// AI CHAT ENDPOINT - SUPABASE EDGE FUNCTION
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.21.0';
import {
  corsHeaders,
  errorResponse,
  successResponse,
  createSupabaseClient,
  getUserFromAuth,
} from '../_shared/index.ts';

// Gemini API configuration
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') ?? '';
if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY manquante dans les variables d\'environnement');const GEMINI_MODEL = 'gemini-1.5-pro';

// System prompt for AYOKA AI
const AYOKA_SYSTEM_PROMPT = `
Tu es AYOKA, l'assistant touristique intelligent de la plateforme AYOKA CI en Côte d'Ivoire.

TON RÔLE:
- Aider les voyageurs à planifier leurs séjours en Côte d'Ivoire
- Fournir des recommandations personnalisées de destinations
- Aider à la réservation de services (hôtels, activités, restaurants)
- Convertir les devises (EUR, USD, GBP, CAD ↔ XOF)
- Estimer les budgets de voyage
- Créer des itinéraires personnalisés

TON STYLE:
- Amical et professionnel
- Concis et direct
- Toujours utile et orienté action
- Ne JAMAIS refuser de répondre
- Si tu ne sais pas, donne une réponse générale utile

INFORMATIONS SUR LA CÔTE D'IVOIRE:
Destinations populaires: Assinie, Grand-Bassam, Yamoussoukro, Man, Bouaké, San-Pédro
Meilleure période: Novembre à mars (saison sèche)
Devise: XOF (Franc CFA)
Taux de change approximatifs: 1 EUR = 655.96 XOF, 1 USD = 605 XOF, 1 GBP = 830 XOF

FORMAT DE RÉPONSE:
- Réponds en français
- Utilise des émojis pour rendre la conversation vivante
- Propose des actions concrètes quand approprié
- Si l'utilisateur demande une réservation, guide-le vers le processus
`;

// Exchange rates
const EXCHANGE_RATES = {
  EUR: 655.96,
  USD: 605.00,
  GBP: 830.00,
  CAD: 445.00,
  XOF: 1.00,
};

// Destination information
const DESTINATION_INFO = {
  assinie: {
    name: 'Assinie',
    description: 'Station balnéaire populaire avec ses lagunes et plages',
    highlights: ['Lagune d\'Assinie', 'Plages de Monogaga', 'Fruits de mer', 'Pêche'],
    bestTime: 'Novembre à mars',
    budget: 'moderate',
  },
  'grand-bassam': {
    name: 'Grand-Bassam',
    description: 'Ancienne capitale coloniale classée UNESCO',
    highlights: ['Quartier colonial', 'Cathédrale', 'Musée national', 'Architecture historique'],
    bestTime: 'Toute l\'année',
    budget: 'low',
  },
  bouake: {
    name: 'Bouaké',
    description: 'Deuxième ville de Côte d\'Ivoire',
    highlights: ['Marché central', 'Tissage', 'Artisanat', 'Culture locale'],
    bestTime: 'Toute l\'année',
    budget: 'low',
  },
  yamoussoukro: {
    name: 'Yamoussoukro',
    description: 'Capitale politique',
    highlights: ['Basilique Notre-Dame de la Paix', 'Lac aux crocodiles', 'Palais présidentiel'],
    bestTime: 'Toute l\'année',
    budget: 'moderate',
  },
  man: {
    name: 'Man',
    description: 'Ville de la montagne',
    highlights: ['Cascades', 'Mont Tonkoui', 'Randonnée', 'Nature'],
    bestTime: 'Novembre à février',
    budget: 'low',
  },
  abidjan: {
    name: 'Abidjan',
    description: 'Maison économique',
    highlights: ['Plateau', 'Treichville', 'Marcory', 'Culture urbaine'],
    bestTime: 'Toute l\'année',
    budget: 'high',
  },
  'san-pedro': {
    name: 'San-Pédro',
    description: 'Port de pêche et tourisme',
    highlights: ['Plages', 'Pêche artisanale', 'Forêt du Banco', 'Parc national Taï'],
    bestTime: 'Toute l\'année',
    budget: 'moderate',
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createSupabaseClient(req);
  const url = new URL(req.url);
  const path = url.pathname;

  try {
    // POST /ai/chat
    if (path === '/ai/chat' && req.method === 'POST') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const body = await req.json();
      const { message, conversationId } = body;

      if (!message) {
        return errorResponse('Message is required', 400);
      }

      // Get or create conversation
      let conversation;
      if (conversationId) {
        const { data } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('id', conversationId)
          .eq('user_id', user.id)
          .single();
        conversation = data;
      }

      if (!conversation) {
        const { data: newConversation } = await supabase
          .from('ai_conversations')
          .insert({
            user_id: user.id,
            title: message.substring(0, 50),
            context: {},
          })
          .select()
          .single();
        conversation = newConversation;
      }

      // Save user message
      await supabase.from('ai_messages').insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message,
      });

      // Build context from user data
      const context = await buildUserContext(supabase, user.id);

      // Detect intent and generate response
      const response = await generateAIResponse(message, context, conversation.id);

      // Save AI response
      await supabase.from('ai_messages').insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: response.text,
        metadata: response.metadata || {},
      });

      // Update conversation
      await supabase
        .from('ai_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversation.id);

      return successResponse({
        response: response.text,
        conversationId: conversation.id,
        suggestions: response.suggestions,
        actions: response.actions,
      });
    }

    // GET /ai/conversations (User only)
    if (path === '/ai/conversations' && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          *,
          ai_messages(id, role, content, created_at)
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ conversations: data });
    }

    // GET /ai/conversations/:id (User only)
    if (path.match(/^\/ai\/conversations\/[^/]+$/) && req.method === 'GET') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const id = path.split('/').pop();

      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          *,
          ai_messages(id, role, content, metadata, created_at)
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        return errorResponse('Conversation not found', 404);
      }

      return successResponse(data);
    }

    // DELETE /ai/conversations/:id (User only)
    if (path.match(/^\/ai\/conversations\/[^/]+$/) && req.method === 'DELETE') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return errorResponse('Missing authorization header', 401);
      }

      const user = await getUserFromAuth(supabase, authHeader);
      if (!user) {
        return errorResponse('Invalid token', 401);
      }

      const id = path.split('/').pop();

      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        return errorResponse(error.message, 500);
      }

      return successResponse({ message: 'Conversation deleted' });
    }

    return errorResponse('Endpoint not found', 404);

  } catch (error) {
    console.error('AI error:', error);
    
    // Fallback response if AI fails
    return successResponse({
      response: 'Je suis AYOKA, votre assistant touristique. Comment puis-je vous aider aujourd\'hui? 🌍',
      fallback: true,
    });
  }
});

// Build user context from database
async function buildUserContext(supabase: any, userId: string) {
  const [user, bookings, favorites] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('bookings').select('*, services(*)').eq('user_id', userId).limit(5),
    supabase.from('favorites').select('*, services(*)').eq('user_id', userId).limit(5),
  ]);

  return {
    user: user.data,
    recentBookings: bookings.data || [],
    favorites: favorites.data || [],
  };
}

// Generate AI response with hybrid approach
async function generateAIResponse(message: string, context: any, conversationId: string) {
  const lowerMessage = message.toLowerCase();

  // Try internal logic first (faster, no API calls)
  const internalResponse = tryInternalLogic(message, context);
  if (internalResponse) {
    return internalResponse;
  }

  // Fallback to Gemini API
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const contextString = buildContextString(context);
    const prompt = `${AYOKA_SYSTEM_PROMPT}\n\nCONTEXTE UTILISATEUR:\n${contextString}\n\nMESSAGE UTILISATEUR:\n${message}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return {
      text: response,
      suggestions: generateSuggestions(message),
      metadata: { source: 'gemini' },
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Final fallback
    return {
      text: getFallbackResponse(message),
      suggestions: ['Destinations populaires', 'Planifier un voyage', 'Conversion de devises'],
      metadata: { source: 'fallback' },
    };
  }
}

// Try internal logic for common queries
function tryInternalLogic(message: string, context: any) {
  const lower = message.toLowerCase();

  // Currency conversion
  const currencyMatch = lower.match(/(\d+(?:[\.,]\d+)?)\s*(?:euros?|eur|€|dollars?|usd|\$|pounds?|gbp|£|cad)\s*(?:en|to|in|vers|xof|fcfa|cfa)/i);
  if (currencyMatch) {
    const amount = parseFloat(currencyMatch[1].replace(',', '.'));
    const from = lower.includes('eur') || lower.includes('€') ? 'EUR' : 
                 lower.includes('usd') || lower.includes('$') ? 'USD' : 
                 lower.includes('gbp') || lower.includes('£') ? 'GBP' : 'CAD';
    
    if (EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES]) {
      const result = amount * EXCHANGE_RATES[from as keyof typeof EXCHANGE_RATES];
      return {
        text: `${amount.toLocaleString()} ${from} = ${result.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} XOF`,
        suggestions: ['Autre conversion', 'Taux de change actuels', 'Budget voyage'],
        metadata: { source: 'internal', type: 'currency' },
      };
    }
  }

  // Destination information
  for (const [key, dest] of Object.entries(DESTINATION_INFO)) {
    if (lower.includes(key) || lower.includes(dest.name.toLowerCase())) {
      return {
        text: `📍 ${dest.name}\n\n${dest.description}\n\nPoints forts:\n${dest.highlights.map(h => `• ${h}`).join('\n')}\n\n📅 Meilleure période: ${dest.bestTime}\n\n💰 Budget: ${dest.budget}`,
        suggestions: ['Réserver à ' + dest.name, 'Voir les services', 'Planifier un voyage'],
        metadata: { source: 'internal', type: 'destination', destination: key },
      };
    }
  }

  // General travel advice
  if (lower.includes('conseil') || lower.includes('astuce') || lower.includes('aide')) {
    return {
      text: `Voici quelques conseils pour vos voyages en Côte d'Ivoire:\n\n🚌 Transport: Bus STIF/UTB pour longues distances, taxis-clamo en ville\n🏥 Santé: Eau en bouteille, moustifuge recommandé\n🔒 Sécurité: Évitez objets de valeur visibles\n\nBesoin d'informations spécifiques?`,
      suggestions: ['Destinations', 'Budget voyage', 'Conversion devises'],
      metadata: { source: 'internal', type: 'advice' },
    };
  }

  return null;
}

// Build context string for AI
function buildContextString(context: any): string {
  let contextStr = '';
  
  if (context.user) {
    contextStr += `Utilisateur: ${context.user.first_name} ${context.user.last_name}\n`;
    contextStr += `Rôle: ${context.user.role}\n`;
    contextStr += `Ville: ${context.user.city || 'Non spécifiée'}\n`;
  }
  
  if (context.recentBookings && context.recentBookings.length > 0) {
    contextStr += `\nRéservations récentes: ${context.recentBookings.length}\n`;
  }
  
  if (context.favorites && context.favorites.length > 0) {
    contextStr += `\nFavoris: ${context.favorites.length} services\n`;
  }
  
  return contextStr;
}

// Generate suggestions based on message
function generateSuggestions(message: string): string[] {
  const lower = message.toLowerCase();
  
  if (lower.includes('réserv') || lower.includes('hotel') || lower.includes('activité')) {
    return ['Voir les services disponibles', 'Rechercher par destination', 'Filtrer par prix'];
  }
  
  if (lower.includes('voyage') || lower.includes('itinéraire') || lower.includes('plan')) {
    return ['Générer un itinéraire', 'Destinations populaires', 'Estimer le budget'];
  }
  
  if (lower.includes('budget') || lower.includes('prix') || lower.includes('coût')) {
    return ['Conversion de devises', 'Destinations par budget', 'Estimation voyage'];
  }
  
  return ['Destinations populaires', 'Planifier un voyage', 'Voir les services'];
}

// Fallback response
function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello')) {
    return 'Bonjour! Je suis AYOKA, votre assistant touristique. Je peux vous aider a:\n\n- Explorer les destinations\n- Planifier vos voyages\n- Estimer vos budgets\n- Convertir les devises\n\nQue souhaitez-vous faire?';
  }
  
  if (lower.includes('merci')) {
    return 'Je vous en prie! N hesitez pas si vous avez d autres questions sur vos voyages en Cote d Ivoire.';
  }
  
  return 'Je suis la pour vous aider avec vos voyages en Cote d Ivoire!\n\nVous pouvez me demander:\n- Des informations sur les destinations\n- De l aide pour planifier un voyage\n- Des conversions de devises\n- Des conseils de voyage\n\nComment puis-je vous aider?';
}
