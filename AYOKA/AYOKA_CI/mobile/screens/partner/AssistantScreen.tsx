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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, fontSize, shadows } from '../../theme';
import { Avatar } from '../../components';
import { getGeneralResponse, convertCurrency } from '../../services/ai/travelAssistantService';
import { getAyokaAIResponse, isOpenAIConfigured, type AyokaAIContext } from '../../services/ai/openaiService';
import { usePartner } from '../../contexts/PartnerContext';
import { useAuth } from '../../contexts/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock AI responses for demo (no backend)
const AI_RESPONSES: Record<string, string> = {
  default: "Je suis votre assistant AYOKA. Comment puis-je vous aider aujourd'hui ? Je peux répondre à vos questions générales, faire des conversions de devises, ou vous aider avec vos réservations et revenus.",
  reservations: "Vous avez 5 réservations en attente. La prochaine est pour demain à 14h avec M. Koné pour la Visite du Quartier Colonial.",
  revenus: "Vos revenus ce mois s'élèvent à 2.4 millions de FCFA, en augmentation de 18% par rapport au mois dernier.",
  services: "Vous avez actuellement 6 services actifs. Votre service le plus populaire est 'Dîner Gastronomique Ivoirien' avec 312 réservations.",
  aide: "Je peux vous aider avec: vos réservations, vos revenus, vos services, vos clients, ou répondre à vos questions générales (conversion devises, conseils voyage, etc.).",
  bonjour: "Bonjour ! Je suis ravi de vous voir. Comment puis-je vous assister aujourd'hui ?",
  merci: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions.",
  client: "Vos derniers clients ont laissé des avis positifs. Note moyenne : 4.7 sur 5 étoiles.",
};

// Quick action suggestions
const QUICK_ACTIONS = [
  { id: 'reservations', label: 'Réservations', icon: 'calendar' },
  { id: 'revenus', label: 'Revenus', icon: 'cash' },
  { id: 'services', label: 'Services', icon: 'map' },
  { id: 'client', label: 'Clients', icon: 'people' },
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
  
  // Réponses spécifiques au partenaire
  if (lower.includes('réservation') || lower.includes('booking')) return AI_RESPONSES.reservations;
  if (lower.includes('revenu') || lower.includes('chiffre') || lower.includes('argent')) return AI_RESPONSES.revenus;
  if (lower.includes('service') || lower.includes('offre')) return AI_RESPONSES.services;
  if (lower.includes('client') || lower.includes('avis')) return AI_RESPONSES.client;
  if (lower.includes('aid') || lower.includes('help') || lower.includes('peux-tu')) return AI_RESPONSES.aide;
  if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('hello')) return AI_RESPONSES.bonjour;
  if (lower.includes('merci') || lower.includes('thanks')) return AI_RESPONSES.merci;
  
  return AI_RESPONSES.default;
}

export default function AssistantScreen() {
  const { stats, bookings, services, profile, reviews } = usePartner();
  const { user } = useAuth();
  
  // Contexte pour AYOKA AI
  const ayokaContext: AyokaAIContext = {
    userRole: 'partner',
    userReservations: bookings,
    availableServices: services,
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
    // Pulse animation for listening state
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

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI thinking
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    // Get AI response
    const response = await getAIResponse(messageText, ayokaContext);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);

    // Speak response
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
      // Simulate voice input after 2 seconds
      setTimeout(() => {
        if (isListening) {
          setIsListening(false);
          handleSend('Quelles sont mes réservations du jour ?');
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
      {/* Header */}
      <View style={styles.header}>
        <Avatar initials="AI" size={44} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Assistant AYOKA</Text>
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

      {/* Messages */}
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

      {/* Quick Actions */}
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

      {/* Input Area */}
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
