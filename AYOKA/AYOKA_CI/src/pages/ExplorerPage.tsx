import { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { destinations, typeLabels } from '../data';
import DestinationCard from '../components/DestinationCard';

const budgetRanges = [
  { label: 'Tout', min: 0, max: Infinity },
  { label: '< 10 000 FCFA', min: 0, max: 10000 },
  { label: '10K - 30K', min: 10000, max: 30000 },
  { label: '30K - 60K', min: 30000, max: 60000 },
  { label: '60K+', min: 60000, max: Infinity },
];

const cities = ['Toutes', ...Array.from(new Set(destinations.map((d) => d.city)))];

export default function ExplorerPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [cityIdx, setCityIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const budget = budgetRanges[budgetIdx];
  const city = cities[cityIdx];

  const filtered = destinations.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && d.type !== typeFilter) return false;
    if (d.price < budget.min || d.price > budget.max) return false;
    if (city !== 'Toutes' && d.city !== city) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-beige-50 pt-24 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-navy-800 mb-2">
            Explorer
          </h1>
          <p className="text-gray-500 font-body">
            Découvrez les merveilles de la Côte d'Ivoire
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une destination..."
              className="input-field pl-12"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-heading font-medium text-sm transition-all duration-300 ${
              showFilters ? 'bg-navy-800 text-white' : 'bg-white text-navy-800 border border-gray-200 hover:border-navy-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="card p-6 mb-6 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Type Filter */}
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-3 block">
                  Type d'expérience
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all duration-300 ${
                      typeFilter === 'all' ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tout
                  </button>
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTypeFilter(key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all duration-300 ${
                        typeFilter === key ? 'bg-navy-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-3 block">
                  Budget
                </label>
                <div className="flex flex-wrap gap-2">
                  {budgetRanges.map((b, i) => (
                    <button
                      key={b.label}
                      onClick={() => setBudgetIdx(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all duration-300 ${
                        budgetIdx === i ? 'bg-gold-500 text-navy-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-3 block">
                  Ville
                </label>
                <div className="flex flex-wrap gap-2">
                  {cities.map((c, i) => (
                    <button
                      key={c}
                      onClick={() => setCityIdx(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-medium transition-all duration-300 ${
                        cityIdx === i ? 'bg-ai-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        <div className="card-lg overflow-hidden mb-8">
          <div className="h-48 sm:h-64 bg-gradient-to-br from-navy-50 to-ai-50 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-ai-400 animate-pulse-soft" />
              <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-gold-500 animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
              <div className="absolute bottom-1/4 left-1/2 w-3 h-3 rounded-full bg-nature-400 animate-pulse-soft" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-2/3 w-3 h-3 rounded-full bg-navy-400 animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
            </div>
            <div className="text-center">
              <MapPin className="w-10 h-10 text-ai-400 mx-auto mb-2" />
              <p className="font-heading font-semibold text-navy-800">Carte interactive</p>
              <p className="text-gray-500 text-sm font-body">Vue carte bientôt disponible</p>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 font-body text-sm">
            <span className="font-heading font-semibold text-navy-800">{filtered.length}</span> destination{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-heading font-semibold text-navy-800 text-lg">Aucune destination trouvée</p>
            <p className="text-gray-500 font-body text-sm mt-1">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((d) => (
              <DestinationCard key={d.id} d={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
