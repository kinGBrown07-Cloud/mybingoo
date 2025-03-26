'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // Corrigez ici
  value: number;
  category: string;
}


export default function PlayPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState<number>(0);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [hasWon, setHasWon] = useState<boolean | null>(null);
  const [showBuyPoints, setShowBuyPoints] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [prizesResponse, pointsResponse] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/users/points')
        ]);
        
        const prizesData = await prizesResponse.json();
        const pointsData = await pointsResponse.json();
        
        setPrizes(prizesData);
        setPoints(pointsData.points || 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, router]);

  const handlePlay = async (prize: Prize) => {
    if (points < prize.value) {
      alert('Vous n\'avez pas assez de points pour jouer !');
      return;
    }

    setSelectedPrize(prize);
    setIsFlipping(true);

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prizeId: prize.id }),
      });

      const data = await response.json();
      setHasWon(data.won);
      
      // Mettre à jour les points après le jeu
      const pointsResponse = await fetch('/api/users/points');
      const pointsData = await pointsResponse.json();
      setPoints(pointsData.points || 0);
    } catch (error) {
      console.error('Erreur lors du jeu:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Section Héro */}
      <div className="relative h-[400px] w-full bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
          <div className="flex-1 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Jouer pour gagner
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Tentez votre chance et gagnez des lots exceptionnels !
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold text-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span>{points} points</span>
                </div>
              </div>
              <button
                onClick={() => setShowBuyPoints(true)}
                className="bg-white text-yellow-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <span className="text-2xl">💰</span>
                Acheter des points
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-[500px] h-[400px]">
              <Image
                src="/images/play.png"
                alt="Jeu"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section des prix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {prizes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Aucun prix disponible
            </h2>
            <p className="text-gray-600">
              Revenez plus tard pour découvrir de nouveaux lots !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prizes.map((prize) => (
              <motion.div
                key={prize.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-48">
                  <Image
                    src={prize.imageUrl}
                    alt={prize.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                    {prize.value} points
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {prize.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{prize.description}</p>
                  <button
                    onClick={() => handlePlay(prize)}
                    className={`w-full py-3 rounded-full transition-all duration-300 ${
                      points >= prize.value
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={isFlipping || points < prize.value}
                  >
                    {points >= prize.value ? 'Jouer maintenant' : 'Points insuffisants'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedPrize && isFlipping && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={selectedPrize.imageUrl}
                    alt={selectedPrize.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {hasWon ? '🎉' : '😢'}
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    {hasWon ? 'Félicitations !' : 'Dommage...'}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    {hasWon
                      ? `Vous avez gagné ${selectedPrize.name} !`
                      : 'Vous n\'avez pas gagné cette fois-ci. Réessayez !'}
                  </p>
                  <button
                    onClick={() => {
                      setIsFlipping(false);
                      setSelectedPrize(null);
                      setHasWon(null);
                    }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-full hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showBuyPoints && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">💰</div>
                  <h2 className="text-2xl font-bold">
                    Acheter des points
                  </h2>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      // TODO: Implémenter l'achat de points
                      setShowBuyPoints(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <span>100 points</span>
                    <span className="text-sm">-</span>
                    <span>10€</span>
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implémenter l'achat de points
                      setShowBuyPoints(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <span>500 points</span>
                    <span className="text-sm">-</span>
                    <span>45€</span>
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implémenter l'achat de points
                      setShowBuyPoints(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <span>1000 points</span>
                    <span className="text-sm">-</span>
                    <span>80€</span>
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implémenter l'achat de points
                      setShowBuyPoints(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <span>2000 points</span>
                    <span className="text-sm">-</span>
                    <span>150€</span>
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implémenter l'achat de points
                      setShowBuyPoints(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <span>5000 points</span>
                    <span className="text-sm">-</span>
                    <span>350€</span>
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implémenter l'achat de points
                      setShowBuyPoints(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-semibold flex items-center justify-center gap-2"
                  >
                    <span>10000 points</span>
                    <span className="text-sm">-</span>
                    <span>650€</span>
                  </button>
                </div>
                <button
                  onClick={() => setShowBuyPoints(false)}
                  className="w-full bg-gray-500 text-white py-4 rounded-full hover:bg-gray-600 transition-all duration-300 mt-6 text-lg font-semibold"
                >
                  Annuler
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
