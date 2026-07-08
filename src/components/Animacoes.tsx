/**
 * Wrappers de animação (manifesto 2.6):
 * - TransicaoTela: fade + slide de baixo (14px), 300ms — troca de tela.
 * - EntradaCascata: cards entram em cascata (slide da esquerda + fade),
 *   delay de 60ms por item.
 * Ambos respeitam "reduzir animações".
 */
import { useEffect } from 'react';
import type { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export function TransicaoTela({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const p = useSharedValue(0);
  const reduzir = useReducedMotion();
  useEffect(() => {
    p.value = reduzir ? 1 : withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, []);
  const anim = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * 14 }],
  }));
  return <Animated.View style={[{ flex: 1 }, style, anim]}>{children}</Animated.View>;
}

export function EntradaCascata({
  children,
  index,
  style,
}: {
  children: React.ReactNode;
  index: number;
  style?: ViewStyle;
}) {
  const p = useSharedValue(0);
  const reduzir = useReducedMotion();
  useEffect(() => {
    p.value = reduzir
      ? 1
      : withDelay(index * 60, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }));
  }, []);
  const anim = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateX: (1 - p.value) * -24 }],
  }));
  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}
