import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform, Animated } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { useAppSelector } from '../../hooks/redux';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AppPageGradient from '../../components/AppPageGradient';

function formatDuration(totalSeconds: number) {
  const safeSeconds = Number.isFinite(totalSeconds) && totalSeconds > 0 ? Math.floor(totalSeconds) : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

export default function HistoryDetailsScreen({ route }: any) {
  const { token } = useAppSelector((state) => state.auth);
  const fallbackAttempt = route?.params?.attempt || {};
  const [detailedAttempt, setDetailedAttempt] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const bottomPadding = Platform.OS === 'web' ? 24 : 120;
  const { onScroll, headerTranslateY, headerOpacity, contentTranslateY, contentOpacity } =
    useScrollAnimation();

  useEffect(() => {
    const attemptId = Number(fallbackAttempt?.id);
    if (!token || attemptId <= 0) {
      return;
    }

    const fetchAttemptDetails = async () => {
      try {
        setDetailsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/my-attempts/${attemptId}/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDetailedAttempt(response.data?.attempt || null);
      } catch (error) {
        setDetailedAttempt(null);
      } finally {
        setDetailsLoading(false);
      }
    };

    void fetchAttemptDetails();
  }, [fallbackAttempt?.id, token]);

  const attempt = detailedAttempt || fallbackAttempt;
  const totalQuestions = Number(attempt?.total_questions) || 0;
  const correctAnswers = Number(attempt?.correct_answers) || 0;
  const falseAnswers = Math.max(totalQuestions - correctAnswers, 0);
  const timeSpent = Number(attempt?.time_spent) || 0;
  const attemptAnswers = attempt?.answers || {};
  const questionItems = Array.isArray(attempt?.quiz?.questions) ? attempt.quiz.questions : [];

  return (
    <View style={styles.container}>
      <AppPageGradient />
      <Animated.ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPadding }]}
        scrollEnabled
        showsVerticalScrollIndicator
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        bounces={Platform.OS === 'ios'}
        alwaysBounceVertical={Platform.OS === 'ios'}
        overScrollMode="always"
        contentInsetAdjustmentBehavior="automatic"
        persistentScrollbar={Platform.OS === 'android'}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.headerCard,
            { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity },
          ]}
        >
          <Text style={styles.title}>{attempt.quiz?.title || 'Quiz Details'}</Text>
          <Text style={styles.dateText}>
            {attempt.created_at ? new Date(attempt.created_at).toLocaleString() : '-'}
          </Text>
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: contentTranslateY }], opacity: contentOpacity }}>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Questions</Text>
              <Text style={styles.statValue}>{totalQuestions}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Correct Answers</Text>
              <Text style={[styles.statValue, styles.correctValue]}>{correctAnswers}</Text>
            </View>

            <View style={styles.statRow}>
              <Text style={styles.statLabel}>False Answers</Text>
              <Text style={[styles.statValue, styles.falseValue]}>{falseAnswers}</Text>
            </View>

            <View style={[styles.statRow, styles.lastRow]}>
              <Text style={styles.statLabel}>Total Time Spent</Text>
              <Text style={styles.statValue}>{formatDuration(timeSpent)}</Text>
            </View>
          </View>

          <View style={styles.qaCard}>
            <Text style={styles.qaTitle}>Questions & Answers</Text>

            {detailsLoading && questionItems.length === 0 ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="small" color="#3b82f6" />
              </View>
            ) : questionItems.length === 0 ? (
              <Text style={styles.emptyQaText}>No question details found.</Text>
            ) : (
              questionItems.map((question: any, index: number) => {
                const rawSelectedIndex = attemptAnswers[question.id] ?? attemptAnswers[String(question.id)];
                const selectedIndex = Number(rawSelectedIndex);
                const correctIndex = Number(question.correct_answer);
                const hasSelected = Number.isInteger(selectedIndex) && selectedIndex >= 0;
                const isCorrect = hasSelected && Number.isInteger(correctIndex) && selectedIndex === correctIndex;

                return (
                  <View key={question.id} style={styles.qaItem}>
                    <Text style={styles.questionText}>
                      {index + 1}. {question.question_text}
                    </Text>

                    {Array.isArray(question.options) &&
                      question.options.map((option: string, optionIndex: number) => {
                        const optionIsCorrect =
                          Number.isInteger(correctIndex) && optionIndex === correctIndex;
                        const optionIsSelected = hasSelected && optionIndex === selectedIndex;
                        const rowPrefix = optionIsCorrect ? '✓' : optionIsSelected ? '✗' : '○';

                        const labels: string[] = [];
                        if (optionIsCorrect) {
                          labels.push('Correct');
                        }
                        if (optionIsSelected) {
                          labels.push('Your answer');
                        }

                        return (
                          <Text
                            key={`${question.id}-${optionIndex}`}
                            style={[
                              styles.optionText,
                              optionIsCorrect ? styles.optionCorrectText : null,
                              optionIsSelected && !optionIsCorrect ? styles.optionWrongSelectedText : null,
                            ]}
                          >
                            {rowPrefix} {option}
                            {labels.length > 0 ? ` (${labels.join(', ')})` : ''}
                          </Text>
                        );
                      })}

                    <Text style={[styles.answerText, isCorrect ? styles.resultCorrect : styles.resultIncorrect]}>
                      {hasSelected ? (isCorrect ? '✓ Correct' : '✗ Incorrect') : 'Not answered'}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#64748b',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  statLabel: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 17,
    color: '#0f172a',
    fontWeight: '700',
  },
  correctValue: {
    color: '#10b981',
  },
  falseValue: {
    color: '#ef4444',
  },
  qaCard: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  qaTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  loadingWrap: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  emptyQaText: {
    color: '#64748b',
    fontSize: 14,
  },
  qaItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  questionText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 6,
  },
  answerText: {
    fontSize: 14,
    color: '#334155',
    marginTop: 8,
    fontWeight: '600',
  },
  optionText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  optionCorrectText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  optionWrongSelectedText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  resultCorrect: {
    color: '#16a34a',
  },
  resultIncorrect: {
    color: '#dc2626',
  },
});
