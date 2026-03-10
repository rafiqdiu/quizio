import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchLeaderboard } from '../../store/slices/leaderboardSlice';

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

function toHandle(name: string) {
  const base = String(name || 'member').toLowerCase().replace(/[^a-z0-9]+/g, '_');
  return `@${base}`;
}

export default function LeaderboardScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector((state) => state.leaderboard);

  const [query, setQuery] = useState('');
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [followingById, setFollowingById] = useState<Record<number, boolean>>({});

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    if (!entries.length) {
      return;
    }

    setFollowingById((prev) => {
      const next = { ...prev };
      entries.forEach((entry) => {
        if (next[entry.id] === undefined) {
          next[entry.id] = entry.rank % 4 === 0;
        }
      });
      return next;
    });
  }, [entries]);

  const members = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return [...entries]
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => ({
        ...entry,
        handle: toHandle(entry.name),
        isFollowing: Boolean(followingById[entry.id]),
      }))
      .filter((member) => {
        const matchesQuery =
          normalized.length === 0 ||
          member.name.toLowerCase().includes(normalized) ||
          member.handle.toLowerCase().includes(normalized);

        if (!matchesQuery) {
          return false;
        }

        if (showFollowingOnly && !member.isFollowing) {
          return false;
        }

        return true;
      });
  }, [entries, followingById, query, showFollowingOnly]);

  const toggleFollow = (id: number) => {
    setFollowingById((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5b45f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroGlow} />

        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (navigation?.canGoBack?.()) {
                navigation.goBack();
                return;
              }

              navigation?.navigate?.('CategoriesTab');
            }}
          >
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Top Members</Text>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>Q</Text>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search members"
              placeholderTextColor="#d6d3f4"
            />
          </View>

          <TouchableOpacity
            style={[styles.filterButton, showFollowingOnly ? styles.filterButtonActive : null]}
            onPress={() => setShowFollowingOnly((prev) => !prev)}
          >
            <Text style={styles.filterButtonText}>{showFollowingOnly ? 'F' : 'A'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => {
          const featured = index === 0;

          return (
            <View style={[styles.memberRow, featured ? styles.memberRowFeatured : null]}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                </View>
              </View>

              <View style={styles.memberTextWrap}>
                <View style={styles.nameRow}>
                  <Text style={styles.memberName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.verifiedDot}>
                    <Text style={styles.verifiedText}>v</Text>
                  </View>
                </View>
                <Text style={styles.memberHandle}>{item.handle}</Text>
              </View>

              <TouchableOpacity
                style={[styles.followButton, item.isFollowing ? styles.followingButton : null]}
                onPress={() => toggleFollow(item.id)}
              >
                <Text style={[styles.followText, item.isFollowing ? styles.followingText : null]}>
                  {item.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No members found</Text>
            <Text style={styles.emptySub}>Try another name or clear the filter.</Text>
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
  hero: {
    backgroundColor: '#5b45f6',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 28,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    right: -130,
    top: -170,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '16deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '700',
    marginTop: -1,
  },
  title: {
    color: '#ffffff',
    fontSize: 34 / 2,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchWrap: {
    flex: 1,
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchIcon: {
    color: '#d6d3f4',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  filterButtonActive: {
    backgroundColor: '#ff7a14',
    borderColor: '#ff7a14',
  },
  filterButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  memberRow: {
    minHeight: 86,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    marginBottom: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberRowFeatured: {
    borderColor: '#fb923c',
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e9e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  memberTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  memberName: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '800',
    maxWidth: 160,
  },
  verifiedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    marginTop: -1,
  },
  memberHandle: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  followButton: {
    minWidth: 92,
    minHeight: 34,
    borderRadius: 17,
    backgroundColor: '#5b45f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  followingButton: {
    backgroundColor: '#ecebff',
    borderWidth: 1,
    borderColor: '#d6d3f4',
  },
  followText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  followingText: {
    color: '#8f82ff',
  },
  emptyWrap: {
    paddingVertical: 24,
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
