'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import BuyPointsModal from './BuyPointsModal';
import GameBoard from './GameBoard';
import { GiftIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pointValue: number;
  category: 'FOOD' | 'CLOTHING' | 'SUPER';
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

const GAME_COST = 1; // Coût uniforme de 1 point par carte

export default function TombolaGame() {
  const supabase = createClientComponentClient();
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gameConfig, setGameConfig] = useState({
    maxTries: 3,
    gameType: 'FOOD' as Prize['category']
  });

  useEffect(() => {
    fetchPrizes();
    fetchUserPoints();
  }, []);

  const fetchUserPoints = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: userData } = await supabase
          .from('users')
          .select('points')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          setUserPoints(userData.points || 0);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des points:', error);
    }
  };

  const fetchPrizes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('prizes')
        .select('*')
        .eq('category', gameConfig.gameType)
        .eq('available', true);

      if (error) throw error;
      setPrizes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des lots:', error);
      toast.error('Erreur lors du chargement des lots');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameEnd = async (won: boolean, prize?: Prize) => {
    if (!prize) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('Vous devez être connecté pour jouer');
        return;
      }

      if (won) {
        // Mettre à jour les points de l'utilisateur avec les points gagnés
        const { error: pointsError } = await supabase.rpc('add_points', {
          p_user_id: session.user.id,
          p_points: prize.pointValue
        });

        if (pointsError) throw pointsError;

        // Enregistrer la victoire
        const { error: winError } = await supabase
          .from('game_wins')
          .insert({
            userId: session.user.id,
            prizeId: prize.id,
            category: gameConfig.gameType,
            pointsWon: prize.pointValue
          });

        if (winError) throw winError;

        toast.success(`Félicitations ! Vous avez gagné ${prize.pointValue} points !`);
        fetchUserPoints(); // Rafraîchir les points
      }

      setIsPlaying(false);
    } catch (error) {
      console.error('Erreur lors de la fin du jeu:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const startGame = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error('Vous devez être connecté pour jouer');
        return;
      }

      if (userPoints < GAME_COST) {
        setIsModalOpen(true);
        return;
      }

      // Déduire le coût du jeu
      const { error: pointsError } = await supabase.rpc('subtract_points', {
        p_user_id: session.user.id,
        p_points: GAME_COST
      });

      if (pointsError) throw pointsError;

      setIsPlaying(true);
      fetchUserPoints(); // Rafraîchir les points
    } catch (error) {
      console.error('Erreur lors du démarrage du jeu:', error);
      toast.error('Une erreur est survenue');
    }
  };

  const handleCategoryChange = (category: Prize['category']) => {
    setGameConfig(prev => ({ ...prev, gameType: category }));
    fetchPrizes();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!isPlaying ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Bingoo Tombola</h1>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-medium text-white">{userPoints} points</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleCategoryChange('FOOD')}
              className={`p-4 rounded-xl border ${
                gameConfig.gameType === 'FOOD'
                  ? 'bg-yellow-500 border-yellow-600 text-gray-900'
                  : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              }`}
            >
              <GiftIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Kits Alimentaires</div>
            </button>

            <button
              onClick={() => handleCategoryChange('CLOTHING')}
              className={`p-4 rounded-xl border ${
                gameConfig.gameType === 'CLOTHING'
                  ? 'bg-yellow-500 border-yellow-600 text-gray-900'
                  : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              }`}
            >
              <GiftIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Habillements</div>
            </button>

            <button
              onClick={() => handleCategoryChange('SUPER')}
              className={`p-4 rounded-xl border ${
                gameConfig.gameType === 'SUPER'
                  ? 'bg-yellow-500 border-yellow-600 text-gray-900'
                  : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              }`}
            >
              <GiftIcon className="w-6 h-6 mx-auto mb-2" />
              <div className="font-medium">Super Lots</div>
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Comment jouer</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Chaque partie coûte {GAME_COST} point</li>
              <li>• Retournez les cartes pour trouver des paires identiques</li>
              <li>• Trouvez toutes les paires avant d'épuiser vos essais</li>
              <li>• Gagnez des points selon la valeur du lot</li>
            </ul>
          </div>

          <button
            onClick={startGame}
            disabled={isLoading}
            className="w-full bg-yellow-500 text-gray-900 font-medium py-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Jouer ({GAME_COST} point)
          </button>
        </div>
      ) : (
        <GameBoard
          config={gameConfig}
          prizes={prizes}
          onGameEnd={handleGameEnd}
        />
      )}

      <BuyPointsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUserPoints}
      />
    </div>
  );
}
