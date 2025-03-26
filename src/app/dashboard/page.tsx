'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlusIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TwoFactorAuth from '@/components/auth/TwoFactorAuth';
import { useDataCache } from '@/hooks/useDataCache';

interface UserData {
  name: string;
  email: string;
  phone: string;
  country: string;
  image: string | null;
  points: number;
  role: string;
  affiliateCode: string;
  referralCount: number;
  referralEarnings: number;
  gameHistory: {
    id: string;
    gameType: string;
    cost: number;
    points: number;
    won: boolean;
    createdAt: string;
    prizes: {
      prize: {
        name: string;
        image: string;
      };
    }[];
  }[];
  transactions: {
    id: string;
    amount: number;
    points: number;
    type: 'DEPOSIT' | 'WITHDRAWAL';
    status: string;
    provider: string;
    createdAt: string;
  }[];
  notifications: {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }[];
  dailyRewards: {
    id: string;
    streakDay: number;
    pointsAwarded: number;
    claimedAt: string;
  }[];
  tournaments: {
    id: string;
    name: string;
    status: string;
    score: number;
  }[];
}

interface LoginHistory {
  id: string;
  device: string;
  location: string;
  timestamp: string;
}

interface Tournament {
  id: string;
  name: string;
  participants: number;
  prize: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS';
}

interface LeaderboardPlayer {
  id: string;
  name: string;
  points: number;
  winRate: number;
}

const REGION_CONFIG = {
  AFRIQUE_NOIRE: {
    countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD'],
    currency: 'XOF',
    pointsPerPlay: 3,
    costPerPlay: 300,
  },
  AFRIQUE_BLANCHE: {
    countries: ['MA', 'DZ', 'TN'],
    currency: 'XOF',
    pointsPerPlay: 3,
    costPerPlay: 500,
  },
  EUROPE: {
    countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB'],
    currency: 'EUR',
    pointsPerPlay: 3,
    costPerPlay: 2,
  },
  ASIE: {
    countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG'],
    currency: 'USD',
    pointsPerPlay: 3,
    costPerPlay: 2,
  },
};

