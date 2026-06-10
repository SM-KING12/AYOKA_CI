import { Shield, Bot } from 'lucide-react';
import { PageTransition } from '../../components/UI';

export default function AdminSettingsPage() {
  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-navy-800">Paramètres</h1>
        <p className="text-gray-500 font-body text-sm mt-0.5">Configuration de la plateforme</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-ai-400 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-navy-800">Général</h2>
              <p className="text-gray-400 text-xs font-body">Paramètres de base</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Nom de la plateforme</label>
              <input type="text" defaultValue="AYOKA CI" className="input-field" />
            </div>
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Email de contact</label>
              <input type="email" defaultValue="contact@ayoka.ci" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Devise</label>
                <select className="input-field">
                  <option>FCFA</option>
                  <option>EUR</option>
                  <option>USD</option>
                </select>
              </div>
              <div>
                <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Langue</label>
                <select className="input-field">
                  <option>Français</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card-lg shadow-soft p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-400 to-ai-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-navy-800">Assistant IA</h2>
              <p className="text-gray-400 text-xs font-body">Configuration du modèle</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Modèle</label>
              <select className="input-field">
                <option>GPT-4 Turbo</option>
                <option>Claude 3.5 Sonnet</option>
              </select>
            </div>
            <div>
              <label className="font-heading font-semibold text-sm text-navy-800 mb-1.5 block">Température</label>
              <input type="range" min="0" max="100" defaultValue="70" className="w-full accent-ai-400" />
              <div className="flex justify-between text-xs text-gray-400 font-body mt-1">
                <span>Précis</span><span>Créatif</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn-primary">Sauvegarder</button>
      </div>
    </PageTransition>
  );
}
