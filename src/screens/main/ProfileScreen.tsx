import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout, getCurrentUser } from '../../store/slices/authSlice';
import { fetchUserRank } from '../../store/slices/leaderboardSlice';

type ProfileTab = 'badge' | 'stats' | 'matches';

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

const PURPLE = '#5b45f6';
const DARK_BG = '#102a66';
const CARD_BG = '#2a2a2e';
const ORANGE = '#ff7a14';

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userRank } = useAppSelector((state) => state.leaderboard);
  const token = useAppSelector((state) => state.auth.token);

  const [activeTab, setActiveTab] = useState<ProfileTab>('badge');
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
      dispatch(fetchUserRank(token));
    }
  }, [dispatch, token]);

  const points = Number(user?.total_score || 0);
  const quizzes = Number(user?.quizzes_completed || 0);

  const computedStats = useMemo(
    () => ({
      points,
      referred: Math.max(3, Math.floor(quizzes / 2)),
      withdraw: Math.max(20, Math.floor(points / 150)),
      totalEarning: `${Math.max(80, Math.floor(points / 10))}.00$`,
    }),
    [points, quizzes]
  );

  const confirmLogout = () => {
    setShowLogoutPrompt(false);
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.roundButton}
              onPress={() => {
                if (navigation?.canGoBack?.()) {
                  navigation.goBack();
                  return;
                }

                navigation?.navigate?.('CategoriesTab');
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity style={styles.roundButton} onPress={() => setShowLogoutPrompt(true)}>
              <Ionicons name="ellipsis-horizontal" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileTop}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}><Text style={styles.avatarText}>{getInitials(user?.name || 'Frost Phoenix')}</Text></View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Ionicons name="heart" size={14} color={ORANGE} />
              <Text style={styles.metaPillText}>200</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="trophy-outline" size={14} color={ORANGE} />
              <Text style={styles.metaPillText}>#{userRank?.rank || 1}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user?.name || 'Frost Phoenix'}</Text>
          <Text style={styles.tagline}>Frend come on, play with me</Text>

          <View style={styles.walletCard}>
            <View>
              <Text style={styles.walletAmount}>{computedStats.totalEarning}</Text>
              <Text style={styles.walletLabel}>Total Earning</Text>
            </View>
            <View style={styles.walletDivider} />
            <TouchableOpacity style={styles.walletAction}>
              <Text style={styles.walletActionText}>View Wallet</Text>
              <Ionicons name="chevron-forward" size={16} color={ORANGE} />
            </TouchableOpacity>
          </View>

          <View style={styles.orangeCardWrap}>
            <View style={styles.orangeCard}>
              <View style={styles.orangeMetricCol}><Text style={styles.orangeMetricLabel}>Points</Text><Text style={styles.orangeMetricValue}>{computedStats.points}</Text></View>
              <View style={styles.orangeMetricDivider} />
              <View style={styles.orangeMetricCol}><Text style={styles.orangeMetricLabel}>Referred users</Text><Text style={styles.orangeMetricValue}>{computedStats.referred}</Text></View>
              <View style={styles.orangeMetricDivider} />
              <View style={styles.orangeMetricCol}><Text style={styles.orangeMetricLabel}>Withdrawals</Text><Text style={styles.orangeMetricValue}>${computedStats.withdraw}</Text></View>
            </View>
            <View style={styles.orangeShadow} />
          </View>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'badge' ? styles.tabButtonActive : null]} onPress={() => setActiveTab('badge')}>
            <Text style={[styles.tabText, activeTab === 'badge' ? styles.tabTextActive : null]}>Badge</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'stats' ? styles.tabButtonActive : null]} onPress={() => setActiveTab('stats')}>
            <Text style={[styles.tabText, activeTab === 'stats' ? styles.tabTextActive : null]}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabButton, activeTab === 'matches' ? styles.tabButtonActive : null]} onPress={() => setActiveTab('matches')}>
            <Text style={[styles.tabText, activeTab === 'matches' ? styles.tabTextActive : null]}>Matches</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'badge' && (
          <View style={styles.contentCard}>
            <View style={styles.contentHeaderRow}>
              <Text style={styles.contentHeader}>Medals 1</Text>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsText}>Details</Text>
                <Ionicons name="chevron-forward" size={15} color={ORANGE} />
              </TouchableOpacity>
            </View>
            <View style={styles.contentDivider} />
            <View style={styles.badgeRow}>
              {['sunny-outline', 'flash-outline', 'flame-outline', 'diamond-outline', 'flash-outline'].map((item, idx) => (
                <View key={idx} style={styles.badgeItem}>
                  <Ionicons name={item as any} size={24} color="#ffffff" />
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'stats' && (
          <View style={styles.contentCard}>
            <View style={styles.statsItem}><Text style={styles.statsLabel}>Total Score</Text><Text style={styles.statsValue}>{points}</Text></View>
            <View style={styles.statsItem}><Text style={styles.statsLabel}>Quizzes Completed</Text><Text style={styles.statsValue}>{quizzes}</Text></View>
            <View style={styles.statsItem}><Text style={styles.statsLabel}>Leaderboard Rank</Text><Text style={styles.statsValue}>#{userRank?.rank || '-'}</Text></View>
          </View>
        )}

        {activeTab === 'matches' && (
          <View style={styles.contentCard}>
            <View style={styles.statsItem}><Text style={styles.statsLabel}>Math Battle</Text><Text style={styles.statsValue}>Won</Text></View>
            <View style={styles.statsItem}><Text style={styles.statsLabel}>History Clash</Text><Text style={styles.statsValue}>Won</Text></View>
            <View style={styles.statsItem}><Text style={styles.statsLabel}>Science Duel</Text><Text style={styles.statsValue}>Lost</Text></View>
          </View>
        )}
      </ScrollView>

      {showLogoutPrompt && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayTouch} onPress={() => setShowLogoutPrompt(false)} />

          <View style={styles.logoutSheet}>
            <Text style={styles.logoutTitle}>Log Out</Text>
            <View style={styles.logoutDivider} />
            <Text style={styles.logoutMessage}>Are you sure you want to log out?</Text>

            <View style={styles.logoutButtonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowLogoutPrompt(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmButton} onPress={confirmLogout}>
                <Text style={styles.confirmButtonText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  content: {
    paddingBottom: 120,
  },
  hero: {
    backgroundColor: PURPLE,
    minHeight: 210,
    borderBottomLeftRadius: 170,
    borderBottomRightRadius: 170,
    paddingTop: 54,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    right: -120,
    top: -160,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '16deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    color: '#ffffff',
    fontSize: 46 / 2,
    fontWeight: '800',
  },
  profileTop: {
    marginTop: -78,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  avatarRing: {
    width: 162,
    height: 162,
    borderRadius: 81,
    borderWidth: 4,
    borderColor: ORANGE,
    backgroundColor: '#1f2a7a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '86%',
    height: '86%',
    borderRadius: 999,
    backgroundColor: '#3d3f8a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '800',
  },
  metaRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
    marginBottom: 10,
  },
  metaPill: {
    minWidth: 90,
    minHeight: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#54597e',
    backgroundColor: '#19213f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 6,
  },
  metaPillText: {
    color: '#e5e7eb',
    fontSize: 32 / 2,
    fontWeight: '700',
  },
  userName: {
    color: '#ffffff',
    fontSize: 50 / 2,
    fontWeight: '800',
    marginBottom: 4,
  },
  tagline: {
    color: '#9ca3af',
    fontSize: 18 / 1.1,
    fontWeight: '600',
    marginBottom: 16,
  },
  walletCard: {
    width: '100%',
    minHeight: 96,
    borderRadius: 18,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: '#4b5563',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  walletAmount: {
    color: ORANGE,
    fontSize: 44 / 2,
    fontWeight: '800',
    marginBottom: 4,
  },
  walletLabel: {
    color: '#e5e7eb',
    fontSize: 18 / 1.1,
    fontWeight: '600',
  },
  walletDivider: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4b5563',
    marginHorizontal: 14,
  },
  walletAction: {
    minWidth: 122,
    minHeight: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#7c2d12',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 4,
  },
  walletActionText: {
    color: ORANGE,
    fontSize: 18 / 1.1,
    fontWeight: '700',
  },
  orangeCardWrap: {
    width: '100%',
    marginBottom: 16,
  },
  orangeCard: {
    minHeight: 136,
    borderRadius: 20,
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    zIndex: 3,
  },
  orangeShadow: {
    marginTop: -12,
    marginHorizontal: 16,
    height: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,122,20,0.35)',
  },
  orangeMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  orangeMetricDivider: {
    width: 1,
    height: 74,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  orangeMetricLabel: {
    color: '#111827',
    fontSize: 16 / 1.1,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  orangeMetricValue: {
    color: '#111827',
    fontSize: 22 / 1.1,
    fontWeight: '800',
    textAlign: 'center',
  },
  tabRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tabButton: {
    width: '31.5%',
    minHeight: 52,
    borderRadius: 10,
    backgroundColor: '#272a35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: ORANGE,
  },
  tabText: {
    color: '#f3f4f6',
    fontSize: 18 / 1.1,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#111827',
  },
  contentCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: CARD_BG,
    padding: 16,
  },
  contentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  contentHeader: {
    color: '#f3f4f6',
    fontSize: 34 / 2,
    fontWeight: '700',
  },
  detailsText: {
    color: ORANGE,
    fontSize: 18 / 1.1,
    fontWeight: '600',
  },
  contentDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4b5563',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#5b45f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d6d3f4',
  },
  statsItem: {
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
  },
  statsLabel: {
    color: '#e5e7eb',
    fontSize: 18 / 1.1,
    fontWeight: '600',
  },
  statsValue: {
    color: ORANGE,
    fontSize: 18 / 1.1,
    fontWeight: '700',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  logoutSheet: {
    marginHorizontal: 12,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#111214',
    padding: 20,
  },
  logoutTitle: {
    color: ORANGE,
    fontSize: 46 / 2,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
  },
  logoutDivider: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#3f3f46',
    marginBottom: 14,
  },
  logoutMessage: {
    color: '#ffffff',
    fontSize: 20 / 1.1,
    textAlign: 'center',
    marginBottom: 18,
  },
  logoutButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    width: '48%',
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#7c2d12',
    backgroundColor: '#2b1e19',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: ORANGE,
    fontSize: 20 / 1.1,
    fontWeight: '700',
  },
  confirmButton: {
    width: '48%',
    minHeight: 52,
    borderRadius: 26,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#111827',
    fontSize: 20 / 1.1,
    fontWeight: '800',
  },
});
