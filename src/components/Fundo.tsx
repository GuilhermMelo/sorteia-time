/**
 * Fundo padrão de todas as telas: pitch (#0A0C10) + véu gradiente verde->azul
 * (manifesto 2.2). Envolve o conteúdo e respeita a área segura básica.
 */
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cores, veuGradient } from '../theme';

export function Fundo({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View style={[styles.base, style]}>
      <LinearGradient {...veuGradient} style={StyleSheet.absoluteFill} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: cores.pitch },
});
