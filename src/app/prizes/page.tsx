'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { GiftIcon, StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // Remplace "image" par "imageUrl"
  value: number;
  category: string;
  available: boolean;
  color?: string;
}

export default function PrizesPage() {
  const { user, loading } = useSession();
  const router = useRouter();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'super', name: 'Super Lots', color: 'yellow' },
    { id: 'clothing', name: 'Habillement', color: 'red' },
    { id: 'food', name: 'Kits Alimentaires', color: 'emerald' }
  ];

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        // Ajouter les couleurs aux prix selon leur catégorie
        const prizesWithColors = data.map((prize: Prize) => ({
          ...prize,
          color: prize.category.toLowerCase().includes('super') ? 'yellow' :
                 prize.category.toLowerCase().includes('habillement') ? 'red' :
                 prize.category.toLowerCase().includes('alimentaire') ? 'emerald' : 'gray'
        }));
        setPrizes(prizesWithColors);
      } catch (error) {
        console.error('Erreur lors de la récupération des prix:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrizes();
  }, []);

  const filteredPrizes = selectedCategory
    ? prizes.filter(prize => prize.category.toLowerCase().includes(selectedCategory))
    : prizes;

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center mb-8"
        >
          <GiftIcon className="h-16 w-16 text-yellow-500" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-center mb-8 text-black"
        >
          Tous les Prix
        </motion.h1>

        {/* Filtres de catégories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              !selectedCategory
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? `bg-${category.color}-500 text-white shadow-lg`
                  : `bg-${category.color}-100 text-${category.color}-600 hover:bg-${category.color}-200`
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="text-center text-black">Chargement...</div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredPrizes.map((prize, index) => (
              <motion.div
                key={prize.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  {prize.imageUrl ? (
                    <Image
                      src={prize.imageUrl}
                      alt={prize.name}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <GiftIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className={`absolute top-4 right-4 ${
                    prize.color === 'yellow' ? 'bg-yellow-500' :
                    prize.color === 'red' ? 'bg-red-500' :
                    prize.color === 'emerald' ? 'bg-emerald-500' :
                    'bg-gray-500'
                  } rounded-full p-2 shadow-lg`}>
                    <StarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    prize.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    prize.color === 'red' ? 'bg-red-100 text-red-800' :
                    prize.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {prize.category}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">{prize.name}</h3>
                  <p className="text-black mb-4">{prize.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-black font-semibold">{prize.value} points</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      prize.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {prize.available ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}