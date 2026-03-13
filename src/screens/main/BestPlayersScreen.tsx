import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchBestPlayers } from '../../store/slices/homeSlice';
import { BestPlayerItem } from './homeTypes';

export default function BestPlayersScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { bestPlayers, listLoading } = useAppSelector((state) => state.home);

  useEffect(() => {
    dispatch(fetchBestPlayers(20));
  }, [dispatch]);

  const getPlayerAvatarUri = (player: BestPlayerItem) => player.avatarUrl || player.avatar || null;

  const getPlayerIcon = (player: BestPlayerItem) => {
    if (player.gender === 'female') {
      return 'female';
    }

    if (player.gender === 'male') {
      return 'male';
    }

    return 'person';
  };

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
            <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={26} color="#1b1b25" />
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Best Players</Text>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchField}>
              <Ionicons name="search-outline" size={22} color="#e6ddff" />
              <Text style={styles.searchPlaceholder}>Search Contest</Text>
            </View>

            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#efeaff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.gridWrap}>
          {listLoading && bestPlayers.length === 0 ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#ff7a14" />
            </View>
          ) : null}

          {bestPlayers.map((item) => {
            const isFollowing = item.rank === '#2' || item.rank === '#4' || item.rank === '#6';

            return (
              <View key={item.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={styles.rankPill}>
                  <Ionicons name="trophy" size={14} color="#ff7a14" />
                  <Text style={styles.rankPillText}>{item.rank}</Text>
                </View>
                <Text style={styles.flag}>#{item.rank.replace('#', '')}</Text>
              </View>

              <View style={styles.avatarRing}>
                <View style={styles.avatarInner}>
                  {getPlayerAvatarUri(item) ? (
                    <Image source={{ uri: getPlayerAvatarUri(item)! }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name={getPlayerIcon(item) as any} size={34} color="#ffffff" />
                  )}
                </View>
              </View>

              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.xp}>{item.totalScore} XP</Text>

              <TouchableOpacity style={[styles.followButton, isFollowing ? styles.followingButton : null]}>
                <Text style={[styles.followText, isFollowing ? styles.followingText : null]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              </View>
            );
          })}
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
    paddingBottom: Platform.OS === 'web' ? 20 : 126,
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
    gap: 10,
    marginBottom: 18,
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchField: {
    flex: 1,
    minHeight: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  searchPlaceholder: {
    color: '#efeaff',
    fontSize: 34 / 2,
    fontWeight: '500',
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  gridWrap: {
    marginTop: -30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  loadingWrap: {
    width: '100%',
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '48.3%',
    borderRadius: 18,
    backgroundColor: '#2a2a31',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    alignItems: 'center',
  },
  cardTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankPill: {
    minWidth: 82,
    minHeight: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,146,64,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  rankPillText: {
    color: '#f7f7f9',
    fontSize: 28 / 2,
    fontWeight: '800',
  },
  flag: {
    fontSize: 16,
  },
  avatarRing: {
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 3,
    borderColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#3d3b66',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 22,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: '#f6f5fb',
    fontSize: 18 / 1.1,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  xp: {
    color: '#efedf9',
    fontSize: 30 / 2,
    marginBottom: 12,
  },
  followButton: {
    minWidth: 98,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3d2f8d',
  },
  followText: {
    color: '#161722',
    fontSize: 30 / 2,
    fontWeight: '700',
  },
  followingText: {
    color: '#6c59f7',
  },
});
