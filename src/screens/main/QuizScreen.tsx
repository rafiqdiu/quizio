import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchQuiz, saveQuizProgress, submitQuiz } from '../../store/slices/quizzesSlice';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AppPageGradient from '../../components/AppPageGradient';

function twoDigit(value: number) {
  return String(value).padStart(2, '0');
}

function resolveCorrectIndex(question: any): number | null {
  const options = Array.isArray(question?.options) ? question.options : [];
  const raw = question?.correct_answer ?? question?.correct_index ?? question?.answer;
  const parsed = Number(raw);

  if (!Number.isInteger(parsed)) {
    return null;
  }

  if (parsed >= 0 && parsed < options.length) {
    return parsed;
  }

  if (parsed >= 1 && parsed <= options.length) {
    return parsed - 1;
  }

  return null;
}

export default function QuizScreen({ route, navigation }: any) {
  const { quizId } = route.params;
  const dispatch = useAppDispatch();
  const { currentQuiz: quiz, loading } = useAppSelector((state) => state.quizzes);
  const { token } = useAppSelector((state) => state.auth);
  const quizQuestions = Array.isArray(quiz?.questions) ? quiz.questions : [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const answersRef = useRef<{ [key: number]: number }>({});
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
  const { onScroll, headerTranslateY, headerOpacity, contentTranslateY, contentOpacity } =
    useScrollAnimation({ maxShift: 14, fadeDistance: 120 });

  useEffect(() => {
    dispatch(fetchQuiz(quizId));
  }, [dispatch, quizId]);

  useEffect(() => {
    if (!quiz) {
      return;
    }

    setCurrentQuestionIndex(0);
    setAnswers({});
    answersRef.current = {};
    setTimeStarted(Date.now());
    setTimeRemaining(Math.max(0, Number(quiz.time_limit || 0)));
    setHasAutoSubmitted(false);
  }, [quiz]);

  useEffect(() => {
    if (!quiz || timeRemaining === null) {
      return;
    }

    if (timeRemaining <= 0) {
      if (!hasAutoSubmitted) {
        setHasAutoSubmitted(true);
        void submitQuizAttempt(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, (prev ?? 0) - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, quiz, hasAutoSubmitted]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    const next = {
      ...answersRef.current,
      [questionId]: answerIndex,
    };
    answersRef.current = next;
    setAnswers(next);
  };

  const saveProgress = async () => {
    if (!token || !quiz) {
      return;
    }

    const startedAt = timeStarted ?? Date.now();
    const timeSpent = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));

    await dispatch(
      saveQuizProgress({
        quizId,
        answers: answersRef.current,
        timeSpent,
        token,
      })
    );
  };

  const submitQuizAttempt = async (showErrorPopup = true) => {
    if (!token) {
      Alert.alert('Session Expired', 'Please login again to submit your quiz.');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const startedAt = timeStarted ?? Date.now();
      const timeSpent = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));

      const result = await dispatch(
        submitQuiz({
          quizId,
          answers: answersRef.current,
          timeSpent,
          token,
        })
      );

      if (submitQuiz.fulfilled.match(result)) {
        navigation.navigate('Results', {
          attempt: result.payload.attempt,
          score: result.payload.score,
          percentage: result.payload.percentage,
          passed: result.payload.passed,
        });
        return;
      }

      if (showErrorPopup) {
        Alert.alert('Submit Failed', String(result.payload || 'Failed to submit quiz'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (!quiz) {
      return;
    }

    void submitQuizAttempt(true);
  };

  const handleNextQuestion = async () => {
    if (!quiz) {
      return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      await saveProgress();
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const timerText = (() => {
    if (timeRemaining === null) {
      return '--';
    }
    if (timeRemaining > 99) {
      return `${Math.floor(timeRemaining / 60)}m`;
    }
    return String(timeRemaining);
  })();

  if (loading || !quiz) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5b45f6" />
      </View>
    );
  }

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (!currentQuestion || totalQuestions === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No questions available for this quiz.</Text>
      </View>
    );
  }

  const answeredCount = Object.keys(answersRef.current).length;
  const selectedIndex = answers[currentQuestion.id];
  const correctIndex = resolveCorrectIndex(currentQuestion);
  const canReveal = selectedIndex !== undefined && correctIndex !== null;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

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
          style={styles.topHero}
        >
          <View style={styles.topGlow} />

          <View style={styles.topStatusRow}>
            <View style={styles.leftChip}>
              <Ionicons name="person-outline" size={14} color="#6b7280" />
              <Text style={styles.leftChipText}>
                {currentQuestionIndex + 1} of {totalQuestions}
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            <View style={styles.rightChip}>
              <Ionicons name="trophy-outline" size={14} color="#ffffff" />
              <Text style={styles.rightChipText}>
                {answeredCount} of {totalQuestions}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={styles.mainArea}>
        <Animated.View
          style={[
            styles.questionCardWrap,
            { transform: [{ translateY: contentTranslateY }], opacity: contentOpacity },
          ]}
        >
          <View style={styles.timerRing}>
            <View style={styles.timerInner}>
              <Text style={styles.timerValue}>{timerText}</Text>
            </View>
          </View>

          <View style={styles.questionCard}>
            <View style={styles.hintChip}>
              <Ionicons name="bulb-outline" size={12} color="#f97316" />
              <Text style={styles.hintText}>Hint</Text>
            </View>

            <Text style={styles.questionHeading}>
              Question <Text style={styles.questionHeadingAccent}>{twoDigit(currentQuestionIndex + 1)}</Text>
            </Text>
            <Text style={styles.quizLabel}>{quiz.title || 'Sports Quiz'}</Text>
            <View style={styles.separator} />
            <Text style={styles.questionText}>“{currentQuestion.question_text}”</Text>
          </View>
        </Animated.View>

        <Animated.ScrollView
          style={styles.optionsScroll}
          contentContainerStyle={styles.optionsContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {currentQuestion.options.map((option, optionIndex) => {
            const optionSelected = selectedIndex === optionIndex;
            const optionCorrect = canReveal && optionIndex === correctIndex;
            const optionWrongSelected = canReveal && optionSelected && optionIndex !== correctIndex;

            return (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionRow,
                  optionSelected ? styles.optionSelected : null,
                  optionCorrect ? styles.optionCorrect : null,
                  optionWrongSelected ? styles.optionWrong : null,
                ]}
                onPress={() => handleAnswerSelect(currentQuestion.id, optionIndex)}
                disabled={isSubmitting}
                activeOpacity={0.9}
              >
                <Text
                  style={[
                    styles.optionText,
                    optionSelected ? styles.optionTextSelected : null,
                    optionCorrect ? styles.optionTextCorrect : null,
                    optionWrongSelected ? styles.optionTextWrong : null,
                  ]}
                >
                  {option}
                </Text>

                <View
                  style={[
                    styles.optionStatusCircle,
                    optionCorrect ? styles.optionStatusCircleCorrect : null,
                    optionWrongSelected ? styles.optionStatusCircleWrong : null,
                    optionSelected && !canReveal ? styles.optionStatusCircleSelected : null,
                  ]}
                >
                  {optionCorrect ? (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  ) : optionWrongSelected ? (
                    <Ionicons name="close" size={16} color="#ffffff" />
                  ) : optionSelected ? (
                    <Ionicons name="ellipse" size={10} color="#5b45f6" />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, isSubmitting ? styles.nextButtonDisabled : null]}
          onPress={() => {
            void handleNextQuestion();
          }}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={['#5b45f6', '#6f4dff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.nextButtonText}>
            {isSubmitting ? 'Submitting...' : isLastQuestion ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
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
  emptyText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  topHero: {
    height: 140,
    paddingTop: 56,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  topGlow: {
    position: 'absolute',
    right: -60,
    top: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '18deg' }],
  },
  topStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftChip: {
    minWidth: 90,
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  leftChipText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#ff7a14',
  },
  rightChip: {
    minWidth: 96,
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  rightChipText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
  },
  mainArea: {
    flex: 1,
    marginTop: -30,
  },
  questionCardWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  timerRing: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#5b45f6',
    borderTopColor: '#ff7a14',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    elevation: 3,
  },
  timerInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerValue: {
    color: '#1f2937',
    fontSize: 30 / 2,
    fontWeight: '800',
  },
  questionCard: {
    marginTop: -24,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  hintChip: {
    alignSelf: 'flex-start',
    minHeight: 28,
    borderRadius: 6,
    backgroundColor: '#ffedd5',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hintText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  questionHeading: {
    textAlign: 'center',
    color: '#1f2937',
    fontSize: 34 / 2,
    fontWeight: '800',
  },
  questionHeadingAccent: {
    color: '#5b45f6',
  },
  quizLabel: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 15 / 1.1,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 14,
  },
  questionText: {
    textAlign: 'center',
    color: '#111827',
    fontSize: 34 / 2,
    fontWeight: '700',
    lineHeight: 28,
  },
  optionsScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  optionsContent: {
    paddingBottom: 12,
  },
  optionRow: {
    minHeight: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    marginBottom: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    borderColor: '#b7acef',
    backgroundColor: '#f6f3ff',
  },
  optionCorrect: {
    borderColor: '#c6e6cc',
    backgroundColor: '#ecf9ef',
  },
  optionWrong: {
    borderColor: '#fb923c',
    backgroundColor: '#fff7ed',
  },
  optionText: {
    flex: 1,
    color: '#1f2937',
    fontSize: 17 / 1.1,
    fontWeight: '700',
    marginRight: 8,
  },
  optionTextSelected: {
    color: '#5b45f6',
  },
  optionTextCorrect: {
    color: '#43a857',
  },
  optionTextWrong: {
    color: '#f97316',
  },
  optionStatusCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionStatusCircleSelected: {
    borderColor: '#b7acef',
    backgroundColor: '#ede9fe',
  },
  optionStatusCircleCorrect: {
    borderColor: '#57bc69',
    backgroundColor: '#57bc69',
  },
  optionStatusCircleWrong: {
    borderColor: '#f97316',
    backgroundColor: '#f97316',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 98,
    paddingTop: 8,
    marginBottom: 8,
  },
  nextButton: {
    minHeight: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.75,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18 / 1.1,
    fontWeight: '700',
  },
});
