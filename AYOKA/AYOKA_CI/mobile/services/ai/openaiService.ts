// Importation du SDK Google Generative AI pour utiliser l'API Gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================================
// CONFIGURATION GOOGLE GEMINI
// ============================================================
// Clé API Gemini fournie par l'utilisateur
// Fallback: utilise la clé intégrée si process.env n'est pas disponible
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDMD5jpfuYtbLBnP_tz6HZLO_UUXhg1JnI';

// Initialisation du client Gemini avec la clé API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configuration du modèle Gemini (gemini-1.5-pro = modèle supporté et performant)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// ============================================================
// SYSTEM PROMPT AYOKA AI
// ============================================================
// Ce prompt définit le comportement et les règles de l'IA
// Il indique à Gemini comment se comporter comme assistant AYOKA CI
const AYOKA_SYSTEM_PROMPT = `
Tu es AYOKA AI, un assistant déjà intégré à une application de tourisme (AYOKA CI).

⚠️ IMPORTANT
Tu ne remplaces pas les fonctionnalités existantes du système.
Tu les complètes et les améliores uniquement.

🔧 FONCTIONNALITÉS EXISTANTES À PRÉSERVER
- Conversion de devises (EUR, USD, GBP → FCFA)
- Réponses sur les destinations ivoiriennes
- Gestion des services (hôtels, activités, restaurants)
- Réponses basées sur des données utilisateur (réservations, favoris)
- Logique interne de l'application (ne pas casser)

🧠 NOUVELLES RÈGLES D'AMÉLIORATION

1. 🔀 Complément et non remplacement
- Si une fonctionnalité existe déjà dans l'application (ex: conversion devise),
  tu peux l'utiliser MAIS tu ne dois pas la remplacer.
- Si tu détectes une meilleure réponse possible, tu proposes une amélioration sans supprimer l'existant.

2. 🧩 Mode extension intelligente
Quand une question arrive :
- Si une fonction interne existe → utilise-la
- Si elle n'existe pas → répond avec tes capacités générales
- Si les deux sont utiles → combine les deux intelligemment

3. 📡 Utilisation des données externes
Tu peux recevoir des données de l'application (API backend).
- Utilise-les uniquement si elles sont présentes dans le contexte
- Ne jamais inventer de données

4. 🌍 Double intelligence obligatoire
Tu dois toujours équilibrer deux types de réponses :
A. 🔵 Données application (AYOKA CI)
- réservations
- hôtels
- services
- prix
- destinations internes
B. 🟢 Connaissances générales
- conseils voyage
- culture
- astuces
- informations globales

5. ⚙️ Règle de non-régression
- Ne supprime jamais une fonctionnalité existante
- Ne modifie pas la logique backend
- Ne remplace pas les calculs déjà faits par l'application
- Tu agis comme une couche intelligente au-dessus du système

6. 💬 Amélioration de réponse
Si une réponse peut être meilleure :
- ajoute des suggestions
- propose des alternatives
- enrichis sans changer les données originales

🚫 INTERDICTIONS
- Ne pas casser les fonctions existantes
- Ne pas inventer de données backend
- Ne pas ignorer les données fournies par l'application
- Ne pas remplacer les calculs internes

Tu es une couche d'intelligence AU-DESSUS de l'application AYOKA CI.
Tu n'écrases rien. Tu enrichis tout.
`;

// ============================================================
// INTERFACES TYPES
// ============================================================

/**
 * Interface définissant le contexte utilisateur passé à l'IA
 * Contient les données de l'application pour personnaliser les réponses
 */
export interface AyokaAIContext {
  userRole?: 'admin' | 'partner' | 'traveler'; // Rôle de l'utilisateur
  userReservations?: any[]; // Réservations de l'utilisateur
  userFavorites?: any[]; // Favoris de l'utilisateur
  availableServices?: any[]; // Services disponibles dans l'app
  destinations?: any[]; // Destinations disponibles
  userData?: any; // Données personnelles de l'utilisateur
}

/**
 * Interface définissant la réponse de l'IA
 * Contient le texte, les suggestions et les métadonnées
 */
export interface AyokaAIResponse {
  text: string; // Texte de la réponse
  usedInternalFunction?: boolean; // Indique si une fonction interne a été utilisée
  suggestions?: string[]; // Suggestions d'actions supplémentaires
  actions?: any[]; // Actions possibles (réservations, etc.)
}

