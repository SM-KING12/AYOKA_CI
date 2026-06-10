import type { Itinerary, ItineraryDay } from '../types';
import { destinations } from '../data';

const itineraryTemplates: Record<string, ItineraryDay[]> = {
  'abidjan-3j': [
    {
      day: 1,
      title: 'Abidjan Discovery',
      activities: [
        { time: '09:00', name: 'Marché de Cocody', description: 'Explorez les tissus wax et l\'artisanat local', location: 'Cocody', duration: '2h', cost: 0 },
        { time: '12:00', name: 'Déjeuner au Maquis', description: 'Cuisine ivoirienne authentique - attiéké et poisson braisé', location: 'Plateau', duration: '1h30', cost: 5000 },
        { time: '14:30', name: 'Tour de la Lagune Ébrié', description: 'Croisière sur la lagune avec vue sur le Plateau', location: 'Zone 4', duration: '2h', cost: 10000 },
        { time: '18:00', name: 'Coucher de soleil au Zone 4', description: 'Bars et restaurants au bord de l\'eau', location: 'Zone 4', duration: '3h', cost: 15000 },
      ],
    },
    {
      day: 2,
      title: 'Culture & Art',
      activities: [
        { time: '09:00', name: 'Musée des Civilisations', description: 'Découvrez l\'histoire et la culture ivoiriennes', location: 'Plateau', duration: '2h', cost: 2000 },
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
        { time: '15:00', name: 'Spa & Détente', description: 'Massage et soins au spa de l\'hôtel', location: 'Marcory', duration: '2h', cost: 30000 },
        { time: '18:00', name: 'Dîner gastronomique', description: 'Restaurant étoilé pour clôturer le séjour', location: 'Zone 4', duration: '2h30', cost: 35000 },
      ],
    },
  ],
  'bassam-2j': [
    {
      day: 1,
      title: 'Histoire & Patrimoine',
      activities: [
        { time: '09:00', name: 'Quartier Colonial', description: 'Visite guidée des bâtiments classés UNESCO', location: 'Grand-Bassam', duration: '3h', cost: 5000 },
        { time: '13:00', name: 'Déjeuner sur la lagune', description: 'Restaurant avec vue sur la lagune Ouladine', location: 'Grand-Bassam', duration: '1h30', cost: 8000 },
        { time: '15:00', name: 'Musée du Costume', description: 'Traditions vestimentaires ivoiriennes', location: 'Grand-Bassam', duration: '1h30', cost: 2000 },
        { time: '18:00', name: 'Coucher de soleil sur la plage', description: 'Moment magique au bord de l\'eau', location: 'Grand-Bassam', duration: '1h', cost: 0 },
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

export function getAiRecommendations(query: string): string {
  const lower = query.toLowerCase();

  if (lower.includes('plage') || lower.includes('bord de mer')) {
    return "Voici les meilleures plages de Côte d'Ivoire ! Assinie-Mafia offre les plus belles étendues de sable, Grand-Bassam combine histoire et baignade, et Jacqueville est la crique secrète des connaisseurs.";
  }
  if (lower.includes('restaurant') || lower.includes('manger') || lower.includes('cuisine')) {
    return "Abidjan est un paradis culinaire ! Ne manquez pas les maquis du Plateau pour l'attiéké frais, le Jardin Gourmand pour la fusion afro-contemporaine, et les brochettes de Zone 4 le soir.";
  }
  if (lower.includes('itinéraire') || lower.includes('plan') || lower.includes('voyage')) {
    return "Je vous recommande un circuit de 3 jours : Jour 1 à Abidjan (marchés, lagune, Zone 4), Jour 2 à Grand-Bassam (colonial UNESCO, plage), Jour 3 à Assinie (sports nautiques, fruits de mer). Voulez-vous que je génère l'itinéraire détaillé ?";
  }
  if (lower.includes('nature') || lower.includes('parc') || lower.includes('forêt')) {
    return "La Côte d'Ivoire cache des trésors naturels ! Le Parc de Taï est une forêt primaire UNESCO, le Mont Tonkoui offre des randonnées épiques, et le Parc du Banco est une forêt en plein Abidjan.";
  }
  if (lower.includes('hôtel') || lower.includes('logement') || lower.includes('dormir')) {
    return "Selon votre budget : Ibis Marcory pour l'économique (25K FCFA), Novotel Plateau pour le milieu (55K FCFA), Sofitel Ivoire pour le premium (85K FCFA). Tous incluent petit-déjeuner.";
  }
  if (lower.includes('culture') || lower.includes('musée') || lower.includes('tradition')) {
    return "La culture ivoirienne est fascinante ! Visitez le Musée des Civilisations au Plateau, les danses Zaouli à Gouro, et les masques Dan dans la région de Man. Les festivals de masques ont lieu de juin à août.";
  }

  return "La Côte d'Ivoire offre des expériences uniques pour chaque voyageur. Dites-moi ce qui vous intéresse le plus : plages, culture, nature, gastronomie, ou aventure, et je créerai des recommandations personnalisées pour vous !";
}
