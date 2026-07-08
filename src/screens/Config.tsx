/**
 * Configuração global (⚙️) — quantidade de times (2..10) e jogadores por time
 * (1..11). Usada pelos modos Nomes e Goleiros. Persiste no AsyncStorage.
 */
import { StyleSheet, Text } from 'react-native';
import { BotaoPrimario, Card, Stepper, Tela } from '../components';
import { cores, fontes, MAX_TIMES } from '../theme';
import { useNav } from '../navigation';
import { useStore } from '../store';

export function Config() {
  const nav = useNav();
  const { config, setConfig } = useStore();
  return (
    <Tela
      titulo="Configurar"
      onVoltar={nav.voltar}
      rodape={<BotaoPrimario titulo="SALVAR" onPress={nav.voltar} />}
    >
      <Card>
        <Text style={styles.titulo}>Quantidade de times</Text>
        <Text style={styles.sub}>Usado no Modo Nomes e no Sorteio de Goleiros.</Text>
        <Stepper
          valor={config.qtdTimes}
          min={2}
          max={MAX_TIMES}
          onChange={(v) => setConfig({ ...config, qtdTimes: v })}
        />
      </Card>

      <Card>
        <Text style={styles.titulo}>Jogadores por time</Text>
        <Text style={styles.sub}>Referência para montar os times.</Text>
        <Stepper
          valor={config.porTime}
          min={1}
          max={11}
          onChange={(v) => setConfig({ ...config, porTime: v })}
        />
      </Card>

      <Text style={styles.nota}>
        No Modo Toque você define o total de jogadores e quantos por time na hora do sorteio.
      </Text>
    </Tela>
  );
}

const styles = StyleSheet.create({
  titulo: { color: cores.chalk, fontFamily: fontes.corpoBold, fontSize: 17, marginBottom: 2 },
  sub: { color: cores.chalkDim, fontFamily: fontes.corpo, fontSize: 13, marginBottom: 14 },
  nota: {
    color: cores.chalkDim,
    fontFamily: fontes.corpo,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
