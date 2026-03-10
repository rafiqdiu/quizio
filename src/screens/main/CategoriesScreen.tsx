import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCategories } from '../../store/slices/quizzesSlice';

export default function CategoriesScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryPress = (category: any) => {
    navigation.navigate('Quizzes', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5b45f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (navigation.canGoBack?.()) {
                navigation.goBack();
              }
            }}
          >
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.heroTitle}>Choose Category</Text>
        </View>
      </View>

      <View style={styles.sheet}>
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const isFeatured = index === 0;
            return (
              <TouchableOpacity
                style={[styles.categoryCard, isFeatured ? styles.featuredCard : null]}
                onPress={() => handleCategoryPress(item)}
                activeOpacity={0.9}
              >
                <View style={[styles.iconCircle, isFeatured ? styles.featuredIconCircle : null]}>
                  <Text style={[styles.iconText, isFeatured ? styles.featuredIconText : null]}>
                    {String(item.icon || item.name?.charAt(0) || 'Q').slice(0, 1)}
                  </Text>
                </View>

                <View style={styles.textWrap}>
                  <Text
                    style={[styles.categoryName, isFeatured ? styles.featuredText : null]}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.quizCount, isFeatured ? styles.featuredSubText : null]}>
                    Que: {item.total_quizzes || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No categories available</Text>
              <Text style={styles.emptySub}>Add categories from admin to display here.</Text>
            </View>
          }
        />
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
  hero: {
    height: 198,
    backgroundColor: '#5b45f6',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -120,
    right: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ rotate: '12deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '700',
    marginTop: -1,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 33 / 2,
    fontWeight: '800',
  },
  sheet: {
    flex: 1,
    marginTop: -42,
    backgroundColor: '#edf1fb',
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    paddingTop: 28,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryCard: {
    width: '48%',
    minHeight: 112,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featuredCard: {
    backgroundColor: '#ff7a14',
    borderColor: '#ff7a14',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featuredIconCircle: {
    backgroundColor: '#ffffff',
  },
  iconText: {
    color: '#5b45f6',
    fontWeight: '800',
    fontSize: 16,
  },
  featuredIconText: {
    color: '#ff7a14',
  },
  textWrap: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '700',
    marginBottom: 5,
  },
  featuredText: {
    color: '#ffffff',
  },
  quizCount: {
    fontSize: 13,
    color: '#6d28d9',
    fontWeight: '600',
  },
  featuredSubText: {
    color: '#fff3e7',
  },
  emptyWrap: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySub: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
  },
});
