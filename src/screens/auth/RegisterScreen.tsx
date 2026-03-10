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
import { register } from '../../store/slices/authSlice';

const PURPLE = '#5b45f6';

export default function RegisterScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('male');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const handleRegister = async () => {
    if (!firstName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept terms to continue');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    const result = await dispatch(
      register({
        name: firstName,
        email,
        password,
        password_confirmation: confirmPassword,
      })
    );

    if (register.rejected.match(result)) {
      const message = (result.payload as string) || 'Registration failed';
      Alert.alert('Registration Failed', message);
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
          <Text style={styles.headerTitle}>Create account</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.tabInactive} onPress={() => navigation.replace('Login')}>
              <Text style={styles.tabInactiveText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabActive}>
              <Text style={styles.tabActiveText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Enter Name"
                placeholderTextColor="#9ca3af"
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
              />
              <Text style={styles.inputIcon}>U</Text>
            </View>
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
              <Text style={styles.inputIcon}>v</Text>
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

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="*Str0ngP@ss!"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
              <Text style={styles.inputIcon}>O</Text>
            </View>
          </View>

          <Text style={styles.label}>Choose Gender</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' ? styles.genderActive : null]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.genderCheck}>{gender === 'male' ? 'v' : ''}</Text>
              <Text style={[styles.genderText, gender === 'male' ? styles.genderTextActive : null]}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' ? styles.genderActive : null]}
              onPress={() => setGender('female')}
            >
              <Text style={styles.genderCheck}>{gender === 'female' ? 'v' : ''}</Text>
              <Text style={[styles.genderText, gender === 'female' ? styles.genderTextActive : null]}>Female</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.termsRow} onPress={() => setAcceptedTerms((prev) => !prev)}>
            <View style={[styles.checkbox, acceptedTerms ? styles.checkboxActive : null]}>
              <Text style={styles.checkboxText}>{acceptedTerms ? 'v' : ''}</Text>
            </View>
            <Text style={styles.termsText}>I accept to all Term, Privacy and Fees</Text>
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
        </View>

        <TouchableOpacity style={[styles.primaryButton, loading ? styles.buttonDisabled : null]} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Create Account</Text>}
        </TouchableOpacity>
      </ScrollView>
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
    fontSize: 18,
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
    fontSize: 17,
    fontWeight: '700',
  },
  tabInactiveText: {
    color: '#9ca3af',
    fontSize: 17,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 12,
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
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  genderButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 9,
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderActive: {
    borderColor: PURPLE,
    backgroundColor: '#f0edff',
  },
  genderCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c4b5fd',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: PURPLE,
    overflow: 'hidden',
    fontWeight: '700',
    lineHeight: 18,
    marginRight: 8,
  },
  genderText: {
    color: '#6b7280',
    fontSize: 14,
  },
  genderTextActive: {
    color: '#4338ca',
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  checkboxText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  termsText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
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
  buttonDisabled: {
    opacity: 0.75,
  },
});
