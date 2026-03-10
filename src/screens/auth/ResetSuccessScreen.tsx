import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PURPLE = '#5b45f6';

export default function ResetSuccessScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapOuter}>
        <View style={styles.iconWrapInner}>
          <Text style={styles.check}>v</Text>
        </View>
      </View>

      <Text style={styles.title}>Reset Successfully!</Text>
      <Text style={styles.subtitle}>
        Your OTP has been successfully updated. Secure access for your financial transactions is ensured.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('Login')}>
        <Text style={styles.primaryButtonText}>Okey!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  iconWrapOuter: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconWrapInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
    marginTop: -4,
  },
  title: {
    color: PURPLE,
    fontSize: 34 / 2,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    color: '#374151',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 64,
    maxWidth: 320,
  },
  primaryButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 28,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
