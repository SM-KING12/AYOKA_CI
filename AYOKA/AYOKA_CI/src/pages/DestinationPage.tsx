import { useParams, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Heart,
  Share2,
  Sparkles,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { destinations, reviews } from '../data';

export default function DestinationPage() {
  const { id } = useParams();
  const d = destinations.find((dest) => dest.id === id);

  if (!d) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-heading font-bold text-2xl text-navy-800">Destination non trouvée</p>
          <Link to="/explorer" className="btn-primary mt-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour à l'exploration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={d.image}
          alt={d.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-800/70 via-transparent to-navy-800/20" />
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Link to="/explorer" className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-white font-heading font-medium text-sm hover:bg-white/20 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <div className="flex gap-2">
            <button className="glass p-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
              <Heart className="w-5 h-5" />
            </button>
            <button className="glass p-3 rounded-xl text-white hover:bg-white/20 transition-all duration-300">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-heading font-semibold bg-gold-500/90 text-navy-800">
              {d.type.charAt(0).toUpperCase() + d.type.slice(1)}
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white">{d.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="font-body text-sm">{d.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
              <span className="font-heading font-semibold text-white text-sm">{d.rating}</span>
              <span className="text-white/60 text-sm font-body">({d.reviews} avis)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="card-lg p-6">
              <h2 className="font-heading font-bold text-xl text-navy-800 mb-4">À propos</h2>
              <p className="text-gray-600 font-body leading-relaxed">{d.description}</p>

              <div className="flex flex-wrap gap-3 mt-6">
                {d.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-50 text-navy-800 text-xs font-heading font-medium"
                  >
                    <Check className="w-3.5 h-3.5 text-ai-400" />
                    {h}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                {[
                  { icon: Clock, label: 'Durée', value: '2-4h' },
                  { icon: Users, label: 'Groupes', value: '1-12 pers.' },
                  { icon: Star, label: 'Note', value: `${d.rating}/5` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-5 h-5 text-ai-400 mx-auto mb-1" />
                    <div className="font-heading font-semibold text-sm text-navy-800">{value}</div>
                    <div className="text-gray-400 text-xs font-body">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="card-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-xl text-navy-800">Avis voyageurs</h2>
                <span className="text-ai-400 font-heading font-semibold text-sm">{d.reviews} avis</span>
              </div>
              <div className="space-y-4">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
                          <span className="text-white font-heading font-semibold text-xs">{r.avatar}</span>
                        </div>
                        <div>
                          <div className="font-heading font-semibold text-sm text-navy-800">{r.author}</div>
                          <div className="text-gray-400 text-xs font-body">{r.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-body">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking & AI Suggestions */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="card-lg p-6 sticky top-24">
              {d.price > 0 && (
                <div className="mb-4">
                  <span className="font-heading font-bold text-3xl text-navy-800">
                    {d.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 font-body text-sm ml-2">FCFA</span>
                  <div className="text-gray-400 text-xs font-body mt-0.5">{d.priceUnit}</div>
                </div>
              )}

              <Link
                to={`/booking/${d.id}`}
                className="btn-primary w-full flex items-center justify-center gap-2 text-center"
              >
                Réserver maintenant <ChevronRight className="w-4 h-4" />
              </Link>

              <button className="btn-outline w-full flex items-center justify-center gap-2 mt-3">
                <Heart className="w-4 h-4" /> Sauvegarder
              </button>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                {[
                  'Annulation gratuite 24h',
                  'Paiement sécurisé',
                  'Support 24/7',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-nature-400" />
                    <span className="font-body text-gray-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="card-lg p-6 glass-ai">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai-400 to-ai-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-heading font-semibold text-sm text-navy-800">Suggestion IA</div>
                  <div className="text-ai-400 text-xs font-body">Basé sur vos préférences</div>
                </div>
              </div>

              {destinations
                .filter((dest) => dest.id !== d.id && dest.type === d.type)
                .slice(0, 2)
                .map((s) => (
                  <Link
                    key={s.id}
                    to={`/destination/${s.id}`}
                    className="flex gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 mb-2"
                  >
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-heading font-semibold text-sm text-navy-800 truncate">{s.name}</div>
                      <div className="text-gray-500 text-xs font-body">{s.city}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                        <span className="text-xs font-heading font-medium">{s.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}

              <Link
                to="/assistant"
                className="flex items-center gap-2 text-ai-400 font-heading font-semibold text-sm mt-4 hover:gap-3 transition-all duration-300"
              >
                Voir plus de suggestions <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
