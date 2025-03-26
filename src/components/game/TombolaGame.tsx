'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import BuyPointsModal from './BuyPointsModal';
import { GiftIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // Remplacez 'image' par 'imageUrl'
  pointValue: number;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

const GAME_COST = 1; // Coût uniforme de 1 point par carte

export default function TombolaGame() {
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchPrizes();
    if (session) {
      fetchUserPoints();
    }
  }, [session]);

  const fetchPrizes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/games');
      const data = await response.json();
      setPrizes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des lots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPoints = async () => {
    try {
      const response = await fetch('/api/users/points');
      const data = await response.json();
      setUserPoints(data.points);
    } catch (error) {
      console.error('Erreur lors du chargement des points:', error);
    }
  };

  const handlePrizeSelect = (prize: Prize) => {
    setSelectedPrize(prize);
  };

  const handlePlay = async () => {
    if (!selectedPrize || !session) return;

    if (userPoints < GAME_COST) {
      setIsModalOpen(true);
      return;
    }

    setIsPlaying(true);

    try {
      const response = await fetch('/api/games/play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prizeId: selectedPrize.id,
        }),
      });

      const result = await response.json();

      // Animation de tirage
      setTimeout(() => {
        setIsPlaying(false);
        if (result.won) {
          alert('🎉 Félicitations ! Vous avez gagné ' + selectedPrize.name + ' !');
        } else {
          alert('Pas de chance cette fois-ci. Réessayez !');
        }
        fetchUserPoints();
        fetchPrizes();
      }, 3000);

    } catch (error) {
      console.error('Erreur lors du tirage:', error);
      setIsPlaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Points Display */}
      {session && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Vos points</h2>
            <p className="text-3xl font-bold text-indigo-600">{userPoints} points</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Acheter des points
          </button>
        </div>
      )}

      {/* Prize Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {prizes.map((prize) => (
          <div
            key={prize.id}
            className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 transform hover:scale-105 ${
              selectedPrize?.id === prize.id ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => handlePrizeSelect(prize)}
          >
            <div className="relative h-48">
              <Image
                src={prize.imageUrl} // Utilisez 'imageUrl' ici
                alt={prize.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-sm font-medium text-indigo-600">
                {GAME_COST} points
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{prize.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{prize.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {prize.available ? 'Disponible' : 'Non disponible'}
                </span>
                <span className="text-gray-500">
                  Catégorie : {prize.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Prize Section */}
      {selectedPrize && (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <SparklesIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Lot sélectionné : {selectedPrize.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Coût : {GAME_COST} points
            </p>
            {session ? (
              <button
                onClick={handlePlay}
                disabled={isPlaying || userPoints < GAME_COST}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  isPlaying
                    ? 'bg-gray-400 cursor-not-allowed'
                    : userPoints < GAME_COST
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isPlaying ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                    Tirage en cours...
                  </>
                ) : userPoints < GAME_COST ? (
                  'Points insuffisants'
                ) : (
                  <>
                    <GiftIcon className="h-5 w-5 mr-2" />
                    Tenter sa chance
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500">
                  Connectez-vous pour participer au tirage
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Buy Points Modal */}
      <BuyPointsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchUserPoints();
        }}
      />
    </div>
  );
}