export default function Dashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
  });
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [activeTournaments, setActiveTournaments] = useState<Tournament[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      setUserData(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        country: data.country || '',
      });
      setImagePreview(data.image);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('country', formData.country);
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          image: data.image,
        },
      });

      setSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
      fetchUserData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleNotification = (type: 'email' | 'push') => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [type]: !prevNotifications[type],
    }));
  };

  const joinTournament = async (tournamentId: string) => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la participation au tournoi');
      }

      setActiveTournaments((prevTournaments) =>
        prevTournaments.map((tournament) =>
          tournament.id === tournamentId ? { ...tournament, status: 'IN_PROGRESS' } : tournament
        )
      );
    } catch (error) {
      console.error('Erreur lors de la participation au tournoi:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du dashboard */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/auth/logout')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation des onglets */}
        <div className="flex space-x-4 mb-8">
          {['overview', 'games', 'payments', 'rewards', 'settings', 'tournaments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-yellow-500 text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab === 'overview' && 'Vue d\'ensemble'}
              {tab === 'games' && 'Jeux'}
              {tab === 'payments' && 'Paiements'}
              {tab === 'rewards' && 'Récompenses'}
              {tab === 'settings' && 'Paramètres'}
              {tab === 'tournaments' && 'Tournois'}
            </button>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="space-y-8">
          {/* Contenu basé sur l'onglet actif */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-400">Points totaux</h3>
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-white">{userData?.points || 0}</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-400">Parties jouées</h3>
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-white">{userData?.gameHistory?.length || 0}</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-400">Prix gagnés</h3>
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m8-12v24m8-12l-4-4m4 4l-4 4" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {userData?.gameHistory?.filter(game => game.won).length || 0}
                  </p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-400">Niveau</h3>
                    <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {Math.floor((userData?.points || 0) / 1000) + 1}
                  </p>
                </div>
              </div>

              {/* Graphiques et statistiques */}
              <StatsOverview />

              {/* Dernières parties */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Dernières parties</h2>
                <div className="space-y-4">
                  {userData?.gameHistory?.slice(0, 5).map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          game.won ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          <svg className={`w-5 h-5 ${game.won ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{game.gameType}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${game.won ? 'text-green-500' : 'text-red-500'}`}>
                          {game.won ? '+' : '-'}{game.points} points
                        </p>
                        <p className="text-sm text-gray-400">{game.cost} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Récompenses quotidiennes */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Récompenses quotidiennes</h2>
                <div className="grid grid-cols-7 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    const reward = userData?.dailyRewards?.find(r => r.streakDay === day);
                    return (
                      <div key={day} className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
                        reward ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-gray-700/50 border-gray-700'
                      } border`}>
                        <span className="text-sm font-medium text-white">Jour {day}</span>
                        <span className="text-xs text-gray-400">{day * 10} points</span>
                        {reward && (
                          <svg className="w-4 h-4 text-yellow-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-8">
              {/* Games content */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Game cards */}
                {['Bingo Classique', 'Bingo Rapide', 'Bingo VIP'].map((game) => (
                  <div key={game} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{game}</h3>
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Prix</span>
                        <span className="text-yellow-500 font-medium">300 FCFA</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Points gagnés</span>
                        <span className="text-green-500 font-medium">3 points</span>
                      </div>
                      <button className="w-full bg-yellow-500 text-gray-900 font-medium py-2 rounded-lg hover:bg-yellow-400 transition-colors">
                        Jouer maintenant
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Historique des parties */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Historique des parties</h2>
                <div className="space-y-4">
                  {userData?.gameHistory?.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          game.won ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          <svg className={`w-5 h-5 ${game.won ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{game.gameType}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${game.won ? 'text-green-500' : 'text-red-500'}`}>
                          {game.won ? '+' : '-'}{game.points} points
                        </p>
                        <p className="text-sm text-gray-400">{game.cost} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              {/* Solde et points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold text-white mb-4">Solde</h2>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Points disponibles</span>
                    <span className="text-2xl font-bold text-white">{userData?.points || 0}</span>
                  </div>
                  <div className="mt-4 space-y-4">
                    <button className="w-full bg-yellow-500 text-gray-900 font-medium py-2 rounded-lg hover:bg-yellow-400 transition-colors">
                      Convertir en argent
                    </button>
                    <button className="w-full bg-gray-700 text-white font-medium py-2 rounded-lg hover:bg-gray-600 transition-colors">
                      Acheter des points
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold text-white mb-4">Méthodes de paiement</h2>
                  <div className="space-y-4">
                    <button className="w-full bg-gray-700 text-white font-medium py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                      <CreditCardIcon className="w-5 h-5" />
                      <span>Ajouter une carte</span>
                    </button>
                    <button className="w-full bg-gray-700 text-white font-medium py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Ajouter un compte bancaire</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Historique des transactions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Historique des transactions</h2>
                <div className="space-y-4">
                  {userData?.transactions?.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'DEPOSIT' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          <svg className={`w-5 h-5 ${transaction.type === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">
                            {transaction.type === 'DEPOSIT' ? 'Dépôt' : 'Retrait'}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.type === 'DEPOSIT' ? '+' : '-'}{transaction.amount} FCFA
                        </p>
                        <p className="text-sm text-gray-400">{transaction.points} points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-8">
              {/* Programme d'affiliation */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Programme d'affiliation</h2>
                <div className="space-y-6">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">Comment ça marche ?</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Invitez vos amis à rejoindre Bingoo
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Gagnez 10% sur leurs achats de points
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Gagnez 5% sur leurs gains
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">Votre code d'affiliation</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-800 rounded-lg p-3">
                        <p className="text-yellow-500 font-mono text-lg">{userData?.affiliateCode || 'Génération en cours...'}</p>
                      </div>
                      <button className="bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
                        Copier
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">Vos gains d'affiliation</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Gains totaux</p>
                        <p className="text-2xl font-bold text-white">{userData?.referralEarnings || 0} FCFA</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Parrainages</p>
                        <p className="text-2xl font-bold text-white">{userData?.referralCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Succès */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Succès</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Premier pas', description: 'Jouez votre première partie', points: 100 },
                    { name: 'Chanceux', description: 'Gagnez 3 parties consécutives', points: 500 },
                    { name: 'Expert', description: 'Atteignez 1000 points', points: 1000 },
                    { name: 'VIP', description: 'Jouez 50 parties', points: 2000 },
                    { name: 'Champion', description: 'Gagnez un tournoi', points: 5000 },
                    { name: 'Légende', description: 'Atteignez le niveau 10', points: 10000 },
                  ].map((achievement) => (
                    <div key={achievement.name} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">{achievement.name}</h3>
                        <span className="text-yellow-500 font-medium">+{achievement.points}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                      <div className="mt-4">
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              {/* Profil */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Profil</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Photo de profil"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{userData?.name}</h3>
                      <p className="text-gray-400">{userData?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-400 mb-1">
                        Pays
                      </label>
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="">Sélectionnez votre pays</option>
                        {Object.entries(REGION_CONFIG).map(([region, config]) => (
                          <optgroup key={region} label={region.replace('_', ' ')}>
                            {config.countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  {success && (
                    <div className="text-green-500 text-sm">{success}</div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </form>
              </div>

              {/* Sécurité */}
              <TwoFactorAuth />

              {/* Préférences de notifications */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Préférences de notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">Notifications par email</label>
                    <button
                      onClick={() => handleToggleNotification('email')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notifications.email ? 'bg-yellow-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">Notifications push</label>
                    <button
                      onClick={() => handleToggleNotification('push')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notifications.push ? 'bg-yellow-500' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Journal des connexions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Journal des connexions</h2>
                <div className="space-y-4">
                  {loginHistory.map((login) => (
                    <div key={login.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{login.device}</p>
                        <p className="text-sm text-gray-400">{login.location}</p>
                      </div>
                      <p className="text-sm text-gray-400">{new Date(login.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ajout du nouvel onglet Tournois */}
          {activeTab === 'tournaments' && (
            <div className="space-y-8">
              {/* Tournois en cours */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Tournois en cours</h2>
                <div className="space-y-4">
                  {activeTournaments.map((tournament) => (
                    <div key={tournament.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">{tournament.name}</h3>
                        <p className="text-sm text-gray-400">
                          {tournament.participants} participants • Prix: {tournament.prize}
                        </p>
                      </div>
                      <button
                        onClick={() => joinTournament(tournament.id)}
                        className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
                      >
                        Rejoindre
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Classement */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Classement global</h2>
                <div className="space-y-2">
                  {leaderboard.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className={`text-lg font-bold ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-300' :
                          index === 2 ? 'text-yellow-700' :
                          'text-gray-400'
                        }`}>#{index + 1}</span>
                        <div>
                          <p className="text-white font-medium">{player.name}</p>
                          <p className="text-sm text-gray-400">{player.points} points</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-500 font-medium">{player.winRate}%</p>
                        <p className="text-sm text-gray-400">Taux de victoire</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}