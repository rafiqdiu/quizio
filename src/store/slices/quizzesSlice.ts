import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export interface Question {
  id: number;
  question_text: string;
  options: string[];
  points: number;
}

export interface Quiz {
  id: number;
  category_id: number;
  title: string;
  description: string;
  total_questions: number;
  time_limit: number;
  difficulty: number;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  total_quizzes: number;
}

interface QuizzesState {
  categories: Category[];
  currentQuizzes: Quiz[];
  currentQuiz: Quiz & { questions: Question[] } | null;
  userAttempts: any[];
  loading: boolean;
  error: string | null;
}

function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const initialState: QuizzesState = {
  categories: [],
  currentQuizzes: [],
  currentQuiz: null,
  userAttempts: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'quizzes/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data.categories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchQuizzesByCategory = createAsyncThunk(
  'quizzes/fetchQuizzesByCategory',
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/quizzes`);
      return response.data.quizzes;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuiz = createAsyncThunk(
  'quizzes/fetchQuiz',
  async (quizId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`);
      return response.data.quiz;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quizzes/submitQuiz',
  async (
    { quizId, answers, timeSpent, token }: { quizId: number; answers: any; timeSpent: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/quizzes/${quizId}/submit`,
        { quiz_id: quizId, answers, time_spent: timeSpent },
        config
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (typeof error.response?.data?.errors === 'object'
          ? Object.values(error.response.data.errors).flat().join(' ')
          : null) ||
        'Failed to submit quiz';
      return rejectWithValue(message);
    }
  }
);

export const saveQuizProgress = createAsyncThunk(
  'quizzes/saveQuizProgress',
  async (
    { quizId, answers, timeSpent, token }: { quizId: number; answers: any; timeSpent: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/quizzes/${quizId}/progress`,
        { quiz_id: quizId, answers, time_spent: timeSpent },
        config
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (typeof error.response?.data?.errors === 'object'
          ? Object.values(error.response.data.errors).flat().join(' ')
          : null) ||
        'Failed to save quiz progress';
      return rejectWithValue(message);
    }
  }
);

export const fetchUserAttempts = createAsyncThunk(
  'quizzes/fetchUserAttempts',
  async (token: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_BASE_URL}/my-attempts`, config);
      return response.data.attempts;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attempts');
    }
  }
);

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Quizzes by Category
    builder
      .addCase(fetchQuizzesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuizzes = shuffleArray(Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchQuizzesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Quiz
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.loading = false;
        const quiz = action.payload;
        const questionItems = Array.isArray(quiz?.questions) ? quiz.questions : [];
        state.currentQuiz = {
          ...quiz,
          questions: shuffleArray(questionItems),
        };
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Submit Quiz
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuiz.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User Attempts
    builder
      .addCase(fetchUserAttempts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAttempts.fulfilled, (state, action) => {
        state.loading = false;
        state.userAttempts = action.payload.data || action.payload;
      })
      .addCase(fetchUserAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;
