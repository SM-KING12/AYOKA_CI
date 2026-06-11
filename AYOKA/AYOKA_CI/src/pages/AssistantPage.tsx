/**
 * AssistantPage.tsx — AYOKA CI
 * VERSION 2 — Améliorée :
 *   - Suivi de contexte via ConversationContext (persisté dans la session)
 *   - Affichage de la conversion monétaire dans les messages
 *   - Recommandations "Bon Plan" enrichies avec cartes dédiées
 *   - Correction du bug : generateAIResponse utilisait l'ancienne API sans contexte
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  MapPin,
  Clock,
  Trash2,
  Plus,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { destinations, quickSuggestions, type ChatMessage, type RecommendationCard } from '../data';
import {
  getContextualAiResponse,
  generateItinerary,
  updateContext,
  createEmptyContext,
  extractBudget,
  getBonPlans,
  type ConversationContext,
} from '../mock/mockAiService';
import { useItineraries } from '../contexts/ItinerariesContext';

const aiWelcomeMessage: ChatMessage = {
  id: '0',
  role: 'ai',
  content:
    "Bonjour ! Je suis l'assistant AYOKA, votre guide IA pour découvrir la Côte d'Ivoire. 🌍\n\nJe peux vous aider à :\n• Planifier votre voyage et créer des itinéraires\n• Trouver les meilleures destinations selon vos goûts\n• **Adapter mes recommandations à votre budget** (FCFA, $ ou €)\n\nQue souhaitez-vous explorer ?",
  timestamp: new Date().toISOString(),
};

// ─── Génère la réponse IA + cartes de recommandation ───────────────────────
function generateAIResponse(
  input: string,
  ctx: ConversationContext
): { content: string; cards?: RecommendationCard[]; bonPlanCards?: RecommendationCard[] } {
  const lower = input.toLowerCase();

  // Réponse textuelle contextuelle
  const content = getContextualAiResponse(input, ctx);

  // Cartes de destination selon le thème
  let cards: RecommendationCard[] | undefined;
  if (lower.includes('plage') || lower.includes('bord de mer') || lower.includes('mer')) {
    const beaches = destinations.filter((d) => d.type === 'plage').slice(0, 3);
    cards = beaches.map((d) => ({
      id: d.id, title: d.name, subtitle: d.city, image: d.image, price: d.price, priceUnit: d.priceUnit,
    }));
  } else if (lower.includes('nature') || lower.includes('parc') || lower.includes('forêt') || lower.includes('foret')) {
    const nature = destinations.filter((d) => d.type === 'nature').slice(0, 3);
    cards = nature.map((d) => ({
      id: d.id, title: d.name, subtitle: d.city, image: d.image, price: d.price, priceUnit: d.priceUnit,
    }));
  } else if (lower.includes('culture') || lower.includes('musée') || lower.includes('musee')) {
    const culture = destinations.filter((d) => d.type === 'culture').slice(0, 3);
    cards = culture.map((d) => ({
      id: d.id, title: d.name, subtitle: d.city, image: d.image, price: d.price, priceUnit: d.priceUnit,
    }));
  }

  // Cartes "Bon Plan" si un budget est détecté
  let bonPlanCards: RecommendationCard[] | undefined;
  const budgetInMsg = extractBudget(input);
  const effectiveBudget = budgetInMsg?.xof ?? ctx.detectedBudgetXOF;
  if (effectiveBudget) {
    const bonPlans = getBonPlans(effectiveBudget, ctx.primaryInterest);
    if (bonPlans.length > 0) {
      bonPlanCards = bonPlans.map((bp) => {
        // Trouve la destination correspondante pour avoir une image
        const dest = destinations.find((d) => d.id === bp.id);
        return {
          id: bp.id,
          title: bp.name,
          subtitle: `${bp.tag} · ${bp.location}`,
          image: dest?.image ?? 'https://images.pexels.com/photos/1591375/pexels-photo-1591375.jpeg?auto=compress&cs=tinysrgb&w=400',
          price: bp.price,
          priceUnit: bp.priceUnit,
        };
      });
    }
  }

  // Cartes par défaut si aucun thème détecté
  if (!cards && !bonPlanCards) {
    const defaultDests = destinations.slice(0, 3);
    cards = defaultDests.map((d) => ({
      id: d.id, title: d.name, subtitle: d.city, image: d.image, price: d.price, priceUnit: d.priceUnit,
    }));
  }

  return { content, cards, bonPlanCards };
}

// ─── Types ────────────────────────────────────────────────────────────────
interface EnhancedChatMessage extends ChatMessage {
  bonPlanCards?: RecommendationCard[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: EnhancedChatMessage[];
  context: ConversationContext;  // ← NOUVEAU : contexte persisté par session
  createdAt: string;
}

// ─── Composant principal ──────────────────────────────────────────────────
export default function AssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem('ayoka_chat_sessions_v2');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItinerary } = useItineraries();

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages: EnhancedChatMessage[] = activeSession?.messages || [aiWelcomeMessage];
  const currentContext: ConversationContext = activeSession?.context || createEmptyContext();

  useEffect(() => {
    localStorage.setItem('ayoka_chat_sessions_v2', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const createSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Nouvelle conversation',
      messages: [aiWelcomeMessage],
      context: createEmptyContext(),
      createdAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowHistory(false);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    let currentSessionId = activeSessionId;
    let sessionContext = currentContext;

    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: text.slice(0, 30),
        messages: [aiWelcomeMessage],
        context: createEmptyContext(),
        createdAt: new Date().toISOString(),
      };
      currentSessionId = newSession.id;
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(currentSessionId);
    }

    // Mise à jour du contexte avec les infos du message utilisateur
    const updatedContext = updateContext(sessionContext, text);

    const userMsg: EnhancedChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? {
              ...s,
              title: s.messages.length <= 1 ? text.slice(0, 30) : s.title,
              messages: [...s.messages, userMsg],
              context: updatedContext,  // ← contexte mis à jour
            }
          : s
      )
    );
    setInput('');
    setIsTyping(true);

    const sessionId = currentSessionId;
    setTimeout(() => {
      const { content, cards, bonPlanCards } = generateAIResponse(text, updatedContext);
      const aiMsg: EnhancedChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content,
        cards,
        bonPlanCards,
        timestamp: new Date().toISOString(),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg] } : s
        )
      );
      setIsTyping(false);
    }, 1200);
  };

  const handleGenerateItinerary = () => {
    const dest = currentContext.mentionedDestination ?? 'Abidjan';
    const days = currentContext.mentionedDays ?? 3;
    const budget = currentContext.detectedBudgetXOF
      ? currentContext.detectedBudgetXOF >= 150000 ? 'premium'
        : currentContext.detectedBudgetXOF >= 80000 ? 'standard' : 'economique'
      : 'standard';
    const it = generateItinerary(dest, days, budget);
    addItinerary(it);
    const aiMsg: EnhancedChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: `✅ Itinéraire généré ! **${it.name}** — ${days} jour${days > 1 ? 's' : ''}, budget ${it.totalBudget.toLocaleString()} FCFA.\nRetrouvez-le dans **Mes itinéraires**. 📋`,
      timestamp: new Date().toISOString(),
    };
    if (activeSessionId) {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s
        )
      );
    }
  };

  // ─── Rendu ──────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-navy-900">
      {/* Header */}
      <div className="glass-dark px-4 py-3 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-400 to-ai-600 flex items-center justify-center shadow-ai-glow">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-heading font-semibold text-white text-sm">Assistant AYOKA</div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
            <span className="text-green-400 text-xs font-body">En ligne</span>
            {currentContext.detectedBudgetXOF && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-ai-400/20 text-ai-400 text-[10px] font-heading font-semibold flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5" />
                {currentContext.detectedBudgetXOF.toLocaleString()} FCFA
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleGenerateItinerary}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ai-400/10 text-ai-400 text-xs font-heading font-medium hover:bg-ai-400/20 transition-all"
        >
          <Calendar className="w-3.5 h-3.5" /> Générer itinéraire
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors relative"
        >
          <Clock className="w-5 h-5 text-white/60" />
        </button>
        <button onClick={createSession} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Plus className="w-5 h-5 text-white/60" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-r border-white/5 overflow-hidden flex-shrink-0"
            >
              <div className="w-[260px] h-full overflow-y-auto p-3 space-y-1">
                <div className="flex items-center justify-between px-2 mb-3">
                  <span className="text-white/40 text-xs font-heading font-semibold uppercase tracking-wider">Historique</span>
                  <button
                    onClick={() => { setSessions([]); setActiveSessionId(null); }}
                    className="text-red-400/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {sessions.length === 0 ? (
                  <p className="text-white/20 text-xs font-body px-2">Aucune conversation</p>
                ) : (
                  sessions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setActiveSessionId(s.id); setShowHistory(false); }}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                        s.id === activeSessionId ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="font-heading font-medium text-white text-xs truncate">{s.title}</div>
                      <div className="text-white/30 text-[10px] font-body mt-0.5 flex items-center gap-2">
                        <span>{s.messages.length} message{s.messages.length !== 1 ? 's' : ''}</span>
                        {s.context.detectedBudgetXOF && (
                          <span className="text-ai-400/60">💰 {(s.context.detectedBudgetXOF / 1000).toFixed(0)}K</span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[70%] ${msg.role === 'ai' ? 'flex gap-3' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai-400 to-ai-600 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div>
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          msg.role === 'ai'
                            ? 'glass ai-message-glow text-white/90 font-body text-sm leading-relaxed rounded-tl-sm'
                            : 'bg-ai-400 text-white font-body text-sm leading-relaxed rounded-tr-sm'
                        }`}
                      >
                        {msg.content.split('\n').map((line, i) => (
                          <p key={i} className={line === '' ? 'h-2' : ''}>
                            {line.startsWith('•') ? (
                              <span className="block ml-2">{line}</span>
                            ) : line.startsWith('**') && line.endsWith('**') ? (
                              <span className="font-heading font-semibold">{line.replace(/\*\*/g, '')}</span>
                            ) : line.includes('**') ? (
                              // Inline bold (ex: "Budget **50 000 FCFA**")
                              <span dangerouslySetInnerHTML={{
                                __html: line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                              }} />
                            ) : (
                              line
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Cartes de destination thématiques */}
                      {msg.cards && msg.cards.length > 0 && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.cards.map((card) => (
                            <Link
                              key={card.id}
                              to={`/destination/${card.id}`}
                              className="flex gap-3 p-3 rounded-xl glass hover:bg-white/10 transition-all duration-300 group"
                            >
                              <img src={card.image} alt={card.title} className="w-14 h-14 rounded-lg object-cover" />
                              <div className="flex-1 min-w-0">
                                <div className="font-heading font-semibold text-white text-xs group-hover:text-ai-400 transition-colors truncate">
                                  {card.title}
                                </div>
                                <div className="flex items-center gap-1 text-white/50 text-[10px] font-body mt-0.5">
                                  <MapPin className="w-3 h-3" /> {card.subtitle}
                                </div>
                                {card.price !== undefined && card.price > 0 && (
                                  <div className="mt-1">
                                    <span className="font-heading font-bold text-ai-400 text-xs">
                                      {card.price.toLocaleString()}
                                    </span>
                                    <span className="text-white/40 text-[10px] ml-1">FCFA</span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Cartes "Bon Plan" budget */}
                      {msg.bonPlanCards && msg.bonPlanCards.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[10px] font-heading font-semibold uppercase tracking-wider">
                              Bons Plans dans votre budget
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.bonPlanCards.map((card) => (
                              <Link
                                key={card.id}
                                to={`/destination/${card.id}`}
                                className="flex gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300 group"
                              >
                                <img src={card.image} alt={card.title} className="w-14 h-14 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-heading font-semibold text-white text-xs group-hover:text-emerald-400 transition-colors truncate">
                                    {card.title}
                                  </div>
                                  <div className="text-white/40 text-[10px] font-body mt-0.5 truncate">{card.subtitle}</div>
                                  {card.price !== undefined && card.price > 0 && (
                                    <div className="mt-1">
                                      <span className="font-heading font-bold text-emerald-400 text-xs">
                                        {card.price.toLocaleString()}
                                      </span>
                                      <span className="text-white/40 text-[10px] ml-1">{card.priceUnit ?? 'FCFA'}</span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons for AI messages */}
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={handleGenerateItinerary}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ai-400/10 text-ai-400 text-[10px] font-heading font-medium hover:bg-ai-400/20 transition-all"
                          >
                            <Calendar className="w-3 h-3" /> Itinéraire
                          </button>
                          <Link
                            to="/explorer"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white/50 text-[10px] font-heading font-medium hover:bg-white/10 hover:text-white/80 transition-all"
                          >
                            <MapPin className="w-3 h-3" /> Explorer
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ai-400 to-ai-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 ai-message-glow flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-ai-400 animate-dot-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 rounded-full bg-ai-400 animate-dot-bounce" style={{ animationDelay: '0.16s' }} />
                  <div className="w-2 h-2 rounded-full bg-ai-400 animate-dot-bounce" style={{ animationDelay: '0.32s' }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {[...quickSuggestions, 'Budget 100$', 'Budget 50€'].map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 rounded-full glass text-white/70 text-xs font-heading font-medium hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 md:pb-6">
            <div className="glass-dark rounded-2xl p-2 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Demandez-moi tout… ou dites votre budget en $, € ou FCFA"
                className="flex-1 bg-transparent text-white placeholder-white/30 font-body px-4 py-3 focus:outline-none text-sm"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  input.trim()
                    ? 'bg-ai-400 text-white hover:bg-ai-500 shadow-ai-glow'
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
