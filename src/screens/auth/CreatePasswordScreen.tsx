import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';

const PURPLE = '#5b45f6';

export default function CreatePasswordScreen({ navigation }: any) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submit = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    navigation.navigate('ResetSuccess');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerBackground} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Password</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Password</Text>
          <Text style={styles.cardSubtitle}>
            Craft a strong and secure password to safeguard your online presence
          </Text>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Confirm"
              placeholderTextColor="#9ca3af"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Text style={styles.inputIcon}>O</Text>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="*Str0ngP@ss!"
              placeholderTextColor="#9ca3af"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <Text style={styles.inputIcon}>O</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={submit}>
          <Text style={styles.primaryButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececf8',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: PURPLE,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  content: {
    flex: 1,
    paddingTop: 54,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: {
    fontSize: 24,
    color: '#374151',
    marginTop: -2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 18,
    padding: 18,
    marginBottom: 40,
  },
  cardTitle: {
    textAlign: 'center',
    color: '#111827',
    fontSize: 30 / 2,
    fontWeight: '800',
    marginBottom: 10,
  },
  cardSubtitle: {
    color: '#374151',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 2,
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    color: '#111827',
    fontSize: 14,
  },
  inputIcon: {
    color: '#9ca3af',
    fontSize: 16,
  },
  primaryButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
