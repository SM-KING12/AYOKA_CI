// ============================================================
// SERVICES/AI/TRAVELASSISTANTSERVICE.TS - SERVICE ASSISTANT VOYAGE
// ============================================================
// Ce fichier contient les fonctions internes de l'assistant voyage.
// Il fournit des réponses basées sur des règles pour les questions
// fréquentes sur les voyages, les conversions de devises et les destinations.
//
// Fonctionnalités:
// - Conversion de devises (EUR, USD, GBP, CAD ↔ FCFA)
// - Informations sur les destinations ivoiriennes
// - Planification de voyages
// - Conseils de voyage
// - Recommandations budgétaires
// ============================================================

/**
 * Interface définissant une réponse de l'IA
 * Contient le texte de réponse, des suggestions et des actions possibles
 */
export interface AIResponse {
  text: string; // Texte de la réponse
  suggestions?: string[]; // Suggestions d'actions supplémentaires
  actions?: AIAction[]; // Actions possibles (navigation, réservation, etc.)
}

/**
 * Interface définissant une action de l'IA
 * Représente une action que l'utilisateur peut effectuer
 */
export interface AIAction {
  type: 'navigate' | 'book' | 'search' | 'plan'; // Type d'action
  data?: any; // Données associées à l'action
}

/**
 * Interface définissant une demande de plan de voyage
 * Contient les paramètres pour générer un itinéraire personnalisé
 */
export interface TravelPlanRequest {
  destination: string; // Destination souhaitée
  duration: number; // Durée du voyage (en jours)
  budget: number; // Budget total
  interests: string[]; // Centres d'intérêt
  groupSize: number; // Taille du groupe
}

// ============================================================
// TAUX DE CHANGE
// ============================================================
// Taux de change approximatifs (à mettre à jour régulièrement)
// Base: FCFA (Franc CFA d'Afrique de l'Ouest)
const EXCHANGE_RATES = {
  EUR: 655.96, // 1 EUR = 655.96 FCFA
  USD: 605.00, // 1 USD = 605 FCFA
  GBP: 830.00, // 1 GBP = 830 FCFA
  CAD: 445.00, // 1 CAD = 445 FCFA
  CFA: 1.00, // 1 FCFA = 1 FCFA
};

// ============================================================
// INFORMATIONS SUR LES DESTINATIONS
// ============================================================
// Base de données des destinations ivoiriennes avec leurs caractéristiques
const DESTINATION_INFO: Record<string, any> = {
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
  korhogo: {
    name: 'Korhogo',
    description: 'Capitale du Nord',
    highlights: ['Artisanat tissage', 'Culture Sénoufo', 'Parc de la Comoé'],
    bestTime: 'Novembre à février',
    budget: 'low',
  },
  'san-pedro': {
    name: 'San-Pédro',
    description: 'Port de pêche et tourisme',
    highlights: ['Plages', 'Pêche artisanale', 'Forêt du Banco', 'Parc national Taï'],
    bestTime: 'Toute l\'année',
    budget: 'moderate',
  },
};

/**
 * Fonction de conversion de devises
 * Convertit un montant d'une devise à une autre
 * 
 * @param amount - Montant à convertir
 * @param from - Devise source (EUR, USD, GBP, CAD, FCFA)
 * @param to - Devise cible (EUR, USD, GBP, CAD, FCFA)
 * @returns Chaîne formatée avec le résultat de la conversion
 */
export function convertCurrency(amount: number, from: string, to: string): string {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();
  
  if (!EXCHANGE_RATES[fromUpper as keyof typeof EXCHANGE_RATES]) {
    return `Devise ${from} non supportée. Devises supportées: EUR, USD, GBP, CAD, FCFA`;
  }
  
  if (!EXCHANGE_RATES[toUpper as keyof typeof EXCHANGE_RATES]) {
    return `Devise ${to} non supportée. Devises supportées: EUR, USD, GBP, CAD, FCFA`;
  }
  
  const amountInFCFA = amount * EXCHANGE_RATES[fromUpper as keyof typeof EXCHANGE_RATES];
  const result = amountInFCFA / EXCHANGE_RATES[toUpper as keyof typeof EXCHANGE_RATES];
  
  return `${amount.toLocaleString()} ${fromUpper} = ${result.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${toUpper}`;
}

