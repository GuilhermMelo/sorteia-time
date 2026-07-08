/**
 * Layout padrão das telas internas: fundo com véu, área segura, cabeçalho,
 * conteúdo rolável e um rodapé opcional de ações fixas.
 */
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fundo } from './Fundo';
import { Header } from './Header';
import { TransicaoTela } from './Animacoes';

export function Tela({
  titulo,
  onVoltar,
  children,
  rodape,
  scrollStyle,
}: {
  titulo: string;
  onVoltar?: () => void;
  children: React.ReactNode;
  rodape?: React.ReactNode;
  scrollStyle?: ViewStyle;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Fundo>
      <TransicaoTela>
        <View style={[styles.wrap, { paddingTop: insets.top + 12 }]}>
          <View style={styles.head}>
            <Header titulo={titulo} onVoltar={onVoltar} />
          </View>
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              { paddingBottom: insets.bottom + 20 },
              scrollStyle,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
          {rodape ? (
            <View style={[styles.rodape, { paddingBottom: insets.bottom + 12 }]}>{rodape}</View>
          ) : null}
        </View>
      </TransicaoTela>
    </Fundo>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 18 },
  head: { marginBottom: 4 },
  scroll: { paddingTop: 6, gap: 12 },
  rodape: { paddingTop: 10, gap: 10 },
});
