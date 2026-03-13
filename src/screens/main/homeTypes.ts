export type ContestItem = {
  id: number;
  quizId: number;
  categoryId: number;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  date: string;
  time: string;
  startAt?: string | null;
  endAt?: string | null;
  maxTime: string;
  maxQues: string;
  noOfContest?: string;
  spots?: string;
  prize?: string;
  entry?: string;
  joinAmount?: string;
  availableSpots: number;
  totalSpots: number;
  progressPercent: number;
};

export type BestPlayerItem = {
  id: number;
  rank: string;
  name: string;
  gender?: 'male' | 'female' | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  totalScore: number;
  quizzesCompleted: number;
};

export type ContestLeaderboardItem = {
  id: number;
  rank: number;
  name: string;
  gender?: 'male' | 'female' | null;
  avatar?: string | null;
  avatarUrl?: string | null;
  score: number;
};

export type ContestWinningItem = {
  rank: number;
  amount: number;
  amountLabel: string;
};
