/**
 * Botões do design system (manifesto 2.5).
 * - Primário: gradiente da marca, texto onGradient.
 * - Secundário: fundo chalk, texto pitch.
 * - Ghost: transparente, borda chalkDim 33%.
 * Todos com feedback de escala 0.95 ao pressionar (2.6), respeitando o
 * "reduzir animações" do sistema.
 */
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { cores, fontes, marcaGradient, raio } from '../theme';

const AView = Animated.createAnimatedComponent(View);

function usePress() {
  const s = useSharedValue(1);
  const reduzir = useReducedMotion();
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  const onPressIn = () => {
    s.value = reduzir ? 1 : withTiming(0.95, { duration: 90 });
  };
  const onPressOut = () => {
    s.value = withTiming(1, { duration: 120 });
  };
  return { anim, onPressIn, onPressOut };
}

type BtnProps = {
  titulo: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  cor?: string; // sobrescreve a cor de fundo (usado nos botões coloridos da home)
  corTexto?: string;
};

export function BotaoPrimario({ titulo, onPress, disabled, style, cor, corTexto }: BtnProps) {
  const { anim, onPressIn, onPressOut } = usePress();
  const solido = !!cor;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={style}
    >
      <AView style={[anim, disabled && styles.disabled]}>
        {solido ? (
          <View style={[styles.corpo, { backgroundColor: cor }]}>
            <Text style={[styles.txtPrim, { color: corTexto ?? '#FFFFFF' }]}>{titulo}</Text>
          </View>
        ) : (
          <LinearGradient {...marcaGradient} style={styles.corpo}>
            <Text style={[styles.txtPrim, { color: cores.onGradient }]}>{titulo}</Text>
          </LinearGradient>
        )}
      </AView>
    </Pressable>
  );
}

export function BotaoSecundario({ titulo, onPress, disabled, style }: BtnProps) {
  const { anim, onPressIn, onPressOut } = usePress();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={style}
    >
      <AView style={[styles.corpo, styles.secundario, anim, disabled && styles.disabled]}>
        <Text style={[styles.txtPrim, { color: cores.pitch }]}>{titulo}</Text>
      </AView>
    </Pressable>
  );
}

export function BotaoGhost({ titulo, onPress, disabled, style }: BtnProps) {
  const { anim, onPressIn, onPressOut } = usePress();
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={style}
    >
      <AView style={[styles.corpo, styles.ghost, anim, disabled && styles.disabled]}>
        <Text style={[styles.txtGhost]}>{titulo}</Text>
      </AView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  corpo: {
    borderRadius: raio.botao,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secundario: { backgroundColor: cores.chalk },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(159,170,181,0.33)',
    borderRadius: raio.ghost,
  },
  txtPrim: {
    fontFamily: fontes.display,
    fontSize: 22,
    letterSpacing: 1,
  },
  txtGhost: {
    fontFamily: fontes.corpoMed,
    fontSize: 15,
    color: cores.chalkDim,
  },
  disabled: { opacity: 0.4 },
});
