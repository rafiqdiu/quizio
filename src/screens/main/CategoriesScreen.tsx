import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { fetchHomeData } from '../../store/slices/homeSlice';
import { BestPlayerItem, ContestItem } from './homeTypes';
import { getAvailableSpotsLabel, getContestCountdown } from './homeFormatters';

type CategoryVisual = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  gradientColors: string[];
};

const drawerItems = [
  { key: 'profile', label: 'My Profile', icon: 'person-outline' },
  { key: 'notification', label: 'Notification', icon: 'notifications-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
  { key: 'play_quiz', label: 'Play Quiz', icon: 'apps-outline' },
  { key: 'help', label: 'Help Center', icon: 'help-buoy-outline' },
  { key: 'logout', label: 'Logout', icon: 'log-out-outline' },
];

const categoryVisuals: CategoryVisual[] = [
  {
    icon: 'time-outline',
    color: '#6dd5a8',
    gradientColors: ['#6dd5a8', '#4ec59b', '#3eb890']
  },
  {
    icon: 'language-outline',
    color: '#7dc8ff',
    gradientColors: ['#7dc8ff', '#5eb8f5', '#4aa8eb']
  },
  {
    icon: 'grid-outline',
    color: '#ffb1b1',
    gradientColors: ['#ffb1b1', '#ffa0a0', '#ff9090']
  },
  {
    icon: 'film-outline',
    color: '#ffc966',
    gradientColors: ['#ffc966', '#ffbb52', '#ffad3e']
  },
];

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

export default function CategoriesScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { categories, currentContests, upcomingContests, bestPlayers, loading } = useAppSelector((state) => state.home);
  const { user } = useAppSelector((state) => state.auth);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());

  const bottomPadding = Platform.OS === 'web' ? 34 : 140;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const displayCategories = useMemo(() => {
    return categories.map((category, index) => ({
      id: category.id,
      name: category.name,
      total_quizzes: category.total_quizzes,
      visual: categoryVisuals[index % categoryVisuals.length],
    }));
  }, [categories]);

  const handleCategoryPress = (category: { id: number; name: string }) => {
    navigation.navigate('Quizzes', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const handleDrawerItem = (key: string) => {
    setDrawerOpen(false);
    const tabNavigation = navigation.getParent?.();

    if (key === 'profile') {
      tabNavigation?.navigate?.('Profile');
      return;
    }

    if (key === 'notification') {
      navigation.navigate('Notification');
      return;
    }

    if (key === 'settings') {
      navigation.navigate('Settings');
      return;
    }

    if (key === 'play_quiz') {
      navigation.navigate('PlayQuiz');
      return;
    }

    if (key === 'help') {
      navigation.navigate('HelpCenter');
      return;
    }

    if (key === 'logout') {
      setShowLogoutPrompt(true);
    }
  };

  const confirmLogout = () => {
    setShowLogoutPrompt(false);
    dispatch(logout());
  };

  const openQuizDetails = (contest: ContestItem) => {
    navigation.navigate('QuizDetails', { contest });
  };

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
        colors={['#1a2d5a', '#152649', '#101f3c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#6640f4', '#5e38ed', '#5630e8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerOpen(true)}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </TouchableOpacity>

            <Text style={styles.brandText}>Quizio</Text>

            <View style={styles.rightHeader}>
              <TouchableOpacity style={styles.iconButtonCircle}>
                <Ionicons name="notifications-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButtonCircle}
                onPress={() => navigation.getParent?.()?.navigate?.('Profile')}
              >
                <Ionicons name="person-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchField}>
              <Ionicons name="search-outline" size={20} color="#c8bdff" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search Contest"
                placeholderTextColor="#c8bdff"
              />
            </View>

            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLead}>Browse By Category</Text>
        </LinearGradient>

        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesRow}>
            {displayCategories.map((category, index) => {
              const compactName = category.name.replace(/\s+Quiz$/i, '');

              return (
                <TouchableOpacity
                  key={`${category.id}-${index}`}
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress(category)}
                >
                  <LinearGradient
                    colors={category.visual.gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryCircle}
                  >
                    <View style={styles.categoryInnerCircle}>
                      <Ionicons name={category.visual.icon} size={32} color="#5630e8" />
                    </View>
                  </LinearGradient>
                  <Text style={styles.categoryLabel}>{compactName}</Text>
                  <Text style={styles.categoryLabel}>Quiz</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {loading && categories.length === 0 ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color="#ff7a14" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : null}

        {!loading && displayCategories.length === 0 ? (
          <View style={styles.loadingWrap}>
            <Text style={styles.loadingText}>No categories found.</Text>
          </View>
        ) : null}

        <View style={styles.bodyContent}>
          <View style={styles.inviteCardContainer}>
            <LinearGradient
              colors={['#6640f4', '#5e38ed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.inviteCard}
            >
              <View style={styles.inviteLeft}>
                <Text style={styles.inviteTitle}>Invite Friends</Text>
                <Text style={styles.inviteAmount}>$80</Text>
                <Text style={styles.inviteSub}>Earn Up To</Text>
              </View>

              <View style={styles.inviteRight}>
                <View style={styles.inviteIconWrapper}>
                  <Text style={styles.inviteIcon}>✏️</Text>
                  <View style={styles.inviteAvatarBig}>
                    <Ionicons name="person" size={60} color="#3a2b6f" />
                  </View>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.inviteShadow} />
          </View>

          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="trophy" size={24} color="#ff7a14" />
              <Text style={styles.sectionTitle}>Current Contest</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CurrentContests')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={currentContests}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.contestCard} onPress={() => openQuizDetails(item)} activeOpacity={0.92}>
                {(() => {
                  const countdown = getContestCountdown(item, nowMs);

                  return (
                    <>
                <View style={styles.contestTopStrip}>
                  <Text style={styles.contestTopText}>Starting In</Text>
                  <View style={styles.timerRow}>
                    <View style={styles.timerBox}>
                      <Text style={styles.timerText}>{countdown.hours}</Text>
                    </View>
                    <Text style={styles.timerColon}>:</Text>
                    <View style={styles.timerBox}>
                      <Text style={styles.timerText}>{countdown.minutes}</Text>
                    </View>
                    <Text style={styles.timerColon}>:</Text>
                    <View style={styles.timerBox}>
                      <Text style={styles.timerText}>{countdown.seconds}</Text>
                    </View>
                  </View>
                  <Text style={styles.readInstruction}>Read Instruction</Text>
                </View>

                <View style={styles.contestMainRow}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeDay}>{item.date}</Text>
                    <Text style={styles.dateBadgeTime}>{item.time}</Text>
                  </View>

                  <View style={styles.contestMainInfo}>
                    <Text style={styles.contestName}>{item.title}</Text>
                    <Text style={styles.contestLang}>{item.subtitle}</Text>
                  </View>

                  <TouchableOpacity style={styles.arrowCircle} onPress={() => openQuizDetails(item)}>
                    <Ionicons name="arrow-forward" size={22} color="#0f0a2e" />
                  </TouchableOpacity>
                </View>

                <View style={styles.contestStatsRow}>
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

                <View style={styles.bottomDivider} />

                <View style={styles.contestFooterRow}>
                  <View style={styles.footerTagLeft}>
                    <Ionicons name="sparkles-outline" size={16} color="#6a4dff" />
                    <Text style={styles.footerTagText}>{item.tag || 'Trivia Quiz'}</Text>
                  </View>

                  <View style={styles.footerActions}>
                    <Ionicons name="notifications-outline" size={19} color="#f2eaff" />
                    <Ionicons name="share-social-outline" size={19} color="#f2eaff" />
                  </View>
                </View>
                    </>
                  );
                })()}
              </TouchableOpacity>
            )}
          />

          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="trophy" size={24} color="#ff7a14" />
              <Text style={styles.sectionTitle}>Best Players</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('BestPlayers')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={bestPlayers}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
            renderItem={({ item }) => {
              const isFollowing = item.rank === '#2' || item.rank === '#4';

              return (
                <View style={styles.playerCard}>
                <View style={styles.playerTopRow}>
                  <View style={styles.rankPill}>
                    <Ionicons name="trophy" size={14} color="#ff7a14" />
                    <Text style={styles.rankPillText}>{item.rank}</Text>
                  </View>
                  <Text style={styles.playerFlag}>#{item.rank.replace('#', '')}</Text>
                </View>

                <View style={styles.playerAvatarRing}>
                  <View style={styles.playerAvatarInner}>
                    {getPlayerAvatarUri(item) ? (
                      <Image source={{ uri: getPlayerAvatarUri(item)! }} style={styles.playerAvatarImage} />
                    ) : (
                      <Ionicons name={getPlayerIcon(item) as any} size={50} color="#ffffff" />
                    )}
                  </View>
                  <View style={styles.diamondBadge}>
                    <Ionicons name="diamond" size={14} color="#ffd700" />
                  </View>
                </View>

                <Text style={styles.playerName}>{item.name}</Text>
                <Text style={styles.playerXp}>{item.totalScore} XP</Text>

                <TouchableOpacity
                  style={[styles.followButton, isFollowing ? styles.followingButton : null]}
                >
                  <Text style={[styles.followButtonText, isFollowing ? styles.followingButtonText : null]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
                </View>
              );
            }}
          />

          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="trophy" size={24} color="#ff7a14" />
              <Text style={styles.sectionTitle}>Upcoming Contest</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('UpcomingContests')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={upcomingContests}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.upcomingCard} onPress={() => openQuizDetails(item)} activeOpacity={0.92}>
                {(() => {
                  const countdown = getContestCountdown(item, nowMs);

                  return (
                    <>
                <View style={styles.upcomingTopRow}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeDay}>{item.date}</Text>
                    <Text style={styles.dateBadgeTime}>{item.time}</Text>
                  </View>

                  <View style={styles.upcomingMainInfo}>
                    <Text style={styles.contestName}>{item.title}</Text>
                    <Text style={styles.contestLang}>{item.subtitle}</Text>
                  </View>

                  <View style={styles.timerRow}>
                    <View style={styles.timerBox}>
                      <Text style={styles.timerText}>{countdown.hours}</Text>
                    </View>
                    <Text style={styles.timerColon}>:</Text>
                    <View style={styles.timerBox}>
                      <Text style={styles.timerText}>{countdown.minutes}</Text>
                    </View>
                    <Text style={styles.timerColon}>:</Text>
                    <View style={styles.timerBox}>
                      <Text style={styles.timerText}>{countdown.seconds}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.upcomingMetricsRow}>
                  <Text style={styles.upcomingMetric}>Max Time - <Text style={styles.upcomingMetricBold}>{item.maxTime}</Text></Text>
                  <Text style={styles.upcomingMetric}>Max Ques - <Text style={styles.upcomingMetricBold}>{item.maxQues}</Text></Text>
                </View>

                <View style={styles.spotsRow}>
                  <Text style={styles.spotsText}>{getAvailableSpotsLabel(item)}</Text>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(Math.max(item.progressPercent, 0), 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.spotsText}>{item.spots}</Text>
                </View>

                <View style={styles.upcomingBottomRow}>
                  <View style={styles.prizeBlock}>
                    <View style={styles.prizeIconWrap}>
                      <Ionicons name="trophy-outline" size={18} color="#0f0a2e" />
                    </View>
                    <View>
                      <Text style={styles.prizeLabel}>Price Pool</Text>
                      <Text style={styles.prizeValue}>{item.prize}</Text>
                    </View>
                  </View>

                  <View>
                    <Text style={styles.prizeLabel}>Entry</Text>
                    <Text style={styles.prizeValue}>{item.entry}</Text>
                  </View>

                  <TouchableOpacity style={styles.joinNowButton}>
                    <Text style={styles.joinNowText}>Join Now</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.bottomDivider} />

                <View style={styles.contestFooterRow}>
                  <View style={styles.footerTagLeft}>
                    <Ionicons name="sparkles-outline" size={16} color="#6a4dff" />
                    <Text style={styles.footerTagText}>{item.tag || 'Trivia Quiz'}</Text>
                  </View>

                  <View style={styles.footerActions}>
                    <Ionicons name="notifications-outline" size={19} color="#f2eaff" />
                    <Ionicons name="share-social-outline" size={19} color="#f2eaff" />
                  </View>
                </View>
                    </>
                  );
                })()}
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>

      {drawerOpen && (
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.drawerBackdrop} onPress={() => setDrawerOpen(false)} />
          <View style={styles.drawerPanel}>
            <LinearGradient
              colors={['#6640f4', '#5e38ed', '#5630e8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.drawerTop}
            >
              <TouchableOpacity style={styles.drawerClose} onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={20} color="#ffffff" />
              </TouchableOpacity>

              <View style={styles.drawerUserRow}>
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>{getInitials(user?.name || 'Quiz User')}</Text>
                </View>
                <View>
                  <Text style={styles.drawerName}>{user?.name || 'Quiz User'}</Text>
                  <Text style={styles.drawerSub}>ID: 6546354651</Text>
                </View>
              </View>
            </LinearGradient>

            <FlatList
              data={drawerItems}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.drawerMenuRow} onPress={() => handleDrawerItem(item.key)}>
                  <View style={styles.drawerMenuLeft}>
                    <Ionicons name={item.icon as any} size={20} color="#ff7a14" />
                    <Text style={styles.drawerMenuText}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#8f95b2" />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}

      {showLogoutPrompt && (
        <View style={styles.logoutOverlay}>
          <TouchableOpacity style={styles.logoutBackdrop} onPress={() => setShowLogoutPrompt(false)} />
          <View style={styles.logoutSheet}>
            <Text style={styles.logoutTitle}>Log Out</Text>
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
    backgroundColor: '#1a2d5a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    marginBottom: 5,
  },
  brandText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    position: 'absolute',
    left: '50%',
    marginLeft: -40,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButtonCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  searchField: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionLead: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginTop: -40,
    paddingHorizontal: 20,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  categoryInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  loadingWrap: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  bodyContent: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  inviteCardContainer: {
    marginBottom: 24,
  },
  inviteCard: {
    height: 140,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  inviteLeft: {
    flex: 1,
  },
  inviteTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  inviteAmount: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  inviteSub: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  inviteRight: {
    width: 120,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteIconWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteIcon: {
    position: 'absolute',
    top: -10,
    right: 10,
    fontSize: 28,
  },
  inviteAvatarBig: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#8b6be8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteShadow: {
    height: 16,
    marginHorizontal: 12,
    marginTop: -10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: 'rgba(102,64,244,0.4)',
    zIndex: 1,
  },
  sectionHeaderRow: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  seeAll: {
    color: '#ff7a14',
    fontSize: 16,
    fontWeight: '600',
  },
  horizontalListContent: {
    paddingRight: 8,
    gap: 16,
  },
  contestCard: {
    width: 340,
    borderRadius: 16,
    backgroundColor: '#2a1d5e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  contestTopStrip: {
    height: 56,
    backgroundColor: '#6d5549',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  contestTopText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerBox: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  timerColon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  readInstruction: {
    color: '#ff7a14',
    fontSize: 13,
    fontWeight: '600',
  },
  contestMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  dateBadge: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeDay: {
    color: '#0f0a2e',
    fontSize: 14,
    fontWeight: '700',
  },
  dateBadgeTime: {
    color: '#1a1538',
    fontSize: 12,
    fontWeight: '600',
  },
  contestMainInfo: {
    flex: 1,
  },
  contestName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  contestLang: {
    color: '#c8bdff',
    fontSize: 13,
    fontWeight: '500',
  },
  arrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contestStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statLabel: {
    color: '#c8bdff',
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomDivider: {
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    borderStyle: 'dashed',
  },
  contestFooterRow: {
    paddingHorizontal: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerTagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerTagText: {
    color: '#c8bdff',
    fontSize: 14,
    fontWeight: '500',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playerCard: {
    width: 180,
    borderRadius: 16,
    backgroundColor: '#3d3b47',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    alignItems: 'center',
  },
  playerTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,122,20,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankPillText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  playerFlag: {
    fontSize: 20,
  },
  playerAvatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  playerAvatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#4a4766',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  diamondBadge: {
    position: 'absolute',
    bottom: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2a1d5e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ff7a14',
  },
  playerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  playerXp: {
    color: '#c8bdff',
    fontSize: 14,
    marginBottom: 12,
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ff7a14',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5e38ed',
  },
  followButtonText: {
    color: '#0f0a2e',
    fontSize: 14,
    fontWeight: '700',
  },
  followingButtonText: {
    color: '#8b6be8',
  },
  upcomingCard: {
    width: 360,
    borderRadius: 16,
    backgroundColor: '#2a1d5e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 16,
  },
  upcomingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  upcomingMainInfo: {
    flex: 1,
  },
  upcomingMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  upcomingMetric: {
    color: '#c8bdff',
    fontSize: 13,
    fontWeight: '500',
  },
  upcomingMetricBold: {
    fontWeight: '700',
    color: '#ffffff',
  },
  spotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  spotsText: {
    color: '#ffffff',
    fontSize: 13,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4a3d7f',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff7a14',
  },
  upcomingBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  prizeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prizeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prizeLabel: {
    color: '#c8bdff',
    fontSize: 12,
  },
  prizeValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  joinNowButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ff7a14',
  },
  joinNowText: {
    color: '#0f0a2e',
    fontSize: 14,
    fontWeight: '700',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerPanel: {
    width: '75%',
    backgroundColor: '#0f0a2e',
  },
  drawerTop: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  drawerClose: {
    position: 'absolute',
    right: 16,
    top: 50,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  drawerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  drawerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  drawerSub: {
    color: '#c8bdff',
    fontSize: 13,
  },
  drawerMenuRow: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1a3c',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerMenuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drawerMenuText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  logoutBackdrop: {
    flex: 1,
  },
  logoutSheet: {
    backgroundColor: '#0f0a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'web' ? 32 : 120,
  },
  logoutTitle: {
    color: '#ff7a14',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  logoutMessage: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 15,
  },
  logoutButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#ff7a14',
    fontWeight: '600',
    fontSize: 15,
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#0f0a2e',
    fontWeight: '700',
    fontSize: 15,
  },
});
