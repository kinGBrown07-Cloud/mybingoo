import { GameHistory, Transaction } from '@/types/user';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
}

export function formatGameHistoryData(gameHistory: GameHistory[]): ChartData {
  // Trier par date
  const sortedHistory = [...gameHistory].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Grouper par jour
  const dailyData = sortedHistory.reduce((acc, game) => {
    const date = new Date(game.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        gamesPlayed: 0,
        pointsWon: 0,
      };
    }
    acc[date].gamesPlayed++;
    acc[date].pointsWon += game.won ? game.points : 0;
    return acc;
  }, {} as Record<string, { gamesPlayed: number; pointsWon: number }>);

  const labels = Object.keys(dailyData);
  const gamesPlayed = labels.map(date => dailyData[date].gamesPlayed);
  const pointsWon = labels.map(date => dailyData[date].pointsWon);

  return {
    labels,
    datasets: [
      {
        label: 'Parties jouées',
        data: gamesPlayed,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Points gagnés',
        data: pointsWon,
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
}

export function formatTransactionData(transactions: Transaction[]): ChartData {
  // Trier par date
  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Grouper par jour
  const dailyData = sortedTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {
        deposits: 0,
        withdrawals: 0,
      };
    }
    if (transaction.type === 'DEPOSIT') {
      acc[date].deposits += transaction.amount;
    } else {
      acc[date].withdrawals += transaction.amount;
    }
    return acc;
  }, {} as Record<string, { deposits: number; withdrawals: number }>);

  const labels = Object.keys(dailyData);
  const deposits = labels.map(date => dailyData[date].deposits);
  const withdrawals = labels.map(date => dailyData[date].withdrawals);

  return {
    labels,
    datasets: [
      {
        label: 'Dépôts',
        data: deposits,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Retraits',
        data: withdrawals,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
}
