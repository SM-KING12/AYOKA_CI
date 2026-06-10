import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';
import { useItineraries } from '../contexts/ItinerariesContext';
import { PageTransition, EmptyState } from '../components/UI';
import Navbar from '../components/Layout';

export default function ItineraryDetailPage() {
  const { id } = useParams();
  const { getItinerary } = useItineraries();
  const itinerary = id ? getItinerary(id) : undefined;

  if (!itinerary) {
    return (
      <PageTransition className="min-h-screen bg-beige-50">
        <Navbar />
        <div className="pt-24 pb-24 md:pb-8 max-w-5xl mx-auto px-4">
          <EmptyState
            icon={MapPin}
            title="Itinéraire non trouvé"
            description="Cet itinéraire n'existe pas ou a été supprimé"
            action={<Link to="/itineraires" className="btn-primary text-sm">Mes itinéraires</Link>}
          />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-beige-50">
      <Navbar />
      <div className="pt-24 pb-24 md:pb-8 max-w-4xl mx-auto px-4">
        <Link to="/itineraires" className="inline-flex items-center gap-2 text-navy-800 font-heading font-medium text-sm mb-6 hover:text-ai-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Mes itinéraires
        </Link>

        {/* Header */}
        <div className="card-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-2xl text-navy-800">{itinerary.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-500 text-sm font-body">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {itinerary.days.length} jour{itinerary.days.length > 1 ? 's' : ''}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> Budget : {itinerary.totalBudget.toLocaleString()} FCFA</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Créé {itinerary.createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="card-lg overflow-hidden mb-6">
          <div className="h-40 bg-gradient-to-br from-navy-50 to-ai-50 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-ai-400 animate-pulse-soft" />
              <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-gold-500 animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-1/4 left-1/2 w-3 h-3 rounded-full bg-nature-400 animate-pulse-soft" style={{ animationDelay: '1s' }} />
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-ai-400 mx-auto mb-2" />
              <p className="font-heading font-semibold text-navy-800 text-sm">Carte de l'itinéraire</p>
              <p className="text-gray-400 text-xs font-body">Bientôt disponible</p>
            </div>
          </div>
        </div>

        {/* Days */}
        <div className="space-y-6">
          {itinerary.days.map((day) => {
            const dayCost = day.activities.reduce((sum, a) => sum + a.cost, 0);
            return (
              <div key={day.day} className="card-lg overflow-hidden">
                <div className="bg-gradient-to-r from-navy-800 to-navy-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-ai-400 text-xs font-heading font-semibold uppercase tracking-wider">Jour {day.day}</span>
                      <h2 className="font-heading font-bold text-lg text-white">{day.title}</h2>
                    </div>
                    <span className="text-gold-500 font-heading font-semibold text-sm">{dayCost.toLocaleString()} FCFA</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {day.activities.map((act, i) => (
                    <div key={i} className="px-6 py-4 flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <span className="font-heading font-bold text-ai-400 text-sm">{act.time}</span>
                        <div className="w-px h-full bg-gray-200 mt-2" />
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="font-heading font-semibold text-navy-800 text-sm">{act.name}</div>
                        <div className="text-gray-500 text-xs font-body mt-0.5">{act.description}</div>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-gray-400 text-xs font-body">
                            <MapPin className="w-3 h-3" /> {act.location}
                          </span>
                          <span className="flex items-center gap-1 text-gray-400 text-xs font-body">
                            <Clock className="w-3 h-3" /> {act.duration}
                          </span>
                          {act.cost > 0 && (
                            <span className="font-heading font-semibold text-navy-800 text-xs">
                              {act.cost.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Budget Summary */}
        <div className="card-lg p-6 mt-6">
          <h3 className="font-heading font-bold text-lg text-navy-800 mb-4">Résumé du budget</h3>
          <div className="space-y-3">
            {itinerary.days.map((day) => {
              const dayCost = day.activities.reduce((sum, a) => sum + a.cost, 0);
              return (
                <div key={day.day} className="flex items-center justify-between text-sm">
                  <span className="font-body text-gray-600">Jour {day.day} - {day.title}</span>
                  <span className="font-heading font-semibold text-navy-800">{dayCost.toLocaleString()} FCFA</span>
                </div>
              );
            })}
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="font-heading font-bold text-navy-800">Total</span>
              <span className="font-heading font-bold text-xl text-navy-800">{itinerary.totalBudget.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