/**
 * Analyse de la requête pour la conversion de devises
 * Extrait les informations de conversion depuis le texte utilisateur
 * 
 * @param input - Texte de l'utilisateur
 * @returns Objet avec amount, from, to ou null si pas de conversion détectée
 */
export function parseCurrencyConversion(input: string): { amount: number; from: string; to: string } | null {
  const patterns = [
    /(\d+(?:[\.,]\d+)?)\s*(?:euros?|eur|€)\s*(?:en|to|in)\s*(?:fcfa|xof|cfa)/i,
    /(\d+(?:[\.,]\d+)?)\s*(?:dollars?|usd|\$)\s*(?:en|to|in)\s*(?:fcfa|xof|cfa)/i,
    /(\d+(?:[\.,]\d+)?)\s*(?:pounds?|gbp|£)\s*(?:en|to|in)\s*(?:fcfa|xof|cfa)/i,
    /(\d+(?:[\.,]\d+)?)\s*(?:cad|dollars?\s*canadiens?)\s*(?:en|to|in)\s*(?:fcfa|xof|cfa)/i,
    /(\d+(?:[\.,]\d+)?)\s*(?:fcfa|xof|cfa)\s*(?:en|to|in)\s*(?:euros?|eur|€)/i,
    /(\d+(?:[\.,]\d+)?)\s*(?:fcfa|xof|cfa)\s*(?:en|to|in)\s*(?:dollars?|usd|\$)/i,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(',', '.'));
      const text = input.toLowerCase();
      
      let from = 'CFA';
      let to = 'FCFA';
      
      if (text.includes('euro') || text.includes('eur') || text.includes('€')) {
        from = text.includes('fcfa') || text.includes('cfa') ? 'CFA' : 'EUR';
        to = text.includes('fcfa') || text.includes('cfa') ? 'EUR' : 'FCFA';
      } else if (text.includes('dollar') || text.includes('usd') || text.includes('$')) {
        from = text.includes('fcfa') || text.includes('cfa') ? 'CFA' : 'USD';
        to = text.includes('fcfa') || text.includes('cfa') ? 'USD' : 'FCFA';
      } else if (text.includes('pound') || text.includes('gbp') || text.includes('£')) {
        from = text.includes('fcfa') || text.includes('cfa') ? 'CFA' : 'GBP';
        to = text.includes('fcfa') || text.includes('cfa') ? 'GBP' : 'FCFA';
      } else if (text.includes('cad')) {
        from = text.includes('fcfa') || text.includes('cfa') ? 'CFA' : 'CAD';
        to = text.includes('fcfa') || text.includes('cfa') ? 'CAD' : 'FCFA';
      }
      
      return { amount, from, to };
    }
  }
  
  return null;
}

/**
 * Réponses générales étendues
 * Fournit des réponses basées sur des règles pour les questions fréquentes
 * 
 * @param input - Texte de l'utilisateur
 * @returns Réponse de l'IA ou null si pas de réponse applicable
 */
