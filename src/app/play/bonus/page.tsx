'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function BonusPointsPage() {
  const { user, loading } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleClaimBonus = async () => {
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
              <button
                onClick={handleClaimBonus}
                disabled={isLoading}
                className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {isLoading ? 'Chargement...' : 'Réclamer mon bonus'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}