'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import StatsOverview from '@/components/dashboard/StatsOverview';
import TwoFactorAuth from '@/components/auth/TwoFactorAuth';
import PaymentMethods from '@/components/payment/PaymentMethods';
import BuyPoints from '@/components/payment/BuyPoints';
import GamesList from '@/components/games/GamesList'; 
import { useDataCache } from '@/hooks/useDataCache';
import { REGION_CONFIG, type RegionKey, type CountryCode } from '@/config/regions';

interface UserData {
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
  region: {
    costPerPoint: number;
    pointsPerPlay: number;
    currency: string;
  };
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête du dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
            <p className="text-gray-400">Bienvenue, {userData?.name || 'Joueur'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-yellow-500 font-medium">Points</div>
              <div className="text-2xl font-bold text-white">{userData?.points || 0}</div>
            </div>
          </div>
        </div>

        {/* Navigation du dashboard */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-1 mb-8">
          <nav className="flex space-x-1">
            {['overview', 'games', 'payments', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-yellow-500 text-gray-900'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab === 'overview' && 'Vue d\'ensemble'}
                {tab === 'games' && 'Jeux'}
                {tab === 'payments' && 'Paiements'}
                {tab === 'settings' && 'Paramètres'}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <StatsOverview />
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Jeux disponibles</h2>
                <GamesList userRegion={userData?.region?.costPerPoint ? 'AFRIQUE_NOIRE' : 'EUROPE'} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Historique des parties</h2>
                {userData?.gameHistory && userData.gameHistory.length > 0 ? (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                    <div className="space-y-4">
                      {userData.gameHistory.map((game) => (
                        <div key={game.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                          <div>
                            <div className="text-white font-medium">{game.gameType}</div>
                            <div className="text-gray-400 text-sm">{new Date(game.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-yellow-500">{game.points} points</div>
                            <div className={`text-sm font-medium ${game.won ? 'text-green-500' : 'text-red-500'}`}>
                              {game.won ? 'Gagné' : 'Perdu'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    Aucune partie jouée pour le moment
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Méthodes de paiement</h2>
                <PaymentMethods 
                  amount={userData?.region?.costPerPoint ? userData.region.costPerPoint * 2 : 300}
                  currency={userData?.region?.currency || 'EUR'}
                  points={userData?.region?.pointsPerPlay || 2}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Acheter des points</h2>
                <BuyPoints />
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
                          <img
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
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
                      <button 
                        onClick={handleCopyAffiliate}
                        className="bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                      >
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

              {/* Sécurité */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">Sécurité</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Double authentification
                    </label>
                    <TwoFactorAuth />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}