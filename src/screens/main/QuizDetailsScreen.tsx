import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchContestDetails } from '../../store/slices/homeSlice';
import { ContestItem } from './homeTypes';
import { getAvailableSpotsLabel, getContestCountdown } from './homeFormatters';

const fallbackContest: ContestItem = {
  id: 100,
  quizId: 0,
  categoryId: 0,
  date: '19 Jun',
  time: '04.32',
  title: 'English Language Quiz',
  subtitle: 'Language - English',
  startAt: null,
  endAt: null,
  maxTime: '5 min',
  maxQues: '20',
  spots: '100 spots',
  prize: '$2499',
  entry: '$20',
  tag: 'Trivia Quiz',
  joinAmount: '$20',
  description: 'Achievement, significance, earned points, rewards, level, and milestone insights.',
  availableSpots: 30,
  totalSpots: 100,
  progressPercent: 70,
};

export default function QuizDetailsScreen({ navigation, route }: any) {
  const dispatch = useAppDispatch();
  const { contestDetails, contestLeaderboard, contestWinnings, detailsLoading } = useAppSelector((state) => state.home);
  const [activeTab, setActiveTab] = useState<'winning' | 'leaderboard'>('winning');
  const [nowMs, setNowMs] = useState(Date.now());
  const initialContest: ContestItem = route?.params?.contest || fallbackContest;
  const contestId = Number(initialContest.id || 0);
  const contest: ContestItem = contestDetails && contestDetails.id === contestId ? contestDetails : initialContest;
  const countdown = useMemo(() => getContestCountdown(contest, nowMs), [contest, nowMs]);
  const cardPrize = contestWinnings[0]?.amountLabel || contest.prize || '$0';
  const joinLabel = contest.joinAmount || contest.entry || '$0.00';

  useEffect(() => {
    if (contestId > 0) {
      dispatch(fetchContestDetails(contestId));
    }
  }, [contestId, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#112c58', '#0f2752', '#0d2145']}
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
              <Text style={styles.heroTitle}>Quiz Details</Text>
            </View>

            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#efeaff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.mainCard}>
          {detailsLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#ff7a14" />
            </View>
          ) : null}

          <View style={styles.topRow}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{contest.date}</Text>
              <Text style={styles.timeText}>{contest.time}</Text>
            </View>

            <View style={styles.titleWrap}>
              <Text style={styles.quizTitle}>{contest.title}</Text>
              <Text style={styles.quizSub}>{contest.subtitle}</Text>
            </View>

            <View style={styles.timerRow}>
              <Text style={styles.timerChip}>{countdown.hours}</Text>
              <Text style={styles.timerColon}>:</Text>
              <Text style={styles.timerChip}>{countdown.minutes}</Text>
              <Text style={styles.timerColon}>:</Text>
              <Text style={styles.timerChip}>{countdown.seconds}</Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>{getAvailableSpotsLabel(contest)}</Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${Math.min(Math.max(contest.progressPercent, 0), 100)}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{contest.spots || '100 spots'}</Text>
          </View>

          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join Now {joinLabel}</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.footerRow}>
            <View style={styles.priceWrap}>
              <Ionicons name="trophy-outline" size={22} color="#ff7a14" />
              <Text style={styles.priceText}>1st Price - {cardPrize}</Text>
            </View>

            <View style={styles.footerIcons}>
              <Ionicons name="share-social-outline" size={24} color="#f4efff" />
              <Ionicons name="notifications-outline" size={24} color="#f4efff" />
            </View>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <View style={styles.divider} />

          <View style={styles.descriptionRow}>
            <View style={styles.docIcon}>
              <Ionicons name="document-text-outline" size={21} color="#f7f5ff" />
            </View>
            <Text style={styles.descriptionText}>
              {contest.description || fallbackContest.description}
            </Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('winning')}>
            <Text style={[styles.tabText, activeTab === 'winning' ? styles.tabTextActive : null]}>Winning</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('leaderboard')}>
            <Text style={[styles.tabText, activeTab === 'leaderboard' ? styles.tabTextActive : null]}>Leaderboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabUnderlineRow}>
          <View style={[styles.tabUnderline, activeTab === 'winning' ? styles.tabUnderlineActive : null]} />
          <View style={[styles.tabUnderline, activeTab === 'leaderboard' ? styles.tabUnderlineActive : null]} />
        </View>

        <View style={styles.rankCard}>
          <LinearGradient
            colors={['#6f4dff', '#5b3dee', '#5135db']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.rankHeader}
          >
            <Text style={styles.rankHeaderText}>Rank</Text>
            <Text style={styles.rankHeaderText}>{activeTab === 'winning' ? 'Winning' : 'Score'}</Text>
          </LinearGradient>

          {activeTab === 'winning'
            ? contestWinnings.map((item, index) => (
                <View key={item.rank} style={styles.rankRow}>
                  <View style={styles.rankLeft}>
                    <Ionicons name="trophy-outline" size={23} color="#ff7a14" />
                    <Text style={styles.rankNumber}>{item.rank}</Text>
                  </View>
                  <Text style={styles.rankAmount}>{item.amountLabel}</Text>
                  {index < contestWinnings.length - 1 ? <View style={styles.rankDivider} /> : null}
                </View>
              ))
            : contestLeaderboard.map((item, index) => (
                <View key={item.id} style={styles.rankRow}>
                  <View style={styles.rankLeft}>
                    <Ionicons name="trophy-outline" size={23} color="#ff7a14" />
                    <Text style={styles.rankNumber}>{item.rank}</Text>
                  </View>
                  <Text style={styles.rankName}>{item.name}</Text>
                  <Text style={styles.rankAmount}>{item.score}</Text>
                  {index < contestLeaderboard.length - 1 ? <View style={styles.rankDivider} /> : null}
                </View>
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
    paddingBottom: Platform.OS === 'web' ? 28 : 126,
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  moreButton: {
    width: 58 / 1.2,
    height: 58 / 1.2,
    borderRadius: 29 / 1.2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    marginTop: -46,
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: '#24125d',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    padding: 14,
  },
  loadingWrap: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 28 / 2,
    fontWeight: '800',
  },
  timeText: {
    color: '#2a2b37',
    fontSize: 28 / 2,
    fontWeight: '600',
  },
  titleWrap: {
    flex: 1,
  },
  quizTitle: {
    color: '#f6f4ff',
    fontSize: 21 / 1.1,
    fontWeight: '800',
    marginBottom: 4,
  },
  quizSub: {
    color: '#e6e2fb',
    fontSize: 18 / 1.1,
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
  progressRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressText: {
    color: '#f4f2ff',
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
    width: '70%',
    height: '100%',
    backgroundColor: '#ff7a14',
  },
  joinButton: {
    marginTop: 16,
    minHeight: 72 / 1.3,
    borderRadius: 36 / 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6a4dff',
  },
  joinButtonText: {
    color: '#f9f8ff',
    fontSize: 40 / 2,
    fontWeight: '800',
  },
  divider: {
    marginTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.22)',
    borderStyle: 'dashed',
  },
  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceText: {
    color: '#f4f0ff',
    fontSize: 19,
    fontWeight: '500',
  },
  footerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  descriptionCard: {
    marginTop: 18,
    marginHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#2a1c72',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
  },
  descriptionTitle: {
    color: '#f4f4fb',
    fontSize: 44 / 2,
    fontWeight: '800',
  },
  descriptionRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionText: {
    flex: 1,
    color: '#dcd7ee',
    fontSize: 20 / 1.1,
    lineHeight: 30 / 1.1,
  },
  tabRow: {
    marginTop: 18,
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
  },
  tabText: {
    color: '#f4f5f7',
    fontSize: 24 / 1.1,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#ff7a14',
  },
  tabUnderlineRow: {
    marginHorizontal: 16,
    flexDirection: 'row',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.22)',
    marginBottom: 14,
  },
  tabUnderline: {
    flex: 1,
  },
  tabUnderlineActive: {
    backgroundColor: '#ff7a14',
  },
  rankCard: {
    marginHorizontal: 16,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#2a2a31',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  rankHeader: {
    minHeight: 66 / 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  rankHeaderText: {
    color: '#f8f7ff',
    fontSize: 44 / 2,
    fontWeight: '800',
  },
  rankRow: {
    paddingHorizontal: 16,
    minHeight: 68,
    justifyContent: 'center',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rankNumber: {
    position: 'absolute',
    left: 30,
    color: '#f8f7fd',
    fontSize: 36 / 2,
    fontWeight: '700',
  },
  rankAmount: {
    position: 'absolute',
    right: 16,
    color: '#f8f7fd',
    fontSize: 42 / 2,
    fontWeight: '700',
  },
  rankName: {
    position: 'absolute',
    left: 56,
    color: '#f8f7fd',
    fontSize: 18,
    fontWeight: '600',
  },
  rankDivider: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
  },
});
