import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const slides = [
  {
    title: 'Knowledge Boosting',
    subtitle: 'Find fun and interesting quizzes to boost up your knowledge',
  },
  {
    title: 'Win Rewards Galore',
    subtitle: 'Compete with friends, top leaderboards, and unlock badges.',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const slide = useMemo(() => slides[index], [index]);

  const goNext = () => {
    if (index >= slides.length - 1) {
      navigation.replace('Login');
      return;
    }

    setIndex((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topGraphic}>
        <View style={styles.planet} />

        <View style={[styles.avatar, styles.avatarA]}><Text style={styles.avatarText}>A</Text></View>
        <View style={[styles.avatar, styles.avatarB]}><Text style={styles.avatarText}>B</Text></View>
        <View style={[styles.avatar, styles.avatarC]}><Text style={styles.avatarText}>C</Text></View>
        <View style={[styles.avatar, styles.avatarD]}><Text style={styles.avatarText}>D</Text></View>

        <View style={[styles.badge, styles.badgeOne]}><Text>S</Text></View>
        <View style={[styles.badge, styles.badgeTwo]}><Text>L</Text></View>
        <View style={[styles.badge, styles.badgeThree]}><Text>C</Text></View>
        <View style={[styles.badge, styles.badgeFour]}><Text>F</Text></View>
      </View>

      <View style={styles.content}>
        <Text style={styles.spark}>*</Text>
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

        <TouchableOpacity style={styles.nextButton} onPress={goNext}>
          <Text style={styles.nextText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4ff',
  },
  topGraphic: {
    height: 360,
    overflow: 'hidden',
    backgroundColor: '#eef2ff',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  planet: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: '#7c6af5',
    top: -300,
    alignSelf: 'center',
    borderWidth: 36,
    borderColor: '#a5b4fc',
  },
  avatar: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 34,
  },
  avatarA: {
    left: 54,
    top: 88,
  },
  avatarB: {
    left: 24,
    top: 188,
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
    backgroundColor: '#fff',
  },
  badgeOne: {
    top: 102,
    left: 16,
  },
  badgeTwo: {
    top: 160,
    left: '46%',
  },
  badgeThree: {
    top: 218,
    left: 96,
  },
  badgeFour: {
    top: 210,
    right: 26,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 32,
    alignItems: 'center',
  },
  spark: {
    alignSelf: 'flex-start',
    color: '#fb923c',
    fontSize: 26,
    marginBottom: 10,
  },
  title: {
    fontSize: 44 / 2,
    fontWeight: '800',
    color: '#16181d',
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 320,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 28,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 18,
    backgroundColor: '#5b45f6',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    color: '#5b45f6',
    fontSize: 26 / 2,
    fontWeight: '700',
  },
  nextButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#5b45f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 28,
    marginTop: -2,
  },
});
