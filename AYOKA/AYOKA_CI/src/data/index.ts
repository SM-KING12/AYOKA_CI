export interface Destination {
  id: string;
  name: string;
  city: string;
  type: 'plage' | 'hotel' | 'restaurant' | 'culture' | 'nature' | 'aventure';
  image: string;
  rating: number;
  reviews: number;
  price: number;
  priceUnit: string;
  description: string;
  shortDescription: string;
  highlights: string[];
  featured: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  cards?: RecommendationCard[];
  timestamp: Date | string;
}

export interface RecommendationCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price?: number;
  priceUnit?: string;
}

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Grand-Bassam',
    city: 'Grand-Bassam',
    type: 'culture',
    image: 'https://images.pexels.com/photos/17749102/pexels-photo-17749102.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    reviews: 234,
    price: 15000,
    priceUnit: 'FCFA/nuit',
    description: 'Première capitale de la Côte d\'Ivoire, Grand-Bassam est une ville historique classée au patrimoine mondial de l\'UNESCO. Ses bâtiments coloniaux, ses rues bordées de flamboyants et son ambiance unique en font une destination incontournable. Flânez dans le quartier France, visitez le musée national du Costume et profitez des plages de sable fin.',
    shortDescription: 'Ville historique UNESCO avec architecture coloniale et plages',
    highlights: ['Patrimoine UNESCO', 'Architecture coloniale', 'Plages tranquilles', 'Art et culture'],
    featured: true,
  },
  {
    id: '2',
    name: 'Parc National de Taï',
    city: 'Taï',
    type: 'nature',
    image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviews: 128,
    price: 25000,
    priceUnit: 'FCFA/visite',
    description: 'L\'un des derniers vestiges de la forêt tropicale primaire d\'Afrique de l\'Ouest, le Parc National de Taï est un trésor de biodiversité. Abritant des hippopotames pygmées, des chimpanzés et plus de 200 espèces d\'oiseaux, c\'est un paradis pour les amoureux de la nature et les chercheurs du monde entier.',
    shortDescription: 'Forêt tropicale primaire UNESCO avec biodiversité exceptionnelle',
    highlights: ['Forêt primaire', 'Chimpanzés', 'Hippopotames pygmées', 'Randonnée'],
    featured: true,
  },
  {
    id: '3',
    name: 'Assinie-Mafia',
    city: 'Assinie',
    type: 'plage',
    image: 'https://images.pexels.com/photos/1591375/pexels-photo-1591375.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    reviews: 456,
    price: 35000,
    priceUnit: 'FCFA/nuit',
    description: 'Station balnéaire prisée à l\'est d\'Abidjan, Assinie-Mafia offre des plages de sable doré, des lagunes paisibles et une ambiance festive. Idéale pour le surf, la baignade et les sports nautiques, c\'est la destination week-end par excellence des Abidjanais. Les resorts luxueux bordent la côte, offrant confort et sérénité.',
    shortDescription: 'Station balnéaire chic avec plages dorées et sports nautiques',
    highlights: ['Plages dorées', 'Surf', 'Resorts luxury', 'Ambiance festive'],
    featured: true,
  },
  {
    id: '4',
    name: 'Basilique de Yamoussoukro',
    city: 'Yamoussoukro',
    type: 'culture',
    image: 'https://images.pexels.com/photos/2668328/pexels-photo-2668328.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    reviews: 312,
    price: 5000,
    priceUnit: 'FCFA/visite',
    description: 'La Basilique Notre-Dame de la Paix est l\'un des plus grands édifices religieux au monde, inspirée de la Basilique Saint-Pierre de Rome. Située dans la capitale politique Yamoussoukro, elle impressionne par son architecture grandiose et ses vitraux spectaculaires. Un monument incontournable qui témoigne de la diversité culturelle ivoirienne.',
    shortDescription: 'Monument religieux monumental inspiré de Saint-Pierre de Rome',
    highlights: ['Architecture grandiose', 'Vitraux spectaculaires', 'Histoire unique', 'Capitale politique'],
    featured: true,
  },
  {
    id: '5',
    name: 'Mont Tonkoui',
    city: 'Man',
    type: 'aventure',
    image: 'https://images.pexels.com/photos/16555348/pexels-photo-16555348.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviews: 89,
    price: 20000,
    priceUnit: 'FCFA/randonnée',
    description: 'Le Mont Tonkoui, deuxième plus haut sommet de Côte d\'Ivoire (1,159m), offre une randonnée spectaculaire à travers la forêt de montagne. Depuis son sommet, par temps clair, on peut apercevoir les côtes du Libéria. La région de Man est également célèbre pour ses ponts de lianes, ses cascades et la culture des Dan.',
    shortDescription: 'Randonnée spectaculaire avec vue panoramique au-dessus des nuages',
    highlights: ['Randonnée épique', 'Vue panoramique', 'Ponts de lianes', 'Culture Dan'],
    featured: false,
  },
  {
    id: '6',
    name: 'Lagune Ébrié',
    city: 'Abidjan',
    type: 'nature',
    image: 'https://images.pexels.com/photos/15961309/pexels-photo-15961309.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.3,
    reviews: 567,
    price: 10000,
    priceUnit: 'FCFA/croisière',
    description: 'La Lagune Ébrié traverse Abidjan et offre des croisières inoubliables au cœur de la capitale économique. Admirez le contraste entre les gratte-ciel du Plateau et les villages de pêcheurs traditionnels. Les excursions au coucher du soleil sont particulièrement magiques, avec des vues imprenables sur le pont Henri-Konan-Bédié.',
    shortDescription: 'Croisières urbaines au cœur de la capitale économique',
    highlights: ['Croisières', 'Coucher du soleil', 'Contraste urbain', 'Pêche traditionnelle'],
    featured: false,
  },
  {
    id: '7',
    name: 'Hôtel Sofitel Abidjan',
    city: 'Abidjan',
    type: 'hotel',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.4,
    reviews: 789,
    price: 85000,
    priceUnit: 'FCFA/nuit',
    description: 'Au cœur du Plateau, le Sofitel Abidjan Hôtel Ivoire offre un luxe à la française avec une touche ivoirienne. Piscine panoramique vue sur la lagune, spa de renommée et cuisine gastronomique font de ce palace une référence en Afrique de l\'Ouest. Parfait pour les voyageurs d\'affaires et les touristes exigeants.',
    shortDescription: 'Palace 5 étoiles avec vue lagune au cœur du Plateau',
    highlights: ['Piscine panoramique', 'Spa premium', 'Gastronomie', 'Vue lagune'],
    featured: false,
  },
  {
    id: '8',
    name: 'Marché d\'Abidjan',
    city: 'Abidjan',
    type: 'culture',
    image: 'https://images.pexels.com/photos/5463314/pexels-photo-5463314.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.2,
    reviews: 342,
    price: 0,
    priceUnit: 'Gratuit',
    description: 'Les marchés d\'Abidjan sont une expérience sensorielle unique. Du marché de Cocody aux tissus wax colorés, au marché d\'Adjamé avec ses épices et produits frais, chaque marché raconte l\'âme ivoirienne. Goûtez aux fruits tropicaux, négociez les pagne wax et imprégnez-vous de l\'effervescence locale.',
    shortDescription: 'Experience sensorielle au cœur des marchés colorés d\'Abidjan',
    highlights: ['Tissus wax', 'Épices', 'Fruits tropicaux', 'Ambiance locale'],
    featured: false,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    author: 'Aminata K.',
    avatar: 'AK',
    rating: 5,
    date: '15 mars 2026',
    comment: 'Une expérience incroyable ! L\'assistant IA m\'a recommandé des endroits que je ne connaissais même pas. Grand-Bassam était magnifique.',
  },
  {
    id: '2',
    author: 'Jean-Pierre M.',
    avatar: 'JM',
    rating: 4,
    date: '28 février 2026',
    comment: 'Très bonne plateforme. La réservation était simple et rapide. Je recommande pour les voyages en Côte d\'Ivoire.',
  },
  {
    id: '3',
    author: 'Sophie L.',
    avatar: 'SL',
    rating: 5,
    date: '10 janvier 2026',
    comment: 'L\'itinéraire généré par l\'IA était parfait pour notre séjour de 3 jours. On a découvert des pépites cachées !',
  },
  {
    id: '4',
    author: 'Moussa D.',
    avatar: 'MD',
    rating: 4,
    date: '5 décembre 2025',
    comment: 'Facile à utiliser et les prix sont compétitifs. Le support est très réactif aussi.',
  },
];

export const quickSuggestions = [
  'Planifier un voyage',
  'Restaurants à Abidjan',
  'Itinéraire 3 jours',
  'Meilleures plages',
  'Hôtels pas chers',
  'Culture et musées',
];

export const typeLabels: Record<Destination['type'], string> = {
  plage: 'Plage',
  hotel: 'Hôtel',
  restaurant: 'Restaurant',
  culture: 'Culture',
  nature: 'Nature',
  aventure: 'Aventure',
};

export const typeIcons: Record<Destination['type'], string> = {
  plage: 'Waves',
  hotel: 'Hotel',
  restaurant: 'UtensilsCrossed',
  culture: 'Landmark',
  nature: 'Trees',
  aventure: 'Mountain',
};
