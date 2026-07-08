/**
 * Card e Divisor do design system (manifesto 2.5).
 */
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cores, marcaGradient, raio } from '../theme';

export function Card({
  children,
  style,
  borda,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  borda?: string; // cor de borda opcional (ex.: vermelho para avisos)
}) {
  return (
    <View style={[styles.card, borda ? { borderWidth: 2, borderColor: borda } : null, style]}>
      {children}
    </View>
  );
}

/** Barra de 3px com o gradiente da marca (divisor de cabeçalho). */
export function DivisorMarca({ largura = 56, style }: { largura?: number; style?: ViewStyle }) {
  return (
    <LinearGradient
      {...marcaGradient}
      style={[{ width: largura, height: 3, borderRadius: 2 }, style]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.pitchLight,
    borderRadius: raio.card,
    padding: 16,
  },
});
