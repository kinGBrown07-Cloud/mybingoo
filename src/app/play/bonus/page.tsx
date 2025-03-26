'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function BonusPointsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleClaimBonus = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      // TODO: Implémenter la logique de réclamation des points bonus
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Points bonus réclamés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la réclamation des points bonus:', error);
      alert('Une erreur est survenue lors de la réclamation des points bonus.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center mb-8">
            <SparklesIcon className="h-16 w-16 text-yellow-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-6 text-black">
            Points Bonus
          </h1>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-black">Bonus Quotidien</h3>
              <p className="text-black mb-4">
                Revenez chaque jour pour réclamer vos points bonus quotidiens !
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Points bonus</span>
                  <span className="font-semibold text-black">5 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Prochain bonus</span>
                  <span className="font-semibold text-black">Dans 24h</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-black">Bonus de Fidélité</h3>
              <p className="text-black mb-4">
                Plus vous jouez, plus vous gagnez de points bonus !
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Niveau actuel</span>
                  <span className="font-semibold text-black">Bronze</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Bonus de niveau</span>
                  <span className="font-semibold text-black">+1 point</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Prochain niveau</span>
                  <span className="font-semibold text-black">Argent (après 5 achats)</span>
                </div>
              </div>
            </div>

            {session ? (
              <button
                onClick={handleClaimBonus}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {isLoading ? 'Traitement en cours...' : 'Réclamer mes points bonus'}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-black mb-4">
                  Connectez-vous pour réclamer vos points bonus
                </p>
                <a
                  href="/auth/signin"
                  className="text-yellow-600 hover:text-yellow-700 font-semibold"
                >
                  Se connecter
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 