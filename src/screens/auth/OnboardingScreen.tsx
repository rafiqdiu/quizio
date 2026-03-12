import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const slides = [
  {
    title: 'Knowledge Boosting',
    subtitle: 'Find fun and interesting quizzes to boost up your knowledge',
  },
  {
    title: 'Win Rewards Galore',
    subtitle: 'Find fun and interesting quizzes to boost up your knowledge',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slide = useMemo(() => slides[index], [index]);
  const isLast = index === slides.length - 1;

  const handleNext = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
      if (isLast) {
        navigation.replace('Login');
        return;
      }
      setIndex((prev) => prev + 1);
    });
  };



  return (
    <LinearGradient
      colors={['#f4f6ff', '#eef2ff', '#ede9fe']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topGraphic}>
        <View style={styles.planet} />

        <View style={[styles.avatar, styles.avatarA]}><Text style={styles.avatarText}>A</Text></View>
        <View style={[styles.avatar, styles.avatarB]}><Text style={styles.avatarText}>B</Text></View>
        <View style={[styles.avatar, styles.avatarC]}><Text style={styles.avatarText}>C</Text></View>
        <View style={[styles.avatar, styles.avatarD]}><Text style={styles.avatarText}>D</Text></View>

        <View style={[styles.badge, styles.badgeOne]}><Text style={styles.badgeText}>S</Text></View>
        <View style={[styles.badge, styles.badgeTwo]}><Text style={styles.badgeText}>L</Text></View>
        <View style={[styles.badge, styles.badgeThree]}><Text style={styles.badgeText}>C</Text></View>
        <View style={[styles.badge, styles.badgeFour]}><Text style={styles.badgeText}>F</Text></View>
      </View>

      <View style={styles.content}>
        <Text style={styles.spark}>***</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        <View style={styles.pagination}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index ? styles.dotActive : null]} />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButton, isLast ? styles.nextButtonWide : null]}
          onPress={handleNext}
        >
          <LinearGradient
            colors={['#5b45f6', '#7c3ae5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {isLast ? (
            <Text style={styles.nextText}>Get Started</Text>
          ) : (
            <Ionicons name="arrow-forward" size={26} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f5',
  },
  topGraphic: {
    height: 356,
    overflow: 'hidden',
    backgroundColor: '#f4f6ff',
  },
  planet: {
    position: 'absolute',
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: '#7b66f5',
    top: -298,
    alignSelf: 'center',
    borderWidth: 36,
    borderColor: '#9aaaf0',
    shadowColor: '#7b66f5',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 12,
  },
  avatar: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#d5e9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
  },
  avatarA: {
    left: 52,
    top: 88,
  },
  avatarB: {
    left: 14,
    top: 190,
  },
  avatarC: {
    right: 56,
    top: 140,
  },
  avatarD: {
    alignSelf: 'center',
    top: 214,
  },
  badge: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  badgeText: {
    color: '#4b5563',
    fontWeight: '700',
  },
  badgeOne: {
    top: 102,
    left: 12,
  },
  badgeTwo: {
    top: 160,
    left: '46%',
  },
  badgeThree: {
    top: 218,
    left: 98,
  },
  badgeFour: {
    top: 210,
    right: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
    paddingTop: 22,
    alignItems: 'center',
  },
  spark: {
    alignSelf: 'flex-start',
    color: '#f97316',
    fontSize: 22,
    marginBottom: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 50 / 2,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 30 / 1.2,
    textAlign: 'center',
    maxWidth: 320,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 28,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fbc0c6',
    marginHorizontal: 7,
  },
  dotActive: {
    width: 34,
    borderRadius: 7,
    backgroundColor: '#f66f7a',
  },
  footer: {
    paddingHorizontal: 36,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    color: '#f97316',
    fontSize: 32 / 2,
    fontWeight: '700',
  },
  nextButton: {
    width: 55,
    height: 55,
    borderRadius: 46,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5b45f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonWide: {
    width: 160,
    height: 55,
    borderRadius: 40,
    shadowColor: '#5b45f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  nextText: {
    color: '#ffffff',
    fontSize: 36 / 2,
    fontWeight: '700',
  },
});
