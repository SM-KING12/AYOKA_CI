/**
 * mockAiService.ts — AYOKA CI
 * VERSION 2 — Améliorée :
 *   - Suivi de contexte (ConversationContext)
 *   - Conversion monétaire dynamique USD/EUR → XOF
 *   - Recommandation "Bon Plan" basée sur le budget converti
 *   - Toutes les données restent 100% mockées
 */

import type { Itinerary, ItineraryDay } from '../types';
import { destinations } from '../data';
import { mockPartnerServices } from './mockPartnerData';

// ─────────────────────────────────────────────
// 1. TAUX DE CONVERSION (fixes / simulés)
// ─────────────────────────────────────────────
export const CONVERSION_RATES: Record<string, number> = {
  USD: 600,   // 1 USD ≈ 600 XOF
  EUR: 655,   // 1 EUR ≈ 655 XOF (taux fixe CFA)
  GBP: 760,   // 1 GBP ≈ 760 XOF
  XOF: 1,
};

export type SupportedCurrency = keyof typeof CONVERSION_RATES;

/**
 * Convertit un montant dans une devise vers XOF.
 * Retourne null si la devise n'est pas reconnue.
 */
export function convertToXOF(amount: number, currency: SupportedCurrency): number {
  return Math.round(amount * (CONVERSION_RATES[currency] ?? 1));
}

// ─────────────────────────────────────────────
// 2. CONTEXTE DE CONVERSATION (Thread Management)
// ─────────────────────────────────────────────
export interface ConversationContext {
  /** Budget en XOF détecté durant la conversation */
  detectedBudgetXOF: number | null;
  /** Devise originale mentionnée par le touriste */
  detectedCurrency: SupportedCurrency | null;
  /** Montant original avant conversion */
  detectedBudgetOriginal: number | null;
  /** Type d'intérêt principal (plage, nature, culture…) */
  primaryInterest: string | null;
  /** Destination mentionnée */
  mentionedDestination: string | null;
  /** Durée du séjour mentionnée */
  mentionedDays: number | null;
  /** Historique de sujets abordés */
  topicsDiscussed: string[];
}

/** Contexte vide de départ */
export function createEmptyContext(): ConversationContext {
  return {
    detectedBudgetXOF: null,
    detectedCurrency: null,
    detectedBudgetOriginal: null,
    primaryInterest: null,
    mentionedDestination: null,
    mentionedDays: null,
    topicsDiscussed: [],
  };
}

// ─────────────────────────────────────────────
// 3. EXTRACTION D'ENTITÉS (budget, devise, durée…)
// ─────────────────────────────────────────────

/** Regex pour détecter un budget avec devise : "$200", "200$", "150 euros", "80 000 FCFA"… */
const BUDGET_REGEX =
  /(?:(\$|€|£|USD|EUR|GBP|XOF|FCFA)\s*([0-9][0-9\s.,]*)|([0-9][0-9\s.,]*)\s*(\$|€|£|USD|EUR|GBP|XOF|FCFA|francs?|dollars?|euros?))/i;

const SYMBOL_MAP: Record<string, SupportedCurrency> = {
  '$': 'USD', 'dollar': 'USD', 'dollars': 'USD', 'usd': 'USD',
  '€': 'EUR', 'euro': 'EUR', 'euros': 'EUR', 'eur': 'EUR',
  '£': 'GBP', 'gbp': 'GBP',
  'xof': 'XOF', 'fcfa': 'XOF', 'franc': 'XOF', 'francs': 'XOF',
};

function normalizeCurrency(raw: string): SupportedCurrency {
  return SYMBOL_MAP[raw.toLowerCase().trim()] ?? 'XOF';
}

function parseAmount(raw: string): number {
  return parseFloat(raw.replace(/[\s,]/g, '').replace(/\./g, '')) || 0;
}

interface BudgetExtraction {
  original: number;
  currency: SupportedCurrency;
  xof: number;
}

