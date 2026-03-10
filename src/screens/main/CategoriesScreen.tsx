import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCategories } from '../../store/slices/quizzesSlice';
import { logout } from '../../store/slices/authSlice';

const PURPLE = '#5b45f6';
const DARK_BG = '#0f2f67';
const CARD_BG = '#2a1a76';
const ORANGE = '#ff7a14';

export default function CategoriesScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.quizzes);
  const { user } = useAppSelector((state) => state.auth);

  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return categories;
    }

    return categories.filter((item) =>
      String(item.name || '').toLowerCase().includes(normalized)
    );
  }, [categories, query]);

  const topCategories = filteredCategories.slice(0, 4);
  const listCategories = filteredCategories.slice(4);

  const handleCategoryPress = (category: any) => {
    navigation.navigate('Quizzes', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const handleDrawerItem = (key: string) => {
    setDrawerOpen(false);

    if (key === 'profile') {
      navigation.navigate('Profile');
      return;
    }

    if (key === 'top_members') {
      navigation.navigate('Leaderboard');
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={PURPLE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroGlow} />

        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.circleIcon} onPress={() => setDrawerOpen(true)}>
            <Text style={styles.iconText}>=</Text>
          </TouchableOpacity>

          <Text style={styles.brandText}>Quizio</Text>

          <View style={styles.headerActionRow}>
            <TouchableOpacity style={styles.circleIcon}><Text style={styles.iconText}>N</Text></TouchableOpacity>
            <TouchableOpacity style={styles.circleIcon} onPress={() => navigation.navigate('Profile')}><Text style={styles.iconText}>P</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>Q</Text>
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search Contest"
              placeholderTextColor="#8e8cb5"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}><Text style={styles.filterText}>F</Text></TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Browse By Category</Text>

        <View style={styles.topCategoryRow}>
          {topCategories.map((item) => (
            <TouchableOpacity key={item.id} style={styles.topCategoryItem} onPress={() => handleCategoryPress(item)}>
              <View style={styles.topCategoryCircle}>
                <Text style={styles.topCategoryIcon}>{String(item.icon || item.name?.charAt(0) || 'Q').slice(0, 1)}</Text>
              </View>
              <Text style={styles.topCategoryLabel} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={listCategories}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.inviteCard}>
              <View style={styles.inviteTextWrap}>
                <Text style={styles.inviteTitle}>Invite Friends</Text>
                <Text style={styles.inviteAmount}>$80</Text>
                <Text style={styles.inviteSub}>Earn Up To</Text>
              </View>
              <View style={styles.inviteArtwork}>
                <Text style={styles.inviteArtworkText}>INVITE</Text>
              </View>
            </View>

            <View style={styles.listHeaderRow}>
              <Text style={styles.listHeaderTitle}>Contest</Text>
              <TouchableOpacity><Text style={styles.listHeaderAction}>See All</Text></TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryListCard} onPress={() => handleCategoryPress(item)}>
            <View style={styles.categoryListIcon}><Text style={styles.categoryListIconText}>{String(item.icon || item.name?.charAt(0) || 'Q').slice(0, 1)}</Text></View>
            <View style={styles.categoryListTextWrap}>
              <Text style={styles.categoryListName}>{item.name}</Text>
              <Text style={styles.categoryListMeta}>Que: {item.total_quizzes || 0}</Text>
            </View>
            <Text style={styles.categoryListArrow}>{'>'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No categories found</Text>
          </View>
        }
      />

      {drawerOpen && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayTouch} onPress={() => setDrawerOpen(false)} />

          <View style={styles.drawerPanel}>
            <View style={styles.drawerTop}>
              <View style={styles.drawerUserRow}>
                <View style={styles.drawerAvatar}><Text style={styles.drawerAvatarText}>U</Text></View>
                <View style={styles.drawerUserTextWrap}>
                  <Text style={styles.drawerName}>{user?.name || 'Jhon Smith'}</Text>
                  <Text style={styles.drawerId}>ID: 6546354651</Text>
                </View>
                <TouchableOpacity style={styles.drawerClose} onPress={() => setDrawerOpen(false)}>
                  <Text style={styles.drawerCloseText}>x</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.drawerStatsRow}>
                <View style={styles.drawerStatBlock}>
                  <Text style={styles.drawerStatLabel}>Rank</Text>
                  <Text style={styles.drawerStatValue}>420</Text>
                </View>
                <View style={styles.drawerStatDivider} />
                <View style={styles.drawerStatBlock}>
                  <Text style={styles.drawerStatLabel}>Quizio Coin Earned</Text>
                  <Text style={styles.drawerStatValue}>20</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.drawerUpgradeRow}>
              <Text style={styles.drawerUpgradeText}>Upgrade to Premium</Text>
              <Text style={styles.drawerArrow}>{'>'}</Text>
            </TouchableOpacity>

            <View style={styles.drawerMenuWrap}>
              {[
                ['profile', 'My Profile'],
                ['balance', 'Balance'],
                ['notification', 'Notification'],
                ['settings', 'Settings'],
                ['master_medal', 'Master Medal'],
                ['all_players', 'All Players'],
                ['about', 'About Us'],
                ['play_quiz', 'Play Quiz'],
                ['help', 'Help Center'],
                ['top_members', 'Top Members'],
                ['logout', 'Logout'],
              ].map(([key, label]) => (
                <TouchableOpacity key={key} style={styles.drawerMenuRow} onPress={() => handleDrawerItem(key)}>
                  <Text style={styles.drawerMenuText}>{label}</Text>
                  <Text style={styles.drawerArrow}>{'>'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>Rate this App</Text>
              <Text style={styles.drawerFooterStars}>***</Text>
            </View>
          </View>
        </View>
      )}

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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DARK_BG,
  },
  hero: {
    backgroundColor: PURPLE,
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    right: -120,
    top: -180,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '16deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerActionRow: {
    flexDirection: 'row',
  },
  circleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconText: {
    color: '#d6d3f4',
    fontSize: 13,
    fontWeight: '700',
  },
  brandText: {
    flex: 1,
    color: '#f3f4f6',
    fontSize: 22 / 1.1,
    fontWeight: '800',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchWrap: {
    flex: 1,
    minHeight: 48,
    borderRadius: 24,
    backgroundColor: '#412fad',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 10,
  },
  searchIcon: {
    color: '#9ea0be',
    marginRight: 8,
    fontWeight: '700',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#412fad',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    color: '#b5b9df',
    fontWeight: '700',
  },
  sectionHeader: {
    color: '#dbeafe',
    fontSize: 32 / 2,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  topCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topCategoryItem: {
    width: '24%',
    alignItems: 'center',
  },
  topCategoryCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.24)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  topCategoryIcon: {
    color: '#1f2937',
    fontWeight: '800',
    fontSize: 18,
  },
  topCategoryLabel: {
    color: '#e5e7eb',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  inviteCard: {
    minHeight: 144,
    borderRadius: 18,
    backgroundColor: CARD_BG,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inviteTextWrap: {
    flex: 1,
  },
  inviteTitle: {
    color: '#d6d3f4',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  inviteAmount: {
    color: '#f3f4f6',
    fontSize: 56 / 2,
    fontWeight: '800',
    marginBottom: 2,
  },
  inviteSub: {
    color: '#d6d3f4',
    fontSize: 18,
    fontWeight: '700',
  },
  inviteArtwork: {
    width: 118,
    height: 96,
    borderRadius: 12,
    backgroundColor: '#3f2f9d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteArtworkText: {
    color: '#d6d3f4',
    fontWeight: '800',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listHeaderTitle: {
    color: '#f3f4f6',
    fontSize: 18,
    fontWeight: '800',
  },
  listHeaderAction: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: '700',
  },
  categoryListCard: {
    minHeight: 64,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryListIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryListIconText: {
    color: '#5b45f6',
    fontSize: 14,
    fontWeight: '800',
  },
  categoryListTextWrap: {
    flex: 1,
  },
  categoryListName: {
    color: '#1f2937',
    fontSize: 15,
    fontWeight: '700',
  },
  categoryListMeta: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 2,
  },
  categoryListArrow: {
    color: '#9ca3af',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyWrap: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#f3f4f6',
    fontSize: 16,
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
  drawerPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '78%',
    backgroundColor: '#111214',
  },
  drawerTop: {
    backgroundColor: PURPLE,
    paddingTop: 46,
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  drawerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  drawerAvatarText: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '800',
  },
  drawerUserTextWrap: {
    flex: 1,
  },
  drawerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  drawerId: {
    color: '#d6d3f4',
    fontSize: 13,
  },
  drawerClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerCloseText: {
    color: '#fbbf24',
    fontWeight: '700',
  },
  drawerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
    paddingTop: 10,
  },
  drawerStatBlock: {
    flex: 1,
  },
  drawerStatDivider: {
    width: 1,
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 10,
  },
  drawerStatLabel: {
    color: '#ddd6fe',
    fontSize: 13,
    marginBottom: 4,
  },
  drawerStatValue: {
    color: '#ffffff',
    fontSize: 28 / 2,
    fontWeight: '800',
  },
  drawerUpgradeRow: {
    minHeight: 64,
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerUpgradeText: {
    color: '#111827',
    fontSize: 20 / 1.1,
    fontWeight: '800',
  },
  drawerArrow: {
    color: ORANGE,
    fontSize: 22,
    fontWeight: '700',
  },
  drawerMenuWrap: {
    flex: 1,
  },
  drawerMenuRow: {
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#2f2f35',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerMenuText: {
    color: '#f3f4f6',
    fontSize: 20 / 1.1,
    fontWeight: '700',
  },
  drawerFooter: {
    minHeight: 58,
    backgroundColor: ORANGE,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerFooterText: {
    color: '#111827',
    fontSize: 30 / 2,
    fontWeight: '700',
  },
  drawerFooterStars: {
    color: '#fef08a',
    fontSize: 20,
    letterSpacing: 4,
    fontWeight: '700',
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
