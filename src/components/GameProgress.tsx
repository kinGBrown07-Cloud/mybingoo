import { motion } from 'framer-motion';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/solid';

interface GameProgressProps {
  currentPoints: number;
  targetPoints: number;
  level: number;
  gamesPlayed: number;
}

export default function GameProgress({ currentPoints, targetPoints, level, gamesPlayed }: GameProgressProps) {
  const progress = Math.min((currentPoints / targetPoints) * 100, 100);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrophyIcon className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-semibold">Niveau {level}</span>
        </div>
        <div className="flex items-center space-x-2">
          <StarIcon className="h-5 w-5 text-yellow-500" />
          <span>{currentPoints} / {targetPoints} points</span>
        </div>
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-red-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Parties jouées</p>
          <p className="text-xl font-bold">{gamesPlayed}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Prochain niveau</p>
          <p className="text-xl font-bold">{targetPoints - currentPoints} points</p>
        </div>
      </div>
    </div>
  );
} 