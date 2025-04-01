'use client';

import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useState } from 'react';

export default function PlaySuperLotButton() {
  const router = useRouter();
  const { user } = useSupabase();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      // Vérifier les points de l'utilisateur
      const response = await fetch('/api/users/points');
      const data = await response.json();
      
      if (data.points >= 2) { // On suppose que chaque partie coûte 2 points
        // Rediriger vers le jeu avec le thème super lot
        router.push('/game?theme=super-lot');
      } else {
        // Rediriger vers la page d'achat de points
        router.push('/play/buy');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des points:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-yellow-400 hover:bg-yellow-300 text-red-900 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-900"></div>
          <span>Chargement...</span>
        </>
      ) : (
        <span>Jouer maintenant</span>
      )}
    </button>
  );
}
