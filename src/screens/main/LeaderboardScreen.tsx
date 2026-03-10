import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchLeaderboard } from '../../store/slices/leaderboardSlice';

type RangeFilter = 'today' | 'weekly' | 'all';

function getInitials(name: string) {
  const safe = String(name || '').trim();
  if (!safe) {
    return 'U';
  }
  const parts = safe.split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

function TopUserCard({ user, place }: { user: any; place: 1 | 2 | 3 }) {
  if (!user) {
    return <View style={[styles.topCard, place === 1 ? styles.topCardCenter : styles.topCardSide]} />;
  }

  return (
    <View style={[styles.topCard, place === 1 ? styles.topCardCenter : styles.topCardSide]}>
      <View style={[styles.avatarRing, place === 1 ? styles.avatarRingFirst : null]}>
        <View style={styles.avatarInner}>
          <Text style={styles.avatarInitial}>{getInitials(user.name)}</Text>
        </View>
      </View>
      <View style={[styles.badgeRank, place === 1 ? styles.badgeRankFirst : null]}>
        <Text style={styles.badgeRankText}>{place}</Text>
      </View>
      <Text style={styles.topName} numberOfLines={1}>{user.name}</Text>
      <View style={[styles.topScorePill, place === 1 ? styles.topScoreFirst : place === 2 ? styles.topScoreSecond : styles.topScoreThird]}>
        <Text style={styles.topScoreText}>D {user.total_score}</Text>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector((state) => state.leaderboard);
  const [range, setRange] = useState<RangeFilter>('today');

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.rank - b.rank);

    if (range === 'today') {
      return sorted.slice(0, 10);
    }

    if (range === 'weekly') {
      return [...entries]
        .sort((a, b) => b.quizzes_completed - a.quizzes_completed || a.rank - b.rank)
        .slice(0, 10)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));
    }

    return sorted;
  }, [entries, range]);

  const topThree = filteredEntries.slice(0, 3);
  const listEntries = filteredEntries.slice(3);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5b45f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listEntries}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.hero}>
              <View style={styles.heroGlow} />
              <View style={styles.titleRow}>
                <View style={styles.closeButton}>
                  <Text style={styles.closeText}>x</Text>
                </View>
                <Text style={styles.title}>Leaderboard</Text>
              </View>

              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterTab, range === 'today' ? styles.filterTabActive : null]}
                  onPress={() => setRange('today')}
                >
                  <Text style={[styles.filterText, range === 'today' ? styles.filterTextActive : null]}>Today</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterTab, range === 'weekly' ? styles.filterTabActive : null]}
                  onPress={() => setRange('weekly')}
                >
                  <Text style={[styles.filterText, range === 'weekly' ? styles.filterTextActive : null]}>Weekly</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterTab, range === 'all' ? styles.filterTabActive : null]}
                  onPress={() => setRange('all')}
                >
                  <Text style={[styles.filterText, range === 'all' ? styles.filterTextActive : null]}>All Time</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.topThreeWrap}>
                <TopUserCard user={topThree[1]} place={2} />
                <TopUserCard user={topThree[0]} place={1} />
                <TopUserCard user={topThree[2]} place={3} />
              </View>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const isFirst = index === 0;
          return (
            <View style={[styles.rowCard, isFirst ? styles.rowCardPrimary : null]}>
              <View style={styles.rowRankWrap}>
                <Text style={[styles.rowRankText, isFirst ? styles.rowRankTextPrimary : null]}>{item.rank}</Text>
              </View>

              <View style={styles.rowAvatar}>
                <Text style={styles.rowAvatarInitial}>{getInitials(item.name)}</Text>
              </View>

              <View style={styles.rowNameWrap}>
                <Text style={[styles.rowName, isFirst ? styles.rowNamePrimary : null]} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              <View style={[styles.rowScorePill, isFirst ? styles.rowScorePillPrimary : null]}>
                <Text style={[styles.rowScoreText, isFirst ? styles.rowScoreTextPrimary : null]}>D {item.total_score}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No leaderboard data</Text>
            <Text style={styles.emptySub}>Complete quizzes to populate rankings.</Text>
          </View>
        }
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  hero: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    backgroundColor: '#5b45f6',
    paddingTop: 56,
    paddingBottom: 28,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    marginBottom: 14,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    right: -120,
    top: -190,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '20deg' }],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  closeText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '700',
  },
  title: {
    color: '#ffffff',
    fontSize: 33 / 2,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    marginHorizontal: 5,
    minHeight: 42,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#ff7a14',
  },
  filterText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  topThreeWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  topCard: {
    alignItems: 'center',
    flex: 1,
  },
  topCardCenter: {
    marginHorizontal: 8,
  },
  topCardSide: {
    marginBottom: 8,
  },
  avatarRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#f97316',
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRingFirst: {
    width: 108,
    height: 108,
    borderRadius: 54,
  },
  avatarInner: {
    width: '86%',
    height: '86%',
    borderRadius: 999,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  badgeRank: {
    marginTop: -12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5bbf68',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRankFirst: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ff7a14',
  },
  badgeRankText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  topName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
    maxWidth: 96,
  },
  topScorePill: {
    marginTop: 8,
    minWidth: 72,
    borderRadius: 14,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  topScoreFirst: {
    backgroundColor: '#ff7a14',
  },
  topScoreSecond: {
    backgroundColor: '#5bbf68',
  },
  topScoreThird: {
    backgroundColor: '#5b45f6',
  },
  topScoreText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  rowCard: {
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCardPrimary: {
    backgroundColor: '#5b45f6',
    borderColor: '#5b45f6',
  },
  rowRankWrap: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  rowRankText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '700',
  },
  rowRankTextPrimary: {
    color: '#ffffff',
  },
  rowAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowAvatarInitial: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  rowNameWrap: {
    flex: 1,
  },
  rowName: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '700',
  },
  rowNamePrimary: {
    color: '#ffffff',
  },
  rowScorePill: {
    minWidth: 74,
    minHeight: 30,
    borderRadius: 15,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  rowScorePillPrimary: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  rowScoreText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  rowScoreTextPrimary: {
    color: '#374151',
  },
  emptyWrap: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySub: {
    color: '#6b7280',
    fontSize: 13,
  },
});
