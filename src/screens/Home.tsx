/**
 * Home (manifesto 3.0). Ordem fixa dos elementos:
 * logo → wordmark → chips → configuração → Modo Toque → Modo Nomes →
 * Sorteio de Goleiros → Histórico → rodapé.
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BotaoGhost,
  BotaoPrimario,
  BotaoSecundario,
  Fundo,
  LogoFlutuante,
  TransicaoTela,
  Wordmark,
} from '../components';
import { cores, fontes } from '../theme';
import { useNav } from '../navigation';
import { useStore } from '../store';

export function Home() {
  const nav = useNav();
  const { historico } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <Fundo>
      <TransicaoTela>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 28 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topo}>
            <LogoFlutuante tamanho={148} />
            <Wordmark />
          </View>

          <Pressable style={styles.config} onPress={() => nav.ir({ nome: 'config' })}>
            <Text style={styles.configTxt}>⚙️  Configurar times e jogadores</Text>
          </Pressable>

          <View style={styles.botoes}>
            <BotaoPrimario titulo="MODO TOQUE" onPress={() => nav.ir({ nome: 'tapSetup' })} />
            <Text style={styles.legenda}>cada um toca e descobre seu time</Text>

            <BotaoSecundario titulo="MODO NOMES" onPress={() => nav.ir({ nome: 'names' })} />
            <Text style={styles.legenda}>digite a lista e sorteie os times</Text>

            <BotaoPrimario
              titulo="SORTEIO DE GOLEIROS"
              cor={cores.azul}
              corTexto="#FFFFFF"
              onPress={() => nav.ir({ nome: 'gkSetup' })}
            />
            <Text style={styles.legenda}>1 goleiro para cada time</Text>

            <BotaoGhost
              titulo={`🗂️  Histórico de sorteios (${historico.length}/10)`}
              onPress={() => nav.ir({ nome: 'history' })}
              style={{ marginTop: 6 }}
            />
          </View>

          <Text style={styles.rodape}>Seus dados ficam salvos apenas neste aparelho.</Text>
        </ScrollView>
      </TransicaoTela>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20, alignItems: 'stretch' },
  topo: { alignItems: 'center', marginBottom: 20 },
  config: {
    backgroundColor: cores.pitchLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  configTxt: { color: cores.chalk, fontFamily: fontes.corpoMed, fontSize: 15 },
  botoes: { gap: 8 },
  legenda: {
    color: cores.chalkDim,
    fontFamily: fontes.corpo,
    fontSize: 12,
    textAlign: 'center',
    marginTop: -2,
    marginBottom: 8,
  },
  rodape: {
    color: cores.chalkDim,
    fontFamily: fontes.corpo,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});
