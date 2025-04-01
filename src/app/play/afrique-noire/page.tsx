'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSupabase } from '@/providers/SupabaseProvider';
import { THEMES } from '@/config/themes';

export default function AfriqueNoire() {
  const router = useRouter();
  const { user } = useSupabase();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('kit-alimentaire');

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

  if (!user || !userData) return null;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Bingoo Afrique Noire
          </h1>
          <p className="text-yellow-400 text-lg">
            2 points par partie - 300 XOF
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

          {/* Carte Historique */}
          <div className="bg-red-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
            <h2 className="text-xl font-semibold text-white mb-4">Historique</h2>
            <div className="space-y-2">
              {userData.GameHistory && userData.GameHistory.length > 0 ? (
                userData.GameHistory.slice(0, 5).map((game: any) => (
                  <div 
                    key={game.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-white">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </span>
                    <span className={game.game.won ? 'text-green-400' : 'text-red-400'}>
                      {game.game.won ? 'Gagné' : 'Perdu'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-yellow-400/70">Aucune partie jouée</p>
              )}
            </div>
          </div>

          {/* Carte Jouer */}
          <div className="bg-red-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
            <h2 className="text-xl font-semibold text-white mb-4">Jouer</h2>
            <div className="mb-4">
              <label htmlFor="theme" className="block text-white text-sm font-medium mb-2">
                Choisir un thème
              </label>
              <select
                id="theme"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full bg-red-800/30 text-white border border-yellow-400/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {Object.values(THEMES).map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-yellow-400/70 mb-4">
              Vous avez {userData.points || 0} points disponibles
            </p>
            <button 
              className="w-full bg-yellow-400 text-red-900 px-4 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!userData.points || userData.points < 2}
              onClick={() => router.push(`/game?theme=${selectedTheme}`)}
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
                <li>Chaque partie coûte 2 points (300 XOF)</li>
                <li>Sélectionnez les numéros de votre choix</li>
                <li>Cliquez sur &quot;Jouer&quot; pour lancer la partie</li>
                <li>Si vos numéros correspondent, vous gagnez !</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Prix à gagner</h3>
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Lots quotidiens</li>
                <li>Super lots hebdomadaires</li>
                <li>Bonus de points</li>
                <li>Et bien plus encore !</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
