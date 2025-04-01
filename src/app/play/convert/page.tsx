'use client';

import { useState } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { CurrencyEuroIcon } from '@heroicons/react/24/outline';

export default function ConvertPage() {
  const { user, loading } = useSession();
  const [points, setPoints] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // router.push('/auth/login');
    // return null;
    return (
      <div className="text-center">
        <p className="text-black mb-4">
          Connectez-vous pour convertir vos points
        </p>
        <a
          href="/auth/signin"
          className="text-green-600 hover:text-green-700 font-semibold"
        >
          Se connecter
        </a>
      </div>
    );
  }

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      // TODO: Implémenter la logique de conversion des points
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Points convertis avec succès !');
    } catch (error) {
      console.error('Erreur lors de la conversion des points:', error);
      alert('Une erreur est survenue lors de la conversion des points.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center mb-8">
            <CurrencyEuroIcon className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-6 text-black">
            Convertir des points
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Points à convertir
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setPoints(prev => Math.max(3, prev - 3))}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-green-50 text-black"
                >
                  -3
                </button>
                <span className="text-xl font-semibold text-black">{points}</span>
                <button
                  onClick={() => setPoints(prev => prev + 3)}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-green-50 text-black"
                >
                  +3
                </button>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-black">Taux de conversion</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Points</span>
                  <span className="text-black">{points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Taux</span>
                  <span className="text-black">3 points = 500 XOF</span>
                </div>
                <div className="border-t border-green-200 pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-black">Valeur</span>
                    <span className="text-black">{Math.round((points / 3) * 500)} XOF</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleConvert}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading ? 'Traitement en cours...' : 'Convertir les points'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}