import { useMemo, useRef } from 'react';
import { Animated } from 'react-native';

type ScrollAnimationOptions = {
  maxShift?: number;
  fadeDistance?: number;
};

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const maxShift = options.maxShift ?? 28;
  const fadeDistance = options.fadeDistance ?? 180;
  const scrollY = useRef(new Animated.Value(0)).current;

  const onScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      ),
    [scrollY]
  );

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, fadeDistance],
    outputRange: [0, -maxShift],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, fadeDistance * 0.7, fadeDistance],
    outputRange: [1, 0.96, 0.9],
    extrapolate: 'clamp',
  });

  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, fadeDistance],
    outputRange: [0, -(maxShift * 0.35)],
    extrapolate: 'clamp',
  });

  const contentOpacity = scrollY.interpolate({
    inputRange: [0, fadeDistance],
    outputRange: [1, 0.98],
    extrapolate: 'clamp',
  });

  return {
    onScroll,
    headerTranslateY,
    headerOpacity,
    contentTranslateY,
    contentOpacity,
  };
}
