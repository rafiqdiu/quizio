import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchLeaderboard } from '../../store/slices/leaderboardSlice';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AppPageGradient from '../../components/AppPageGradient';

type Period = 'today' | 'weekly' | 'all';

type LeaderboardItem = {
  id: number;
  name: string;
  gender?: 'male' | 'female' | null;
  avatar?: string | null;
  avatar_url?: string | null;
  total_score: number;
  quizzes_completed?: number;
  rank: number;
};

function getGenderIcon(gender?: string | null) {
  if (gender === 'female') {
    return 'female';
  }

  if (gender === 'male') {
    return 'male';
  }

  return 'person';
}

function getAvatarUri(item: LeaderboardItem): string | null {
  return item.avatar_url || item.avatar || null;
}

export default function LeaderboardScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector((state) => state.leaderboard);

  const [period, setPeriod] = useState<Period>('today');
  const { onScroll, headerTranslateY, headerOpacity, contentTranslateY, contentOpacity } =
    useScrollAnimation({ maxShift: 24, fadeDistance: 180 });

  useEffect(() => {
    dispatch(fetchLeaderboard({ period, limit: 50 }));
  }, [dispatch, period]);

  const rankedEntries = useMemo<LeaderboardItem[]>(
    () => [...entries].sort((a, b) => a.rank - b.rank),
    [entries]
  );

  const topThreeByRank = rankedEntries.slice(0, 3);
  const topForDisplay = [topThreeByRank[1], topThreeByRank[0], topThreeByRank[2]].filter(
    (item): item is LeaderboardItem => Boolean(item)
  );

  if (loading && entries.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5b45f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppPageGradient />
      <Animated.View
        style={[
          { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity },
        ]}
      >
        <LinearGradient
          colors={['#6f4dff', '#5b45f6', '#4f39d8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroShine} />

          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                if (navigation?.canGoBack?.()) {
                  navigation.goBack();
                }
              }}
            >
              <Ionicons name="close" size={18} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Leaderboard</Text>
          </View>

          <View style={styles.periodRow}>
            <TouchableOpacity
              style={[styles.periodButton, period === 'today' ? styles.periodButtonActive : null]}
              onPress={() => setPeriod('today')}
            >
              <Text style={[styles.periodText, period === 'today' ? styles.periodTextActive : null]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, period === 'weekly' ? styles.periodButtonActive : null]}
              onPress={() => setPeriod('weekly')}
            >
              <Text style={[styles.periodText, period === 'weekly' ? styles.periodTextActive : null]}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, period === 'all' ? styles.periodButtonActive : null]}
              onPress={() => setPeriod('all')}
            >
              <Text style={[styles.periodText, period === 'all' ? styles.periodTextActive : null]}>All Time</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          styles.body,
          { transform: [{ translateY: contentTranslateY }], opacity: contentOpacity },
        ]}
      >
        <View style={styles.podiumRow}>
          {topForDisplay.map((item, index) => {
            const center = index === 1;
            const badgeRank = center ? 1 : index === 0 ? 2 : 3;
            return (
              <View key={item.id} style={[styles.podiumItem, center ? styles.podiumCenter : null]}>
                {center ? (
                  <View style={styles.crownWrap}>
                    <Ionicons name="trophy" size={28} color="#facc15" />
                  </View>
                ) : null}

                <View style={[styles.podiumAvatarRing, center ? styles.podiumAvatarRingCenter : null]}>
                  <View style={styles.podiumAvatarInner}>
                    {getAvatarUri(item) ? (
                      <Image source={{ uri: getAvatarUri(item)! }} style={styles.podiumAvatarImage} />
                    ) : (
                      <Ionicons
                        name={getGenderIcon(item.gender) as any}
                        size={center ? 30 : 26}
                        color="#ffffff"
                      />
                    )}
                  </View>
                </View>

                <View style={[styles.rankDot, center ? styles.rankDotCenter : null]}>
                  <Text style={styles.rankDotText}>{badgeRank}</Text>
                </View>

                <Text style={styles.podiumName} numberOfLines={1}>
                  {item.name}
                </Text>

                <View style={[styles.scorePill, center ? styles.scorePillCenter : null]}>
                  <Ionicons name="diamond-outline" size={12} color="#ffffff" />
                  <Text style={styles.scorePillText}>{item.total_score}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Animated.FlatList
          data={rankedEntries}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No leaderboard data for this period.</Text>
              </View>
            ) : null
          }
          renderItem={({ item, index }) => {
            const isTop = index === 0;
            return (
              <View style={[styles.rowCard, isTop ? styles.rowCardTop : null]}>
                {isTop ? (
                  <LinearGradient
                    colors={['#4f39d8', '#5b45f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}

                <Text style={[styles.rowRank, isTop ? styles.rowRankTop : null]}>{item.rank}</Text>

                <View style={styles.rowAvatar}>
                  {getAvatarUri(item) ? (
                    <Image source={{ uri: getAvatarUri(item)! }} style={styles.rowAvatarImage} />
                  ) : (
                    <Ionicons
                      name={getGenderIcon(item.gender) as any}
                      size={18}
                      color={isTop ? '#ffffff' : '#4b5563'}
                    />
                  )}
                </View>

                <Text style={[styles.rowName, isTop ? styles.rowNameTop : null]} numberOfLines={1}>
                  {item.name}
                </Text>

                <Ionicons
                  name="trophy"
                  size={14}
                  color={isTop ? '#fb923c' : '#f97316'}
                  style={styles.rowTrophy}
                />

                <View style={[styles.rowScorePill, isTop ? styles.rowScorePillTop : null]}>
                  <Ionicons name="diamond-outline" size={12} color="#f97316" />
                  <Text style={styles.rowScoreText}>{item.total_score}</Text>
                </View>
              </View>
            );
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edf1fb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edf1fb',
  },
  hero: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 64,
    borderBottomRightRadius: 64,
    overflow: 'hidden',
  },
  heroShine: {
    position: 'absolute',
    right: -40,
    top: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '18deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 34 / 2,
    fontWeight: '800',
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  periodButton: {
    width: '30.5%',
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#ff7a14',
  },
  periodText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  periodTextActive: {
    color: '#ffffff',
  },
  body: {
    flex: 1,
    marginTop: -6,
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 10,
  },
  podiumItem: {
    width: '30%',
    alignItems: 'center',
  },
  podiumCenter: {
    marginTop: -12,
  },
  crownWrap: {
    marginBottom: -8,
    zIndex: 3,
  },
  podiumAvatarRing: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 3,
    borderColor: '#ff7a14',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9e7ff',
  },
  podiumAvatarRingCenter: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  podiumAvatarInner: {
    width: '84%',
    height: '84%',
    borderRadius: 999,
    backgroundColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  podiumAvatarImage: {
    width: '100%',
    height: '100%',
  },
  rankDot: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 6,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 8,
  },
  rankDotCenter: {
    backgroundColor: '#f97316',
  },
  rankDotText: {
    color: '#ffffff',
    fontSize: 15 / 1.1,
    fontWeight: '800',
  },
  podiumName: {
    color: '#111827',
    fontSize: 34 / 2,
    fontWeight: '800',
    marginBottom: 6,
  },
  scorePill: {
    minHeight: 28,
    borderRadius: 14,
    backgroundColor: '#22c55e',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scorePillCenter: {
    backgroundColor: '#ff7a14',
  },
  scorePillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  emptyState: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '600',
  },
  rowCard: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  rowCardTop: {
    borderColor: '#5b45f6',
  },
  rowRank: {
    width: 18,
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
  },
  rowRankTop: {
    color: '#ddd6fe',
  },
  rowAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  rowAvatarImage: {
    width: '100%',
    height: '100%',
  },
  rowName: {
    flex: 1,
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  rowNameTop: {
    color: '#ffffff',
  },
  rowTrophy: {
    marginRight: 6,
  },
  rowScorePill: {
    minHeight: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowScorePillTop: {
    backgroundColor: '#ffffff',
  },
  rowScoreText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
});
