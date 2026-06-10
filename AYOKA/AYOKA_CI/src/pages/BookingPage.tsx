import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Check,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { destinations } from '../data';

const steps = [
  { label: 'Date', icon: Calendar },
  { label: 'Options', icon: Sparkles },
  { label: 'Paiement', icon: CreditCard },
  { label: 'Confirmation', icon: Check },
];

export default function BookingPage() {
  const { id } = useParams();
  const d = destinations.find((dest) => dest.id === id);
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [option, setOption] = useState('standard');

  if (!d) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-heading font-bold text-2xl text-navy-800">Destination non trouvée</p>
          <Link to="/explorer" className="btn-primary mt-4 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 pt-24 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <Link
          to={`/destination/${d.id}`}
          className="inline-flex items-center gap-2 text-navy-800 font-heading font-medium text-sm mb-6 hover:text-ai-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à {d.name}
        </Link>

        {/* Progress Steps */}
        <div className="card-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      i < step
                        ? 'bg-nature-400 text-white'
                        : i === step
                          ? 'bg-navy-800 text-white shadow-soft'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {i < step ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs font-heading font-medium mt-2 ${
                      i <= step ? 'text-navy-800' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 sm:w-20 mx-2 rounded-full transition-colors duration-300 ${
                      i < step ? 'bg-nature-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Step Content */}
          <div className="lg:col-span-2">
            {step === 0 && (
              <div className="card-lg p-6 animate-fade-in">
                <h2 className="font-heading font-bold text-xl text-navy-800 mb-6">
                  Choisissez votre date
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">
                      Date d'arrivée
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">
                      Nombre de voyageurs
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-navy-800 font-heading font-bold hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-heading font-bold text-xl text-navy-800">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(12, guests + 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-navy-800 font-heading font-bold hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => selectedDate && setStep(1)}
                  className={`mt-8 w-full flex items-center justify-center gap-2 ${
                    selectedDate ? 'btn-primary' : 'bg-gray-200 text-gray-400 px-6 py-3 rounded-xl font-heading font-semibold cursor-not-allowed'
                  }`}
                >
                  Continuer <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="card-lg p-6 animate-fade-in">
                <h2 className="font-heading font-bold text-xl text-navy-800 mb-6">
                  Sélectionnez une option
                </h2>
                <div className="space-y-4">
                  {[
                    { id: 'standard', name: 'Standard', desc: 'Expérience basique avec guide', price: d.price },
                    { id: 'premium', name: 'Premium', desc: 'Guide privé + transport inclus', price: Math.round(d.price * 1.5) },
                    { id: 'luxe', name: 'Luxe', desc: 'VIP avec hôtel 5 étoiles + chauffeur', price: Math.round(d.price * 2.5) },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setOption(opt.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                        option === opt.id
                          ? 'border-navy-800 bg-navy-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                option === opt.id ? 'border-navy-800 bg-navy-800' : 'border-gray-300'
                              }`}
                            >
                              {option === opt.id && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="font-heading font-semibold text-navy-800">{opt.name}</span>
                          </div>
                          <p className="text-gray-500 text-sm font-body mt-1 ml-7">{opt.desc}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-heading font-bold text-navy-800">
                            {opt.price.toLocaleString()}
                          </span>
                          <span className="text-gray-400 text-xs font-body ml-1">FCFA</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(0)} className="btn-outline flex-1">
                    Retour
                  </button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    Continuer <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card-lg p-6 animate-fade-in">
                <h2 className="font-heading font-bold text-xl text-navy-800 mb-6">
                  Paiement
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">
                      Nom complet
                    </label>
                    <input type="text" placeholder="Kouamé Jean" className="input-field" />
                  </div>
                  <div>
                    <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">
                      Email
                    </label>
                    <input type="email" placeholder="jean@email.com" className="input-field" />
                  </div>
                  <div>
                    <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">
                      Numéro de carte
                    </label>
                    <input type="text" placeholder="4242 4242 4242 4242" className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">
                        Expiration
                      </label>
                      <input type="text" placeholder="MM/AA" className="input-field" />
                    </div>
                    <div>
                      <label className="font-heading font-semibold text-sm text-navy-800 mb-2 block">
                        CVV
                      </label>
                      <input type="text" placeholder="123" className="input-field" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-gray-500 text-sm font-body">
                  <Shield className="w-4 h-4 text-nature-400" />
                  Paiement sécurisé par chiffrement SSL
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1">
                    Retour
                  </button>
                  <button onClick={() => setStep(3)} className="btn-gold flex-1 flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4" /> Payer
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card-lg p-8 text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-nature-400/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-nature-400" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-navy-800 mb-2">
                  Réservation confirmée !
                </h2>
                <p className="text-gray-500 font-body mb-6">
                  Votre réservation pour {d.name} a été confirmée. Vous recevrez un email de confirmation.
                </p>
                <div className="inline-block p-4 rounded-xl bg-beige-100 mb-6">
                  <div className="font-heading font-semibold text-sm text-navy-800">Référence</div>
                  <div className="font-heading font-bold text-lg text-navy-800 tracking-wider">
                    AYC-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link to="/reservations" className="btn-primary flex items-center gap-2">
                    Mes réservations
                  </Link>
                  <Link to="/" className="btn-outline">
                    Accueil
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="card-lg p-6 h-fit sticky top-24">
            <div className="relative h-32 rounded-xl overflow-hidden mb-4">
              <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-2 left-3">
                <span className="font-heading font-semibold text-white text-sm">{d.name}</span>
              </div>
            </div>
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-gray-500">Destination</span>
                <span className="font-heading font-semibold text-navy-800">{d.name}</span>
              </div>
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-heading font-semibold text-navy-800">{selectedDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Voyageurs</span>
                <span className="font-heading font-semibold text-navy-800">{guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Option</span>
                <span className="font-heading font-semibold text-navy-800 capitalize">{option}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-heading font-semibold text-navy-800">Total</span>
                <span className="font-heading font-bold text-lg text-navy-800">
                  {(
                    option === 'premium'
                      ? Math.round(d.price * 1.5)
                      : option === 'luxe'
                        ? Math.round(d.price * 2.5)
                        : d.price
                  ).toLocaleString()}{' '}
                  FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
