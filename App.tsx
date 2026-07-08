/**
 * M&M Sorteia Time — raiz do app.
 * Carrega as fontes (Bebas Neue + Inter), inicializa o estado local e só então
 * esconde a splash. 100% offline, sem login.
 */
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// Importar cada peso pelo subpath evita puxar todos os pesos (APK menor).
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue/400Regular';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';

import { AppProvider, useStore } from './src/store';
import { NavProvider } from './src/navigation';
import { Router } from './src/Router';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontesOk] = useFonts({
    BebasNeue_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavProvider>
          <Raiz fontesOk={fontesOk} />
        </NavProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

function Raiz({ fontesOk }: { fontesOk: boolean }) {
  const { pronto } = useStore();
  const ok = fontesOk && pronto;

  useEffect(() => {
    if (ok) SplashScreen.hideAsync();
  }, [ok]);

  if (!ok) return null; // splash continua visível

  return (
    <>
      <StatusBar style="light" />
      <Router />
    </>
  );
}
