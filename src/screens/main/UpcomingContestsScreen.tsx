import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUpcomingContests } from '../../store/slices/homeSlice';
import { getContestCountdown, getAvailableSpotsLabel } from './homeFormatters';

export default function UpcomingContestsScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { upcomingContests, listLoading } = useAppSelector((state) => state.home);
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    dispatch(fetchUpcomingContests());
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
              <Text style={styles.heroTitle}>Upcoming Contest</Text>
            </View>

            <TouchableOpacity style={styles.plusButton}>
              <Ionicons name="add" size={24} color="#efeaff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Upcoming Contest</Text>

          {listLoading && upcomingContests.length === 0 ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#ff7a14" />
            </View>
          ) : null}

          {upcomingContests.map((item) => (
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
              <View style={styles.topRow}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>

                <View style={styles.titleWrap}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSub}>{item.subtitle}</Text>
                </View>

                <View style={styles.timerRow}>
                  <Text style={styles.timerChip}>{countdown.hours}</Text>
                  <Text style={styles.timerColon}>:</Text>
                  <Text style={styles.timerChip}>{countdown.minutes}</Text>
                  <Text style={styles.timerColon}>:</Text>
                  <Text style={styles.timerChip}>{countdown.seconds}</Text>
                </View>
              </View>

              <View style={styles.metricsRow}>
                <Text style={styles.metricText}>Max Time - <Text style={styles.metricBold}>{item.maxTime}</Text></Text>
                <Text style={styles.metricText}>Max Ques - <Text style={styles.metricBold}>{item.maxQues}</Text></Text>
              </View>

              <View style={styles.spotsRow}>
                <Text style={styles.spotsText}>{getAvailableSpotsLabel(item)}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.min(Math.max(item.progressPercent, 0), 100)}%` }]} />
                </View>
                <Text style={styles.spotsText}>{item.spots || `${item.totalSpots} spots`}</Text>
              </View>

              <View style={styles.bottomMetrics}>
                <View style={styles.prizeGroup}>
                  <View style={styles.prizeIcon}>
                    <Ionicons name="trophy-outline" size={16} color="#1b1b25" />
                  </View>

                  <View>
                    <Text style={styles.prizeLabel}>Price Pool</Text>
                    <Text style={styles.prizeValue}>{item.prize || '$0'}</Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.prizeLabel}>Entry</Text>
                  <Text style={styles.prizeValue}>{item.entry || '$0.00'}</Text>
                </View>

                <TouchableOpacity style={styles.joinNowButton}>
                  <Text style={styles.joinNowText}>Join Now</Text>
                </TouchableOpacity>
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
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(255,255,255,0.16)',
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
    padding: 14,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    color: '#f4efff',
    fontSize: 22 / 1.1,
    fontWeight: '800',
  },
  metricsRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricText: {
    color: '#f5f1ff',
    fontSize: 22 / 1.1,
  },
  metricBold: {
    fontWeight: '800',
  },
  spotsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  spotsText: {
    color: '#f5f1ff',
    fontSize: 22 / 1.1,
  },
  track: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#3b2a7f',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#ff7a14',
  },
  bottomMetrics: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prizeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prizeLabel: {
    color: '#f6f1ff',
    fontSize: 17,
  },
  prizeValue: {
    color: '#ffffff',
    fontSize: 38 / 2,
    fontWeight: '800',
  },
  joinNowButton: {
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  joinNowText: {
    color: '#1b1a24',
    fontSize: 34 / 2,
    fontWeight: '700',
  },
  divider: {
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
