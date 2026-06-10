import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Avatar } from '../../components';
import { getGeneralResponse } from '../../services/ai/travelAssistantService';
import { getAyokaAIResponse, isOpenAIConfigured, type AyokaAIContext } from '../../services/ai/openaiService';
import { useTraveler } from '../../contexts/TravelerContext';
import { useAuth } from '../../contexts/AuthContext';

const AI_RESPONSES: Record<string, string> = {
  default: "Je suis votre assistant voyage AYOKA. Comment puis-je vous aider à planifier votre séjour en Côte d'Ivoire ? Je peux répondre à vos questions générales, faire des conversions de devises, ou vous aider avec la planification de voyage.",
  assinie: "Assinie est magnifique ! Je vous recommande de visiter la lagune, les plages de Monogaga, et de goûter aux fruits de mer. Le meilleur moment pour y aller est de novembre à mars.",
  grandbassam: "Grand-Bassam est classé UNESCO ! Ne manquez pas le quartier colonial, la cathédrale, et le musée national. C'est parfait pour une journée culturelle.",
  bouake: "Bouaké est connue pour son marché et le tissage. Visitez le marché central et découvrez l'artisanat local. C'est une expérience authentique.",
  yamoussoukro: "Yamoussoukro impressionne avec sa basilique ! C'est la plus grande au monde. Visitez aussi le lac aux crocodiles et le palais présidentiel.",
  man: "Man est la ville de la montagne ! Les cascades et le mont Tonkoui sont incontournables. Prévoyez de bonnes chaussures pour la randonnée.",
  budget: "Pour un séjour confortable en Côte d'Ivoire, prévoyez environ 150000-200000 FCFA par semaine pour un voyageur solo, hors vols internationaux.",
  transport: "Le moyen le plus pratique de se déplacer est le bus (STIF, UTB) ou le train entre Abidjan et l'intérieur du pays. Pour les villes, les taxis-clado sont abordables.",
  cuisine: "La cuisine ivoirienne est délicieuse ! Essayez l'attiéké, le alloco, le kedjenou, et le poulet braisé. Chaque région a ses spécialités.",
  aide: "Je peux vous aider avec: la planification d'itinéraire, les recommandations de destinations, le budget voyage, le transport, la cuisine locale, ou répondre à vos questions générales (conversion devises, conseils voyage, etc.).",
  bonjour: "Bonjour ! Je suis ravi de vous aider à planifier votre voyage en Côte d'Ivoire. Où souhaitez-vous aller ?",
  merci: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions pour votre voyage.",
};

