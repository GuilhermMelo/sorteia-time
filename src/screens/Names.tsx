/**
 * Modo Nomes (manifesto 3.2). Lista de jogadores (nome + toggle goleiro 🧤 +
 * adicionar; removíveis) e resultado com 1 goleiro por time (round-robin).
 * A lista persiste no AsyncStorage; usa a config global de quantidade de times.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { BotaoGhost, BotaoPrimario, Card, CardTime, Tela } from '../components';
import { CORES_TIMES, cores, fontes } from '../theme';
import { useNav } from '../navigation';
import { useStore } from '../store';
import { sortearNomes, type TimeNomes } from '../sorteio';
import { novoId, type Jogador, type LinhaDetalhe } from '../storage';

function paraDetalhe(times: TimeNomes[]): LinhaDetalhe[] {
  return times.map((t, i) => ({
    ordem: i + 1,
    corIndex: i,
    titulo: `${i + 1} · TIME ${CORES_TIMES[i].nome.toUpperCase()}`,
    itens: [...t.goleiros.map((g) => `🧤 ${g.nome}`), ...t.linha.map((p) => `• ${p.nome}`)],
  }));
}

export function Names() {
  const nav = useNav();
  const { jogadores, setJogadores, config, salvarSorteio } = useStore();
  const [nome, setNome] = useState('');
  const [ehGoleiro, setEhGoleiro] = useState(false);
  const [resultado, setResultado] = useState<LinhaDetalhe[] | null>(null);

  function adicionar() {
    const n = nome.trim();
    if (!n) return;
    const novo: Jogador = { id: novoId(), nome: n, goleiro: ehGoleiro };
    setJogadores([...jogadores, novo]);
    setNome('');
    setEhGoleiro(false);
  }
  function remover(id: string) {
    setJogadores(jogadores.filter((j) => j.id !== id));
  }

  async function sortear() {
    if (jogadores.length < config.qtdTimes) return;
    const times = sortearNomes(jogadores, config.qtdTimes);
    const detalhe = paraDetalhe(times);
    setResultado(detalhe);
    await salvarSorteio({
      tipo: 'nomes',
      resumo: `${config.qtdTimes} times · ${jogadores.length} jogadores`,
      detalhe,
    });
  }

  // ---- Tela de resultado ----
  if (resultado) {
    return (
      <Tela
        titulo="Times sorteados"
        onVoltar={nav.inicio}
        rodape={
          <View style={styles.acoes}>
            <BotaoGhost titulo="Editar lista" style={styles.flex} onPress={() => setResultado(null)} />
            <BotaoPrimario titulo="🔁 RE-SORTEAR" style={styles.flex} onPress={sortear} />
          </View>
        }
      >
        <Text style={styles.resumo}>
          {config.qtdTimes} times · {jogadores.length} jogadores
        </Text>
        {resultado.map((linha, i) => (
          <CardTime key={i} linha={linha} index={i} />
        ))}
      </Tela>
    );
  }

  // ---- Tela da lista ----
  const goleiros = jogadores.filter((j) => j.goleiro).length;
  const podeSortear = jogadores.length >= config.qtdTimes;
  return (
    <Tela
      titulo="Modo Nomes"
      onVoltar={nav.voltar}
      rodape={
        <>
          {!podeSortear ? (
            <Text style={styles.aviso}>
              Adicione pelo menos {config.qtdTimes} jogadores (config: {config.qtdTimes} times).
            </Text>
          ) : null}
          <BotaoPrimario titulo="SORTEAR TIMES" disabled={!podeSortear} onPress={sortear} />
        </>
      }
    >
      <Card>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Nome do jogador"
            placeholderTextColor={cores.chalkDim}
            value={nome}
            onChangeText={setNome}
            onSubmitEditing={adicionar}
            returnKeyType="done"
          />
          <Pressable
            style={[styles.gk, ehGoleiro && styles.gkOn]}
            onPress={() => setEhGoleiro((v) => !v)}
          >
            <Text style={styles.gkEmoji}>🧤</Text>
          </Pressable>
          <Pressable style={styles.add} onPress={adicionar}>
            <Text style={styles.addTxt}>＋</Text>
          </Pressable>
        </View>
        <Text style={styles.contagem}>
          {jogadores.length} jogadores · {goleiros} goleiro{goleiros === 1 ? '' : 's'}
        </Text>
      </Card>

      {jogadores.length === 0 ? (
        <Text style={styles.vazio}>Nenhum jogador ainda.{'\n'}Adicione o pessoal da pelada ⚽</Text>
      ) : (
        jogadores.map((j) => (
          <View key={j.id} style={styles.linha}>
            <Text style={styles.linhaNome}>
              {j.goleiro ? '🧤 ' : ''}
              {j.nome}
            </Text>
            <Pressable onPress={() => remover(j.id)} hitSlop={10}>
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
  gk: {
    width: 48,
    height: 46,
    borderRadius: 10,
    backgroundColor: cores.pitch,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  gkOn: { opacity: 1, backgroundColor: 'rgba(52,227,137,0.18)' },
  gkEmoji: { fontSize: 20 },
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
  resumo: { color: cores.chalkDim, fontFamily: fontes.corpoMed, fontSize: 15, marginBottom: 2 },
  aviso: { color: cores.warnRed, fontFamily: fontes.corpoMed, fontSize: 13, textAlign: 'center' },
  acoes: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