export function getGeneralResponse(input: string): AIResponse | null {
  const lower = input.toLowerCase();
  
  // Conversion de devises
  const currencyConversion = parseCurrencyConversion(input);
  if (currencyConversion) {
    return {
      text: convertCurrency(currencyConversion.amount, currencyConversion.from, currencyConversion.to),
      suggestions: ['Autre conversion', 'Taux de change actuels', 'Budget voyage'],
    };
  }
  
  // Suggestions de voyages générales
  if (lower.includes('voyag') && (lower.includes('1 semaine') || lower.includes('7 jours') || lower.includes('semaine'))) {
    return {
      text: `Pour un voyage d'une semaine en Côte d'Ivoire, je recommande cet itinéraire:\n\n` +
            `**Jour 1-2**: Abidjan - Découverte de la ville (Plateau, Treichville, Marcory)\n` +
            `**Jour 3-4**: Grand-Bassam - Patrimoine UNESCO et plages\n` +
            `**Jour 5-6**: Assinie - Lagune et détente balnéaire\n` +
            `**Jour 7**: Retour à Abidjan, shopping et départ\n\n` +
            `Budget estimé: 150K-250K FCFA par personne (hors vols internationaux).\n\n` +
            `Voulez-vous des détails sur une destination spécifique ?`,
      suggestions: ['Détail Grand-Bassam', 'Détail Assinie', 'Budget détaillé', 'Autre durée'],
    };
  }
  
  // Que faire à une destination
  if (lower.includes('que faire') || lower.includes('activités') || lower.includes('visiter')) {
    const destination = getDestinationInfo(input);
    if (destination) {
      return {
        text: `À ${destination.name}, voici les activités incontournables:\n\n` +
              destination.highlights.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n') +
              `\n\n**Meilleure période**: ${destination.bestTime}\n\n` +
              `Je peux vous aider à planifier votre séjour !`,
        suggestions: ['Planifier un voyage', 'Voir les hébergements', 'Budget estimé'],
      };
    }
  }
  
  // Planification de voyage
  if (lower.includes('planifie') || lower.includes('planifier') || lower.includes('itinéraire')) {
    const destination = getDestinationInfo(input);
    if (destination) {
      return {
        text: `Je peux vous aider à planifier un voyage à ${destination.name}!\n\n` +
              `Pour créer un itinéraire personnalisé, j'ai besoin de:\n` +
              `- Durée du séjour\n` +
              `- Budget approximatif\n` +
              `- Vos centres d'intérêt (culture, nature, gastronomie...)\n` +
              `- Nombre de personnes\n\n` +
              `Donnez-moi ces informations et je créerai un itinéraire détaillé pour vous!`,
        suggestions: ['1 semaine', '2 semaines', 'Week-end', 'Budget 200K FCFA'],
      };
    }
  }
  
  // Informations générales sur la Côte d'Ivoire
  if (lower.includes('côte d\'ivoire') || lower.includes('cote divoire') || lower.includes('ci')) {
    return {
      text: `La Côte d'Ivoire est un pays d'Afrique de l'Ouest riche en culture et nature.\n\n` +
            `**Destinations populaires**:\n` +
            `- Abidjan: Capitale économique, vie urbaine\n` +
            `- Grand-Bassam: Patrimoine UNESCO, plages\n` +
            `- Assinie: Lagunes, tourisme balnéaire\n` +
            `- Yamoussoukro: Basilique, capitale politique\n` +
            `- Man: Montagnes, cascades, nature\n` +
            `- Bouaké: Artisanat, culture locale\n\n` +
            `**Meilleure période**: Novembre à mars (saison sèche)\n\n` +
            `Quelle destination vous intéresse ?`,
      suggestions: ['Assinie', 'Grand-Bassam', 'Yamoussoukro', 'Man', 'Bouaké'],
    };
  }
  
  // Conseils généraux de voyage
  if (lower.includes('conseil') || lower.includes('astuce') || lower.includes('aide')) {
    return {
      text: `Voici quelques conseils pour vos voyages en Côte d'Ivoire:\n\n` +
            `**Transport**:\n` +
            `- Bus (STIF, UTB) pour les longues distances\n` +
            `- Taxis-clamo pour les déplacements urbains\n` +
            `- Train Sitarail Abidjan-Bouaké\n\n` +
            `**Santé**:\n` +
            `- Vaccinations recommandées (fièvre jaune)\n` +
            `- Eau en bouteille\n` +
            `- Moustifuge\n\n` +
            `**Sécurité**:\n` +
            `- Évitez les objets de valeur visibles\n` +
            `- Utilisez les hébergements recommandés\n` +
            `- Conservez vos documents en sécurité\n\n` +
            `Besoin d'informations spécifiques ?`,
      suggestions: ['Budget voyage', 'Destinations', 'Conversion devises'],
    };
  }
  
  return null;
}

/**
 * Récupère les informations sur une destination
 * 
 * @param destination - Nom de la destination
 * @returns Informations sur la destination ou null si non trouvée
 */
export function getDestinationInfo(destination: string): any {
  const key = Object.keys(DESTINATION_INFO).find(k => destination.toLowerCase().includes(k));
  return key ? DESTINATION_INFO[key] : null;
}