/**
 * ============================================================
 * FONCTION PRINCIPALE AYOKA AI
 * ============================================================
 * Combine l'intelligence interne de l'application avec Gemini
 * 
 * @param userMessage - Message de l'utilisateur
 * @param context - Contexte utilisateur (réservations, favoris, etc.)
 * @returns Réponse de l'IA enrichie
 */
export async function getAyokaAIResponse(
  userMessage: string,
  context: AyokaAIContext = {}
): Promise<AyokaAIResponse> {
  try {
    // ÉTAPE 1: Essayer d'utiliser les fonctions internes existantes
    // (conversion de devises, réservations, favoris, etc.)
    const internalResponse = await tryInternalFunction(userMessage, context);
    
    // ÉTAPE 2: Construire la chaîne de contexte pour Gemini
    // (rôle utilisateur, réservations, services disponibles, etc.)
    const contextString = buildContextString(context);
    
    // ÉTAPE 3: Appeler l'API Gemini avec le contexte et la réponse interne
    const geminiResponse = await callGemini(userMessage, contextString, internalResponse);
    
    // ÉTAPE 4: Combiner intelligemment les réponses internes et Gemini
    return combineResponses(internalResponse, geminiResponse);
    
  } catch (error) {
    // En cas d'erreur, fallback sur les réponses internes uniquement
    console.error('Erreur AYOKA AI:', error);
    const fallback = await tryInternalFunction(userMessage, context);
    return fallback || {
      text: "Désolé, je rencontre une difficulté technique. Pouvez-vous reformuler votre question ?",
      usedInternalFunction: false,
    };
  }
}

/**
 * ============================================================
 * FONCTIONS INTERNES
 * ============================================================
 * Essaie d'utiliser les fonctions internes existantes de l'application
 * avant de faire appel à Gemini. Cela permet de préserver les
 * fonctionnalités existantes et d'améliorer les réponses.
 * 
 * @param message - Message de l'utilisateur
 * @param context - Contexte utilisateur
 * @returns Réponse interne si applicable, null sinon
 */
async function tryInternalFunction(
  message: string,
  context: AyokaAIContext
): Promise<AyokaAIResponse | null> {
  const lower = message.toLowerCase();
  
  // Import dynamique pour éviter les dépendances circulaires
  // On importe les fonctions du service travelAssistantService
  const { convertCurrency, parseCurrencyConversion } = await import('./travelAssistantService');
  const { getDestinationInfo } = await import('./travelAssistantService');
  
  // ============================================================
  // CONVERSION DE DEVISES
  // ============================================================
  // Si le message contient une conversion de devises (ex: "2000 euros en FCFA")
  // on utilise la fonction interne existante
  const currencyConversion = parseCurrencyConversion(message);
  if (currencyConversion) {
    return {
      text: convertCurrency(currencyConversion.amount, currencyConversion.from, currencyConversion.to),
      usedInternalFunction: true,
      suggestions: ['Autre conversion', 'Taux de change actuels', 'Budget voyage'],
    };
  }
  
  // ============================================================
  // INFORMATIONS SUR LES DESTINATIONS
  // ============================================================
  // Si le message demande des activités ou informations sur une destination
  // on utilise la fonction interne existante
  if (lower.includes('que faire') || lower.includes('activités') || lower.includes('visiter')) {
    const destination = getDestinationInfo(message);
    if (destination) {
      return {
        text: `À ${destination.name}, voici les activités incontournables:\n\n` +
              destination.highlights.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n') +
              `\n\n**Meilleure période**: ${destination.bestTime}`,
        usedInternalFunction: true,
        suggestions: ['Planifier un voyage', 'Voir les hébergements', 'Budget estimé'],
      };
    }
  }
  
  // ============================================================
  // RÉSERVATIONS UTILISATEUR
  // ============================================================
  // Si le message concerne les réservations, on utilise les données internes
  if (lower.includes('réservation') || lower.includes('booking') || lower.includes('mes réservations')) {
    if (context.userReservations && context.userReservations.length > 0) {
      // Affiche les 3 premières réservations
      const reservations = context.userReservations.slice(0, 3);
      return {
        text: `Vous avez ${context.userReservations.length} réservation(s).\n\n` +
              reservations.map((r: any, i: number) => 
                `${i + 1}. ${r.serviceName} - ${r.date} - ${r.status}`
              ).join('\n'),
        usedInternalFunction: true,
        suggestions: ['Voir toutes les réservations', 'Annuler une réservation', 'Modifier une réservation'],
      };
    } else {
      return {
        text: "Vous n'avez aucune réservation pour le moment. Voulez-vous réserver un service ?",
        usedInternalFunction: true,
        suggestions: ['Explorer les services', 'Voir les destinations populaires'],
      };
    }
  }
  
  // ============================================================
  // FAVORIS UTILISATEUR
  // ============================================================
  // Si le message concerne les favoris, on utilise les données internes
  if (lower.includes('favori') || lower.includes('préféré') || lower.includes('mes favoris')) {
    if (context.userFavorites && context.userFavorites.length > 0) {
      return {
        text: `Vous avez ${context.userFavorites.length} favori(s):\n\n` +
              context.userFavorites.map((f: any, i: number) => 
                `${i + 1}. ${f.name} - ${f.category}`
              ).join('\n'),
        usedInternalFunction: true,
        suggestions: ['Réserver un favori', 'Voir tous les favoris'],
      };
    } else {
      return {
        text: "Vous n'avez pas encore de favoris. Explorez nos services et ajoutez vos préférés !",
        usedInternalFunction: true,
        suggestions: ['Explorer les services', 'Voir les destinations'],
      };
    }
  }
  
  // Aucune fonction interne applicable
  return null;
}

