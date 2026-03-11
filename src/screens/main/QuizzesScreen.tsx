import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Animated,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchQuizzesByCategory } from '../../store/slices/quizzesSlice';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AppPageGradient from '../../components/AppPageGradient';

export default function QuizzesScreen({ route, navigation }: any) {
  const { categoryId } = route.params;
  const dispatch = useAppDispatch();
  const { currentQuizzes: quizzes, loading } = useAppSelector((state) => state.quizzes);
  const bottomPadding = Platform.OS === 'web' ? 24 : 120;
  const { onScroll, contentTranslateY, contentOpacity } = useScrollAnimation({
    maxShift: 16,
    fadeDistance: 160,
  });

  useEffect(() => {
    dispatch(fetchQuizzesByCategory(categoryId));
  }, [dispatch, categoryId]);

  const handleQuizPress = (quiz: any) => {
    navigation.navigate('Quiz', {
      quizId: quiz.id,
      quizTitle: quiz.title,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: contentTranslateY }], opacity: contentOpacity },
      ]}
    >
      <AppPageGradient />
      <Animated.FlatList
        data={quizzes}
        keyExtractor={(item) => item.id.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.quizCard}
            onPress={() => handleQuizPress(item)}
          >
            <View style={styles.header}>
              <Text style={styles.title}>{item.title}</Text>
              <View
                style={[
                  styles.difficultyBadge,
                  item.difficulty === 1
                    ? styles.easyBadge
                    : item.difficulty === 2
                    ? styles.mediumBadge
                    : styles.hardBadge,
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    item.difficulty === 1
                      ? styles.easyText
                      : item.difficulty === 2
                      ? styles.mediumText
                      : styles.hardText,
                  ]}
                >
                  {item.difficulty === 1 ? 'Easy' : item.difficulty === 2 ? 'Medium' : 'Hard'}
                </Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.info}>
              <Text style={styles.infoText}>❓ {item.total_questions} questions</Text>
              <Text style={styles.infoText}>⏱️ {Math.floor(item.time_limit / 60)} min</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  listContent: {
    padding: 16,
  },
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  easyBadge: {
    backgroundColor: '#dcfce7',
  },
  mediumBadge: {
    backgroundColor: '#fef08a',
  },
  hardBadge: {
    backgroundColor: '#fee2e2',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  easyText: {
    color: '#16a34a',
  },
  mediumText: {
    color: '#ca8a04',
  },
  hardText: {
    color: '#dc2626',
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
});
