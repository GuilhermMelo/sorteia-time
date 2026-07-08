/**
 * Aviso vermelho obrigatório (manifesto: divisões que não fecham, faltas de
 * goleiro). Borda vermelha + texto em negrito, bem destacado.
 */
import { StyleSheet, Text, View } from 'react-native';
import { cores, fontes } from '../theme';

export function Aviso({ texto }: { texto: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.txt}>⚠️ {texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 2,
    borderColor: cores.warnRed,
    backgroundColor: 'rgba(255,59,48,0.10)',
    borderRadius: 12,
    padding: 12,
  },
  txt: { color: cores.warnRed, fontFamily: fontes.corpoBold, fontSize: 14, lineHeight: 20 },
});
