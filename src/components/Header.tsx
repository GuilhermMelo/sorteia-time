/**
 * Cabeçalho de tela: botão voltar + título (Bebas) + divisor gradiente.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, fontes } from '../theme';
import { DivisorMarca } from './Card';

export function Header({ titulo, onVoltar }: { titulo: string; onVoltar?: () => void }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.linha}>
        {onVoltar ? (
          <Pressable onPress={onVoltar} hitSlop={12} style={styles.voltar}>
            <Text style={styles.seta}>‹</Text>
          </Pressable>
        ) : null}
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
      <DivisorMarca largura={64} style={{ marginTop: 6 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  voltar: { width: 34, height: 40, justifyContent: 'center' },
  seta: { color: cores.chalk, fontSize: 40, lineHeight: 40, marginTop: -6 },
  titulo: {
    color: cores.chalk,
    fontFamily: fontes.display,
    fontSize: 34,
    letterSpacing: 1.5,
    flex: 1,
  },
});
