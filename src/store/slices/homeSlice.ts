import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { ContestItem, BestPlayerItem, ContestLeaderboardItem, ContestWinningItem } from '../../screens/main/homeTypes';

type HomeCategory = {
  id: number;
  name: string;
  description: string;
  icon?: string | null;
  total_quizzes: number;
};

type HomeState = {
  categories: HomeCategory[];
  currentContests: ContestItem[];
  upcomingContests: ContestItem[];
  bestPlayers: BestPlayerItem[];
  contestDetails: ContestItem | null;
  contestLeaderboard: ContestLeaderboardItem[];
  contestWinnings: ContestWinningItem[];
  loading: boolean;
  listLoading: boolean;
  detailsLoading: boolean;
  error: string | null;
};

const initialState: HomeState = {
  categories: [],
  currentContests: [],
  upcomingContests: [],
  bestPlayers: [],
  contestDetails: null,
  contestLeaderboard: [],
  contestWinnings: [],
  loading: false,
  listLoading: false,
  detailsLoading: false,
  error: null,
};

function mapContest(item: any): ContestItem {
  return {
    id: Number(item.id),
    quizId: Number(item.quiz_id || 0),
    categoryId: Number(item.category_id || 0),
    title: item.title || 'Quiz Contest',
    subtitle: item.subtitle || '',
    description: item.description || '',
    tag: item.tag || 'Trivia Quiz',
    date: item.date || '',
    time: item.time || '',
    startAt: item.start_at || null,
    endAt: item.end_at || null,
    maxTime: item.max_time || '0 min',
    maxQues: String(item.max_questions || 0),
    noOfContest: String(item.contest_count || 1),
    spots: item.spots_label || `${item.total_spots || 0} spots`,
    prize: item.prize_pool_label || '$0',
    entry: item.entry_fee_label || '$0.00',
    joinAmount: item.entry_fee_label || '$0.00',
    availableSpots: Number(item.available_spots || 0),
    totalSpots: Number(item.total_spots || 0),
    progressPercent: Number(item.progress_percent || 0),
  };
}

function mapBestPlayer(item: any): BestPlayerItem {
  return {
    id: Number(item.id),
    rank: `#${item.rank}`,
    name: item.name || 'Unknown',
    gender: item.gender || null,
    avatar: item.avatar || null,
    avatarUrl: item.avatar_url || null,
    totalScore: Number(item.total_score || 0),
    quizzesCompleted: Number(item.quizzes_completed || 0),
  };
}

function mapContestLeaderboard(item: any): ContestLeaderboardItem {
  return {
    id: Number(item.id),
    rank: Number(item.rank || 0),
    name: item.name || 'Unknown',
    gender: item.gender || null,
    avatar: item.avatar || null,
    avatarUrl: item.avatar_url || null,
    score: Number(item.score || 0),
  };
}

function mapContestWinning(item: any): ContestWinningItem {
  return {
    rank: Number(item.rank || 0),
    amount: Number(item.amount || 0),
    amountLabel: item.amount_label || '$0.00',
  };
}

export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/home`);
      return {
        categories: response.data.categories || [],
        currentContests: (response.data.current_contests || []).map(mapContest),
        upcomingContests: (response.data.upcoming_contests || []).map(mapContest),
        bestPlayers: (response.data.best_players || []).map(mapBestPlayer),
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch home data');
    }
  }
);

export const fetchCurrentContests = createAsyncThunk(
  'home/fetchCurrentContests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contests/current`);
      return (response.data.contests || []).map(mapContest);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current contests');
    }
  }
);

export const fetchUpcomingContests = createAsyncThunk(
  'home/fetchUpcomingContests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contests/upcoming`);
      return (response.data.contests || []).map(mapContest);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming contests');
    }
  }
);

export const fetchBestPlayers = createAsyncThunk(
  'home/fetchBestPlayers',
  async (limit: number = 20, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/best-players`, {
        params: { limit },
      });
      return (response.data.players || []).map(mapBestPlayer);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch best players');
    }
  }
);

export const fetchContestDetails = createAsyncThunk(
  'home/fetchContestDetails',
  async (contestId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contests/${contestId}`);
      return {
        contest: mapContest(response.data.contest || {}),
        leaderboard: (response.data.leaderboard || []).map(mapContestLeaderboard),
        winnings: (response.data.winnings || []).map(mapContestWinning),
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contest details');
    }
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.currentContests = action.payload.currentContests;
        state.upcomingContests = action.payload.upcomingContests;
        state.bestPlayers = action.payload.bestPlayers;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentContests.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentContests.fulfilled, (state, action) => {
        state.listLoading = false;
        state.currentContests = action.payload;
      })
      .addCase(fetchCurrentContests.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUpcomingContests.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingContests.fulfilled, (state, action) => {
        state.listLoading = false;
        state.upcomingContests = action.payload;
      })
      .addCase(fetchUpcomingContests.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchBestPlayers.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchBestPlayers.fulfilled, (state, action) => {
        state.listLoading = false;
        state.bestPlayers = action.payload;
      })
      .addCase(fetchBestPlayers.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContestDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchContestDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.contestDetails = action.payload.contest;
        state.contestLeaderboard = action.payload.leaderboard;
        state.contestWinnings = action.payload.winnings;
      })
      .addCase(fetchContestDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHomeError } = homeSlice.actions;
export default homeSlice.reducer;
