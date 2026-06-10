import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import { useItineraries } from '../contexts/ItinerariesContext';
import { generateItinerary } from '../mock/mockAiService';
import { destinations } from '../data';
import { PageTransition } from '../components/UI';
import Navbar from '../components/Layout';

const steps = [
  { label: 'Destination', icon: MapPin },
  { label: 'Durée', icon: Calendar },
  { label: 'Budget', icon: DollarSign },
  { label: 'Résultat', icon: Sparkles },
];

export default function ItineraryGeneratorPage() {
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState('standard');
  const [generating, setGenerating] = useState(false);
  const { addItinerary } = useItineraries();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    const it = generateItinerary(destination, days, budget);
    addItinerary(it);
    setGenerating(false);
    setStep(3);
  };

  return (
    <PageTransition className="min-h-screen bg-beige-50">
      <Navbar />
      <div className="pt-24 pb-24 md:pb-8 max-w-2xl mx-auto px-4">
        <Link to="/itineraires" className="inline-flex items-center gap-2 text-navy-800 font-heading font-medium text-sm mb-6 hover:text-ai-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Mes itinéraires
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ai-400 to-ai-600 flex items-center justify-center mx-auto mb-4 shadow-ai-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-navy-800">Générateur d'itinéraire</h1>
          <p className="text-gray-500 font-body text-sm mt-1">L'IA crée votre voyage idéal en quelques clics</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map(({ label, icon: Icon }, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  i < step ? 'bg-nature-400 text-white' : i === step ? 'bg-navy-800 text-white shadow-soft' : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <Sparkles className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-heading font-medium mt-1 ${i <= step ? 'text-navy-800' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-8 sm:w-16 mx-1 rounded-full ${i < step ? 'bg-nature-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-lg p-6">
            <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Où souhaitez-vous aller ?</h2>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ex: Abidjan, Grand-Bassam, Man..."
              className="input-field mb-4"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {destinations.slice(0, 6).map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDestination(d.city)}
                  className={`p-3 rounded-xl text-left transition-all duration-300 ${
                    destination === d.city
                      ? 'bg-navy-800 text-white'
                      : 'bg-gray-50 text-navy-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-heading font-semibold text-sm">{d.name}</div>
                  <div className={`text-xs font-body ${destination === d.city ? 'text-white/60' : 'text-gray-400'}`}>{d.city}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => destination && setStep(1)}
              className={`mt-6 w-full flex items-center justify-center gap-2 ${destination ? 'btn-primary' : 'bg-gray-200 text-gray-400 px-6 py-3 rounded-xl font-heading font-semibold cursor-not-allowed'}`}
            >
              Continuer <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-lg p-6">
            <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Combien de jours ?</h2>
            <div className="flex items-center gap-6 mb-6">
              <button onClick={() => setDays(Math.max(1, days - 1))} className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-navy-800 font-heading font-bold hover:bg-gray-200 transition-colors text-xl">-</button>
              <div className="text-center">
                <span className="font-heading font-bold text-4xl text-navy-800">{days}</span>
                <div className="text-gray-500 text-sm font-body">jour{days > 1 ? 's' : ''}</div>
              </div>
              <button onClick={() => setDays(Math.min(7, days + 1))} className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-navy-800 font-heading font-bold hover:bg-gray-200 transition-colors text-xl">+</button>
            </div>
            <div className="flex gap-2">
              {[2, 3, 5, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`flex-1 py-2 rounded-xl font-heading font-medium text-sm transition-all ${days === d ? 'bg-navy-800 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  {d}j
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(0)} className="btn-outline flex-1">Retour</button>
              <button onClick={() => setStep(2)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-lg p-6">
            <h2 className="font-heading font-bold text-lg text-navy-800 mb-4">Quel budget ?</h2>
            <div className="space-y-3">
              {[
                { id: 'economique', name: 'Économique', desc: 'Auberges, transports locaux, street food', range: '< 50 000 FCFA/jour' },
                { id: 'standard', name: 'Standard', desc: 'Hôtels 3-4 étoiles, restaurants, visites guidées', range: '50K - 100K FCFA/jour' },
                { id: 'premium', name: 'Premium', desc: 'Hôtels 5 étoiles, chauffeur privé, gastronomie', range: '> 100 000 FCFA/jour' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                    budget === b.id ? 'border-navy-800 bg-navy-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-heading font-semibold text-navy-800">{b.name}</div>
                      <div className="text-gray-500 text-xs font-body mt-0.5">{b.desc}</div>
                    </div>
                    <span className="font-heading font-semibold text-sm text-navy-800">{b.range}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">Retour</button>
              <button onClick={handleGenerate} className="btn-ai flex-1 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Générer l'itinéraire
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && !generating && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-lg p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-nature-400/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-ai-400" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-navy-800 mb-2">Itinéraire créé !</h2>
            <p className="text-gray-500 font-body mb-6">
              Votre itinéraire pour {destination} a été généré avec succès par l'IA.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/itineraires')} className="btn-primary flex items-center gap-2">
                Voir mes itinéraires <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {generating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-lg p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-ai-400/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-ai-400 animate-pulse-soft" />
            </div>
            <h2 className="font-heading font-bold text-xl text-navy-800 mb-2">L'IA génère votre itinéraire...</h2>
            <p className="text-gray-500 font-body text-sm mb-6">Analyse de vos préférences et création du plan de voyage optimal</p>
            <div className="flex justify-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-ai-400 animate-dot-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-ai-400 animate-dot-bounce" style={{ animationDelay: '0.16s' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-ai-400 animate-dot-bounce" style={{ animationDelay: '0.32s' }} />
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
