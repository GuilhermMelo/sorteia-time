/**
 * Chips: chip simples (home) e chip de time colorido (ordem · cor · qtd).
 */
import { StyleSheet, Text, View } from 'react-native';
import { cores, fontes, CORES_TIMES } from '../theme';

export function Chip({ texto }: { texto: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipTxt}>{texto}</Text>
    </View>
  );
}

/** Chip colorido do time: bolinha + "ordem · COR · qtd jog." */
export function ChipTime({
  corIndex,
  ordem,
  qtd,
  incompleto,
}: {
  corIndex: number;
  ordem: number;
  qtd: number;
  incompleto?: boolean;
}) {
  const cor = CORES_TIMES[corIndex % CORES_TIMES.length];
  return (
    <View style={[styles.time, incompleto && styles.incompleto]}>
      <View style={[styles.bola, { backgroundColor: cor.bg }]} />
      <Text style={styles.timeTxt}>
        {ordem}º · {cor.nome} · {qtd} {qtd === 1 ? 'jog.' : 'jog.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: 'rgba(159,170,181,0.12)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipTxt: { color: cores.chalkDim, fontFamily: fontes.corpoMed, fontSize: 12 },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(159,170,181,0.10)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  incompleto: { borderWidth: 2, borderColor: cores.warnRed },
  bola: { width: 16, height: 16, borderRadius: 5 },
  timeTxt: { color: cores.chalk, fontFamily: fontes.corpoMed, fontSize: 14 },
});
