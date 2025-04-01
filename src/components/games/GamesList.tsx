import React from 'react';
import GameCard from './GameCard';
import { useRouter } from 'next/navigation';

const GAMES = [
  {
    id: 'food',
    title: 'Kit Alimentaire',
    description: 'Gagnez un kit alimentaire complet pour votre famille',
    category: 'food' as const,
    points: 2,
  },
  {
    id: 'clothing',
    title: 'Habillement',
    description: 'Des vêtements et accessoires de luxe à gagner',
    category: 'clothing' as const,
    points: 2,
  },
  {
    id: 'super',
    title: 'Super Lot',
    description: 'Les plus gros lots à gagner (voiture, moto, etc)',
    category: 'super' as const,
    points: 2,
  }
];

interface GamesListProps {
  userRegion?: string;
}

export default function GamesList({ userRegion = 'AFRIQUE_NOIRE' }: GamesListProps) {
  const router = useRouter();

  const getCurrencyAndPrice = (region: string) => {
    switch (region) {
      case 'AFRIQUE_NOIRE':
        return { currency: 'FCFA', price: 300 };
      case 'AFRIQUE_BLANCHE':
        return { currency: 'EUR', price: 1 };
      case 'EUROPE':
        return { currency: 'EUR', price: 2 };
      case 'ASIE':
      case 'AMERIQUE':
        return { currency: 'USD', price: 2 };
      default:
        return { currency: 'EUR', price: 2 };
    }
  };

  const { currency, price } = getCurrencyAndPrice(userRegion);

  const handlePlay = (gameId: string) => {
    router.push(`/play?type=${gameId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {GAMES.map((game) => (
        <GameCard
          key={game.id}
          title={game.title}
          description={game.description}
          price={price}
          currency={currency}
          points={game.points}
          category={game.category}
          onPlay={() => handlePlay(game.id)}
        />
      ))}
    </div>
  );
}