/**
 * Génère un plan de voyage personnalisé
 * Crée un itinéraire basé sur les préférences de l'utilisateur
 * 
 * @param request - Paramètres du voyage (destination, durée, budget, etc.)
 * @returns Réponse de l'IA avec l'itinéraire suggéré
 */
export function generateTravelPlan(request: TravelPlanRequest): AIResponse {
  const destination = getDestinationInfo(request.destination);
  
  if (!destination) {
    return {
      text: `Je n'ai pas d'informations spécifiques sur ${request.destination}. Je peux vous suggérer des destinations populaires comme Assinie, Grand-Bassam, ou Yamoussoukro.`,
      suggestions: ['Assinie', 'Grand-Bassam', 'Yamoussoukro', 'Man', 'Bouaké'],
    };
  }

  const dailyBudget = request.budget / request.duration;
  const budgetLevel = dailyBudget < 30000 ? 'budget' : dailyBudget < 60000 ? 'moderate' : 'luxury';

  return {
    text: `Voici une suggestion d'itinéraire pour ${request.duration} jours à ${destination.name}:\n\n` +
          `**Budget**: ${request.budget.toLocaleString()} FCFA (${dailyBudget.toLocaleString()} FCFA/jour)\n\n` +
          `**Highlights recommandés**:\n${destination.highlights.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n')}\n\n` +
          `**Meilleure période**: ${destination.bestTime}\n\n` +
          `Voulez-vous que je détaille chaque jour ?`,
    suggestions: ['Détail jour par jour', 'Réserver maintenant', 'Voir les services disponibles'],
    actions: [{ type: 'search', data: { destination: request.destination } }],
  };
}

/**
 * Fournit des conseils budgétaires
 * Analyse le budget et recommande des destinations appropriées
 * 
 * @param budget - Budget total
 * @param duration - Durée du voyage (en jours)
 * @returns Réponse de l'IA avec des recommandations budgétaires
 */
export function getBudgetAdvice(budget: number, duration: number): AIResponse {
  const dailyBudget = budget / duration;
  
  if (dailyBudget < 20000) {
    return {
      text: `Avec un budget de ${budget.toLocaleString()} FCFA pour ${duration} jours (${dailyBudget.toLocaleString()} FCFA/jour), je recommande des destinations abordables comme Grand-Bassam ou Bouaké. Privilégiez l'hébergement local et les transports en bus.`,
      suggestions: ['Voir Grand-Bassam', 'Voir Bouaké', 'Augmenter le budget'],
    };
  } else if (dailyBudget < 50000) {
    return {
      text: `Avec un budget de ${budget.toLocaleString()} FCFA pour ${duration} jours (${dailyBudget.toLocaleString()} FCFA/jour), vous pouvez visiter Assinie ou Yamoussoukro avec un hébergement confortable.`,
      suggestions: ['Voir Assinie', 'Voir Yamoussoukro', 'Planifier le voyage'],
    };
  } else {
    return {
      text: `Avec un budget de ${budget.toLocaleString()} FCFA pour ${duration} jours (${dailyBudget.toLocaleString()} FCFA/jour), vous avez de nombreuses options premium à Abidjan, Assinie ou dans les hôtels de luxe.`,
      suggestions: ['Voir les hôtels de luxe', 'Planifier un voyage premium', 'Explorer toutes les destinations'],
    };
  }
}

/**
 * Fournit des conseils de transport
 * Recommande les options de transport pour rejoindre une destination
 * 
 * @param destination - Destination souhaitée
 * @returns Réponse de l'IA avec les options de transport
 */
export function getTransportAdvice(destination: string): AIResponse {
  return {
    text: `Pour rejoindre ${destination}, voici les options de transport:\n\n` +
          `**Bus**: STIF, UTB - Abordable et régulier\n` +
          `**Train**: Sitarail - Comfortable entre Abidjan et l'intérieur\n` +
          `**VTC**: Plus cher mais confortable\n\n` +
          `Sur place, utilisez les taxis-clamo pour les déplacements urbains.`,
    suggestions: ['Réserver un billet de bus', 'Voir les horaires de train'],
  };
}
