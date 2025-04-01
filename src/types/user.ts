export interface Region {
  costPerPoint: number;
  pointsPerPlay: number;
  currency: string;
}

export interface Prize {
  name: string;
  image: string;
}

export interface GameHistory {
  id: string;
  gameType: string;
  cost: number;
  points: number;
  won: boolean;
  createdAt: string;
  prizes: {
    prize: Prize;
  }[];
}

export interface Transaction {
  id: string;
  amount: number;
  points: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  status: string;
  provider: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DailyReward {
  id: string;
  streakDay: number;
  pointsAwarded: number;
  claimedAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS';
  score: number;
}

export interface LeaderboardPlayer {
  id: string;
  name: string;
  points: number;
  winRate: number;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  image: string | null;
  points: number;
  balance: number;
  currency: string;
  role: string;
  affiliateCode: string;
  referralCount: number;
  referralEarnings: number;
  region: Region;
  gameHistory: GameHistory[];
  transactions: Transaction[];
  notifications: Notification[];
  dailyRewards: DailyReward[];
  tournaments: Tournament[];
}
