/**
 * Seletor numérico − valor + (usado nas configurações).
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, fontes } from '../theme';

export function Stepper({
  valor,
  onChange,
  min,
  max,
  rotulo,
}: {
  valor: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  rotulo?: string;
}) {
  const dec = () => valor > min && onChange(valor - 1);
  const inc = () => valor < max && onChange(valor + 1);
  return (
    <View>
      {rotulo ? <Text style={styles.rotulo}>{rotulo}</Text> : null}
      <View style={styles.linha}>
        <Pressable onPress={dec} style={[styles.btn, valor <= min && styles.off]} hitSlop={8}>
          <Text style={styles.sinal}>−</Text>
        </Pressable>
        <Text style={styles.valor}>{valor}</Text>
        <Pressable onPress={inc} style={[styles.btn, valor >= max && styles.off]} hitSlop={8}>
          <Text style={styles.sinal}>＋</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: { color: cores.chalkDim, fontFamily: fontes.corpo, fontSize: 13, marginBottom: 8 },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  btn: {
    width: 58,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(52,227,137,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  off: { opacity: 0.35 },
  sinal: { color: cores.verde, fontFamily: fontes.display, fontSize: 30 },
  valor: {
    minWidth: 64,
    textAlign: 'center',
    color: cores.chalk,
    fontFamily: fontes.display,
    fontSize: 40,
  },
});