export function extractBudget(text: string): BudgetExtraction | null {
  const match = text.match(BUDGET_REGEX);
  if (!match) return null;

  // Groupe 1-2 : devise avant montant ; groupe 3-4 : montant avant devise
  const currencyRaw = (match[1] ?? match[4] ?? 'XOF').trim();
  const amountRaw = (match[2] ?? match[3] ?? '0').trim();
  const currency = normalizeCurrency(currencyRaw);
  const original = parseAmount(amountRaw);
  if (!original) return null;

  return { original, currency, xof: convertToXOF(original, currency) };
}

/** Détecte le nombre de jours mentionnés */
function extractDays(text: string): number | null {
  const m = text.match(/(\d+)\s*(?:jours?|days?|nuits?|nights?)/i);
  return m ? parseInt(m[1], 10) : null;
}

/** Met à jour le contexte avec les informations du nouveau message */
export function updateContext(
  ctx: ConversationContext,
  text: string
): ConversationContext {
  const next = { ...ctx };
  const lower = text.toLowerCase();

  // Budget
  const budget = extractBudget(text);
  if (budget) {
    next.detectedBudgetOriginal = budget.original;
    next.detectedCurrency = budget.currency;
    next.detectedBudgetXOF = budget.xof;
  }

  // Durée
  const days = extractDays(text);
  if (days) next.mentionedDays = days;

  // Intérêt principal
  if (lower.includes('plage') || lower.includes('mer') || lower.includes('bord de mer'))
    next.primaryInterest = 'plage';
  else if (lower.includes('nature') || lower.includes('forêt') || lower.includes('foret') || lower.includes('parc'))
    next.primaryInterest = 'nature';
  else if (lower.includes('culture') || lower.includes('musée') || lower.includes('musee') || lower.includes('patrimoine'))
    next.primaryInterest = 'culture';
  else if (lower.includes('aventure') || lower.includes('randonnée') || lower.includes('randonn'))
    next.primaryInterest = 'aventure';
  else if (lower.includes('hôtel') || lower.includes('hotel') || lower.includes('dormir') || lower.includes('hébergement') || lower.includes('hebergement'))
    next.primaryInterest = 'hotel';
  else if (lower.includes('restaurant') || lower.includes('manger') || lower.includes('cuisine') || lower.includes('gastronomie'))
    next.primaryInterest = 'restaurant';

  // Destination
  const destinationKeywords = ['abidjan', 'bassam', 'assinie', 'yamoussoukro', 'man', 'taï', 'tai', 'jacqueville', 'bouaké', 'bouake'];
  for (const kw of destinationKeywords) {
    if (lower.includes(kw)) {
      next.mentionedDestination = kw;
      break;
    }
  }

  // Topics
  const topics: string[] = [];
  if (budget) topics.push('budget');
  if (lower.includes('itinéraire') || lower.includes('itineraire') || lower.includes('voyage')) topics.push('itinéraire');
  if (lower.includes('plage')) topics.push('plage');
  if (lower.includes('hôtel') || lower.includes('hotel')) topics.push('hébergement');
  if (lower.includes('restaurant') || lower.includes('manger')) topics.push('gastronomie');
  if (lower.includes('culture') || lower.includes('musée')) topics.push('culture');

  next.topicsDiscussed = Array.from(new Set([...ctx.topicsDiscussed, ...topics]));

  return next;
}

// ─────────────────────────────────────────────
// 4. RECOMMANDATION "BON PLAN" BASÉE SUR BUDGET
// ─────────────────────────────────────────────

export interface BonPlan {
  type: 'destination' | 'service';
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  location: string;
  tag: string; // "Hôtel", "Activité", "Restaurant"…
}

/**
 * Filtre et trie les destinations + services mockés selon un budget XOF.
 * Retourne les 3 meilleures options (rapport qualité/prix).
 */
