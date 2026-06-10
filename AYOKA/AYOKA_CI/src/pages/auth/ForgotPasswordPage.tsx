import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageTransition } from '../../components/UI';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { forgotPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Veuillez entrer votre email');
      return;
    }
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError('Erreur lors de l\'envoi');
    }
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 relative overflow-hidden px-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-ai-400 rounded-full blur-[128px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-ai-400 to-ai-600 rounded-xl flex items-center justify-center shadow-ai-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-2xl text-white">
              AYOKA<span className="text-gold-500"> CI</span>
            </span>
          </Link>
          <h1 className="font-heading font-bold text-3xl text-white mb-2">Mot de passe oublié</h1>
          <p className="text-white/50 font-body">Recevez un lien de réinitialisation</p>
        </div>

        <div className="glass-dark rounded-card-lg p-6 shadow-2xl">
          {sent ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-nature-400/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-nature-400" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">Email envoyé !</h3>
              <p className="text-white/50 font-body text-sm mb-6">
                Si un compte existe pour <span className="text-ai-400">{email}</span>, vous recevrez un lien de réinitialisation.
              </p>
              <button onClick={() => navigate('/auth/reset-password')} className="btn-ai w-full">
                J'ai reçu le code
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-body"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="text-white/60 text-xs font-heading font-medium mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:ring-2 focus:ring-ai-400/40 focus:border-ai-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-ai w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Envoyer le lien <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link to="/auth/login" className="text-ai-400 font-heading font-semibold text-sm inline-flex items-center gap-1 hover:text-ai-300 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
