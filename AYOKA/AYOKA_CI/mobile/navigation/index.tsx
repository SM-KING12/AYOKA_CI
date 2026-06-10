// ============================================================
// NAVIGATION/INDEX.TSX - SYSTÈME DE NAVIGATION
// ============================================================
// Ce fichier définit la structure de navigation complète de l'application AYOKA CI.
// Il utilise React Navigation pour gérer les écrans et les transitions.
//
// Architecture de navigation:
// - AuthNavigator: Gère les écrans d'authentification (login, register)
// - PartnerNavigator: Navigation par onglets pour les partenaires
// - AdminNavigator: Navigation par onglets pour les administrateurs
// - TravelerNavigator: Navigation par onglets pour les voyageurs
// - AppNavigator: Navigateur racine qui route selon le rôle utilisateur
// ============================================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import { colors, fontSize } from '../theme';
import { useAuth } from '../contexts/AuthContext';

// ============================================================
// IMPORTS DES ÉCRANS
// ============================================================

// Écrans d'authentification (login, register pour admin/partner et traveler)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import LoginTravelerScreen from '../screens/auth/LoginTravelerScreen';
import RegisterTravelerScreen from '../screens/auth/RegisterTravelerScreen';

// Écrans des partenaires (dashboard, services, réservations, etc.)
import PartnerDashboardScreen from '../screens/partner/DashboardScreen';
import ServicesScreen from '../screens/partner/ServicesScreen';
import ReservationsScreen from '../screens/partner/ReservationsScreen';
import CalendarScreen from '../screens/partner/CalendarScreen';
import MessagesScreen from '../screens/partner/MessagesScreen';
import ProfileScreen from '../screens/partner/ProfileScreen';
import NotificationsScreen from '../screens/partner/NotificationsScreen';
import AssistantScreen from '../screens/partner/AssistantScreen';

// Écrans des voyageurs (accueil, explorer, réservations, assistant, etc.)
import HomeTravelerScreen from '../screens/traveler/HomeTravelerScreen';
import ExplorerScreen from '../screens/traveler/ExplorerScreen';
import TravelerReservationsScreen from '../screens/traveler/ReservationsScreen';
import TravelAssistantScreen from '../screens/traveler/TravelAssistantScreen';
import TravelerProfileScreen from '../screens/traveler/ProfileScreen';
import TripPlannerScreen from '../screens/traveler/TripPlannerScreen';
import MapScreen from '../screens/traveler/MapScreen';
import BookingScreen from '../screens/traveler/BookingScreen';
import CheckoutScreen from '../screens/traveler/CheckoutScreen';
import BookingSuccessScreen from '../screens/traveler/BookingSuccessScreen';
import TravelerNotificationsScreen from '../screens/traveler/NotificationsScreen';

// Écrans des administrateurs (dashboard, partenaires, services, etc.)
import AdminDashboardScreen from '../screens/admin/DashboardScreen';
import PartnersScreen from '../screens/admin/PartnersScreen';
import AdminServicesScreen from '../screens/admin/ServicesScreen';
import AnalyticsScreen from '../screens/admin/AnalyticsScreen';
import AdminNotificationsScreen from '../screens/admin/NotificationsScreen';

// ============================================================
// CONFIGURATION DES NAVIGATEURS
// ============================================================
// Stack: Navigation en pile (écrans empilés les uns sur les autres)
// Tab: Navigation par onglets (barre de navigation en bas)
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============================================================
// AUTH NAVIGATOR
// ============================================================
// Gère les écrans d'authentification (login et register)
// Les écrans sont sans header pour une expérience immersive
// Routes:
// - Login: Connexion admin/partenaire
// - Register: Inscription admin/partenaire
// - LoginTraveler: Connexion voyageur
// - RegisterTraveler: Inscription voyageur
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="LoginTraveler" component={LoginTravelerScreen} />
      <Stack.Screen name="RegisterTraveler" component={RegisterTravelerScreen} />
    </Stack.Navigator>
  );
}

