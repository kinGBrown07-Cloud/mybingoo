'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { useSupabase } from '@/providers/SupabaseProvider';
import toast from 'react-hot-toast';

type RegionData = {
  region: string;
  devise: string;
  pointPrice: number;
};

export default function BuyPointsPage() {
  const router = useRouter();
  const { user } = useSupabase();
  const [amount, setAmount] = useState(2); // On commence par 2 points (= 1 partie)
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [regionData, setRegionData] = useState<RegionData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les données utilisateur
        const userResponse = await fetch('/api/user/profile');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData(userData);
        }

        // Récupérer les données de région
        const regionResponse = await fetch('/api/user/region');
        if (regionResponse.ok) {
          const regionData = await regionResponse.json();
          setRegionData(regionData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user) {
      fetchData();
    } else {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleBuy = async () => {
    if (!user || !regionData) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/points/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          region: regionData.region,
          devise: regionData.devise,
          totalPrice: amount * regionData.pointPrice
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'achat des points');
      }

      const data = await response.json();
      toast.success('Points achetés avec succès !');
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de l\'achat des points:', error);
      toast.error('Une erreur est survenue lors de l\'achat des points.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !userData || !regionData) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  const totalPrice = amount * regionData.pointPrice;
  const numberOfGames = Math.floor(amount / 2);

  // Formater le prix selon la devise
  const formatPrice = (price: number) => {
    switch (regionData.devise) {
      case 'XOF':
        return `${price} XOF`;
      case 'EUR':
        return `${price} €`;
      case 'USD':
        return `$${price}`;
      default:
        return `${price}`;
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-red-800/50 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
          <div className="flex items-center justify-center mb-8">
            <CurrencyDollarIcon className="h-16 w-16 text-yellow-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-6 text-white">
            Acheter des points
          </h1>
          
          <div className="space-y-6">
            <div className="bg-red-700/30 rounded-lg p-4 mb-6">
              <p className="text-white text-sm mb-2">Points actuels :</p>
              <p className="text-2xl font-bold text-yellow-400">{userData.points || 0} points</p>
              <p className="text-sm text-yellow-400/70 mt-1">
                {Math.floor((userData.points || 0) / 2)} partie(s) possible(s)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nombre de points à acheter
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAmount(prev => Math.max(2, prev - 2))}
                  className="px-3 py-1 border border-yellow-400/20 rounded-md hover:bg-red-700/50 text-white"
                  disabled={isLoading}
                >
                  -
                </button>
                <span className="text-xl font-semibold text-white">{amount}</span>
                <button
                  onClick={() => setAmount(prev => prev + 2)}
                  className="px-3 py-1 border border-yellow-400/20 rounded-md hover:bg-red-700/50 text-white"
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
              <p className="text-sm text-yellow-400/70 mt-2">
                {numberOfGames} partie(s)
              </p>
            </div>

            <div className="bg-red-700/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white">Prix par point :</span>
                <span className="text-yellow-400">{formatPrice(regionData.pointPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-white">Prix total :</span>
                <span className="text-yellow-400">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-sm text-yellow-400/70 mt-2">
                {amount} points = {numberOfGames} partie(s)
              </p>
            </div>

            <button
              onClick={handleBuy}
              disabled={isLoading}
              className="w-full bg-yellow-400 text-red-900 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Traitement en cours...' : 'Acheter maintenant'}
            </button>

            <p className="text-xs text-center text-yellow-400/70">
              Paiement sécurisé • Transaction instantanée
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}