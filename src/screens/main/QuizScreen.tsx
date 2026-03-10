import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchQuiz, saveQuizProgress, submitQuiz } from '../../store/slices/quizzesSlice';

export default function QuizScreen({ route, navigation }: any) {
  const { quizId } = route.params;
  const dispatch = useAppDispatch();
  const { currentQuiz: quiz, loading } = useAppSelector((state) => state.quizzes);
  const { token } = useAppSelector((state) => state.auth);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const answersRef = useRef<{ [key: number]: number }>({});
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchQuiz(quizId));
  }, [dispatch, quizId]);

  useEffect(() => {
    if (quiz) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      answersRef.current = {};
      setTimeStarted(Date.now());
      setTimeRemaining(Math.max(0, Number(quiz.time_limit || 0)));
      setHasAutoSubmitted(false);
    }
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

    const answeredCount = Object.keys(answersRef.current).length;
    const unansweredCount = quiz.questions.length - answeredCount;
    const confirmationText =
      unansweredCount > 0
        ? `You still have ${unansweredCount} unanswered question(s). Submit anyway?`
        : 'Are you sure you want to submit your quiz?';

    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm(confirmationText) : true;
      if (confirmed) {
        void submitQuizAttempt(true);
      }
      return;
    }

    Alert.alert('Submit Quiz', confirmationText, [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Submit',
        onPress: () => {
          void submitQuizAttempt(true);
        },
      },
    ]);
  };

  const handleNextQuestion = async () => {
    if (!quiz) {
      return;
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      await saveProgress();
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  if (loading || !quiz) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5b45f6" />
      </View>
    );
  }

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answersRef.current).length;

  const questionProgress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const timerText =
    timeRemaining === null
      ? '--'
      : timeRemaining > 99
      ? `${Math.floor(timeRemaining / 60)}m`
      : String(timeRemaining);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <View style={styles.container}>
      <View style={styles.topHero}>
        <View style={styles.heroGlow} />

        <View style={styles.heroStatusRow}>
          <View style={styles.statusChipLeft}>
            <Text style={styles.statusChipText}>Q {currentQuestionIndex + 1} of {totalQuestions}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${questionProgress}%` }]} />
          </View>

          <View style={styles.statusChipRight}>
            <Text style={styles.statusChipRightText}>{answeredCount} of {totalQuestions}</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainArea}>
        <View style={styles.questionCardWrap}>
          <View style={styles.timerRingOuter}>
            <View style={styles.timerRingInner}>
              <Text style={styles.timerValue}>{timerText}</Text>
            </View>
          </View>

          <View style={styles.questionCard}>
            <View style={styles.hintChip}>
              <Text style={styles.hintText}>Hint</Text>
            </View>

            <Text style={styles.questionHeading}>
              Question <Text style={styles.questionHeadingAccent}>{currentQuestionIndex + 1}</Text>
            </Text>
            <Text style={styles.quizLabel}>{quiz.title}</Text>
            <View style={styles.separator} />
            <Text style={styles.questionText}>"{currentQuestion.question_text}"</Text>
          </View>
        </View>

        <ScrollView
          style={styles.optionsScroll}
          contentContainerStyle={styles.optionsContent}
          showsVerticalScrollIndicator={false}
        >
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQuestion.id] === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionRow, isSelected ? styles.optionRowSelected : null]}
                onPress={() => handleAnswerSelect(currentQuestion.id, index)}
                activeOpacity={0.9}
                disabled={isSubmitting}
              >
                <Text style={[styles.optionText, isSelected ? styles.optionTextSelected : null]}>{option}</Text>
                <View style={[styles.choiceCircle, isSelected ? styles.choiceCircleSelected : null]}>
                  <Text style={styles.choiceMark}>{isSelected ? 'v' : ''}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, isSubmitting ? styles.nextButtonDisabled : null]}
          onPress={() => {
            void handleNextQuestion();
          }}
          disabled={isSubmitting}
        >
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
  topHero: {
    height: 188,
    backgroundColor: '#5b45f6',
    paddingTop: 56,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -120,
    right: -50,
    transform: [{ rotate: '15deg' }],
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusChipLeft: {
    minWidth: 88,
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statusChipText: {
    color: '#1f2937',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff7a14',
    borderRadius: 10,
  },
  statusChipRight: {
    minWidth: 88,
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: '#ff7a14',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statusChipRightText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  mainArea: {
    flex: 1,
    marginTop: -30,
  },
  questionCardWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  timerRingOuter: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#5b45f6',
    borderTopColor: '#ff7a14',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    elevation: 4,
  },
  timerRingInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerValue: {
    color: '#1f2937',
    fontSize: 30 / 2,
    fontWeight: '800',
  },
  questionCard: {
    marginTop: -24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  hintChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffedd5',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  hintText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700',
  },
  questionHeading: {
    textAlign: 'center',
    color: '#1f2937',
    fontSize: 32 / 2,
    fontWeight: '800',
  },
  questionHeadingAccent: {
    color: '#5b45f6',
  },
  quizLabel: {
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
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
    lineHeight: 29,
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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionRowSelected: {
    borderColor: '#76c27f',
    backgroundColor: '#eef9f0',
  },
  optionText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    paddingRight: 8,
  },
  optionTextSelected: {
    color: '#57ad62',
  },
  choiceCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  choiceCircleSelected: {
    backgroundColor: '#57ad62',
    borderColor: '#57ad62',
  },
  choiceMark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  nextButton: {
    height: 54,
    borderRadius: 28,
    backgroundColor: '#5b45f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
