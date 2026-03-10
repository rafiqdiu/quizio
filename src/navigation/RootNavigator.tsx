import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={tabBarStyles.wrap}>
      <View style={tabBarStyles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const tabLabel =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
              ? options.title
              : route.name;

          const iconName =
            route.name === 'CategoriesTab'
              ? 'home-outline'
              : route.name === 'Leaderboard'
              ? 'grid-outline'
              : route.name === 'History'
              ? 'people-outline'
              : 'chatbubble-outline';

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
                  color={isFocused ? '#ffffff' : '#374151'}
                />
              </View>
              <Text style={[tabBarStyles.tabText, isFocused ? tabBarStyles.tabTextActive : null]}>
                {tabLabel}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={tabBarStyles.centerPlusButton}
          onPress={() => navigation.navigate('CategoriesTab')}
        >
          <MaterialCommunityIcons name="plus" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
          backgroundColor: '#1e293b',
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
        name="Results"
        component={ResultsScreen}
        options={{ title: 'Quiz Results', headerLeft: () => null }}
      />
    </Stack.Navigator>
  );
}

function HistoryNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e293b',
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
          title: 'Library',
          tabBarLabel: 'Library',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryNavigator}
        options={{
          title: 'Share & Earn',
          tabBarLabel: 'Share & Earn',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Chat',
          tabBarLabel: 'Chat',
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
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  bar: {
    minHeight: 86,
    borderRadius: 26,
    backgroundColor: '#5b45f6',
    borderWidth: 1,
    borderColor: '#6f5df7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
    paddingBottom: 8,
    paddingTop: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconCircleActive: {
    backgroundColor: '#ff7a14',
  },
  tabText: {
    color: '#ddd6fe',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  centerPlusButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: -22,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#5b45f6',
    borderWidth: 4,
    borderColor: '#edf1fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPlusText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 30,
    marginTop: -2,
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
