// ============================================================
// APP.TSX - POINT D'ENTRÉE DE L'APPLICATION
// ============================================================
// Ce fichier est le point d'entrée principal de l'application mobile AYOKA CI.
// Il configure les providers de contexte (Auth, Partner, Traveler) et
// initialise la navigation de l'application.
//
// Architecture:
// - AuthProvider: Gère l'authentification des utilisateurs
// - PartnerProvider: Gère les données des partenaires
// - TravelerProvider: Gère les données des voyageurs
// - AppNavigator: Gère la navigation entre les écrans
// ============================================================

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/AuthContext';
import { PartnerProvider } from './contexts/PartnerContext';
import { TravelerProvider } from './contexts/TravelerContext';
import AppNavigator from './navigation';
import { colors } from './theme';

/**
 * Composant principal de l'application
 * 
 * Structure des providers:
 * 1. AuthProvider: Gère l'état d'authentification (login, logout, rôle)
 * 2. PartnerProvider: Gère les données spécifiques aux partenaires (services, réservations)
 * 3. TravelerProvider: Gère les données spécifiques aux voyageurs (favoris, plans de voyage)
 * 
 * La navigation est encapsulée dans SafeAreaView pour gérer les zones sécurisées
 * sur les appareils modernes (notch, barre d'état, etc.)
 */
export default function App() {
  return (
    <AuthProvider>
      <PartnerProvider>
        <TravelerProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.navy[800] }}>
            <AppNavigator />
            <StatusBar style="light" />
          </SafeAreaView>
        </TravelerProvider>
      </PartnerProvider>
    </AuthProvider>
  );
}