/**
 * ============================================================
 * CONSTRUCTION DU CONTEXTE
 * ============================================================
 * Construit une chaîne de contexte à partir des données utilisateur
 * pour l'envoyer à Gemini. Cela permet à l'IA de personnaliser
 * ses réponses en fonction du contexte de l'utilisateur.
 * 
 * @param context - Contexte utilisateur
 * @returns Chaîne de contexte formatée
 */
function buildContextString(context: AyokaAIContext): string {
  const parts: string[] = [];
  
  // Ajoute le rôle utilisateur si disponible
  if (context.userRole) {
    parts.push(`RÔLE UTILISATEUR: ${context.userRole}`);
  }
  
  // Ajoute les données utilisateur si disponibles
  if (context.userData) {
    parts.push(`DONNÉES UTILISATEUR: ${JSON.stringify(context.userData)}`);
  }
  
  // Ajoute le nombre de réservations si disponibles
  if (context.userReservations && context.userReservations.length > 0) {
    parts.push(`RÉSERVATIONS: ${context.userReservations.length} réservation(s)`);
  }
  
  // Ajoute le nombre de favoris si disponibles
  if (context.userFavorites && context.userFavorites.length > 0) {
    parts.push(`FAVORIS: ${context.userFavorites.length} favori(s)`);
  }
  
  // Ajoute les services disponibles si présents
  if (context.availableServices && context.availableServices.length > 0) {
    const serviceNames = context.availableServices.map((s: any) => s.name).join(', ');
    parts.push(`SERVICES DISPONIBLES: ${serviceNames}`);
  }
  
  // Ajoute les destinations si présentes
  if (context.destinations && context.destinations.length > 0) {
    const destNames = context.destinations.map((d: any) => d.name).join(', ');
    parts.push(`DESTINATIONS: ${destNames}`);
  }
  
  // Retourne le contexte ou un message par défaut
  return parts.length > 0 ? parts.join('\n') : 'Aucune donnée contextuelle disponible';
}

/**
 * ============================================================
 * APPEL À L'API GEMINI
 * ============================================================
 * Appelle l'API Google Gemini avec le prompt construit
 * (system prompt + contexte + réponse interne + question utilisateur)
 * 
 * @param userMessage - Message de l'utilisateur
 * @param contextString - Contexte de l'application
 * @param internalResponse - Réponse interne déjà générée (si applicable)
 * @returns Réponse de Gemini
 */
