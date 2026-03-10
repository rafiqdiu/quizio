import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quizzesReducer from './slices/quizzesSlice';
import leaderboardReducer from './slices/leaderboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizzesReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
