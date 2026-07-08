/**
 * Tela do Modo Toque (manifesto 3.1, passos 6–9).
 * Cada jogador toca a tela e o fundo inteiro vira a cor do time sorteado com
 * um "pop" elástico, mostrando "VOCÊ É DO TIME {COR}", o número GRANDE = ordem
 * do time e a legenda "{n}º time a jogar". Toca de novo → próximo jogador.
 * No último jogador, salva no histórico e vai para o resumo.
 */
import { useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { CORES_TIMES, cores, fontes } from '../theme';
import { useNav } from '../navigation';
import { useStore } from '../store';
import { montarPoolToque, type PlanoToque } from '../sorteio';
import { nomeRegistro, novoId, type LinhaDetalhe, type Registro } from '../storage';

function montarDetalhe(plano: PlanoToque): { detalhe: LinhaDetalhe[]; aviso?: string } {
  const detalhe = plano.distribuicao.map((qtd, i) => {
    const incompleto = i === plano.incompletoIndex;
    return {
      ordem: i + 1,
      corIndex: i,
      titulo: `${i + 1} · TIME ${CORES_TIMES[i].nome.toUpperCase()}`,
      itens: [`${qtd} ${qtd === 1 ? 'jogador' : 'jogadores'}`],
      incompleto,
      comecaJogando: i < 2 && !incompleto,
    } satisfies LinhaDetalhe;
  });
  const aviso = plano.fecha
    ? undefined
    : `O ${plano.numTimes}º time ficou incompleto (${
        plano.distribuicao[plano.numTimes - 1]
      } jog.) e fica de próximo.`;
  return { detalhe, aviso };
}

export function Tap({ plano }: { plano: PlanoToque }) {
  const nav = useNav();
  const { salvarSorteio } = useStore();
  const insets = useSafeAreaInsets();
  const reduzir = useReducedMotion();

  const pool = useMemo(() => montarPoolToque(plano), [plano]);
  const [feitos, setFeitos] = useState(0); // jogadores já confirmados
  const [revelado, setRevelado] = useState<number | null>(null); // índice do time atual
  const salvo = useRef(false);

  const scale = useSharedValue(1);
  const rot = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));

  function pop() {
    if (reduzir) {
      scale.value = 1;
      rot.value = 0;
      return;
    }
    scale.value = withSequence(
      withTiming(0.3, { duration: 0 }),
      withSpring(1, { damping: 7, stiffness: 150, mass: 0.6 })
    );
    rot.value = withSequence(
      withTiming(-8, { duration: 0 }),
      withSpring(0, { damping: 8, stiffness: 120 })
    );
  }

  async function finalizar() {
    if (salvo.current) return;
    salvo.current = true;
    const { detalhe, aviso } = montarDetalhe(plano);
    const registro: Registro = {
      id: novoId(),
      name: nomeRegistro('toque'),
      tipo: 'toque',
      resumo: `${plano.numTimes} times · ${plano.total} jogadores`,
      detalhe,
      aviso,
    };
    await salvarSorteio(registro);
    nav.ir({ nome: 'tapSummary', registro });
  }

  function onToque() {
    if (revelado === null) {
      // revela o jogador atual
      setRevelado(pool[feitos]);
      pop();
    } else {
      // confirma e avança
      const prox = feitos + 1;
      setRevelado(null);
      setFeitos(prox);
      if (prox >= pool.length) finalizar();
    }
  }

  const cor = revelado !== null ? CORES_TIMES[revelado] : null;
  const incompletoAtual = revelado !== null && revelado === plano.incompletoIndex && !plano.fecha;

  return (
    <Pressable
      style={[styles.tela, { backgroundColor: cor ? cor.bg : cores.pitch }]}
      onPress={onToque}
    >
      <View style={[styles.conteudo, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {cor ? (
          <Animated.View style={[styles.centro, animStyle]}>
            <Text style={[styles.voce, { color: cor.fg }]}>VOCÊ É DO</Text>
            <Text style={[styles.timeCor, { color: cor.fg }]}>TIME {cor.nome.toUpperCase()}</Text>
            <Text style={[styles.numero, { color: cor.fg }]}>{revelado! + 1}</Text>
            <Text style={[styles.legenda, { color: cor.fg }]}>{revelado! + 1}º time a jogar</Text>
            {incompletoAtual ? (
              <Text style={[styles.incompleto, { color: cor.fg }]}>
                ⚠️ time incompleto — fica de próximo
              </Text>
            ) : null}
            <Text style={[styles.toqueDica, { color: cor.fg }]}>toque para o próximo →</Text>
          </Animated.View>
        ) : (
          <View style={styles.centro}>
            <Text style={styles.esperaTitulo}>Passe o celular</Text>
            <Text style={styles.esperaTexto}>Toque na tela para descobrir seu time</Text>
            <View style={styles.dedo}>
              <Text style={styles.dedoEmoji}>👆</Text>
            </View>
          </View>
        )}

        <Text style={[styles.contador, { color: cor ? cor.fg : cores.chalkDim }]}>
          {feitos} de {pool.length} sorteados
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  centro: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  voce: { fontFamily: fontes.display, fontSize: 30, letterSpacing: 2, opacity: 0.9 },
  timeCor: { fontFamily: fontes.display, fontSize: 52, letterSpacing: 2, textAlign: 'center' },
  numero: { fontFamily: fontes.display, fontSize: 200, lineHeight: 210 },
  legenda: { fontFamily: fontes.corpoBold, fontSize: 18, opacity: 0.92 },
  incompleto: { fontFamily: fontes.corpoBold, fontSize: 15, marginTop: 14, textAlign: 'center' },
  toqueDica: { fontFamily: fontes.corpo, fontSize: 14, opacity: 0.75, marginTop: 28 },
  esperaTitulo: { fontFamily: fontes.display, fontSize: 44, color: cores.chalk, letterSpacing: 1 },
  esperaTexto: {
    fontFamily: fontes.corpo,
    fontSize: 16,
    color: cores.chalkDim,
    marginTop: 6,
    textAlign: 'center',
  },
  dedo: { marginTop: 36 },
  dedoEmoji: { fontSize: 64 },
  contador: { fontFamily: fontes.corpoMed, fontSize: 15, paddingBottom: 8 },
});