async function callGemini(
  userMessage: string,
  contextString: string,
  internalResponse: AyokaAIResponse | null
): Promise<AyokaAIResponse> {
  // Commence avec le system prompt AYOKA AI
  let prompt = AYOKA_SYSTEM_PROMPT;
  
  // Ajoute le contexte de l'application si disponible
  if (contextString) {
    prompt += `\n\nCONTEXTE APPLICATION:\n${contextString}`;
  }
  
  // Si une fonction interne a été utilisée, informe Gemini
  // pour qu'il enrichisse la réponse sans la remplacer
  if (internalResponse) {
    prompt += `\n\nRÉPONSE INTERNE DÉJÀ GÉNÉRÉE:\n${internalResponse.text}\n\n` +
             `TA TÂCHE: Améliore ou complète cette réponse avec tes connaissances générales. ` +
             `Ne remplace pas les données internes. Enrichis-les.`;
  }
  
  // Ajoute la question de l'utilisateur
  prompt += `\n\nQUESTION UTILISATEUR:\n${userMessage}`;
  
  try {
    // Appelle l'API Gemini avec le prompt construit
    const result = await model.generateContent(prompt);
    const text = result.response.text() || '';
    
    // Retourne la réponse avec les suggestions extraites
    return {
      text,
      usedInternalFunction: false,
      suggestions: extractSuggestions(text),
    };
  } catch (error) {
    console.error('Erreur Gemini:', error);
    throw error;
  }
}

/**
 * ============================================================
 * COMBINAISON DES RÉPONSES
 * ============================================================
 * Combine intelligemment la réponse interne et la réponse Gemini
 * pour fournir une réponse enrichie sans perdre les données internes.
 * 
 * @param internal - Réponse interne (peut être null)
 * @param gemini - Réponse de Gemini
 * @returns Réponse combinée
 */
function combineResponses(
  internal: AyokaAIResponse | null,
  gemini: AyokaAIResponse
): AyokaAIResponse {
  // Si aucune réponse interne, retourne uniquement la réponse Gemini
  if (!internal) {
    return gemini;
  }
  
  // Si la réponse Gemini est trop courte (< 50 caractères),
  // on considère qu'elle n'ajoute rien de significatif
  if (gemini.text.length < 50) {
    return internal;
  }
  
  // Combine les deux réponses intelligemment
  // La réponse interne est conservée, Gemini ajoute des conseils supplémentaires
  const combinedText = `${internal.text}\n\n💡 **Conseils supplémentaires:**\n${gemini.text}`;
  
  // Fusionne les suggestions des deux réponses
  return {
    text: combinedText,
    usedInternalFunction: true,
    suggestions: [...(internal.suggestions || []), ...(gemini.suggestions || [])],
  };
}

/**
 * ============================================================
 * EXTRACTION DES SUGGESTIONS
 * ============================================================
 * Extrait les suggestions d'une réponse texte en utilisant
 * des expressions régulières pour détecter les patterns de suggestions.
 * 
 * @param text - Texte de la réponse
 * @returns Liste de suggestions (max 3)
 */
function extractSuggestions(text: string): string[] {
  const suggestions: string[] = [];
  
  // Patterns regex pour détecter les suggestions dans le texte
  const patterns = [
    /je vous suggère[:\s]+([^.]+)/gi,
    /recommandé[:\s]+([^.]+)/gi,
    /vous pouvez[:\s]+([^.]+)/gi,
  ];
  
  // Applique chaque pattern et extrait les suggestions
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      suggestions.push(...matches.slice(1));
    }
  }
  
  // Retourne maximum 3 suggestions pour ne pas surcharger l'interface
  return suggestions.slice(0, 3);
}

/**
 * ============================================================
 * VÉRIFICATION DE LA CLÉ API
 * ============================================================
 * Vérifie si la clé API Gemini est configurée.
 * Dans React Native/Expo, process.env ne fonctionne pas directement,
 * donc on vérifie d'abord la variable d'environnement, puis la clé fallback.
 * 
 * @returns true si la clé API est disponible, false sinon
 */
export function isOpenAIConfigured(): boolean {
  // Vérifie d'abord la variable d'environnement (pour production)
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 0) {
    return true;
  }
  
  // Sinon, vérifie si la clé fallback est présente et valide
  // La clé fallback est intégrée dans le code pour le développement
  return !!(GEMINI_API_KEY && GEMINI_API_KEY.length > 0 && GEMINI_API_KEY !== 'your-gemini-api-key-here');
}