export function getBonPlans(budgetXOF: number, interest?: string | null): BonPlan[] {
  const results: BonPlan[] = [];

  // --- Destinations (depuis src/data) ---
  for (const d of destinations) {
    if (d.price <= budgetXOF && d.price > 0) {
      if (!interest || d.type === interest || interest === null) {
        results.push({
          type: 'destination',
          id: d.id,
          name: d.name,
          price: d.price,
          priceUnit: d.priceUnit,
          location: d.city,
          tag: d.type === 'hotel' ? 'Hôtel' : d.type === 'plage' ? 'Plage' : d.type === 'nature' ? 'Nature' : d.type === 'culture' ? 'Culture' : d.type === 'aventure' ? 'Aventure' : 'Destination',
        });
      }
    }
  }

  // --- Services partenaires (depuis mockPartnerData) ---
  for (const s of mockPartnerServices) {
    if (s.price <= budgetXOF && s.status === 'active') {
      results.push({
        type: 'service',
        id: s.id,
        name: s.name,
        price: s.price,
        priceUnit: s.priceUnit,
        location: s.destination,
        tag: s.type === 'hotel' ? 'Hôtel' : s.type === 'restaurant' ? 'Restaurant' : s.type === 'activity' ? 'Activité' : s.type === 'tour' ? 'Circuit' : 'Service',
      });
    }
  }

  // Tri : rapport qualité/prix (plus cher dans le budget = priorité), puis déduplication
  return results
    .sort((a, b) => b.price - a.price)
    .slice(0, 4);
}

// ─────────────────────────────────────────────
// 5. GÉNÉRATEUR DE RÉPONSE CONTEXTUELLE
// ─────────────────────────────────────────────

/**
 * Formate un message de conversion monétaire + bon plan.
 */
function buildBudgetResponse(ctx: ConversationContext): string {
  const { detectedBudgetOriginal, detectedCurrency, detectedBudgetXOF, primaryInterest } = ctx;
  if (!detectedBudgetXOF || !detectedCurrency || !detectedBudgetOriginal) return '';

  const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', XOF: 'FCFA' };
  const sym = currencySymbols[detectedCurrency] ?? detectedCurrency;
  const isAlreadyXOF = detectedCurrency === 'XOF';

  let response = '';

  if (!isAlreadyXOF) {
    response += `💱 **Conversion automatique** : ${detectedBudgetOriginal.toLocaleString()} ${sym} = **${detectedBudgetXOF.toLocaleString()} FCFA** (taux ${CONVERSION_RATES[detectedCurrency]} XOF/${detectedCurrency}).\n\n`;
  }

  const bonPlans = getBonPlans(detectedBudgetXOF, primaryInterest);

  if (bonPlans.length === 0) {
    response += `Avec un budget de **${detectedBudgetXOF.toLocaleString()} FCFA**, les options sont limitées pour la Côte d'Ivoire. Je vous conseille d'envisager un budget d'au moins 10 000 FCFA pour profiter des expériences locales. 🌍`;
    return response;
  }

  response += `✨ **Votre Bon Plan AYOKA** avec ${detectedBudgetXOF.toLocaleString()} FCFA${primaryInterest ? ` (${primaryInterest})` : ''} :\n\n`;
  bonPlans.forEach((bp, i) => {
    response += `**${i + 1}. ${bp.name}** — ${bp.location}\n`;
    response += `   🏷️ ${bp.tag} · ${bp.price.toLocaleString()} ${bp.priceUnit}\n\n`;
  });
  response += `Ces options sont dans votre budget. Voulez-vous un itinéraire personnalisé autour de l'une d'elles ?`;

  return response;
}

/**
 * Génère la réponse IA enrichie en tenant compte du contexte complet.
 */
