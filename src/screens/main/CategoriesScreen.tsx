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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { fetchHomeData } from '../../store/slices/homeSlice';
import { BestPlayerItem, ContestItem } from './homeTypes';
import { getAvailableSpotsLabel, getContestCountdown } from './homeFormatters';

type CategoryVisual = {
  icon: string;
  color: string;
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
  { icon: 'musical-notes-outline', color: '#9ff0b0' },
  { icon: 'language-outline', color: '#9de9ff' },
  { icon: 'calculator-outline', color: '#ffc0cb' },
  { icon: 'film-outline', color: '#ffd189' },
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
        colors={['#122d59', '#102754', '#0c1f44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#6f4dff', '#5a3df2', '#5531f2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.headerRow}>
            <View style={styles.leftHeader}>
              <TouchableOpacity style={styles.iconButton} onPress={() => setDrawerOpen(true)}>
                <Ionicons name="menu-outline" size={24} color="#efeaff" />
              </TouchableOpacity>
              <Text style={styles.brandText}>Quizio</Text>
            </View>

            <View style={styles.rightHeader}>
              <TouchableOpacity style={styles.iconButtonMuted}>
                <Ionicons name="notifications-outline" size={22} color="#efeaff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButtonMuted}
                onPress={() => navigation.getParent?.()?.navigate?.('Profile')}
              >
                <Ionicons name="person-outline" size={21} color="#efeaff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchRow}>
            <TouchableOpacity style={styles.searchField} activeOpacity={0.9}>
              <Ionicons name="search-outline" size={22} color="#e6ddff" />
              <Text style={styles.searchPlaceholder}>Search Contest</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#efeaff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLead}>Browse By Category</Text>
        </LinearGradient>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categoriesRow,
            { paddingHorizontal: Math.max((screenWidth - 4 * 84) / 8, 10) },
          ]}
        >
          {displayCategories.map((category, index) => {
            const compactName = category.name.replace(/\s+Quiz$/i, ' Quiz');

            return (
              <TouchableOpacity
                key={`${category.id}-${index}`}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={[styles.categoryCircle, { backgroundColor: category.visual.color }]}>
                  <View style={styles.categoryInnerCircle}>
                    {category.visual.icon === 'language-outline' ? (
                      <MaterialCommunityIcons name="translate" size={26} color="#6f4dff" />
                    ) : (
                      <Ionicons name={category.visual.icon as any} size={26} color="#6f4dff" />
                    )}
                  </View>
                </View>
                <Text style={styles.categoryLabel} numberOfLines={2}>
                  {compactName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading && categories.length === 0 ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color="#ff861f" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : null}

        {!loading && displayCategories.length === 0 ? (
          <View style={styles.loadingWrap}>
            <Text style={styles.loadingText}>No categories found.</Text>
          </View>
        ) : null}

        <View style={styles.bodyContent}>
          <LinearGradient
            colors={['#6f4dff', '#5d3bf0', '#4f2bd8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inviteCard}
          >
            <View>
              <Text style={styles.inviteTitle}>Invite Friends</Text>
              <Text style={styles.inviteAmount}>$80</Text>
              <Text style={styles.inviteSub}>Earn Up To</Text>
            </View>

            <View style={styles.inviteArtWrap}>
              <Ionicons name="cash-outline" size={26} color="#ff9d2f" style={styles.coinIcon} />
              <View style={styles.inviteAvatarBig}>
                <Ionicons name="person" size={44} color="#2f215a" />
              </View>
            </View>
          </LinearGradient>

          <View style={styles.shadowCard} />

          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="trophy" size={22} color="#ff7a14" />
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
                  <Text style={styles.contestTopText}>{countdown.label}</Text>
                  <View style={styles.timerRow}>
                    <Text style={styles.timerChip}>{countdown.hours}</Text>
                    <Text style={styles.timerColon}>:</Text>
                    <Text style={styles.timerChip}>{countdown.minutes}</Text>
                    <Text style={styles.timerColon}>:</Text>
                    <Text style={styles.timerChip}>{countdown.seconds}</Text>
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
                    <Ionicons name="arrow-forward" size={24} color="#1c154d" />
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
              <Ionicons name="trophy" size={22} color="#ff7a14" />
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
                      <Ionicons name={getPlayerIcon(item) as any} size={38} color="#ffffff" />
                    )}
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
              <Ionicons name="trophy" size={22} color="#ff7a14" />
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
                    <Text style={styles.timerChip}>{countdown.hours}</Text>
                    <Text style={styles.timerColon}>:</Text>
                    <Text style={styles.timerChip}>{countdown.minutes}</Text>
                    <Text style={styles.timerColon}>:</Text>
                    <Text style={styles.timerChip}>{countdown.seconds}</Text>
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
                      <Ionicons name="trophy-outline" size={16} color="#1c154d" />
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
              colors={['#6f4dff', '#5b45f6', '#4f39d8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.drawerTop}
            >
              <TouchableOpacity style={styles.drawerClose} onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={20} color="#efeaff" />
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
                    <Ionicons name={item.icon as any} size={20} color="#ff8620" />
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
    backgroundColor: '#0f2450',
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 70,
    borderBottomLeftRadius: 130,
    borderBottomRightRadius: 130,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  iconButtonMuted: {
    width: 58 / 1.2,
    height: 58 / 1.2,
    borderRadius: 29 / 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  brandText: {
    color: '#f6f2ff',
    fontSize: 52 / 2,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
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
  sectionLead: {
    textAlign: 'center',
    color: '#f5f1ff',
    fontSize: 42 / 2,
    fontWeight: '800',
  },
  categoriesRow: {
    marginTop: -42,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  categoryItem: {
    width: 84,
    alignItems: 'center',
    marginRight: 14,
  },
  categoryCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
    borderColor: '#dbe9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryInnerCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    textAlign: 'center',
    color: '#f3f4f6',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  loadingWrap: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#dce6ff',
    fontWeight: '600',
  },
  bodyContent: {
    marginTop: 26,
    paddingHorizontal: 16,
  },
  inviteCard: {
    minHeight: 160,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inviteTitle: {
    color: '#fff5fb',
    fontSize: 40 / 2,
    fontWeight: '800',
    marginBottom: 8,
  },
  inviteAmount: {
    color: '#fefefe',
    fontSize: 76 / 2,
    fontWeight: '800',
    marginBottom: 6,
  },
  inviteSub: {
    color: '#efeaff',
    fontSize: 38 / 2,
    fontWeight: '700',
  },
  inviteArtWrap: {
    position: 'relative',
    width: 140,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  coinIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  inviteAvatarBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffb15e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowCard: {
    marginTop: -4,
    marginHorizontal: 10,
    height: 26,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(84,61,199,0.55)',
    marginBottom: 14,
  },
  sectionHeaderRow: {
    marginTop: 18,
    marginBottom: 12,
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
    color: '#f8fafc',
    fontSize: 24 / 1.1,
    fontWeight: '800',
  },
  seeAll: {
    color: '#ff8c2e',
    fontSize: 34 / 2,
    fontWeight: '800',
  },
  horizontalListContent: {
    paddingRight: 8,
    gap: 12,
  },
  contestCard: {
    width: 324,
    borderRadius: 22,
    backgroundColor: '#24125d',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  contestTopStrip: {
    minHeight: 70,
    backgroundColor: '#6e584f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  contestTopText: {
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
  readInstruction: {
    color: '#ff982f',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  contestMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
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
  dateBadgeDay: {
    color: '#14151d',
    fontSize: 30 / 2,
    fontWeight: '800',
  },
  dateBadgeTime: {
    color: '#262633',
    fontSize: 28 / 2,
    fontWeight: '600',
  },
  contestMainInfo: {
    flex: 1,
  },
  contestName: {
    color: '#f6f4ff',
    fontSize: 20 / 1.1,
    fontWeight: '800',
    marginBottom: 4,
  },
  contestLang: {
    color: '#f0ebff',
    fontSize: 17,
    fontWeight: '500',
  },
  arrowCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contestStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 14,
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
  bottomDivider: {
    marginHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.24)',
    borderStyle: 'dashed',
  },
  contestFooterRow: {
    paddingHorizontal: 14,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerTagLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerTagText: {
    color: '#e7e2ff',
    fontSize: 18 / 1.1,
    fontWeight: '500',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playerCard: {
    width: 290,
    borderRadius: 20,
    backgroundColor: '#2a2a31',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    padding: 14,
    alignItems: 'center',
  },
  playerTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  rankPill: {
    minWidth: 100,
    minHeight: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255,146,64,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  rankPillText: {
    color: '#f7f7f9',
    fontSize: 36 / 2,
    fontWeight: '800',
  },
  playerFlag: {
    fontSize: 34 / 2,
  },
  playerAvatarRing: {
    width: 122,
    height: 122,
    borderRadius: 61,
    borderWidth: 3,
    borderColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  playerAvatarInner: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#3d3b66',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playerAvatarText: {
    fontSize: 54 / 2,
  },
  playerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  playerName: {
    color: '#f6f5fb',
    fontSize: 20 / 1.1,
    fontWeight: '800',
    marginBottom: 4,
  },
  playerXp: {
    color: '#efedf9',
    fontSize: 34 / 2,
    marginBottom: 16,
  },
  followButton: {
    minWidth: 118,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,146,64,0.5)',
  },
  followButtonText: {
    color: '#15161f',
    fontSize: 32 / 2,
    fontWeight: '700',
  },
  followingButtonText: {
    color: '#f3f4f8',
  },
  upcomingCard: {
    width: 360,
    borderRadius: 24,
    backgroundColor: '#22145e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 14,
  },
  upcomingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  upcomingMainInfo: {
    flex: 1,
  },
  upcomingMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  upcomingMetric: {
    color: '#f3edff',
    fontSize: 18 / 1.1,
    fontWeight: '500',
  },
  upcomingMetricBold: {
    fontWeight: '800',
  },
  spotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  spotsText: {
    color: '#f6f5ff',
    fontSize: 18 / 1.1,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#3b2a7f',
    overflow: 'hidden',
  },
  progressFill: {
    width: '40%',
    height: '100%',
    backgroundColor: '#ff7a14',
  },
  upcomingBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  prizeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  prizeIconWrap: {
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
    fontSize: 36 / 2,
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
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,8,18,0.65)',
    flexDirection: 'row',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerPanel: {
    width: '78%',
    backgroundColor: '#111426',
  },
  drawerTop: {
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  drawerClose: {
    position: 'absolute',
    right: 12,
    top: 42,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  drawerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drawerAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerAvatarText: {
    color: '#ffffff',
    fontSize: 24 / 1.1,
    fontWeight: '800',
  },
  drawerName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 3,
  },
  drawerSub: {
    color: '#e8deff',
    fontSize: 14,
  },
  drawerMenuRow: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2646',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerMenuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drawerMenuText: {
    color: '#f3f4fa',
    fontSize: 17,
    fontWeight: '600',
  },
  logoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  logoutBackdrop: {
    flex: 1,
  },
  logoutSheet: {
    backgroundColor: '#13162a',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    paddingBottom: Platform.OS === 'web' ? 28 : 122,
  },
  logoutTitle: {
    color: '#ff7a14',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  logoutMessage: {
    color: '#f5f5fb',
    textAlign: 'center',
    marginBottom: 18,
    fontSize: 17,
  },
  logoutButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#8b6144',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#ff7a14',
    fontWeight: '700',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 26,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#1a1a22',
    fontWeight: '800',
    fontSize: 16,
  },
});
