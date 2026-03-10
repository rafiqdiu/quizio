import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login } from '../../store/slices/authSlice';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('john@example.com');
  const [password, setPassword] = useState('password');
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await dispatch(login({ email, password }));
    if (login.rejected.match(result)) {
      const message = (result.payload as string) || 'Login failed';
      Alert.alert('Login Failed', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerBackground} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign in</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.tabActive}>
              <Text style={styles.tabActiveText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabInactive} onPress={() => navigation.replace('Register')}>
              <Text style={styles.tabInactiveText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              <Text style={styles.inputIcon}>@</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              <Text style={styles.inputIcon}>O</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotWrap} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or Continue With</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', 'Google login coming soon')}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialText}>Continue with</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', 'Apple login coming soon')}>
            <Text style={styles.socialIcon}>A</Text>
            <Text style={styles.socialText}>Continue with</Text>
          </TouchableOpacity>

          <View style={styles.bottomLine}>
            <Text style={styles.bottomText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Register')}>
              <Text style={styles.bottomLink}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={styles.bottomText}> here</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.primaryButton, loading ? styles.buttonDisabled : null]} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign in</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PURPLE = '#5b45f6';

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 24,
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
    fontSize: 36 / 2,
    fontWeight: '800',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    marginBottom: 18,
  },
  tabActive: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: PURPLE,
  },
  tabInactive: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  tabActiveText: {
    color: PURPLE,
    fontSize: 34 / 2,
    fontWeight: '700',
  },
  tabInactiveText: {
    color: '#9ca3af',
    fontSize: 34 / 2,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
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
  forgotWrap: {
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  forgotText: {
    color: PURPLE,
    fontWeight: '700',
    fontSize: 26 / 2,
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#4b5563',
    fontSize: 15,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 24,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
    fontSize: 18,
  },
  socialText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  bottomText: {
    color: '#374151',
    fontSize: 14,
  },
  bottomLink: {
    color: PURPLE,
    fontSize: 14,
    fontWeight: '700',
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
    fontSize: 18 / 2,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.75,
  },
});
