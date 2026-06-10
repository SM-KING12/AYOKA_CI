import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Heart,
  Clock,
  MapPin,
  Sparkles,
  ChevronRight,
  Star,
  Search,
  Settings,
  Plus,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useItineraries } from '../contexts/ItinerariesContext';
import { useNotifications } from '../contexts/NotificationsContext';
import { destinations } from '../data';
import { mockSearchHistory } from '../mock/mockAdminData';
import { PageTransition, StaggerContainer, StaggerItem, EmptyState } from '../components/UI';
import Navbar from '../components/Layout';

type Tab = 'reservations' | 'favorites' | 'history' | 'itineraries' | 'settings';

const tabs: { id: Tab; label: string; icon: typeof CalendarCheck }[] = [
  { id: 'reservations', label: 'Réservations', icon: CalendarCheck },
  { id: 'favorites', label: 'Favoris', icon: Heart },
  { id: 'history', label: 'Historique', icon: Clock },
  { id: 'itineraries', label: 'Itinéraires', icon: MapPin },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

const mockReservations = [
  { id: '1', destination: 'Grand-Bassam', city: 'Grand-Bassam', date: '15-17 Mars 2026', guests: 2, amount: '150 000 FCFA', status: 'confirmed', image: destinations[0].image },
  { id: '2', destination: 'Parc National de Taï', city: 'Taï', date: '22-24 Avril 2026', guests: 4, amount: '100 000 FCFA', status: 'pending', image: destinations[1].image },
  { id: '3', destination: 'Assinie-Mafia', city: 'Assinie', date: '5-7 Mai 2026', guests: 2, amount: '70 000 FCFA', status: 'confirmed', image: destinations[2].image },
];

const statusMap: Record<string, { label: string; color: string }> = {
  confirmed: { label: 'Confirmée', color: 'bg-nature-400/10 text-nature-400' },
  pending: { label: 'En attente', color: 'bg-gold-500/10 text-gold-500' },
  cancelled: { label: 'Annulée', color: 'bg-red-500/10 text-red-500' },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('reservations');
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, count: favCount } = useFavorites();
  const { savedItineraries } = useItineraries();
  const { unreadCount } = useNotifications();

  const favoriteDestinations = destinations.filter((d) => isFavorite(d.id));

  return (
    <PageTransition className="min-h-screen bg-beige-50">
      <Navbar />
      <div className="pt-24 pb-24 md:pb-8 max-w-6xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center shadow-ai-glow">
            <span className="text-white font-heading font-bold text-xl">{user?.avatar || 'AK'}</span>
          </div>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-2xl text-navy-800">
              Bonjour, {user?.firstName || 'Aminata'}
            </h1>
            <p className="text-gray-500 font-body text-sm">
              {user?.membership === 'premium' ? 'Voyageur Premium' : 'Voyageur'} · {favCount} favoris · {unreadCount} notifications
            </p>
          </div>
          <Link to="/notifications" className="relative p-3 rounded-xl bg-white shadow-soft hover:shadow-card transition-all">
            <Sparkles className="w-5 h-5 text-ai-400" />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ai-400 text-white text-[10px] font-heading font-bold flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { value: mockReservations.length, label: 'Réservations', icon: CalendarCheck },
            { value: favCount, label: 'Favoris', icon: Heart },
            { value: savedItineraries.length, label: 'Itinéraires', icon: MapPin },
            { value: '4.9', label: 'Note', icon: Star },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white rounded-card p-4 shadow-soft">
              <Icon className="w-5 h-5 text-ai-400 mb-2" />
              <div className="font-heading font-bold text-xl text-navy-800">{value}</div>
              <div className="text-gray-500 text-xs font-body">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === id
                  ? 'bg-navy-800 text-white shadow-soft'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-soft'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'reservations' && (
          <StaggerContainer className="space-y-4">
            {mockReservations.length === 0 ? (
              <EmptyState
                icon={CalendarCheck}
                title="Aucune réservation"
                description="Commencez à explorer les destinations de Côte d'Ivoire"
                action={<Link to="/explorer" className="btn-primary text-sm">Explorer</Link>}
              />
            ) : (
              mockReservations.map((r) => (
                <StaggerItem key={r.id}>
                  <div className="card-lg overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-36 h-32 sm:h-auto overflow-hidden">
                        <img src={r.image} alt={r.destination} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-heading font-bold text-navy-800">{r.destination}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-heading font-medium ${statusMap[r.status].color}`}>
                            {statusMap[r.status].label}
                          </span>
                        </div>
                        <div className="text-gray-500 text-sm font-body space-y-1">
                          <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {r.city}</div>
                          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {r.date} · {r.guests} voyageur{r.guests > 1 ? 's' : ''}</div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <span className="font-heading font-bold text-navy-800">{r.amount}</span>
                          <Link to={`/destination/${r.id}`} className="text-ai-400 text-sm font-heading font-medium flex items-center gap-1 hover:gap-2 transition-all">
                            Détails <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>
        )}

        {activeTab === 'favorites' && (
          <StaggerContainer>
            {favoriteDestinations.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Aucun favori"
                description="Ajoutez des destinations en favori pour les retrouver facilement"
                action={<Link to="/explorer" className="btn-primary text-sm">Explorer</Link>}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteDestinations.map((d) => (
                  <StaggerItem key={d.id}>
                    <div className="card overflow-hidden group">
                      <div className="relative h-40 overflow-hidden">
                        <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <button
                          onClick={() => toggleFavorite(d.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </button>
                        <div className="absolute bottom-2 left-3">
                          <span className="font-heading font-semibold text-white text-sm">{d.name}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                            <span className="text-xs font-heading font-medium">{d.rating}</span>
                          </div>
                          <span className="font-heading font-bold text-sm text-navy-800">{d.price.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            )}
          </StaggerContainer>
        )}

        {activeTab === 'history' && (
          <StaggerContainer className="space-y-3">
            {mockSearchHistory.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Aucun historique"
                description="Vos recherches apparaîtront ici"
              />
            ) : (
              mockSearchHistory.map((h) => (
                <StaggerItem key={h.id}>
                  <div className="bg-white rounded-xl p-4 shadow-soft flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                      <Search className="w-5 h-5 text-navy-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-semibold text-sm text-navy-800 truncate">{h.query}</div>
                      <div className="text-gray-400 text-xs font-body">{h.timestamp} · {h.results} résultats</div>
                    </div>
                    <Link to={`/explorer?search=${encodeURIComponent(h.query)}`} className="text-ai-400">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>
        )}

        {activeTab === 'itineraries' && (
          <StaggerContainer className="space-y-4">
            <Link to="/itineraires/generer" className="card-lg p-4 flex items-center gap-4 border-2 border-dashed border-ai-400/30 hover:border-ai-400/60">
              <div className="w-10 h-10 rounded-xl bg-ai-400/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-ai-400" />
              </div>
              <div>
                <div className="font-heading font-semibold text-navy-800 text-sm">Générer un itinéraire IA</div>
                <div className="text-gray-400 text-xs font-body">Créer un plan de voyage personnalisé</div>
              </div>
            </Link>

            {savedItineraries.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="Aucun itinéraire"
                description="Générez votre premier itinéraire avec l'IA"
              />
            ) : (
              savedItineraries.map((it) => (
                <StaggerItem key={it.id}>
                  <Link to={`/itineraires/${it.id}`} className="card-lg p-5 flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-bold text-navy-800 group-hover:text-ai-400 transition-colors">{it.name}</div>
                      <div className="text-gray-500 text-xs font-body">{it.days.length} jour{it.days.length > 1 ? 's' : ''} · {it.totalBudget.toLocaleString()} FCFA · Créé {it.createdAt}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-ai-400 transition-colors" />
                  </Link>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>
        )}

        {activeTab === 'settings' && (
          <div className="card-lg p-6 max-w-lg">
            <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Paramètres du compte</h2>
            <div className="space-y-4">
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Prénom</label>
                <input type="text" defaultValue={user?.firstName || 'Aminata'} className="input-field" />
              </div>
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Nom</label>
                <input type="text" defaultValue={user?.lastName || 'Koné'} className="input-field" />
              </div>
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Email</label>
                <input type="email" defaultValue={user?.email || 'aminata@email.com'} className="input-field" />
              </div>
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Téléphone</label>
                <input type="tel" defaultValue={user?.phone || '+225 07 12 34 56'} className="input-field" />
              </div>
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Ville</label>
                <input type="text" defaultValue={user?.city || 'Abidjan'} className="input-field" />
              </div>
              <button className="btn-primary">Sauvegarder</button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
