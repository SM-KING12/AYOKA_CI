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
} from 'lucide-react';
import { destinations, quickSuggestions, type ChatMessage, type RecommendationCard } from '../data';
import { getAiRecommendations, generateItinerary } from '../mock/mockAiService';
import { useItineraries } from '../contexts/ItinerariesContext';

const aiWelcomeMessage: ChatMessage = {
  id: '0',
  role: 'ai',
  content:
    "Bonjour ! Je suis l'assistant AYOKA, votre guide IA pour d\u00e9couvrir la C\u00f4te d'Ivoire. Je peux vous aider \u00e0 planifier votre voyage, trouver des destinations, cr\u00e9er des itin\u00e9raires personnalis\u00e9s et bien plus encore. Que souhaitez-vous explorer ?",
  timestamp: new Date().toISOString(),
};

function generateAIResponse(input: string): { content: string; cards?: RecommendationCard[] } {
  const lower = input.toLowerCase();

  if (lower.includes('plage') || lower.includes('bord de mer') || lower.includes('mer')) {
    const beaches = destinations.filter((d) => d.type === 'plage').slice(0, 3);
    return {
      content: getAiRecommendations(input),
      cards: beaches.map((d) => ({
        id: d.id,
        title: d.name,
        subtitle: d.city,
        image: d.image,
        price: d.price,
        priceUnit: d.priceUnit,
      })),
    };
  }

  if (lower.includes('nature') || lower.includes('parc') || lower.includes('for\u00eat')) {
    const nature = destinations.filter((d) => d.type === 'nature').slice(0, 3);
    return {
      content: getAiRecommendations(input),
      cards: nature.map((d) => ({
        id: d.id,
        title: d.name,
        subtitle: d.city,
        image: d.image,
        price: d.price,
        priceUnit: d.priceUnit,
      })),
    };
  }

  if (lower.includes('abidjan') || lower.includes('restaurant') || lower.includes('manger') || lower.includes('cuisine')) {
    return { content: getAiRecommendations(input) };
  }

  if (lower.includes('h\u00f4tel') || lower.includes('logement') || lower.includes('dormir') || lower.includes('h\u00e9bergement')) {
    return { content: getAiRecommendations(input) };
  }

  if (lower.includes('culture') || lower.includes('mus\u00e9e') || lower.includes('tradition')) {
    return { content: getAiRecommendations(input) };
  }

  if (lower.includes('itin\u00e9raire') || lower.includes('plan') || lower.includes('3 jours') || lower.includes('voyage') || lower.includes('g\u00e9n\u00e9rer')) {
    return {
      content:
        "Je peux cr\u00e9er un itin\u00e9raire personnalis\u00e9 pour vous ! Utilisez le bouton **G\u00e9n\u00e9rer un itin\u00e9raire** ci-dessous, ou dites-moi votre destination et la dur\u00e9e souhait\u00e9e.\n\nEn attendant, voici un aper\u00e7u :\n\n**Jour 1 - Abidjan**\n\u2022 March\u00e9 de Cocody & Plateau\n\u2022 Croisi\u00e8re Lagune \u00c9bri\u00e9\n\u2022 D\u00eener au Zone 4\n\n**Jour 2 - Grand-Bassam**\n\u2022 Quartier colonial UNESCO\n\u2022 Plage & Mus\u00e9e du Costume\n\n**Jour 3 - Assinie**\n\u2022 Sports nautiques\n\u2022 Fruits de mer au bord de l'eau",
    };
  }

  const defaultDestinations = destinations.slice(0, 3);
  return {
    content: getAiRecommendations(input),
    cards: defaultDestinations.map((d) => ({
      id: d.id,
      title: d.name,
      subtitle: d.city,
      image: d.image,
      price: d.price,
      priceUnit: d.priceUnit,
    })),
  };
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export default function AssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const stored = localStorage.getItem('ayoka_chat_sessions');
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
  const messages = activeSession?.messages || [aiWelcomeMessage];

  useEffect(() => {
    localStorage.setItem('ayoka_chat_sessions', JSON.stringify(sessions));
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
      createdAt: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowHistory(false);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: text.slice(0, 30),
        messages: [aiWelcomeMessage],
        createdAt: new Date().toISOString(),
      };
      currentSessionId = newSession.id;
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(currentSessionId);
    }

    const userMsg: ChatMessage = {
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
            }
          : s
      )
    );
    setInput('');
    setIsTyping(true);

    const sessionId = currentSessionId;
    setTimeout(() => {
      const { content, cards } = generateAIResponse(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content,
        cards,
        timestamp: new Date().toISOString(),
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg] } : s
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  const handleGenerateItinerary = () => {
    const it = generateItinerary('Abidjan', 3, 'standard');
    addItinerary(it);
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: `J'ai g\u00e9n\u00e9r\u00e9 un itin\u00e9raire de 3 jours pour vous ! **${it.name}** avec un budget de ${it.totalBudget.toLocaleString()} FCFA. Vous pouvez le retrouver dans la section **Mes itin\u00e9raires**.`,
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
          </div>
        </div>
        <button
          onClick={handleGenerateItinerary}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ai-400/10 text-ai-400 text-xs font-heading font-medium hover:bg-ai-400/20 transition-all"
        >
          <Calendar className="w-3.5 h-3.5" /> G\u00e9n\u00e9rer itin\u00e9raire
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
                      <div className="text-white/30 text-[10px] font-body mt-0.5">
                        {s.messages.length} message{s.messages.length !== 1 ? 's' : ''}
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
                            {line.startsWith('\u2022') ? (
                              <span className="block ml-2">{line}</span>
                            ) : line.startsWith('**') ? (
                              <span className="font-heading font-semibold">{line.replace(/\*\*/g, '')}</span>
                            ) : (
                              line
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Recommendation Cards */}
                      {msg.cards && msg.cards.length > 0 && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.cards.map((card) => (
                            <Link
                              key={card.id}
                              to={`/destination/${card.id}`}
                              className="flex gap-3 p-3 rounded-xl glass hover:bg-white/10 transition-all duration-300 group"
                            >
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-14 h-14 rounded-lg object-cover"
                              />
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

                      {/* Action buttons for AI messages */}
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={handleGenerateItinerary}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ai-400/10 text-ai-400 text-[10px] font-heading font-medium hover:bg-ai-400/20 transition-all"
                          >
                            <Calendar className="w-3 h-3" /> Itin\u00e9raire
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
                {quickSuggestions.map((s) => (
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
                placeholder="Demandez-moi tout sur la C\u00f4te d'Ivoire..."
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
