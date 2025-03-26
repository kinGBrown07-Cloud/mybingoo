'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GamePage() {
  const [points, setPoints] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    if (points < 1) {
      alert('Vous n\'avez pas assez de points pour jouer !');
      return;
    }
    setIsSpinning(true);
    // TODO: Implement game logic
    setTimeout(() => {
      setIsSpinning(false);
      setPoints(prev => prev - 1); // Chaque carte coûte 1 point
    }, 3000);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header avec points et navigation */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-xl font-bold">Points: {points}</span>
          <button
            onClick={() => setPoints(prev => prev + 10)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Acheter des points
          </button>
        </div>
        <nav className="flex space-x-4">
          <Link href="/profile" className="text-white hover:text-gray-300">
            Profil
          </Link>
          <Link href="/history" className="text-white hover:text-gray-300">
            Historique
          </Link>
        </nav>
      </div>

      {/* Zone de jeu principale */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8">
        <div className="aspect-square relative bg-gray-700 rounded-full flex items-center justify-center mb-8">
          <div className={`absolute inset-0 ${isSpinning ? 'animate-spin' : ''}`}>
            {/* TODO: Ajouter les éléments de la roue */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold">🎁</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSpin}
            disabled={isSpinning || points < 1}
            className={`px-8 py-4 text-xl font-bold rounded-full ${
              isSpinning || points < 1
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isSpinning ? 'Tirage en cours...' : 'Tenter sa chance (1 point)'}
          </button>
        </div>
      </div>

      {/* Section des lots disponibles */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">Lots disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* TODO: Remplacer par les vrais lots depuis l'API */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6">
              <div className="aspect-video bg-gray-700 rounded mb-4"></div>
              <h3 className="text-xl font-bold mb-2">Lot #{i}</h3>
              <p className="text-gray-400">Description du lot...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
