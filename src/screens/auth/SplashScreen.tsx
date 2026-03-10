import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1600);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.ringsWrap}>
        <View style={[styles.ring, styles.ring1]} />
        <View style={[styles.ring, styles.ring2]} />
        <View style={[styles.ring, styles.ring3]} />
        <View style={[styles.ring, styles.ring4]} />
        <View style={[styles.ring, styles.ring5]} />
      </View>

      <View style={styles.logoCard}>
        <Text style={styles.logoBulb}>Q</Text>
        <Text style={styles.logoText}>QuiZio</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2ff',
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
    backgroundColor: '#ffffffdd',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.25)',
  },
  logoBulb: {
    fontSize: 52,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1f2937',
    letterSpacing: 0.6,
  },
});
