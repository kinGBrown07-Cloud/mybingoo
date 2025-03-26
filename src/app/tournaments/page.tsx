'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TournamentCard from '@/components/tournaments/TournamentCard';
import { useDataCache } from '@/hooks/useDataCache';
import { toast } from 'react-hot-toast';

interface Tournament {
  id: string;
  name: string;
  participants: number;
  prize: string;
  prizeValue: number;
  status: string;
  startDate: string;
  endDate: string;
  entryFee: number;
}

export default function TournamentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userPoints, setUserPoints] = useState(0);

  const { data: tournaments, loading, refetch } = useDataCache<Tournament[]>(
    async () => {
      const response = await fetch('/api/tournaments');
      return response.json();
    },
    { key: 'tournaments', ttl: 60 } // 1 minute cache
  );

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserPoints();
    }
  }, [session]);

  const fetchUserPoints = async () => {
    try {
      const response = await fetch('/api/users/points');
      const data = await response.json();
      setUserPoints(data.points);
    } catch (error) {
      console.error('Erreur lors de la récupération des points:', error);
    }
  };

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      toast.success('Vous avez rejoint le tournoi avec succès !');
      setUserPoints(data.remainingPoints);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription au tournoi');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Accès restreint</h2>
            <p className="mt-4 text-lg text-gray-400">
              Connectez-vous pour accéder aux tournois
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-6 px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Tournois</h1>
            <p className="text-gray-400 mt-2">
              Participez à des tournois et gagnez des prix exceptionnels
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400">Vos points</p>
            <p className="text-2xl font-bold text-yellow-500">{userPoints}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 animate-pulse"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tournaments?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onJoin={handleJoinTournament}
                userPoints={userPoints}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-400">
              Aucun tournoi disponible pour le moment
            </h3>
            <p className="text-gray-500 mt-2">
              Revenez plus tard pour découvrir de nouveaux tournois
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