const QUICK_ACTIONS = [
  { id: 'itinéraire', label: 'Planifier un voyage', icon: 'map' },
  { id: 'destination', label: 'Destinations', icon: 'location' },
  { id: 'budget', label: 'Budget', icon: 'cash' },
  { id: 'transport', label: 'Transport', icon: 'bus' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

async function getAIResponse(input: string, context: AyokaAIContext): Promise<string> {
  // Si OpenAI est configuré, utiliser AYOKA AI
  if (isOpenAIConfigured()) {
    try {
      const response = await getAyokaAIResponse(input, context);
      return response.text;
    } catch (error) {
      console.error('Erreur OpenAI, fallback sur réponses internes:', error);
    }
  }
  
  // Fallback sur réponses internes
  const lower = input.toLowerCase();
  
  // Essayer d'abord les réponses générales étendues
  const generalResponse = getGeneralResponse(input);
  if (generalResponse) {
    return generalResponse.text;
  }
  
  // Réponses spécifiques au voyageur
  if (lower.includes('assini')) return AI_RESPONSES.assinie;
  if (lower.includes('grand-bassam') || lower.includes('grand bassam')) return AI_RESPONSES.grandbassam;
  if (lower.includes('bouaké') || lower.includes('bouake')) return AI_RESPONSES.bouake;
  if (lower.includes('yamoussoukro')) return AI_RESPONSES.yamoussoukro;
  if (lower.includes('man')) return AI_RESPONSES.man;
  if (lower.includes('budget') || lower.includes('prix') || lower.includes('coût')) return AI_RESPONSES.budget;
  if (lower.includes('transport') || lower.includes('déplacement') || lower.includes('bus')) return AI_RESPONSES.transport;
  if (lower.includes('cuisine') || lower.includes('manger') || lower.includes('restaurant')) return AI_RESPONSES.cuisine;
  if (lower.includes('aid') || lower.includes('help') || lower.includes('peux-tu')) return AI_RESPONSES.aide;
  if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello')) return AI_RESPONSES.bonjour;
  if (lower.includes('merci') || lower.includes('thanks')) return AI_RESPONSES.merci;
  
  return AI_RESPONSES.default;
}

export default function TravelAssistantScreen() {
  const { profile, reservations, favorites, tripPlans } = useTraveler();
  const { user } = useAuth();
  
  // Contexte pour AYOKA AI
  const ayokaContext: AyokaAIContext = {
    userRole: 'traveler',
    userReservations: reservations,
    userFavorites: favorites,
    userData: profile,
  };
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: AI_RESPONSES.default, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  }, [isListening]);

  const speak = async (text: string) => {
    setIsSpeaking(true);
    Haptics.impactAsync('light');
    Speech.speak(text, {
      language: 'fr-FR',
      rate: 0.95,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    Haptics.impactAsync('light');
    setInput('');
    setIsListening(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const response = await getAIResponse(messageText, ayokaContext);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);

    speak(response);
  };

  const toggleListening = async () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    setIsListening(!isListening);
    Haptics.impactAsync('medium');

    if (!isListening) {
      setTimeout(() => {
        if (isListening) {
          setIsListening(false);
          handleSend('Quelles sont les meilleures destinations à visiter ?');
        }
      }, 2000);
    }
  };

  const handleQuickAction = (action: typeof QUICK_ACTIONS[0]) => {
    handleSend(action.label.toLowerCase());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Avatar initials="AI" size={44} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Assistant Voyage</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isSpeaking && styles.statusDotActive]} />
            <Text style={styles.statusText}>{isSpeaking ? 'Parle...' : isTyping ? 'Réfléchit...' : 'En ligne'}</Text>
          </View>
        </View>
        {isSpeaking && (
          <TouchableOpacity style={styles.stopBtn} onPress={stopSpeaking}>
            <Ionicons name="stop" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            {msg.role === 'assistant' && (
              <View style={styles.messageAvatar}>
                <Avatar initials="AI" size={28} />
              </View>
            )}
            <View style={[
              styles.messageContent,
              msg.role === 'user' ? styles.userContent : styles.aiContent,
            ]}>
              <Text style={[
                styles.messageText,
                msg.role === 'user' ? styles.userText : styles.aiText,
              ]}>{msg.content}</Text>
            </View>
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.messageAvatar}>
              <Avatar initials="AI" size={28} />
            </View>
            <View style={[styles.messageContent, styles.aiContent]}>
              <View style={styles.typingDots}>
                <Animated.View style={[styles.typingDot, { opacity: 0.4 }]} />
                <Animated.View style={[styles.typingDot, { opacity: 0.7 }]} />
                <Animated.View style={[styles.typingDot, { opacity: 1 }]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickActions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionBtn}
              onPress={() => handleQuickAction(action)}
            >
              <Ionicons name={action.icon as any} size={16} color={colors.ai[400]} />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="Posez votre question..."
          placeholderTextColor={colors.gray[400]}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend()}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={styles.micBtn}
          onPress={toggleListening}
        >
          <Animated.View style={[styles.micBtnInner, { transform: [{ scale: pulseAnim }] }]}>
            <Ionicons
              name={isListening ? 'mic' : isSpeaking ? 'stop' : 'mic-outline'}
              size={24}
              color={colors.white}
            />
          </Animated.View>
        </TouchableOpacity>
        {input.length > 0 && (
          <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
            <Ionicons name="send" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 4,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    ...shadows.soft,
  },
  headerInfo: { flex: 1 },
  headerTitle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.nature[400] },
  statusDotActive: { backgroundColor: colors.ai[400] },
  statusText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.xs, color: colors.gray[500] },
  stopBtn: {
    backgroundColor: colors.red[500],
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: spacing.lg, gap: spacing.md },
  messageBubble: { flexDirection: 'row', gap: spacing.sm, maxWidth: '90%' },
  userBubble: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  aiBubble: { alignSelf: 'flex-start' },
  messageAvatar: { marginTop: 4 },
  messageContent: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.soft,
  },
  userContent: { backgroundColor: colors.ai[400] },
  aiContent: { backgroundColor: colors.white },
  messageText: { fontFamily: 'Inter_400Regular', fontSize: fontSize.md, lineHeight: 22 },
  userText: { color: colors.white },
  aiText: { color: colors.navy[800] },
  typingDots: { flexDirection: 'row', gap: 4, paddingVertical: 6 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.ai[400] },
  quickActions: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.ai[50],
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  quickActionText: { fontFamily: 'Inter_500Medium', fontSize: fontSize.xs, color: colors.ai[400] },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: fontSize.md,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.dark,
    maxHeight: 100,
  },
  micBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.navy[800],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  micBtnInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.ai[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ai[400],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.aiGlow,
  },
});