export function getContextualAiResponse(
  input: string,
  ctx: ConversationContext
): string {
  const lower = input.toLowerCase();

  // --- Priorité 1 : Budget détecté dans CE message ---
  const budgetInMessage = extractBudget(input);
  if (budgetInMessage) {
    const enrichedCtx: ConversationContext = {
      ...ctx,
      detectedBudgetXOF: budgetInMessage.xof,
      detectedCurrency: budgetInMessage.currency,
      detectedBudgetOriginal: budgetInMessage.original,
    };
    return buildBudgetResponse(enrichedCtx);
  }

  // --- Priorité 2 : Budget dans le contexte + nouvelle question ---
  if (ctx.detectedBudgetXOF && (lower.includes('quoi') || lower.includes('que faire') || lower.includes('recommande') || lower.includes('conseil') || lower.includes('options') || lower.includes('budget'))) {
    return buildBudgetResponse(ctx);
  }

  // --- Priorité 3 : Réponses thématiques classiques ---
  if (lower.includes('plage') || lower.includes('bord de mer') || lower.includes('mer')) {
    return "Voici les meilleures plages de Côte d'Ivoire ! Assinie-Mafia offre les plus belles étendues de sable doré, Grand-Bassam combine histoire et baignade en famille, et Jacqueville est la crique secrète des connaisseurs. 🏖️";
  }
  if (lower.includes('restaurant') || lower.includes('manger') || lower.includes('cuisine') || lower.includes('gastronomie')) {
    return "Abidjan est un paradis culinaire ! Ne manquez pas les maquis du Plateau pour l'attiéké frais avec poisson braisé (à partir de 3 000 FCFA), le Jardin Gourmand pour la fusion afro-contemporaine, et les brochettes de Zone 4 le soir. 🍽️";
  }
  if (lower.includes('itinéraire') || lower.includes('itineraire') || lower.includes('plan') || lower.includes('voyage') || lower.includes('visiter')) {
    let resp = "Je vous recommande un circuit de 3 jours :\n\n**Jour 1 – Abidjan** : marchés wax, croisière lagune Ébrié, soirée Zone 4\n**Jour 2 – Grand-Bassam** : quartier colonial UNESCO, plage, musée du Costume\n**Jour 3 – Assinie** : sports nautiques, fruits de mer au bord de l'eau\n\n";
    if (ctx.detectedBudgetXOF) {
      resp += `📌 Budget détecté : **${ctx.detectedBudgetXOF.toLocaleString()} FCFA**. Je peux filtrer cet itinéraire selon votre budget. Souhaitez-vous les options "Bon Plan" ?`;
    } else {
      resp += "Dites-moi votre budget (ex: 50 000 FCFA ou $100) et j'adapterai les recommandations à votre enveloppe. 💰";
    }
    return resp;
  }
  if (lower.includes('nature') || lower.includes('parc') || lower.includes('forêt') || lower.includes('foret')) {
    return "La Côte d'Ivoire cache des trésors naturels ! Le Parc de Taï est une forêt primaire UNESCO, le Mont Tonkoui offre des randonnées épiques avec vue sur le Libéria, et le Parc du Banco est une forêt en plein cœur d'Abidjan. 🌿";
  }
  if (lower.includes('hôtel') || lower.includes('hotel') || lower.includes('logement') || lower.includes('dormir') || lower.includes('hébergement')) {
    let resp = "Selon votre budget :\n• **Économique** : Ibis Marcory — 25 000 FCFA/nuit\n• **Milieu de gamme** : Novotel Plateau — 55 000 FCFA/nuit\n• **Premium** : Sofitel Ivoire — 85 000 FCFA/nuit\n\nTous incluent le petit-déjeuner. 🏨";
    if (ctx.detectedBudgetXOF) {
      const bonPlans = getBonPlans(ctx.detectedBudgetXOF, 'hotel');
      if (bonPlans.length > 0) {
        resp += `\n\n💡 Avec votre budget de **${ctx.detectedBudgetXOF.toLocaleString()} FCFA**, je recommande : **${bonPlans[0].name}** (${bonPlans[0].price.toLocaleString()} ${bonPlans[0].priceUnit}).`;
      }
    }
    return resp;
  }
  if (lower.includes('culture') || lower.includes('musée') || lower.includes('musee') || lower.includes('tradition') || lower.includes('patrimoine')) {
    return "La culture ivoirienne est fascinante ! Visitez le Musée des Civilisations au Plateau (2 000 FCFA), les danses Zaouli à Gouro et les masques Dan dans la région de Man. 🎭 Les festivals de masques ont lieu de juin à août — une expérience unique en Afrique de l'Ouest.";
  }
  if (lower.includes('budget') || lower.includes('combien') || lower.includes('prix') || lower.includes('coût') || lower.includes('cout') || lower.includes('tarif')) {
    if (ctx.detectedBudgetXOF) {
      return buildBudgetResponse(ctx);
    }
    return "Pour vous aider avec les tarifs, dites-moi votre budget ! Vous pouvez l'indiquer en FCFA, en Dollars ($) ou en Euros (€), et je vous proposerai automatiquement les meilleures options dans votre enveloppe. 💰";
  }
  if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello') || lower.includes('bonsoir')) {
    const greeting = ctx.topicsDiscussed.length > 0
      ? `Bonjour ! Pour rappel, nous avons discuté de : ${ctx.topicsDiscussed.join(', ')}. Comment puis-je continuer à vous aider pour votre voyage en Côte d'Ivoire ?`
      : "Bonjour ! Je suis l'assistant AYOKA, votre guide IA pour la Côte d'Ivoire. Dites-moi votre destination, votre budget (en FCFA, $ ou €) et vos envies — je créerai des recommandations sur mesure ! 🌍";
    return greeting;
  }

  // --- Par défaut ---
  let defaultResp = "La Côte d'Ivoire offre des expériences uniques pour chaque voyageur. Dites-moi ce qui vous intéresse : plages, culture, nature, gastronomie, ou aventure.";
  if (ctx.detectedBudgetXOF) {
    defaultResp += `\n\n💡 J'ai noté votre budget de **${ctx.detectedBudgetXOF.toLocaleString()} FCFA**. Dès que vous précisez un thème, je vous propose un Bon Plan adapté !`;
  } else {
    defaultResp += "\n\nN'hésitez pas à mentionner votre budget (ex: 100$, 50 000 FCFA) pour des recommandations personnalisées.";
  }
  return defaultResp;
}