// ============================================================
// PARTNER TAB NAVIGATOR
// ============================================================
// Navigation par onglets pour les partenaires
// Couleur accent: AI (bleu clair)
// Onglets:
// 1. Accueil: Dashboard partenaire
// 2. Services: Gestion des services
// 3. Réserv.: Gestion des réservations
// 4. Assistant: Assistant IA avec style spécial
// 5. Plus: Menu supplémentaire (calendrier, profil, notifications)
function PartnerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
        tabBarActiveTintColor: colors.ai[400],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.gray[100] },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: fontSize.xs },
      }}
    >
      <Tab.Screen
        name="PartnerDashboard"
        component={PartnerDashboardScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="map" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{
          title: 'Réserv.',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="PartnerAssistant"
        component={AssistantScreen}
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={aiTabStyles.aiTabIcon}>
              <Ionicons name="sparkles" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={PartnerMoreScreen}
        options={{
          title: 'Plus',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="ellipsis-horizontal" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ============================================================
// STYLES SPÉCIAUX POUR L'ONGLET IA PARTENAIRE
// ============================================================
// Style spécial pour l'icône de l'assistant IA avec fond bleu clair
const aiTabStyles = StyleSheet.create({
  aiTabIcon: {
    backgroundColor: colors.ai[50],
    borderRadius: 12,
    padding: 4,
  },
});

// ============================================================
// PARTNER MORE SCREEN
// ============================================================
// Navigateur pour le menu "Plus" des partenaires
// Contient:
// - MoreMenu: Menu principal avec options
// - Calendar: Calendrier des événements
// - Profile: Profil du partenaire
// - Notifications: Notifications du partenaire
function PartnerMoreScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreMenu" component={MoreMenuScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

// ============================================================
// ADMIN TAB NAVIGATOR
// ============================================================
// Navigation par onglets pour les administrateurs
// Couleur accent: Gold (doré)
// Onglets:
// 1. Accueil: Dashboard administrateur
// 2. Partenaires: Gestion des partenaires
// 3. Services: Gestion des services
// 4. Assistant: Assistant IA avec style spécial
// 5. Notif.: Notifications administrateur
function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
        tabBarActiveTintColor: colors.gold[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.gray[100] },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: fontSize.xs },
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="shield" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Partners"
        component={PartnersScreen}
        options={{
          title: 'Partenaires',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="people" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AdminServices"
        component={AdminServicesScreen}
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="map" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="AdminAssistant"
        component={AssistantScreen}
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={adminAiTabStyles.aiTabIcon}>
              <Ionicons name="sparkles" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AdminNotifications"
        component={AdminNotificationsScreen}
        options={{
          title: 'Notif.',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="notifications" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ============================================================
// STYLES SPÉCIAUX POUR L'ONGLET IA ADMIN
// ============================================================
// Style spécial pour l'icône de l'assistant IA avec fond doré
const adminAiTabStyles = StyleSheet.create({
  aiTabIcon: {
    backgroundColor: colors.gold[50],
    borderRadius: 12,
    padding: 4,
  },
});

// ============================================================
// STYLES DU MENU PLUS
// ============================================================
// Styles pour le menu "Plus" des partenaires
// Contient les options supplémentaires et le bouton de déconnexion
const moreStyles = StyleSheet.create({
  moreContainer: {
    flex: 1,
    backgroundColor: colors.gray[50],
    padding: 24,
  },
  moreTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: colors.navy[800],
    marginBottom: 24,
  },
  moreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 8,
    gap: 16,
  },
  moreItemLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: colors.navy[800],
  },
  logoutItem: {
    marginTop: 24,
    backgroundColor: '#FEF2F2',
  },
});

/**
 * Écran du menu "Plus" pour les partenaires
 * Affiche les options supplémentaires et le bouton de déconnexion
 * 
 * @param navigation - Objet de navigation React Navigation
 */
function MoreMenuScreen({ navigation }: { navigation: any }) {
  const { logout } = useAuth();

  // Liste des options du menu
  const items = [
    { icon: 'calendar', label: 'Calendrier', screen: 'Calendar' },
    { icon: 'person', label: 'Profil', screen: 'Profile' },
    { icon: 'notifications', label: 'Notifications', screen: 'Notifications' },
    { icon: 'sparkles', label: 'Assistant IA', screen: 'Assistant', isSpecial: true },
  ];

  return (
    <View style={moreStyles.moreContainer}>
      <Text style={moreStyles.moreTitle}>Plus</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={[moreStyles.moreItem, item.isSpecial && aiMoreStyles.aiItem]}
          onPress={() => navigation.navigate(item.screen)}
        >
          <View style={[aiMoreStyles.iconWrap, item.isSpecial && aiMoreStyles.aiIconWrap]}>
            <Ionicons name={item.icon as any} size={22} color={item.isSpecial ? colors.ai[400] : colors.navy[800]} />
          </View>
          <Text style={[moreStyles.moreItemLabel, item.isSpecial && aiMoreStyles.aiLabel]}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={[moreStyles.moreItem, moreStyles.logoutItem]} onPress={logout}>
        <Ionicons name="log-out" size={22} color={colors.red[500]} />
        <Text style={[moreStyles.moreItemLabel, { color: colors.red[500] }]}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const aiMoreStyles = StyleSheet.create({
  aiItem: {
    backgroundColor: colors.ai[50],
  borderLeftWidth: 3,
    borderLeftColor: colors.ai[400],
  marginBottom: 8,
  marginTop: 16,
  paddingTop: 20,
    paddingBottom: 20,
  },
  iconWrap: {
    width: 32,
    alignItems: 'center',
  },
  aiIconWrap: {
    backgroundColor: colors.ai[50],
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiLabel: {
    fontFamily: 'Poppins_600SemiBold',
    color: colors.ai[400],
  },
});

// ============================================================
// TRAVELER TAB NAVIGATOR
// ============================================================
// Navigation par onglets pour les voyageurs
// Couleur accent: Nature (vert)
// Onglets:
// 1. Accueil: Dashboard voyageur
// 2. Explorer: Exploration des destinations et services
// 3. Réserv.: Gestion des réservations
// 4. Assistant: Assistant IA avec style spécial
// 5. Profil: Profil du voyageur
function TravelerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { fontFamily: 'Poppins_700Bold', fontSize: fontSize.lg, color: colors.navy[800] },
        tabBarActiveTintColor: colors.nature[400],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.gray[100] },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: fontSize.xs },
      }}
    >
      <Tab.Screen
        name="HomeTraveler"
        component={HomeTravelerScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Explorer"
        component={ExplorerScreen}
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="compass" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="TravelerReservations"
        component={TravelerReservationsScreen}
        options={{
          title: 'Réserv.',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="TravelAssistant"
        component={TravelAssistantScreen}
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View style={travelerAiTabStyles.aiTabIcon}>
              <Ionicons name="sparkles" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TravelerProfile"
        component={TravelerProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ============================================================
// STYLES SPÉCIAUX POUR L'ONGLET IA VOYAGEUR
// ============================================================
// Style spécial pour l'icône de l'assistant IA avec fond vert
const travelerAiTabStyles = StyleSheet.create({
  aiTabIcon: {
    backgroundColor: colors.nature[50],
    borderRadius: 12,
    padding: 4,
  },
});

// ============================================================
// APP NAVIGATOR - NAVIGATEUR RACINE
// ============================================================
// Navigateur principal qui route vers le bon navigateur selon:
// - L'état d'authentification (connecté ou non)
// - Le rôle de l'utilisateur (admin, partner, traveler)
// 
// Logique de routage:
// 1. Si isLoading: Affiche un indicateur de chargement
// 2. Si non authentifié: Affiche AuthNavigator
// 3. Si admin: Affiche AdminNavigator
// 4. Si traveler: Affiche TravelerNavigator
// 5. Sinon (partner): Affiche PartnerNavigator
export default function AppNavigator() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // État de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.navy[800] }}>
        <ActivityIndicator size="large" color={colors.ai[400]} />
      </View>
    );
  }

  // Routage conditionnel selon l'authentification et le rôle
  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : user?.role === 'admin' ? (
        <AdminNavigator />
      ) : user?.role === 'traveler' ? (
        <TravelerNavigator />
      ) : (
        <PartnerNavigator />
      )}
    </NavigationContainer>
  );
}
