import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppPageGradient from '../../components/AppPageGradient';

const PURPLE = '#5b45f6';

export default function ResetPasswordCodeScreen({ navigation, route }: any) {
  const email = route?.params?.email || 'example@gmail.com';
  const [code, setCode] = useState(['', '', '', '']);
  const refs = useRef<Array<TextInput | null>>([]);

  const updateCode = (value: string, index: number) => {
    const char = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...code];
    next[index] = char;
    setCode(next);

    if (char && index < 3) {
      refs.current[index + 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppPageGradient />
      <LinearGradient
        colors={['#5b45f6', '#7c3ae5', '#5b45f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.headerBackground}
      />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Password</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Forgot Password</Text>
          <Text style={styles.cardSubtitle}>Input the verification code that already sent to</Text>
          <Text style={styles.mailText}>{email || 'example@gmail.com'}</Text>

          <View style={styles.codeRow}>
            {code.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(el) => {
                  refs.current[idx] = el;
                }}
                style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                value={digit}
                onChangeText={(value) => updateCode(value, idx)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive email? </Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('CreatePassword', { email, code: code.join('') })}
        >
          <LinearGradient
            colors={['#ff7a14', '#ff6b2c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
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
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  cardSubtitle: {
    color: '#374151',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  mailText: {
    color: PURPLE,
    textAlign: 'center',
    marginBottom: 14,
    fontSize: 14,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  codeInput: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 24,
    color: '#111827',
    fontWeight: '700',
  },
  codeInputFilled: {
    borderColor: '#fb923c',
    backgroundColor: '#fff7ed',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendText: {
    color: '#4b5563',
    fontSize: 14,
  },
  resendLink: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