// ─────────────────────────────────────────────
// 6. FONCTION LEGACY (conservée pour compatibilité)
// ─────────────────────────────────────────────

/** @deprecated Utiliser getContextualAiResponse() à la place */
export function getAiRecommendations(query: string): string {
  return getContextualAiResponse(query, createEmptyContext());
}

// ─────────────────────────────────────────────
// 7. GÉNÉRATEUR D'ITINÉRAIRES (inchangé)
// ─────────────────────────────────────────────

const itineraryTemplates: Record<string, ItineraryDay[]> = {
  'abidjan-3j': [
    {
      day: 1,
      title: 'Abidjan Discovery',
      activities: [
        { time: '09:00', name: 'Marché de Cocody', description: "Explorez les tissus wax et l'artisanat local", location: 'Cocody', duration: '2h', cost: 0 },
        { time: '12:00', name: 'Déjeuner au Maquis', description: 'Cuisine ivoirienne authentique - attiéké et poisson braisé', location: 'Plateau', duration: '1h30', cost: 5000 },
        { time: '14:30', name: 'Tour de la Lagune Ébrié', description: 'Croisière sur la lagune avec vue sur le Plateau', location: 'Zone 4', duration: '2h', cost: 10000 },
        { time: '18:00', name: 'Coucher de soleil au Zone 4', description: "Bars et restaurants au bord de l'eau", location: 'Zone 4', duration: '3h', cost: 15000 },
      ],
    },
    {
      day: 2,
      title: 'Culture & Art',
      activities: [
        { time: '09:00', name: 'Musée des Civilisations', description: "Découvrez l'histoire et la culture ivoiriennes", location: 'Plateau', duration: '2h', cost: 2000 },
        { time: '12:00', name: 'Déjeuner fusion', description: 'Restaurant afro-contemporain au Plateau', location: 'Plateau', duration: '1h30', cost: 12000 },
        { time: '14:30', name: 'Galerie Cécile Fakhoury', description: 'Art contemporain africain', location: 'Zone 4', duration: '1h30', cost: 0 },
        { time: '17:00', name: 'Shopping au Cap Sud', description: 'Boutiques et artisanat design', location: 'Marcory', duration: '2h', cost: 20000 },
      ],
    },
    {
      day: 3,
      title: 'Nature & Relaxation',
      activities: [
        { time: '08:00', name: 'Parc National du Banco', description: 'Forêt urbaine et sentiers de randonnée', location: 'Adjamé', duration: '3h', cost: 5000 },
        { time: '12:00', name: 'Brunch au Sofitel', description: 'Brunch dominical avec vue sur la lagune', location: 'Plateau', duration: '2h', cost: 25000 },
        { time: '15:00', name: 'Spa & Détente', description: "Massage et soins au spa de l'hôtel", location: 'Marcory', duration: '2h', cost: 30000 },
        { time: '18:00', name: 'Dîner gastronomique', description: 'Restaurant étoilé pour clôturer le séjour', location: 'Zone 4', duration: '2h30', cost: 35000 },
      ],
    },
  ],
  'bassam-2j': [
    {
      day: 1,
      title: 'Histoire & Patrimoine',
      activities: [
        { time: '09:00', name: 'Quartier Colonial', description: "Visite guidée des bâtiments classés UNESCO", location: 'Grand-Bassam', duration: '3h', cost: 5000 },
        { time: '13:00', name: 'Déjeuner sur la lagune', description: 'Restaurant avec vue sur la lagune Ouladine', location: 'Grand-Bassam', duration: '1h30', cost: 8000 },
        { time: '15:00', name: 'Musée du Costume', description: 'Traditions vestimentaires ivoiriennes', location: 'Grand-Bassam', duration: '1h30', cost: 2000 },
        { time: '18:00', name: 'Coucher de soleil sur la plage', description: "Moment magique au bord de l'eau", location: 'Grand-Bassam', duration: '1h', cost: 0 },
      ],
    },
    {
      day: 2,
      title: 'Plage & Artisanat',
      activities: [
        { time: '08:00', name: 'Baignade matinale', description: 'Plage tranquille avant la foule', location: 'Grand-Bassam', duration: '2h', cost: 0 },
        { time: '10:30', name: 'Atelier artisanal', description: 'Initiation au tissage et à la poterie', location: 'Grand-Bassam', duration: '2h', cost: 8000 },
        { time: '13:00', name: 'Déjeuner de fruits de mer', description: 'Crevettes et poisson frais', location: 'Grand-Bassam', duration: '1h30', cost: 10000 },
        { time: '15:00', name: 'Retour vers Abidjan', description: 'Trajet en taxi ou bus', location: 'Grand-Bassam', duration: '1h', cost: 5000 },
      ],
    },
  ],
};

export function generateItinerary(destination: string, days: number, budget: string): Itinerary {
  const templateKey = destination.toLowerCase().includes('bassam')
    ? 'bassam-2j'
    : 'abidjan-3j';

  const template = itineraryTemplates[templateKey] || itineraryTemplates['abidjan-3j'];
  const selectedDays = template.slice(0, Math.min(days, template.length));

  const totalBudget = budget === 'economique' ? 50000 : budget === 'premium' ? 200000 : 100000;

  const dest = destinations.find((d) =>
    d.name.toLowerCase().includes(destination.toLowerCase()) ||
    d.city.toLowerCase().includes(destination.toLowerCase())
  );

  return {
    id: `itin-${Date.now()}`,
    name: `Voyage à ${dest?.name || destination}`,
    destination: dest?.name || destination,
    days: selectedDays.map((d, i) => ({
      ...d,
      day: i + 1,
    })),
    totalBudget,
    createdAt: new Date().toISOString(),
    isSaved: false,
  };
}
