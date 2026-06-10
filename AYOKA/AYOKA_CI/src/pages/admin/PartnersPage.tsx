import { useState } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldOff,
  Eye,
  Star,
} from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { PageTransition, StaggerContainer, StaggerItem, EmptyState, ConfirmDialog } from '../../components/UI';

export default function PartnersPage() {
  const { partnerList, blockPartner, unblockPartner } = usePartner();
  const [search, setSearch] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'block' | 'unblock' } | null>(null);

  const filtered = partnerList.filter((p) =>
    p.businessName.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.action === 'block') blockPartner(confirmAction.id);
    else unblockPartner(confirmAction.id);
    setConfirmAction(null);
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Partenaires</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">{partnerList.length} partenaires inscrits</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un partenaire..."
          className="input-field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Aucun partenaire trouvé" description="Ajustez votre recherche" />
      ) : (
        <StaggerContainer className="space-y-4">
          {filtered.map((p) => (
            <StaggerItem key={p.id}>
              <div className={`bg-white rounded-card-lg shadow-soft p-5 transition-all duration-300 ${p.blocked ? 'opacity-60 border-l-4 border-red-400' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-heading font-bold">{p.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading font-bold text-navy-800">{p.businessName}</span>
                      {p.verified && (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-ai-400/10 text-ai-400 text-[10px] font-heading font-medium">
                          <Shield className="w-3 h-3" /> Vérifié
                        </span>
                      )}
                      {p.blocked && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-heading font-medium">
                          Bloqué
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 text-sm font-body">{p.ownerName} · {p.city}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-center flex-shrink-0">
                    <div>
                      <div className="font-heading font-bold text-navy-800">{p.services}</div>
                      <div className="text-gray-400 text-[10px] font-body">Services</div>
                    </div>
                    <div>
                      <div className="font-heading font-bold text-navy-800">{p.bookings}</div>
                      <div className="text-gray-400 text-[10px] font-body">Réserv.</div>
                    </div>
                    <div>
                      <div className="font-heading font-bold text-navy-800">{(p.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-gray-400 text-[10px] font-body">FCFA</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-0.5 justify-center">
                        <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                        <span className="font-heading font-bold text-navy-800 text-sm">{p.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 text-xs font-heading font-medium hover:bg-navy-100 transition-colors flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Détails
                    </button>
                    {p.blocked ? (
                      <button
                        onClick={() => setConfirmAction({ id: p.id, action: 'unblock' })}
                        className="px-3 py-1.5 rounded-lg bg-nature-400/10 text-nature-400 text-xs font-heading font-medium hover:bg-nature-400/20 transition-colors flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" /> Débloquer
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmAction({ id: p.id, action: 'block' })}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-heading font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                      >
                        <ShieldOff className="w-3 h-3" /> Bloquer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      <ConfirmDialog
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction?.action === 'block' ? 'Bloquer le partenaire' : 'Débloquer le partenaire'}
        description={confirmAction?.action === 'block'
          ? 'Ce partenaire ne pourra plus accéder à la plateforme ni recevoir de réservations.'
          : 'Ce partenaire pourra à nouveau accéder à la plateforme.'}
        confirmLabel={confirmAction?.action === 'block' ? 'Bloquer' : 'Débloquer'}
        danger={confirmAction?.action === 'block'}
      />
    </PageTransition>
  );
}
