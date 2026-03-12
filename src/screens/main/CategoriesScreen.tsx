import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCategories } from '../../store/slices/quizzesSlice';
import { logout } from '../../store/slices/authSlice';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AppPageGradient from '../../components/AppPageGradient';

const categoryIcons = [
  'extension-puzzle-outline',
  'image-outline',
  'musical-notes-outline',
  'flask-outline',
  'book-outline',
  'language-outline',
  'film-outline',
  'calculator-outline',
];

const drawerItems = [
  { key: 'profile', label: 'My Profile', icon: 'person-outline' },
  { key: 'notification', label: 'Notification', icon: 'notifications-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
  // { key: 'about', label: 'About Us', icon: 'information-circle-outline' },
  { key: 'play_quiz', label: 'Play Quiz', icon: 'apps-outline' },
  { key: 'help', label: 'Help Center', icon: 'help-buoy-outline' },
  { key: 'logout', label: 'Logout', icon: 'log-out-outline' },
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
  const { categories, loading } = useAppSelector((state) => state.quizzes);
  const { user } = useAppSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  const bottomPadding = Platform.OS === 'web' ? 24 : 120;
  const { onScroll, headerTranslateY, headerOpacity, contentTranslateY, contentOpacity } =
    useScrollAnimation();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const displayCategories = useMemo(() => {
    if (categories.length > 0) {
      return categories;
    }

    return [
      { id: 1, name: 'Puzzle Quiz', total_quizzes: 140 },
      { id: 2, name: 'Picture Quiz', total_quizzes: 140 },
      { id: 3, name: 'Music Quiz', total_quizzes: 140 },
      { id: 4, name: 'Science Quiz', total_quizzes: 140 },
      { id: 5, name: 'History Quiz', total_quizzes: 140 },
      { id: 6, name: 'Language Quiz', total_quizzes: 140 },
      { id: 7, name: 'Movie/TV Show Quiz', total_quizzes: 140 },
      { id: 8, name: 'Mathematics Quiz', total_quizzes: 140 },
    ];
  }, [categories]);

  const handleCategoryPress = (category: any) => {
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

    if (key === 'about') {
      navigation.navigate('AboutUs');
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

  if (loading && categories.length === 0) {
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
            <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerOpen(true)}>
              <Ionicons name="menu" size={18} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Category</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateY: contentTranslateY }], opacity: contentOpacity },
        ]}
      >
        <Animated.FlatList
          data={displayCategories}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrap}
          contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          bounces={Platform.OS === 'ios'}
          alwaysBounceVertical={Platform.OS === 'ios'}
          overScrollMode="always"
          contentInsetAdjustmentBehavior="automatic"
          persistentScrollbar={Platform.OS === 'android'}
          renderItem={({ item, index }) => {
            const active = index === 0;
            const iconName = categoryIcons[index % categoryIcons.length];
            return (
              <TouchableOpacity
                style={[styles.card, active ? styles.cardActive : null]}
                onPress={() => handleCategoryPress(item)}
                activeOpacity={0.9}
              >
                <View style={[styles.iconCircle, active ? styles.iconCircleActive : null]}>
                  {iconName === 'language-outline' ? (
                    <MaterialCommunityIcons
                      name="translate"
                      size={20}
                      color={active ? '#ff7a14' : '#6b7280'}
                    />
                  ) : (
                    <Ionicons name={iconName as any} size={20} color={active ? '#ff7a14' : '#6b7280'} />
                  )}
                </View>

                <View style={styles.cardTextWrap}>
                  <Text style={[styles.cardTitle, active ? styles.cardTitleActive : null]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[styles.cardMeta, active ? styles.cardMetaActive : null]}>
                    Que:{item.total_quizzes || 140}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </Animated.View>

      {drawerOpen && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayTouch} onPress={() => setDrawerOpen(false)} />

          <View style={styles.drawerPanel}>
            <LinearGradient
              colors={['#6f4dff', '#5b45f6', '#4f39d8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.drawerTop}
            >
              <TouchableOpacity style={styles.drawerClose} onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={20} color="#ff8f39" />
              </TouchableOpacity>

              <View style={styles.drawerUserRow}>
                <View style={styles.drawerAvatarRing}>
                  <View style={styles.drawerAvatar}>
                    <Text style={styles.drawerAvatarText}>{getInitials(user?.name || 'Jhon Smith')}</Text>
                  </View>
                </View>

                <View style={styles.drawerUserTextWrap}>
                  <Text style={styles.drawerName}>{user?.name || 'Jhon Smith'}</Text>
                  <Text style={styles.drawerId}>ID : 6546354651</Text>
                </View>
              </View>

              <View style={styles.drawerTopDivider} />

              <View style={styles.drawerStatsRow}>
                <View style={styles.drawerStatBlock}>
                  <View style={styles.drawerStatIconCircle}>
                    <Ionicons name="stats-chart" size={16} color="#111827" />
                  </View>
                  <View>
                    <Text style={styles.drawerStatLabel}>Rank</Text>
                    <Text style={styles.drawerStatValue}>420</Text>
                  </View>
                </View>

                <View style={styles.drawerStatDivider} />

                <View style={styles.drawerStatBlock}>
                  <View style={styles.drawerStatIconCircle}>
                    <Ionicons name="albums-outline" size={16} color="#111827" />
                  </View>
                  <View>
                    <Text style={styles.drawerStatLabel}>Active</Text>
                    <Text style={styles.drawerStatValue}>Daily Pack</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.drawerCurrentMonth}>Renewal Date: 2026-10-15</Text>
            </LinearGradient>

            <TouchableOpacity style={styles.drawerUpgradeRow}>
              <View style={styles.drawerUpgradeLeft}>
                <View style={styles.drawerUpgradeIcon}>
                  <Ionicons name="ribbon-outline" size={16} color="#ff7a14" />
                </View>
                <Text style={styles.drawerUpgradeText}>Upgrade to Primium</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#111827" />
            </TouchableOpacity>

            <FlatList
              data={drawerItems}
              keyExtractor={(item) => item.key}
              style={styles.drawerList}
              contentContainerStyle={styles.drawerListContent}
              showsVerticalScrollIndicator
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              bounces={Platform.OS === 'ios'}
              alwaysBounceVertical={Platform.OS === 'ios'}
              overScrollMode="always"
              contentInsetAdjustmentBehavior="automatic"
              persistentScrollbar={Platform.OS === 'android'}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.drawerMenuRow} onPress={() => handleDrawerItem(item.key)}>
                  <View style={styles.drawerMenuLeft}>
                    <View style={styles.drawerMenuIconCircle}>
                      <Ionicons name={item.icon as any} size={17} color="#ff8f39" />
                    </View>
                    <Text style={styles.drawerMenuText}>{item.label}</Text>
                  </View>

                  <Ionicons name="arrow-forward" size={19} color="#ff8f39" />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}

      {showLogoutPrompt && (
        <View style={styles.logoutOverlay}>
          <TouchableOpacity style={styles.logoutOverlayTouch} onPress={() => setShowLogoutPrompt(false)} />

          <View style={styles.logoutSheet}>
            <Text style={styles.logoutTitle}>Log Out</Text>
            <View style={styles.logoutDivider} />
            <Text style={styles.logoutMessage}>Are you sure you want to log out?</Text>

            <View style={styles.logoutButtonsRow}>
              <TouchableOpacity style={styles.logoutCancelButton} onPress={() => setShowLogoutPrompt(false)}>
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutConfirmButton} onPress={confirmLogout}>
                <Text style={styles.logoutConfirmText}>Yes, Logout</Text>
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
    paddingBottom: 34,
    borderBottomLeftRadius: 130,
    borderBottomRightRadius: 130,
    overflow: 'hidden',
  },
  heroShine: {
    position: 'absolute',
    right: -48,
    top: -90,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.09)',
    transform: [{ rotate: '18deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 42 / 2,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    marginTop: -6,
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    backgroundColor: '#edf1fb',
    paddingTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  columnWrap: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48.3%',
    minHeight: 108,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
  },
  cardActive: {
    backgroundColor: '#ff7a14',
    borderColor: '#ff7a14',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircleActive: {
    backgroundColor: '#ffffff',
  },
  cardTextWrap: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#1f2937',
    fontSize: 16 / 1.1,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardTitleActive: {
    color: '#ffffff',
  },
  cardMeta: {
    color: '#5b45f6',
    fontSize: 14 / 1.1,
    fontWeight: '600',
  },
  cardMetaActive: {
    color: '#ffe7d0',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9,11,32,0.62)',
  },
  overlayTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  drawerPanel: {
    width: '80%',
    height: '100%',
    backgroundColor: '#0f0f12',
  },
  drawerTop: {
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  drawerClose: {
    position: 'absolute',
    right: 12,
    top: 44,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#ff8f39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerAvatarRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: '#ff8f39',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drawerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerAvatarText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  drawerUserTextWrap: {
    flex: 1,
  },
  drawerName: {
    color: '#ffffff',
    fontSize: 22 / 1.1,
    fontWeight: '800',
    marginBottom: 4,
  },
  drawerId: {
    color: '#ddd6fe',
    fontSize: 16 / 1.1,
    fontWeight: '600',
  },
  drawerTopDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.25)',
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  drawerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerStatBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerStatIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  drawerStatDivider: {
    width: 1,
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 12,
  },
  drawerStatLabel: {
    color: '#ffffff',
    fontSize: 15 / 1.1,
    marginBottom: 2,
  },
  drawerStatValue: {
    color: '#ffffff',
    fontSize: 30 / 2,
    fontWeight: '800',
  },
  drawerCurrentMonth: {
    alignSelf: 'flex-end',
    marginTop: 6,
    color: '#ffb05f',
    fontSize: 14 / 1.1,
    fontWeight: '600',
  },
  drawerUpgradeRow: {
    minHeight: 62,
    backgroundColor: '#ff7a14',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerUpgradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerUpgradeIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  drawerUpgradeText: {
    color: '#111827',
    fontSize: 22 / 1.1,
    fontWeight: '800',
  },
  drawerList: {
    flex: 1,
  },
  drawerListContent: {
    paddingBottom: Platform.OS === 'web' ? 16 : 28,
  },
  drawerMenuRow: {
    minHeight: 66,
    borderBottomWidth: 1,
    borderBottomColor: '#2f2f35',
    borderStyle: 'dashed',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerMenuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerMenuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#7c2d12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  drawerMenuText: {
    color: '#f9fafb',
    fontSize: 36 / 2,
    fontWeight: '700',
  },
  logoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6,8,16,0.82)',
    justifyContent: 'flex-end',
    zIndex: 9999,
    elevation: 9999,
  },
  logoutOverlayTouch: {
    flex: 1,
  },
  logoutSheet: {
    backgroundColor: '#0e1015',
    borderTopLeftRadius: 92,
    borderTopRightRadius: 92,
    paddingTop: 34,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === 'web' ? 26 : 122,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    elevation: 20,
  },
  logoutTitle: {
    color: '#ff7a14',
    fontSize: 50 / 2,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.32)',
    borderStyle: 'dashed',
    marginBottom: 22,
    marginHorizontal: 4,
  },
  logoutMessage: {
    color: '#f4f4f5',
    fontSize: 40 / 2,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 26,
  },
  logoutButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 2,
  },
  logoutCancelButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 29,
    borderWidth: 1.2,
    borderColor: '#81573a',
    backgroundColor: '#2a1d17',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelText: {
    color: '#ff7a14',
    fontSize: 19 / 1.1,
    fontWeight: '800',
  },
  logoutConfirmButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 29,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutConfirmText: {
    color: '#12141a',
    fontSize: 19 / 1.1,
    fontWeight: '800',
  },
});
