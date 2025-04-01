'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DashboardNav from '@/components/dashboard/DashboardNav';
import ResponsiveChart from '@/components/dashboard/ResponsiveChart';
import ResponsiveTable from '@/components/dashboard/ResponsiveTable';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TwoFactorAuth from '@/components/auth/TwoFactorAuth';
import PaymentMethods from '@/components/payment/PaymentMethods';
import BuyPoints from '@/components/payment/BuyPoints';
import GamesList from '@/components/games/GamesList';
import { useDataCache } from '@/hooks/useDataCache';
import { REGION_CONFIG, type RegionKey, type CountryCode } from '@/config/regions';
import { formatGameHistoryData, formatTransactionData } from '@/utils/chartHelpers';
import { UserData, Tournament, LeaderboardPlayer } from '@/types/user';

interface LoginHistory {
  id: string;
  device: string;
  location: string;
  timestamp: string;
}

const supabase = createClientComponentClient();

function isValidCountry(country: string): country is CountryCode {
  return Object.values(REGION_CONFIG).some(region => 
    region.countries.includes(country as CountryCode)
  );
}

function getRegionByCountry(country: string): RegionKey {
  if (!isValidCountry(country)) return 'EUROPE';

  for (const [region, config] of Object.entries(REGION_CONFIG)) {
    if (config.countries.includes(country as CountryCode)) {
      return region as RegionKey;
    }
  }

  return 'EUROPE';
}

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
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

  // Préparation des données pour les graphiques
  const gameHistoryChartData = userData?.gameHistory 
    ? formatGameHistoryData(userData.gameHistory)
    : { labels: [], datasets: [] };

  const transactionChartData = userData?.transactions
    ? formatTransactionData(userData.transactions)
    : { labels: [], datasets: [] };

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }
      setUser(session.user);

      try {
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router, supabase]);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        country: userData.country || '',
      });
      if (userData.image) {
        setImagePreview(userData.image);
      }
    }
  }, [userData]);

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

      await supabase.auth.updateUser({
        data: {
          name: formData.name,
          image: data.image,
        }
      });

      setSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
      
      // Forcer le rafraîchissement des données
      await fetchUserData();
      
      // Forcer le rafraîchissement de la page
      router.refresh();
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

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Désactiver le cache
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        // Mettre à jour l'aperçu de l'image si elle existe
        if (data.image) {
          setImagePreview(data.image);
        }
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAffiliate = () => {
    if (userData?.affiliateCode) {
      navigator.clipboard.writeText(userData.affiliateCode)
        .then(() => {
          setSuccess('Code d\'affiliation copié !');
          setTimeout(() => setSuccess(''), 3000);
        })
        .catch(() => {
          setError('Erreur lors de la copie du code');
          setTimeout(() => setError(''), 3000);
        });
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
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="md:ml-64 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsOverview userData={userData} />
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ResponsiveChart
              data={gameHistoryChartData}
              title="Historique des parties"
              height={300}
            />
            <ResponsiveChart
              data={transactionChartData}
              title="Historique des transactions"
              height={300}
            />
          </div>

          {/* Historique des transactions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Dernières transactions</h3>
            <ResponsiveTable
              columns={[
                {
                  key: 'createdAt',
                  label: 'Date',
                  priority: 1,
                  render: (value) => new Date(value as string).toLocaleDateString()
                },
                { key: 'type', label: 'Type', priority: 1 },
                {
                  key: 'amount',
                  label: 'Montant',
                  priority: 1,
                  render: (value) => `${value} ${userData?.currency || 'EUR'}`
                },
                { key: 'status', label: 'Statut', priority: 2 },
                { key: 'provider', label: 'Fournisseur', priority: 3 }
              ]}
              data={userData?.transactions || []}
              itemsPerPage={5}
            />
          </div>

          {/* Liste des parties */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Parties récentes</h3>
            <ResponsiveTable
              columns={[
                {
                  key: 'createdAt',
                  label: 'Date',
                  priority: 1,
                  render: (value) => new Date(value as string).toLocaleDateString()
                },
                { key: 'gameType', label: 'Type', priority: 1 },
                {
                  key: 'points',
                  label: 'Points',
                  priority: 1,
                  render: (value) => `${value} pts`
                },
                {
                  key: 'won',
                  label: 'Résultat',
                  priority: 2,
                  render: (value) => value ? '🏆 Gagné' : '❌ Perdu'
                },
                {
                  key: 'prizes',
                  label: 'Prix gagné',
                  priority: 3,
                  render: (value) => {
                    const prizes = value as { prize: { name: string } }[];
                    return prizes.length > 0
                      ? prizes.map(p => p.prize.name).join(', ')
                      : '-';
                  }
                }
              ]}
              data={userData?.gameHistory || []}
              itemsPerPage={5}
            />
          </div>

          {/* Tournois actifs */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Tournois actifs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData?.tournaments?.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold">{tournament.name}</h4>
                  <p className="text-sm text-gray-600">Score: {tournament.score}</p>
                  <span className={`
                    inline-block px-2 py-1 text-xs rounded-full mt-2
                    ${tournament.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                    {tournament.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-4">
              {userData?.notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-4 rounded-lg border
                    ${notification.isRead ? 'bg-white' : 'bg-orange-50 border-orange-200'}
                  `}
                >
                  <p className="text-sm">{notification.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}