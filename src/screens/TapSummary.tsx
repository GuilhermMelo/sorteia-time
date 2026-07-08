/**
 * Resumo do Modo Toque (manifesto 3.1, passos 8–9).
 * Mostra os times com etiquetas (começa jogando / incompleto) e botões
 * "Ajustar" (volta à configuração) e "Sortear de novo".
 */
import { StyleSheet, Text, View } from 'react-native';
import { Aviso, BotaoPrimario, BotaoSecundario, CardTime, Tela } from '../components';
import { cores, fontes } from '../theme';
import { useNav } from '../navigation';
import type { Registro } from '../storage';

export function TapSummary({ registro }: { registro: Registro }) {
  const nav = useNav();
  return (
    <Tela
      titulo="Times sorteados"
      onVoltar={nav.inicio}
      rodape={
        <View style={styles.acoes}>
          <BotaoSecundario titulo="AJUSTAR" style={styles.flex} onPress={() => nav.voltar()} />
          <BotaoPrimario
            titulo="SORTEAR DE NOVO"
            style={styles.flex}
            onPress={() => {
              // volta para a config do toque para um novo sorteio
              nav.inicio();
              nav.ir({ nome: 'tapSetup' });
            }}
          />
        </View>
      }
    >
      <Text style={styles.resumo}>{registro.resumo}</Text>
      {registro.aviso ? <Aviso texto={registro.aviso} /> : null}
      {registro.detalhe.map((linha, i) => (
        <CardTime key={i} linha={linha} index={i} />
      ))}
    </Tela>
  );
}

const styles = StyleSheet.create({
  resumo: { color: cores.chalkDim, fontFamily: fontes.corpoMed, fontSize: 15, marginBottom: 2 },
  acoes: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
