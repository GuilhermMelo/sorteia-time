/**
 * Histórico (manifesto 3.4). Lista os últimos 10 sorteios (FIFO), cada item
 * expansível (toque abre os detalhes por time) e removível. Explica a regra.
 */
import { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { CardTime, Tela } from '../components';
import { cores, fontes, MAX_TIMES } from '../theme';
import { MAX_HISTORICO } from '../storage';
import { useNav } from '../navigation';
import { useStore } from '../store';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ROTULO_TIPO: Record<string, string> = {
  toque: '👆 Toque',
  nomes: '📝 Nomes',
  goleiros: '🧤 Goleiros',
};

export function History() {
  const nav = useNav();
  const { historico, apagarSorteio } = useStore();
  const [aberto, setAberto] = useState<string | null>(null);

  function alternar(id: string) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAberto((a) => (a === id ? null : id));
  }

  return (
    <Tela titulo="Histórico" onVoltar={nav.voltar}>
      <Text style={styles.regra}>
        Guardamos os últimos {MAX_HISTORICO} sorteios. Ao salvar um novo, o mais antigo é apagado
        automaticamente.
      </Text>

      {historico.length === 0 ? (
        <Text style={styles.vazio}>Nenhum sorteio ainda.{'\n'}Faça um sorteio para começar ⚽</Text>
      ) : (
        historico.map((r) => {
          const expandido = aberto === r.id;
          return (
            <View key={r.id} style={styles.item}>
              <Pressable style={styles.cabecalho} onPress={() => alternar(r.id)}>
                <View style={styles.info}>
                  <Text style={styles.nome}>{r.name}</Text>
                  <Text style={styles.meta}>
                    {ROTULO_TIPO[r.tipo] ?? r.tipo} · {r.resumo}
                  </Text>
                </View>
                <Pressable onPress={() => apagarSorteio(r.id)} hitSlop={10} style={styles.lixo}>
                  <Text style={styles.lixoTxt}>🗑</Text>
                </Pressable>
                <Text style={styles.seta}>{expandido ? '▲' : '▼'}</Text>
              </Pressable>

              {expandido ? (
                <View style={styles.detalhe}>
                  {r.aviso ? <Text style={styles.aviso}>⚠️ {r.aviso}</Text> : null}
                  {r.detalhe.map((linha, i) => (
                    <CardTime key={i} linha={linha} />
                  ))}
                  {r.reserva && r.reserva.length > 0 ? (
                    <Text style={styles.reserva}>Reserva: {r.reserva.join(', ')}</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })
      )}
    </Tela>
  );
}

const styles = StyleSheet.create({
  regra: {
    color: cores.chalkDim,
    fontFamily: fontes.corpo,
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 4,
  },
  vazio: {
    color: cores.chalkDim,
    fontFamily: fontes.corpo,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingVertical: 40,
  },
  item: { backgroundColor: cores.pitchLight, borderRadius: 14, overflow: 'hidden' },
  cabecalho: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  info: { flex: 1 },
  nome: { color: cores.chalk, fontFamily: fontes.corpoBold, fontSize: 14 },
  meta: { color: cores.chalkDim, fontFamily: fontes.corpo, fontSize: 13, marginTop: 2 },
  lixo: { padding: 2 },
  lixoTxt: { fontSize: 18 },
  seta: { color: cores.chalkDim, fontSize: 12 },
  detalhe: { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  aviso: { color: cores.warnRed, fontFamily: fontes.corpoBold, fontSize: 13 },
  reserva: { color: cores.chalkDim, fontFamily: fontes.corpoMed, fontSize: 14 },
});
