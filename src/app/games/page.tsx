'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Prize, GameConfig } from '@/types/game';
import GameBoard from '@/components/game/GameBoard';
import Image from 'next/image';
import { mockPrizes } from '@/data/mockPrizes';

const GAME_TYPES: { type: Prize['category']; title: string; description: string; cost: number }[] = [
  {
    type: 'FOOD',
    title: 'Jeu Gourmand',
    description: 'Trouvez des paires de délicieux lots gastronomiques !',
    cost: 1, // Chaque carte coûte 1 point
  },
  {
    type: 'CLOTHING',
    title: 'Jeu Fashion',
    description: 'Découvrez des paires de vêtements tendance !',
    cost: 1, // Chaque carte coûte 1 point
  },
  {
    type: 'SUPER',
    title: 'Super Jeu',
    description: 'Tentez de gagner des lots exceptionnels !',
    cost: 1, // Chaque carte coûte 1 point
  },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<Prize['category'] | null>(null);
  const [userPoints, setUserPoints] = useState(1000); // À remplacer par les points réels de l'utilisateur

  const handleGameSelect = (gameType: Prize['category']) => {
    const game = GAME_TYPES.find(g => g.type === gameType);
    if (!game || userPoints < game.cost) {
      alert('Points insuffisants !');
      return;
    }
    setSelectedGame(gameType);
    setUserPoints(prev => prev - game.cost);
  };

  const handleGameEnd = (won: boolean, prize?: Prize) => {
    if (won && prize) {
      setUserPoints(prev => prev + prize.pointValue);
    }
  };

  const gameConfig: GameConfig = {
    gameType: selectedGame || 'FOOD',
    cardCost: GAME_TYPES.find(g => g.type === selectedGame)?.cost || 100,
    maxTries: 10,
    winningCondition: 3,
    gridSize: 12,
    timeLimit: 60,
  };

  if (!selectedGame) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Choisissez votre jeu</h1>
        <div className="text-xl text-center mb-8">
          Points disponibles : {userPoints}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GAME_TYPES.map((game) => (
            <motion.div
              key={game.type}
              className={`p-6 rounded-xl shadow-lg ${
                userPoints >= game.cost
                  ? 'bg-white cursor-pointer hover:shadow-xl'
                  : 'bg-gray-100 opacity-50 cursor-not-allowed'
              }`}
              whileHover={userPoints >= game.cost ? { scale: 1.05 } : {}}
              onClick={() => handleGameSelect(game.type)}
            >
              <h2 className="text-2xl font-bold mb-2">{game.title}</h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Coût : {game.cost} points
                </span>
                {userPoints < game.cost && (
                  <span className="text-red-500">Points insuffisants</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {GAME_TYPES.find(g => g.type === selectedGame)?.title}
        </h1>
        <div className="text-xl">
          Points : {userPoints}
        </div>
      </div>
      <GameBoard
        config={gameConfig}
        prizes={mockPrizes}
        onGameEnd={handleGameEnd}
      />
      <button
        className="mt-8 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        onClick={() => setSelectedGame(null)}
      >
        Retour à la sélection
      </button>
    </div>
  );
}