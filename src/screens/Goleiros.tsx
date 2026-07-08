/**
 * Sorteio de Goleiros (manifesto 3.3). Quantidade de times no topo + lista de
 * goleiros. Sorteia 1 goleiro por time; extras vão para a reserva; faltas
 * geram aviso vermelho (antes e no resultado). Persiste lista e histórico.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Aviso, BotaoGhost, BotaoPrimario, Card, CardTime, Stepper, Tela } from '../components';
import { CORES_TIMES, cores, fontes, MAX_TIMES } from '../theme';
import { useNav } from '../navigation';
import { useStore } from '../store';
import { sortearGoleiros } from '../sorteio';
import type { LinhaDetalhe } from '../storage';

export function Goleiros() {
  const nav = useNav();
  const { goleiros, setGoleiros, config, setConfig, salvarSorteio } = useStore();
  const [nome, setNome] = useState('');
  const [resultado, setResultado] = useState<{ detalhe: LinhaDetalhe[]; reserva: string[] } | null>(
    null
  );

  const numTimes = config.qtdTimes;
  const faltando = Math.max(0, numTimes - goleiros.length);

  function adicionar() {
    const n = nome.trim();
    if (!n) return;
    setGoleiros([...goleiros, n]);
    setNome('');
  }
  function remover(i: number) {
    setGoleiros(goleiros.filter((_, idx) => idx !== i));
  }

  async function sortear() {
    const r = sortearGoleiros(goleiros, numTimes);
    const detalhe: LinhaDetalhe[] = r.times.map((g, i) => ({
      ordem: i + 1,
      corIndex: i,
      titulo: `${i + 1} · TIME ${CORES_TIMES[i].nome.toUpperCase()}`,
      itens: [g ? `🧤 ${g}` : '— sem goleiro'],
      semGoleiro: g === null,
    }));
    setResultado({ detalhe, reserva: r.reserva });
    await salvarSorteio({
      tipo: 'goleiros',
      resumo: `${numTimes} times · ${goleiros.length} goleiros`,
      detalhe,
      reserva: r.reserva,
      aviso: r.faltando > 0 ? `${r.faltando} time(s) sem goleiro fixo.` : undefined,
    });
  }

  // ---- Resultado ----
  if (resultado) {
    return (
      <Tela
        titulo="Goleiros sorteados"
        onVoltar={nav.inicio}
        rodape={
          <View style={styles.acoes}>
            <BotaoGhost titulo="Editar" style={styles.flex} onPress={() => setResultado(null)} />
            <BotaoPrimario titulo="🔁 RE-SORTEAR" style={styles.flex} onPress={sortear} />
          </View>
        }
      >
        {resultado.detalhe.map((linha, i) => (
          <CardTime key={i} linha={linha} index={i} />
        ))}
        {resultado.reserva.length > 0 ? (
          <Card>
            <Text style={styles.reservaTitulo}>NA RESERVA (entram de próximo)</Text>
            {resultado.reserva.map((g, i) => (
              <Text key={i} style={styles.reservaItem}>
                🧤 {g}
              </Text>
            ))}
          </Card>
        ) : null}
      </Tela>
    );
  }

  // ---- Cadastro ----
  return (
    <Tela
      titulo="Sorteio de Goleiros"
      onVoltar={nav.voltar}
      rodape={
        <BotaoPrimario
          titulo="SORTEAR GOLEIROS"
          disabled={goleiros.length === 0}
          onPress={sortear}
        />
      }
    >
      <Card>
        <Stepper
          rotulo="Quantidade de times"
          valor={numTimes}
          min={2}
          max={MAX_TIMES}
          onChange={(v) => setConfig({ ...config, qtdTimes: v })}
        />
      </Card>

      {faltando > 0 ? (
        <Aviso texto={`Faltam goleiros: ${faltando} time(s) ficarão sem goleiro fixo!`} />
      ) : null}

      <Card>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nome do goleiro"
            placeholderTextColor={cores.chalkDim}
            value={nome}
            onChangeText={setNome}
            onSubmitEditing={adicionar}
            returnKeyType="done"
          />
          <Pressable style={styles.add} onPress={adicionar}>
            <Text style={styles.addTxt}>＋</Text>
          </Pressable>
        </View>
        <Text style={styles.contagem}>{goleiros.length} goleiros cadastrados</Text>
      </Card>

      {goleiros.length === 0 ? (
        <Text style={styles.vazio}>Nenhum goleiro ainda.{'\n'}Adicione os goleiros 🧤</Text>
      ) : (
        goleiros.map((g, i) => (
          <View key={i} style={styles.linha}>
            <Text style={styles.linhaNome}>🧤 {g}</Text>
            <Pressable onPress={() => remover(i)} hitSlop={10}>
              <Text style={styles.del}>✕</Text>
            </Pressable>
          </View>
        ))
      )}
    </Tela>
  );
}

const styles = StyleSheet.create({
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: cores.pitch,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: cores.chalk,
    fontFamily: fontes.corpo,
    fontSize: 15,
  },
  add: {
    width: 48,
    height: 46,
    borderRadius: 10,
    backgroundColor: cores.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTxt: { color: cores.onGradient, fontFamily: fontes.display, fontSize: 26 },
  contagem: { color: cores.chalkDim, fontFamily: fontes.corpo, fontSize: 13, marginTop: 10 },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.pitchLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  linhaNome: { flex: 1, color: cores.chalk, fontFamily: fontes.corpoMed, fontSize: 16 },
  del: { color: cores.chalkDim, fontSize: 18 },
  vazio: {
    color: cores.chalkDim,
    fontFamily: fontes.corpo,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingVertical: 40,
  },
  reservaTitulo: { color: cores.chalk, fontFamily: fontes.corpoBold, fontSize: 14, marginBottom: 8 },
  reservaItem: { color: cores.chalk, fontFamily: fontes.corpo, fontSize: 16, paddingVertical: 2 },
  acoes: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
