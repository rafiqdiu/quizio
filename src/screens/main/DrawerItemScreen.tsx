import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppPageGradient from '../../components/AppPageGradient';

export default function DrawerItemScreen({ navigation, route }: any) {
  const title = route?.params?.title || 'Details';
  const icon = route?.params?.icon || 'information-circle-outline';
  const description =
    route?.params?.description || 'This section is ready. You can customize it with real data and actions.';

  return (
    <View style={styles.container}>
      <AppPageGradient />
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon as any} size={26} color="#5b45f6" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('CategoriesList')}
        >
          <Text style={styles.primaryButtonText}>Back To Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 18,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: '#5b45f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
