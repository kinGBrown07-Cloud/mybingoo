'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSupabase } from '@/providers/SupabaseProvider';
import { THEMES } from '@/config/themes';

export default function ThemePage({ params }: { params: { themeId: string } }) {
  const router = useRouter();
  const { user } = useSupabase();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Trouver le thème correspondant
  const theme = Object.values(THEMES).find(t => t.id === params.themeId);

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
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Thème non trouvé
            </h1>
            <button
              onClick={() => router.back()}
              className="bg-yellow-400 text-red-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !userData) return null;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {theme.name}
          </h1>
          <p className="text-yellow-400 text-lg">
            {theme.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Carte Points */}
          <div className="bg-red-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
            <h2 className="text-xl font-semibold text-white mb-4">Vos Points</h2>
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-3xl font-bold">
                {userData.points || 0}
              </span>
              <button 
                className="bg-yellow-400 text-red-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                onClick={() => router.push('/play/buy')}
              >
                Acheter des points
              </button>
            </div>
          </div>

          {/* Carte Lots */}
          <div className="bg-red-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
            <h2 className="text-xl font-semibold text-white mb-4">Lots à gagner</h2>
            <div className="space-y-2">
              {theme.prizes.map((prize, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-white">{prize}</span>
                  <span className="text-yellow-400">★</span>
                </div>
              ))}
            </div>
          </div>

          {/* Carte Jouer */}
          <div className="bg-red-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
            <h2 className="text-xl font-semibold text-white mb-4">Jouer</h2>
            <p className="text-yellow-400/70 mb-4">
              Vous avez {userData.points || 0} points disponibles
            </p>
            <button 
              className="w-full bg-yellow-400 text-red-900 px-4 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!userData.points || userData.points < 2}
              onClick={() => router.push(`/game?theme=${theme.id}`)}
            >
              {userData.points >= 2 ? 'Commencer une partie' : 'Points insuffisants'}
            </button>
          </div>
        </div>

        {/* Section des règles */}
        <div className="mt-12 bg-red-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Règles du jeu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Comment jouer</h3>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Chaque partie coûte 2 points</li>
                <li>Sélectionnez les numéros de votre choix</li>
                <li>Cliquez sur &quot;Jouer&quot; pour lancer la partie</li>
                <li>Si vos numéros correspondent, vous gagnez !</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Prix à gagner</h3>
              <ul className="list-disc list-inside text-white space-y-2">
                {theme.prizes.slice(0, 4).map((prize, index) => (
                  <li key={index}>{prize}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
