'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Winner {
  id: string;
  name: string;
  prize: string;
  date: string;
  avatar?: string;
}

const mockWinners: Winner[] = [
  {
    id: '1',
    name: 'Marie Koné',
    prize: 'Moto Scooter',
    date: '2024-02-10',
    avatar: '/images/winner1.png'
  },
  {
    id: '2',
    name: 'Jean Traoré',
    prize: 'Kit Alimentaire',
    date: '2024-02-09',
    avatar: '/images/winner2.png'
  },
  {
    id: '3',
    name: 'Sophie Ouattara',
    prize: 'Montre',
    date: '2024-02-08',
    avatar: '/images/winner3.jpg'
  },
  {
    id: '4',
    name: 'Pierre Diarra',
    prize: 'Sac de Riz',
    date: '2024-02-07',
    avatar: '/images/testimonial-avatar.png'
  },
  {
    id: '5',
    name: 'Adama Keita',
    prize: 'Kit Alimentaire',
    date: '2024-02-06',
    avatar: '/images/avatar1.jpg'
  },
  {
    id: '6',
    name: 'Fatou Diallo',
    prize: 'Montre',
    date: '2024-02-05',
    avatar: '/images/avatar2.jpg'
  }
];

export default function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement asynchrone
    setTimeout(() => {
      setWinners(mockWinners);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-black mb-4">
            Nos Gagnants Heureux
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez les joueurs qui ont remporté des prix exceptionnels
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center text-black">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {winners.map((winner, index) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      {winner.avatar ? (
                        <Image
                          src={winner.avatar}
                          alt={winner.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-yellow-500 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {winner.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black">
                        {winner.name}
                      </h3>
                      <p className="text-gray-600">
                        {new Date(winner.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-yellow-800 font-medium">
                      Prix gagné : {winner.prize}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 