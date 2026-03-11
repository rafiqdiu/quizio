import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AppPageGradient() {
  return (
    <LinearGradient
      colors={['#f8fbff', '#eef2ff', '#ede9fe']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fill}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
});
