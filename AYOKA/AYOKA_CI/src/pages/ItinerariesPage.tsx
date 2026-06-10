import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Calendar, DollarSign, Clock, Sparkles } from 'lucide-react';
import { useItineraries } from '../contexts/ItinerariesContext';
import { PageTransition, StaggerContainer, StaggerItem, EmptyState } from '../components/UI';
import Navbar from '../components/Layout';

export default function ItinerariesPage() {
  const { savedItineraries } = useItineraries();

  return (
    <PageTransition className="min-h-screen bg-beige-50">
      <Navbar />
      <div className="pt-24 pb-24 md:pb-8 max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-800">Mes itinéraires</h1>
            <p className="text-gray-500 font-body text-sm mt-1">Plans de voyage sauvegardés et générés par l'IA</p>
          </div>
          <Link to="/itineraires/generer" className="btn-ai flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Générer
          </Link>
        </div>

        {savedItineraries.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Aucun itinéraire"
            description="Générez votre premier itinéraire avec notre assistant IA"
            action={
              <Link to="/itineraires/generer" className="btn-ai flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4" /> Créer un itinéraire
              </Link>
            }
          />
        ) : (
          <StaggerContainer className="space-y-4">
            {savedItineraries.map((it) => (
              <StaggerItem key={it.id}>
                <Link to={`/itineraires/${it.id}`} className="card-lg p-5 flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-bold text-navy-800 group-hover:text-ai-400 transition-colors">{it.name}</div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-500 text-xs font-body">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {it.days.length} jour{it.days.length > 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {it.totalBudget.toLocaleString()} FCFA</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Créé {it.createdAt}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-ai-400 transition-colors" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </PageTransition>
  );
}
