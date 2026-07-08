/**
 * Configuração do Modo Toque (manifesto 3.1, passos 1–5).
 * Pergunta total de jogadores (2..110) e jogadores por time (1..11), calcula
 * o nº de times (teto) em destaque, avisa quando passa de 10 (desabilita) ou
 * quando a divisão não fecha redondo, e mostra a prévia com chips coloridos.
 */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Aviso, BotaoPrimario, Card, ChipTime, Stepper, Tela } from '../components';
import { cores, fontes, MAX_TIMES } from '../theme';
import { useNav } from '../navigation';
import { planejarToque, TOQUE_LIMITES } from '../sorteio';

export function TapSetup() {
  const nav = useNav();
  const [total, setTotal] = useState(10);
  const [porTime, setPorTime] = useState(5);
  const plano = planejarToque(total, porTime);

  return (
    <Tela
      titulo="Modo Toque"
      onVoltar={nav.voltar}
      rodape={
        <BotaoPrimario
          titulo="COMEÇAR SORTEIO"
          disabled={!plano.valido}
          onPress={() => nav.ir({ nome: 'tap', plano })}
        />
      }
    >
      {/* Nº de times em destaque no topo */}
      <Card style={styles.destaque}>
        <Text style={styles.destLabel}>NÚMERO DE TIMES</Text>
        <Text style={[styles.destNum, plano.excedeMax && { color: cores.warnRed }]}>
          {plano.numTimes}
        </Text>
      </Card>

      {plano.excedeMax ? (
        <Aviso texto={`Máximo de ${MAX_TIMES} times! Aumente os jogadores por time ou reduza o total.`} />
      ) : null}

      {!plano.fecha && plano.valido ? (
        <Aviso
          texto={`A divisão não fecha redonda: o último time (${plano.distribuicao[plano.numTimes - 1]} jog.) fica incompleto e "de próximo".`}
        />
      ) : null}

      <Card>
        <Stepper
          rotulo="Total de jogadores"
          valor={total}
          min={TOQUE_LIMITES.totalMin}
          max={TOQUE_LIMITES.totalMax}
          onChange={setTotal}
        />
      </Card>
      <Card>
        <Stepper
          rotulo="Jogadores por time"
          valor={porTime}
          min={TOQUE_LIMITES.porTimeMin}
          max={TOQUE_LIMITES.porTimeMax}
          onChange={setPorTime}
        />
      </Card>

      {/* Prévia da divisão */}
      {plano.valido ? (
        <View style={styles.previa}>
          <Text style={styles.previaTitulo}>Divisão prevista</Text>
          {plano.distribuicao.map((qtd, i) => (
            <ChipTime
              key={i}
              corIndex={i}
              ordem={i + 1}
              qtd={qtd}
              incompleto={i === plano.incompletoIndex}
            />
          ))}
        </View>
      ) : null}
    </Tela>
  );
}

const styles = StyleSheet.create({
  destaque: { alignItems: 'center', paddingVertical: 18 },
  destLabel: { color: cores.chalkDim, fontFamily: fontes.corpoMed, fontSize: 13, letterSpacing: 2 },
  destNum: { color: cores.verde, fontFamily: fontes.display, fontSize: 72, lineHeight: 76 },
  previa: { gap: 8 },
  previaTitulo: {
    color: cores.chalk,
    fontFamily: fontes.corpoBold,
    fontSize: 15,
    marginBottom: 2,
  },
});
