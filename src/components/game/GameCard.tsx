import { motion } from 'framer-motion';
import { Card } from '@/types/game';
import Image from 'next/image';

interface GameCardProps {
  card: Card;
  onClick: (cardId: string) => void;
  disabled: boolean;
}

export default function GameCard({ card, onClick, disabled }: GameCardProps) {
  const isFlipped = card.status !== 'hidden';

  return (
    <motion.div
      className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
      onClick={() => !disabled && onClick(card.id)}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Face avant (dos de la carte) */}
        <div
          className={`absolute w-full h-full backface-hidden rounded-xl bg-gradient-to-br from-red-600 to-red-800 shadow-xl border-2 border-red-400 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-400 flex items-center justify-center">
              <span className="text-2xl text-white">?</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/50 to-transparent rounded-xl" />
        </div>

        {/* Face arrière (image du lot) */}
        <div className="absolute w-full h-full backface-hidden rounded-xl bg-white shadow-xl rotate-y-180">
          <div className="relative w-full h-full p-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                <Image
                  src={card.image}
                  alt="Prize"
                  fill
                  className="object-contain rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            {card.status === 'matched' && (
              <motion.div
                className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="text-green-600 text-4xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 