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
const DARK_BG = '#0f2f67';
const CARD_BG = '#24155f';
const INPUT_BG = '#2b1f74';
const ORANGE = '#ff7a14';

export default function RegisterScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
      <View style={styles.headerCurve} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity style={styles.tabInactive} onPress={() => navigation.replace('Login')}>
              <Text style={styles.tabInactiveText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabActive}>
              <Text style={styles.tabActiveText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Enter First Name"
                placeholderTextColor="#9ea0be"
                value={firstName}
                onChangeText={setFirstName}
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
                placeholderTextColor="#9ea0be"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.inputIcon}>M</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="*******"
                placeholderTextColor="#9ea0be"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <Text style={styles.inputIcon}>O</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="*******"
                placeholderTextColor="#9ea0be"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <Text style={styles.inputIcon}>O</Text>
            </View>
          </View>

          <Text style={styles.labelLight}>Choose Gender</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.genderButton, gender === 'male' ? styles.genderButtonActive : null]}
              onPress={() => setGender('male')}
            >
              <View style={[styles.radioCircle, gender === 'male' ? styles.radioCircleActive : null]}>
                <Text style={styles.radioMark}>{gender === 'male' ? 'v' : ''}</Text>
              </View>
              <Text style={[styles.genderText, gender === 'male' ? styles.genderTextActive : null]}>Male</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.genderButton, gender === 'female' ? styles.genderButtonActive : null]}
              onPress={() => setGender('female')}
            >
              <View style={[styles.radioCircle, gender === 'female' ? styles.radioCircleActive : null]}>
                <Text style={styles.radioMark}>{gender === 'female' ? 'v' : ''}</Text>
              </View>
              <Text style={[styles.genderText, gender === 'female' ? styles.genderTextActive : null]}>Female</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.termsRow} onPress={() => setAcceptedTerms((prev) => !prev)}>
            <View style={[styles.radioCircle, acceptedTerms ? styles.radioCircleActive : null]}>
              <Text style={styles.radioMark}>{acceptedTerms ? 'v' : ''}</Text>
            </View>
            <Text style={styles.termsText}>I accept to all Term, Privacy and Fees</Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, loading ? styles.buttonDisabled : null]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Sign Up</Text>}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or Continue With</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', 'Google login coming soon')}>
          <Text style={styles.socialIcon}>G</Text>
          <Text style={styles.socialText}>Continue With</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', 'Apple login coming soon')}>
          <Text style={styles.socialIcon}>A</Text>
          <Text style={styles.socialText}>Continue With</Text>
        </TouchableOpacity>

        <View style={styles.bottomLine}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.bottomLink}>Sign In</Text>
          </TouchableOpacity>
          <Text style={styles.bottomText}> here</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: PURPLE,
  },
  headerCurve: {
    position: 'absolute',
    top: 200,
    left: -120,
    right: -120,
    height: 140,
    backgroundColor: DARK_BG,
    borderTopLeftRadius: 240,
    borderTopRightRadius: 240,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 26,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 84,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: {
    fontSize: 22,
    color: '#374151',
    marginTop: -2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 46 / 2,
    fontWeight: '800',
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#7b7ca1',
    marginBottom: 18,
  },
  tabActive: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: ORANGE,
  },
  tabInactive: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
  },
  tabActiveText: {
    color: ORANGE,
    fontSize: 19,
    fontWeight: '700',
  },
  tabInactiveText: {
    color: '#8a8cb0',
    fontSize: 19,
    fontWeight: '700',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 20 / 1.1,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 8,
  },
  labelLight: {
    fontSize: 34 / 2,
    color: '#ffffff',
    marginBottom: 10,
  },
  inputWrap: {
    borderRadius: 12,
    minHeight: 50,
    backgroundColor: INPUT_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 17 / 1.1,
  },
  inputIcon: {
    color: '#d1d5db',
    fontSize: 16,
    fontWeight: '700',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  genderButton: {
    width: '48%',
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7b7ca1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  genderButtonActive: {
    borderColor: '#b7aedf',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#7b7ca1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioCircleActive: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  radioMark: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 10,
  },
  genderText: {
    color: '#8a8cb0',
    fontSize: 36 / 2,
  },
  genderTextActive: {
    color: '#d1d5db',
    fontWeight: '700',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  termsText: {
    color: '#ffffff',
    fontSize: 34 / 2,
    flex: 1,
  },
  errorText: {
    color: '#fca5a5',
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  primaryButtonText: {
    color: '#111827',
    fontSize: 20 / 1.1,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#54597e',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#e5e7eb',
    fontSize: 16 / 1.1,
  },
  socialButton: {
    backgroundColor: '#2a1a76',
    borderRadius: 24,
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  socialIcon: {
    marginRight: 10,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  socialText: {
    color: '#ffffff',
    fontSize: 18 / 1.1,
    fontWeight: '700',
  },
  bottomLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  bottomText: {
    color: '#ffffff',
    fontSize: 16 / 1.1,
  },
  bottomLink: {
    color: ORANGE,
    fontSize: 16 / 1.1,
    fontWeight: '700',
  },
});
