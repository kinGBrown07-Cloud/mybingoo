import { motion, AnimatePresence } from 'framer-motion';
import { Prize } from '@/types/game';
import Image from 'next/image';

interface PrizeDetailsProps {
  prize: Prize;
  onClose: () => void;
}

export default function PrizeDetails({ prize, onClose }: PrizeDetailsProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          <div className="relative w-full aspect-square mb-4">
            <Image
              src={prize.imageUrl || '/images/win.png'} // Utilisez l'image par défaut si imageUrl est undefined
              alt={prize.name}
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2">{prize.name}</h3>
          <p className="text-gray-600 mb-4">{prize.description}</p>
          <div className="flex items-center justify-between mb-6">
            <span className="text-xl font-semibold text-green-600">
              Valeur : {prize.value} points
            </span>
            <span className={`px-3 py-1 rounded-full text-white ${
              prize.category === 'FOOD' ? 'bg-orange-500' :
              prize.category === 'CLOTHING' ? 'bg-blue-500' :
              'bg-purple-500'
            }`}>
              {prize.category}
            </span>
          </div>
          <button
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={onClose}
          >
            Continuer
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
