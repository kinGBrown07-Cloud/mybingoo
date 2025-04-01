import React from 'react';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  description: string;
  price: number;
  currency: string;
  points: number;
  category: 'food' | 'clothing' | 'super';
  onPlay: () => void;
}

export default function GameCard({
  title,
  description,
  price,
  currency,
  points,
  category,
  onPlay
}: GameCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food':
        return 'bg-emerald-500';
      case 'clothing':
        return 'bg-red-500';
      case 'super':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'food':
        return 'Kit Alimentaire';
      case 'clothing':
        return 'Habillement';
      case 'super':
        return 'Super Lot';
      default:
        return 'Standard';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food':
        return '🍚';
      case 'clothing':
        return '👔';
      case 'super':
        return '🏆';
      default:
        return '🎮';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 relative overflow-hidden"
    >
      {/* Badge de catégorie */}
      <div className={`absolute top-4 right-4 ${getCategoryColor(category)} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}>
        <span>{getCategoryIcon(category)}</span>
        <span>{getCategoryName(category)}</span>
      </div>

      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>

      <div className="flex justify-between items-center mt-4">
        <div>
          <div className="text-yellow-500 font-medium">Prix</div>
          <div className="text-white text-lg">{price} {currency}</div>
        </div>
        <div>
          <div className="text-green-500 font-medium">Points gagnés</div>
          <div className="text-white text-lg">{points} points</div>
        </div>
      </div>

      <button
        onClick={onPlay}
        className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Jouer maintenant
      </button>
    </motion.div>
  );
}
