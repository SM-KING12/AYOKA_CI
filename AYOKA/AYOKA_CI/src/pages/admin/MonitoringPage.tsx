import { Eye, Activity, Server, Clock, CheckCircle, AlertTriangle, Users, DollarSign } from 'lucide-react';
import { usePartner } from '../../contexts/PartnerContext';
import { PageTransition } from '../../components/UI';

const systemHealth = [
  { name: 'Serveur API', status: 'operational', uptime: '99.9%' },
  { name: 'Base de données', status: 'operational', uptime: '99.8%' },
  { name: 'Assistant IA', status: 'operational', uptime: '99.5%' },
  { name: 'Système paiement', status: 'degraded', uptime: '97.2%' },
];

const recentActivity = [
  { time: '14:30', event: 'Nouveau partenaire inscrit', detail: 'Man Adventures', type: 'success' },
  { time: '12:15', event: 'Service validé', detail: 'Visite du Quartier Colonial', type: 'success' },
  { time: '09:45', event: 'Partenaire bloqué', detail: 'Man Adventures', type: 'warning' },
  { time: '08:00', event: 'Réservation annulée', detail: 'Ref #BK-004', type: 'alert' },
  { time: 'Hier', event: 'Maintenance système', detail: 'Mise à jour IA v2.1', type: 'info' },
];

export default function MonitoringPage() {
  const { partnerList } = usePartner();

  const activePartners = partnerList.filter((p) => !p.blocked).length;
  const totalRevenue = partnerList.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-navy-800">Monitoring</h1>
          <p className="text-gray-500 font-body text-sm mt-0.5">État de la plateforme en temps réel</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-nature-400/10 text-nature-400 text-xs font-heading font-medium">
          <Activity className="w-4 h-4" /> Opérationnel
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: 'Partenaires actifs', value: activePartners, color: 'from-ai-400 to-ai-600' },
          { icon: DollarSign, label: 'Revenus plateforme', value: `${(totalRevenue / 1000000).toFixed(1)}M FCFA`, color: 'from-gold-400 to-gold-600' },
          { icon: Server, label: 'Uptime moyen', value: '99.6%', color: 'from-nature-400 to-nature-500' },
          { icon: Clock, label: 'Temps réponse IA', value: '1.2s', color: 'from-navy-600 to-navy-800' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-card p-5 shadow-soft">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-heading font-bold text-xl text-navy-800">{value}</div>
            <div className="text-gray-500 text-xs font-body">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">État des services</h2>
          <div className="space-y-3">
            {systemHealth.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${s.status === 'operational' ? 'bg-nature-400' : 'bg-gold-500'}`} />
                  <span className="font-heading font-medium text-sm text-navy-800">{s.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs font-body">{s.uptime}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-medium ${
                    s.status === 'operational' ? 'bg-nature-400/10 text-nature-400' : 'bg-gold-500/10 text-gold-500'
                  }`}>
                    {s.status === 'operational' ? 'OK' : 'Dégradé'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Activité récente</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  a.type === 'success' ? 'bg-nature-400/10' :
                  a.type === 'warning' ? 'bg-gold-500/10' :
                  a.type === 'alert' ? 'bg-red-500/10' :
                  'bg-ai-400/10'
                }`}>
                  {a.type === 'success' ? <CheckCircle className="w-4 h-4 text-nature-400" /> :
                   a.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-gold-500" /> :
                   a.type === 'alert' ? <AlertTriangle className="w-4 h-4 text-red-500" /> :
                   <Eye className="w-4 h-4 text-ai-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-medium text-sm text-navy-800">{a.event}</div>
                  <div className="text-gray-400 text-xs font-body">{a.detail}</div>
                </div>
                <span className="text-gray-400 text-xs font-body whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
