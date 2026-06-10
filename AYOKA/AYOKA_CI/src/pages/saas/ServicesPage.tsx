import { useState } from 'react';
import {
  MapPin,
  Star,
  Plus,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  CheckCircle,
} from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { useAuth } from '../../contexts/AuthContext';
import { PageTransition, StaggerContainer, StaggerItem, EmptyState, ConfirmDialog } from '../../components/UI';
import type { PartnerService } from '../../types/partner';

const typeLabels: Record<PartnerService['type'], string> = {
  tour: 'Tour',
  hotel: 'Hôtel',
  restaurant: 'Restaurant',
  transport: 'Transport',
  activity: 'Activité',
};

const statusConfig: Record<PartnerService['status'], { label: string; color: string }> = {
  active: { label: 'Actif', color: 'bg-nature-400/10 text-nature-400' },
  draft: { label: 'En attente', color: 'bg-gold-500/10 text-gold-500' },
  paused: { label: 'En pause', color: 'bg-gray-200 text-gray-500' },
};

export default function ServicesPage() {
  const { services, removeService, toggleServiceStatus, validateService } = usePartner();
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = services.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.destination.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    return matchSearch && matchType;
  });

  const types = ['all', ...new Set(services.map((s) => s.type))];

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Services</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">{services.length} service{services.length !== 1 ? 's' : ''}</p>
        </div>
        {!isAdmin && (
          <button className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un service..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-xl text-xs font-heading font-medium whitespace-nowrap transition-all ${
                typeFilter === t ? 'bg-navy-800 text-white' : 'bg-white text-gray-600 shadow-soft hover:shadow-card'
              }`}
            >
              {t === 'all' ? 'Tout' : typeLabels[t as PartnerService['type']] || t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Aucun service trouvé"
          description="Modifiez vos filtres ou ajoutez un nouveau service"
        />
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <StaggerItem key={s.id}>
              <div className="bg-white rounded-card shadow-soft overflow-hidden group hover:shadow-card transition-all duration-300">
                <div className="relative h-36 overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-lg bg-white/90 text-xs font-heading font-medium text-navy-800">
                      {typeLabels[s.type]}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-heading font-medium ${statusConfig[s.status].color}`}>
                      {statusConfig[s.status].label}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3">
                    <span className="font-heading font-semibold text-white text-sm">{s.name}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs font-body flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.destination}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                      <span className="text-xs font-heading font-medium">{s.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-heading font-bold text-navy-800">{s.price.toLocaleString()} <span className="text-xs text-gray-400 font-body">{s.priceUnit}</span></span>
                    <span className="text-xs text-gray-400 font-body">{s.bookings} réservations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Admin: validate draft services */}
                    {isAdmin && s.status === 'draft' && (
                      <button
                        onClick={() => validateService(s.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-nature-400/10 text-nature-400 text-xs font-heading font-medium hover:bg-nature-400/20 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" /> Valider
                      </button>
                    )}
                    {/* Partner: edit/toggle/delete */}
                    {!isAdmin && (
                      <>
                        <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 text-xs font-heading font-medium hover:bg-navy-100 transition-colors">
                          <Edit3 className="w-3 h-3" /> Modifier
                        </button>
                        <button
                          onClick={() => toggleServiceStatus(s.id)}
                          className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-xs font-heading font-medium hover:bg-gray-100 transition-colors"
                          title={s.status === 'active' ? 'Mettre en pause' : 'Activer'}
                        >
                          {s.status === 'active' ? <ToggleRight className="w-4 h-4 text-nature-400" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setDeleteId(s.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-heading font-medium hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) removeService(deleteId); setDeleteId(null); }}
        title="Supprimer le service"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        danger
      />
    </PageTransition>
  );
}
