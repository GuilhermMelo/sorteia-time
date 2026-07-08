/**
 * Card de resultado de um time (usado em Toque, Nomes, Goleiros e Histórico).
 * Cabeçalho na cor do colete + itens + etiquetas (começa jogando / incompleto
 * / sem goleiro). Entra em cascata quando `index` é informado.
 */
import { StyleSheet, Text, View } from 'react-native';
import { CORES_TIMES, cores, fontes } from '../theme';
import type { LinhaDetalhe } from '../storage';
import { Card } from './Card';
import { EntradaCascata } from './Animacoes';

export function CardTime({ linha, index }: { linha: LinhaDetalhe; index?: number }) {
  const cor = CORES_TIMES[linha.corIndex % CORES_TIMES.length];
  const alerta = linha.incompleto || linha.semGoleiro;

  const conteudo = (
    <Card borda={alerta ? cores.warnRed : undefined} style={styles.card}>
      <View style={[styles.cabecalho, { backgroundColor: cor.bg }]}>
        <Text style={[styles.titulo, { color: cor.fg }]}>{linha.titulo}</Text>
      </View>

      <View style={styles.corpo}>
        {linha.comecaJogando ? <Text style={styles.comeca}>⚽ começa jogando</Text> : null}
        {linha.incompleto ? (
          <Text style={styles.warn}>⚠️ incompleto — fica de próximo</Text>
        ) : null}
        {linha.semGoleiro ? <Text style={styles.warn}>⚠️ sem goleiro</Text> : null}

        {linha.itens.map((it, i) => (
          <Text key={i} style={styles.item}>
            {it}
          </Text>
        ))}
      </View>
    </Card>
  );

  if (index === undefined) return conteudo;
  return <EntradaCascata index={index}>{conteudo}</EntradaCascata>;
}

const styles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden' },
  cabecalho: { paddingVertical: 10, paddingHorizontal: 14 },
  titulo: { fontFamily: fontes.display, fontSize: 22, letterSpacing: 1 },
  corpo: { padding: 14, gap: 4 },
  comeca: { color: cores.verde, fontFamily: fontes.corpoBold, fontSize: 13, marginBottom: 2 },
  warn: { color: cores.warnRed, fontFamily: fontes.corpoBold, fontSize: 13, marginBottom: 2 },
  item: { color: cores.chalk, fontFamily: fontes.corpo, fontSize: 16 },
});
