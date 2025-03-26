'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface Prize {
  id: string;
  name: string;
  description: string;
  image: string;
  value: number;
  category: string;
  available: boolean;
}

export default function CurrentPrizesPage() {
  const { data: session } = useSession();
  const [featuredPrize, setFeaturedPrize] = useState<Prize | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPrize = async () => {
      try {
        const response = await fetch('/api/games');
        const data = await response.json();
        // Prendre le premier prix disponible comme prix en vedette
        setFeaturedPrize(data.find((prize: Prize) => prize.available) || null);
      } catch (error) {
        console.error('Erreur lors de la récupération du prix en vedette:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPrize();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <StarIcon className="h-16 w-16 text-yellow-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          Prix en Vedette
        </h1>

        {isLoading ? (
          <div className="text-center text-black">Chargement...</div>
        ) : featuredPrize ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/prizes/current/motorcycle.png"
                alt={featuredPrize.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-4 text-black">{featuredPrize.name}</h3>
              <p className="text-black mb-6">{featuredPrize.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-black">{featuredPrize.value} points</span>
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                  Prix en Vedette
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-black">
            Aucun prix en vedette disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
} 