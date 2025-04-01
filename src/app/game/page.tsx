'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useSession } from '@/providers/SessionProvider';
import { THEMES } from '@/config/themes';

interface UserData {
  points: number;
  GameHistory?: Array<{
    id: string;
    createdAt: string;
    game: {
      won: boolean;
    };
  }>;
}

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Récupérer le thème depuis l'URL
  const themeId = searchParams?.get('theme') || 'kit-alimentaire';
  const theme = Object.values(THEMES).find(t => t.id === themeId);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user || !userData || !theme) {
    if (!user) {
      router.push('/auth/login');
    }
    return null;
  }

  const handleSpin = () => {
    if (!userData?.points || userData.points < 2) {
      alert('Vous n\'avez pas assez de points pour jouer !');
      return;
    }
    setIsSpinning(true);
    // TODO: Implement game logic with theme
    setTimeout(() => {
      setIsSpinning(false);
      setUserData((prev: UserData | null) => {
        if (!prev) return null;
        return { ...prev, points: prev.points - 2 }; // Chaque partie coûte 2 points
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec points et navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-red-800/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-yellow-400/20">
              <span className="text-xl font-bold text-yellow-400">Points: {userData.points}</span>
            </div>
            <button
              onClick={() => router.push('/play/buy')}
              className="bg-yellow-400 text-red-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors"
            >
              Acheter des points
            </button>
          </div>
          <nav className="flex space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
            >
              <span>Tableau de bord</span>
            </Link>
            <Link
              href="/play/tickets"
              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
            >
              <span>Mes tickets</span>
            </Link>
          </nav>
        </div>

        {/* Zone de jeu principale */}
        <div className="bg-red-800/50 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{theme.name}</h1>
            <p className="text-yellow-400">{theme.description}</p>
          </div>

          <div className="aspect-square relative bg-red-900/50 rounded-full flex items-center justify-center mb-8 max-w-2xl mx-auto">
            <div className={`absolute inset-0 ${isSpinning ? 'animate-spin' : ''}`}>
              {/* TODO: Ajouter les éléments de la roue avec les lots du thème */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl text-yellow-400">?</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSpin}
              disabled={isSpinning || userData.points < 2}
              className="bg-yellow-400 text-red-900 px-8 py-4 rounded-xl font-bold text-xl hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSpinning ? 'En cours...' : 'Jouer (2 points)'}
            </button>
          </div>

          {/* Liste des lots à gagner */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Lots à gagner</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {theme.prizes.map((prize, index) => (
                <div
                  key={index}
                  className="bg-red-900/30 rounded-lg p-4 text-center"
                >
                  <span className="text-yellow-400">{prize}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
