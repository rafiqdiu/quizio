import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }: any) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate scale and opacity on mount
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1600);

    return () => clearTimeout(timer);
  }, [navigation, scaleAnim, opacityAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['#eef2ff', '#f3e8ff', '#ede9fe']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.ringsWrap}>
        <Animated.View
          style={[
            styles.ring,
            styles.ring1,
            {
              transform: [{ rotate }],
              opacity: 0.1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring2,
            {
              transform: [{ rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-360deg'],
              }) }],
              opacity: 0.12,
            },
          ]}
        />
        <View style={[styles.ring, styles.ring3]} />
        <View style={[styles.ring, styles.ring4]} />
        <View style={[styles.ring, styles.ring5]} />
      </View>

      <Animated.View
        style={[
          styles.logoCard,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <LinearGradient
          colors={['#7c3ae5', '#ff7a14']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientIcon}
        >
          <Text style={styles.logoBulb}>Q</Text>
        </LinearGradient>
        <Text style={styles.logoText}>QuiZio</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ringsWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 26,
    borderColor: 'rgba(124, 58, 237, 0.08)',
    borderRadius: 999,
  },
  ring1: {
    width: 860,
    height: 860,
  },
  ring2: {
    width: 700,
    height: 700,
  },
  ring3: {
    width: 540,
    height: 540,
  },
  ring4: {
    width: 380,
    height: 380,
  },
  ring5: {
    width: 230,
    height: 230,
  },
  logoCard: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#ffffffee',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logoBulb: {
    fontSize: 52,
    fontWeight: '800',
    color: '#ffffff',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: 0.6,
  },
});
