import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type AnimatedGradientButtonProps = {
  title: string;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradientColors?: string[];
};

export default function AnimatedGradientButton({
  title,
  loading = false,
  loadingText,
  disabled = false,
  onPress,
  style,
  textStyle,
  gradientColors = ['#ff7a14', '#ff8f1f', '#ff6b2c'],
}: AnimatedGradientButtonProps) {
  const shimmerProgress = useRef(new Animated.Value(0)).current;
  const pulseProgress = useRef(new Animated.Value(0)).current;
  const [buttonWidth, setButtonWidth] = useState(260);

  useEffect(() => {
    if (!loading) {
      shimmerProgress.stopAnimation();
      pulseProgress.stopAnimation();
      pulseProgress.setValue(0);
      return;
    }

    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerProgress, {
        toValue: 1,
        duration: 1050,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseProgress, {
          toValue: 1,
          duration: 460,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseProgress, {
          toValue: 0,
          duration: 460,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    shimmerProgress.setValue(0);
    pulseProgress.setValue(0);
    shimmerLoop.start();
    pulseLoop.start();

    return () => {
      shimmerLoop.stop();
      pulseLoop.stop();
    };
  }, [loading, pulseProgress, shimmerProgress]);

  const shimmerTranslateX = shimmerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-buttonWidth, buttonWidth],
  });

  const pulseScale = pulseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseScale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={disabled || loading}
        onLayout={(event) => {
          setButtonWidth(event.nativeEvent.layout.width || 260);
        }}
        style={[styles.touchable, style, disabled || loading ? styles.disabled : null]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.shimmerWrap,
            { opacity: loading ? 1 : 0, transform: [{ translateX: shimmerTranslateX }] },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.shimmer}
          />
        </Animated.View>

        <View style={styles.content}>
          {loading ? <ActivityIndicator color="#ffffff" size="small" style={styles.spinner} /> : null}
          <Text style={[styles.text, textStyle]}>{loading ? loadingText || title : title}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  touchable: {
    minHeight: 56,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.92,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '800',
  },
  shimmerWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  shimmer: {
    width: 120,
    height: '100%',
  },
});
