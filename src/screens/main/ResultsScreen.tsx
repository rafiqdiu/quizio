import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Platform } from 'react-native';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AppPageGradient from '../../components/AppPageGradient';

export default function ResultsScreen({ route, navigation }: any) {
  const { score, percentage, passed, attempt } = route.params;
  const { onScroll, headerTranslateY, headerOpacity, contentTranslateY, contentOpacity } =
    useScrollAnimation({ maxShift: 20, fadeDistance: 140 });
  const bottomPadding = Platform.OS === 'web' ? 24 : 120;
  const answerCount = Array.isArray(attempt?.answers)
    ? attempt.answers.length
    : Object.keys(attempt?.answers || {}).length;
  const isNotAttempted = answerCount === 0;
  const statusText = isNotAttempted ? 'Not Attempted' : passed ? 'Passed' : 'Failed';
  const statusColor = isNotAttempted ? '#f59e0b' : passed ? '#10b981' : '#ef4444';

  const handleViewHistory = () => {
    const parentNavigation = navigation.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate('History');
      return;
    }
    navigation.navigate('History');
  };

  return (
    <View style={styles.container}>
      <AppPageGradient />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
      >
        <Animated.View
          style={[
            styles.resultCard,
            passed ? styles.passedCard : styles.failedCard,
            { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity },
          ]}
        >
          <Text style={styles.resultEmoji}>{passed ? '🎉' : '📚'}</Text>
          <Text style={styles.resultText}>{passed ? 'Quiz Passed!' : 'Quiz Completed'}</Text>
          <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: contentTranslateY }], opacity: contentOpacity }}>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{score}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Correct Answers</Text>
              <Text style={styles.statValue}>
                {attempt.correct_answers}/{attempt.total_questions}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Time Spent</Text>
              <Text style={styles.statValue}>{Math.floor(attempt.time_spent / 60)}m {attempt.time_spent % 60}s</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Status</Text>
              <Text style={[styles.statValue, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('CategoriesList')}
            >
              <Text style={styles.buttonText}>Take Another Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleViewHistory}
            >
              <Text style={styles.secondaryButtonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  resultCard: {
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
  },
  passedCard: {
    backgroundColor: '#dcfce7',
  },
  failedCard: {
    backgroundColor: '#dbeafe',
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  percentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10b981',
  },
  statsCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
});
