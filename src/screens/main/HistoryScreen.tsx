import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchUserAttempts } from '../../store/slices/quizzesSlice';

export default function HistoryScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { userAttempts: attempts, loading } = useAppSelector((state) => state.quizzes);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserAttempts(token));
    }
  }, [dispatch, token]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const getPercentage = (attempt: any) => {
    return attempt.total_questions > 0
      ? Math.round((attempt.correct_answers / attempt.total_questions) * 100)
      : 0;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={attempts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const percentage = getPercentage(item);
          const passed = percentage >= 50;

          return (
            <TouchableOpacity
              style={styles.attemptCard}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('HistoryDetails', { attempt: item })}
            >
              <View style={styles.header}>
                <Text style={styles.quizTitle}>{item.quiz?.title}</Text>
                <Text style={[styles.percentage, passed ? styles.passed : styles.failed]}>
                  {percentage}%
                </Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.detail}>
                  ✓ {item.correct_answers}/{item.total_questions} correct
                </Text>
                <Text style={styles.detail}>
                  ⏱️ {Math.floor(item.time_spent / 60)}m {item.time_spent % 60}s
                </Text>
              </View>
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No attempts yet</Text>
            <Text style={styles.emptySubtext}>Start taking quizzes to see your history here</Text>
          </View>
        }
      />
    </View>
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
  attemptCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  passed: {
    color: '#10b981',
  },
  failed: {
    color: '#ef4444',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detail: {
    fontSize: 13,
    color: '#64748b',
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
  },
});
