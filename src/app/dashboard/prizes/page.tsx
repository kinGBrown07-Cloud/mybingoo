'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { GiftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

interface Prize {
  id: string;
  name: string;
  description: string;
  image: string;
  value: number;
  category: string;
  available: boolean;
}

interface UserPrize {
  id: string;
  prizeId: string;
  userId: string;
  claimed: boolean;
  claimedAt: string | null;
  prize: Prize;
}

export default function DashboardPrizesPage() {
  const { user, loading } = useSession();
  const router = useRouter();
  const [userPrizes, setUserPrizes] = useState<UserPrize[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  useEffect(() => {
    fetchUserPrizes();
  }, []);

  const fetchUserPrizes = async () => {
    try {
      const response = await fetch('/api/user/prizes');
      const data = await response.json();
      setUserPrizes(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des prix:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimPrize = async (id: string) => {
    try {
      const response = await fetch('/api/user/prizes/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        fetchUserPrizes();
      }
    } catch (error) {
      console.error('Erreur lors de la réclamation du prix:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <GiftIcon className="h-16 w-16 text-yellow-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Mes Prix Gagnés
        </h1>

        {isLoading ? (
          <div className="text-center text-black">Chargement...</div>
        ) : userPrizes.length === 0 ? (
          <div className="text-center text-black">
            Vous n'avez pas encore gagné de prix.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPrizes.map((userPrize) => (
              <div key={userPrize.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  {userPrize.prize.image ? (
                    <Image
                      src={userPrize.prize.image}
                      alt={userPrize.prize.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Pas d'image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {userPrize.prize.name}
                  </h3>
                  <p className="text-black mb-4">{userPrize.prize.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-black font-semibold">
                      {userPrize.prize.value} points
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      userPrize.claimed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {userPrize.claimed ? 'Retiré' : 'À retirer'}
                    </span>
                  </div>
                  {!userPrize.claimed && (
                    <button
                      onClick={() => handleClaimPrize(userPrize.id)}
                      className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Retirer le prix
                    </button>
                  )}
                  {userPrize.claimed && userPrize.claimedAt && (
                    <p className="text-sm text-gray-500 text-center">
                      Retiré le {new Date(userPrize.claimedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}