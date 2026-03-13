import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCurrentContests } from '../../store/slices/homeSlice';
import { getContestCountdown } from './homeFormatters';

export default function CurrentContestsScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { currentContests, listLoading } = useAppSelector((state) => state.home);
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    dispatch(fetchCurrentContests());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#122d59', '#102754', '#0c1f44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6f4dff', '#5e3ff3', '#5532ef']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroTitleRow}>
              <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={26} color="#1b1b25" />
              </TouchableOpacity>
              <Text style={styles.heroTitle}>Current Contest</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Current Contest</Text>

          {listLoading && currentContests.length === 0 ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#ff7a14" />
            </View>
          ) : null}

          {currentContests.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate('QuizDetails', { contest: item })}
              activeOpacity={0.92}
            >
              {(() => {
                const countdown = getContestCountdown(item, nowMs);

                return (
                  <>
              <View style={styles.topStrip}>
                <Text style={styles.topText}>{countdown.label}</Text>
                <View style={styles.timerRow}>
                  <Text style={styles.timerChip}>{countdown.hours}</Text>
                  <Text style={styles.timerColon}>:</Text>
                  <Text style={styles.timerChip}>{countdown.minutes}</Text>
                  <Text style={styles.timerColon}>:</Text>
                  <Text style={styles.timerChip}>{countdown.seconds}</Text>
                </View>
                <Text style={styles.readText}>Read Instruction</Text>
              </View>

              <View style={styles.mainRow}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>

                <View style={styles.titleWrap}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSub}>{item.subtitle}</Text>
                </View>

                <View style={styles.arrowCircle}>
                  <Ionicons name="arrow-forward" size={24} color="#1c154d" />
                </View>
              </View>

              <View style={styles.statsRow}>
                <View>
                  <Text style={styles.statLabel}>Max Time</Text>
                  <Text style={styles.statValue}>{item.maxTime}</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>Max Ques</Text>
                  <Text style={styles.statValue}>{item.maxQues}</Text>
                </View>
                <View>
                  <Text style={styles.statLabel}>No of Contest</Text>
                  <Text style={styles.statValue}>{item.noOfContest || '1'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.footerRow}>
                <View style={styles.footerLeft}>
                  <Ionicons name="sparkles-outline" size={16} color="#6a4dff" />
                  <Text style={styles.footerLabel}>{item.tag || 'Trivia Quiz'}</Text>
                </View>

                <View style={styles.footerIcons}>
                  <Ionicons name="notifications-outline" size={22} color="#f4efff" />
                  <Ionicons name="share-social-outline" size={22} color="#f4efff" />
                </View>
              </View>
                  </>
                );
              })()}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2450',
  },
  content: {
    paddingBottom: Platform.OS === 'web' ? 24 : 126,
  },
  hero: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 74,
    borderBottomLeftRadius: 130,
    borderBottomRightRadius: 130,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f4f5f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: '#f3f5fb',
    fontSize: 30 / 1.1,
    fontWeight: '800',
  },
  body: {
    marginTop: -36,
    paddingHorizontal: 16,
  },
  loadingWrap: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 50 / 2,
    fontWeight: '800',
    marginBottom: 14,
  },
  card: {
    borderRadius: 22,
    backgroundColor: '#24125d',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
    marginBottom: 14,
  },
  topStrip: {
    minHeight: 70,
    backgroundColor: '#6e584f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  topText: {
    color: '#f6f2ff',
    fontSize: 20 / 1.1,
    fontWeight: '700',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerChip: {
    minWidth: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#f6f2ff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16 / 1.1,
    fontWeight: '700',
    paddingTop: 7,
  },
  timerColon: {
    color: '#f6f2ff',
    fontSize: 22 / 1.1,
    fontWeight: '800',
  },
  readText: {
    color: '#ff982f',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  dateBadge: {
    width: 84,
    minHeight: 84,
    borderRadius: 16,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: '#14151d',
    fontSize: 30 / 2,
    fontWeight: '800',
  },
  timeText: {
    color: '#252632',
    fontSize: 30 / 2,
    fontWeight: '600',
  },
  titleWrap: {
    flex: 1,
  },
  cardTitle: {
    color: '#f7f5ff',
    fontSize: 22 / 1.1,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSub: {
    color: '#f0ebff',
    fontSize: 20 / 1.1,
  },
  arrowCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: '#f2eaff',
    fontSize: 20 / 1.1,
    marginBottom: 4,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 20 / 1.1,
    fontWeight: '800',
  },
  divider: {
    marginHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.24)',
    borderStyle: 'dashed',
  },
  footerRow: {
    marginTop: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLabel: {
    color: '#e8e3ff',
    fontSize: 19 / 1.1,
    fontWeight: '500',
  },
  footerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
