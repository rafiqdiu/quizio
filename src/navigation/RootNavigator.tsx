import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getCurrentUser, restoreToken } from '../store/slices/authSlice';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordCodeScreen from '../screens/auth/ResetPasswordCodeScreen';
import CreatePasswordScreen from '../screens/auth/CreatePasswordScreen';
import ResetSuccessScreen from '../screens/auth/ResetSuccessScreen';

// Main Screens
import CategoriesScreen from '../screens/main/CategoriesScreen';
import QuizzesScreen from '../screens/main/QuizzesScreen';
import QuizScreen from '../screens/main/QuizScreen';
import ResultsScreen from '../screens/main/ResultsScreen';
import LeaderboardScreen from '../screens/main/LeaderboardScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import HistoryDetailsScreen from '../screens/main/HistoryDetailsScreen';
import DrawerItemScreen from '../screens/main/DrawerItemScreen';
import CurrentContestsScreen from '../screens/main/CurrentContestsScreen';
import BestPlayersScreen from '../screens/main/BestPlayersScreen';
import UpcomingContestsScreen from '../screens/main/UpcomingContestsScreen';
import QuizDetailsScreen from '../screens/main/QuizDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const LEADERBOARD_HEADER_COLOR = '#5b45f6';

function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const visualMap: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
    CategoriesTab: { label: 'Home', icon: 'home-outline' },
    Leaderboard: { label: 'Library', icon: 'grid-outline' },
    History: { label: 'Share & Earn', icon: 'people-outline' },
    Profile: { label: 'Chat', icon: 'chatbubble-outline' },
  };

  return (
    <View style={tabBarStyles.wrap}>
      <LinearGradient
        colors={['#6f4dff', '#5c3ef1', '#4f34d8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.8 }}
        style={tabBarStyles.bar}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const fallbackLabel =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
              ? options.title
              : route.name;
          const mappedVisual = visualMap[route.name];
          const tabLabel = mappedVisual?.label || fallbackLabel;
          const iconName = mappedVisual?.icon || 'ellipse-outline';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              style={tabBarStyles.tabButton}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
            >
              <View style={[tabBarStyles.iconCircle, isFocused ? tabBarStyles.iconCircleActive : null]}>
                <Ionicons
                  name={iconName}
                  size={20}
                  color="#ffffff"
                />
              </View>
              <Text style={[tabBarStyles.tabText, isFocused ? tabBarStyles.tabTextActive : null]}>
                {tabLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPasswordCode" component={ResetPasswordCodeScreen} />
      <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
      <Stack.Screen name="ResetSuccess" component={ResetSuccessScreen} />
    </Stack.Navigator>
  );
}

function CategoriesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: LEADERBOARD_HEADER_COLOR,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CategoriesList"
        component={CategoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Quizzes"
        component={QuizzesScreen}
        options={({ route }: any) => ({
          title: route.params?.categoryName || 'Quizzes',
        })}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuizDetails"
        component={QuizDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: 'Quiz Results', headerLeft: () => null }}
      />
      <Stack.Screen
        name="CurrentContests"
        component={CurrentContestsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BestPlayers"
        component={BestPlayersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpcomingContests"
        component={UpcomingContestsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={DrawerItemScreen}
        initialParams={{
          title: 'Notification',
          icon: 'notifications-outline',
          description: 'View notification updates, reminders, and quiz alerts.',
        }}
        options={{ title: 'Notification' }}
      />
      <Stack.Screen
        name="Settings"
        component={DrawerItemScreen}
        initialParams={{
          title: 'Settings',
          icon: 'settings-outline',
          description: 'Manage account preferences and app behavior from this page.',
        }}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="AboutUs"
        component={DrawerItemScreen}
        initialParams={{
          title: 'About Us',
          icon: 'information-circle-outline',
          description: 'Learn about the app vision, team, and update roadmap.',
        }}
        options={{ title: 'About Us' }}
      />
      <Stack.Screen
        name="PlayQuiz"
        component={DrawerItemScreen}
        initialParams={{
          title: 'Play Quiz',
          icon: 'apps-outline',
          description: 'Start a new challenge and improve your leaderboard position.',
        }}
        options={{ title: 'Play Quiz' }}
      />
      <Stack.Screen
        name="HelpCenter"
        component={DrawerItemScreen}
        initialParams={{
          title: 'Help Center',
          icon: 'help-buoy-outline',
          description: 'Get support, FAQs, and troubleshooting resources.',
        }}
        options={{ title: 'Help Center' }}
      />
    </Stack.Navigator>
  );
}

function HistoryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: LEADERBOARD_HEADER_COLOR,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="HistoryList"
        component={HistoryScreen}
        options={{ title: 'History' }}
      />
      <Stack.Screen
        name="HistoryDetails"
        component={HistoryDetailsScreen}
        options={{ title: 'History Details' }}
      />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesNavigator}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          title: 'Leaderboard',
          tabBarLabel: 'Leaderboard',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryNavigator}
        options={{
          title: 'History',
          tabBarLabel: 'History',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const tabBarStyles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  bar: {
    minHeight: 94,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
    paddingBottom: 9,
    paddingTop: 11,
    overflow: 'hidden',
    shadowColor: '#5b45f6',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 9,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#20145f',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircleActive: {
    backgroundColor: '#ff7a14',
    borderColor: '#ff7a14',
  },
  tabText: {
    color: '#20165a',
    fontSize: 11.5,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#20165a',
    fontWeight: '800',
  },
});

export function RootNavigator() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      const result = await dispatch(restoreToken());
      if (restoreToken.fulfilled.match(result) && result.payload) {
        dispatch(getCurrentUser());
      }
    };

    void initAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
