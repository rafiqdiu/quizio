import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

interface LeaderboardEntry {
  id: number;
  name: string;
  gender?: 'male' | 'female' | null;
  avatar?: string | null;
  avatar_url?: string | null;
  total_score: number;
  quizzes_completed: number;
  rank: number;
}

interface UserRank {
  rank: number;
  total_users: number;
  user_score: number;
}

interface LeaderboardState {
  entries: LeaderboardEntry[];
  userRank: UserRank | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  entries: [],
  userRank: null,
  loading: false,
  error: null,
};

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (
    params: { period?: 'today' | 'weekly' | 'all'; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const safeLimit = Math.min(Math.max(params.limit ?? 50, 1), 50);
      const response = await axios.get(`${API_BASE_URL}/leaderboard`, {
        params: {
          period: params.period ?? 'all',
          limit: safeLimit,
        },
      });
      return response.data.leaderboard;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

export const fetchUserRank = createAsyncThunk(
  'leaderboard/fetchUserRank',
  async (token: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${API_BASE_URL}/my-rank`, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user rank');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Leaderboard
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch User Rank
    builder
      .addCase(fetchUserRank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRank.fulfilled, (state, action) => {
        state.loading = false;
        state.userRank = action.payload;
      })
      .addCase(fetchUserRank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
