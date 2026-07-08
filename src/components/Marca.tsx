/**
 * Marca da home: logo recortado flutuando + wordmark "M&M / SORTEIA TIME" +
 * chips (manifesto 2.5). A flutuação é uma animação suave de subir/descer,
 * desativada quando o sistema pede para reduzir animações.
 */
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { cores, fontes } from '../theme';
import { Chip } from './ChipTime';

const logo = require('../../assets/logo-racha-recorte.png');

export function LogoFlutuante({ tamanho = 150 }: { tamanho?: number }) {
  const y = useSharedValue(0);
  const reduzir = useReducedMotion();
  useEffect(() => {
    if (reduzir) return;
    y.value = withRepeat(
      withTiming(-12, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [reduzir]);
  const anim = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={anim}>
      <Image
        source={logo}
        style={{ width: tamanho, height: tamanho }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

export function Wordmark() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.mm}>M&M</Text>
      <Text style={styles.sorteia}>SORTEIA TIME</Text>
      <View style={styles.chips}>
        <Chip texto="sorteio de times" />
        <Chip texto="offline" />
        <Chip texto="sem login" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  mm: { fontFamily: fontes.display, fontSize: 46, color: cores.verde, letterSpacing: 1 },
  sorteia: {
    fontFamily: fontes.display,
    fontSize: 26,
    color: cores.azulClaro,
    letterSpacing: 3,
    marginTop: -4,
  },
  chips: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' },
});
