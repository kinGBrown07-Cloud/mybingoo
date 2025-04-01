'use client';

import Image from 'next/image';

interface UserBalanceProps {
  points: number;
  onConvert?: () => void;
}

export default function UserBalance({ points, onConvert }: UserBalanceProps) {
  return (
    <div className="bg-[#1a1f2e] rounded-lg p-6 w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Solde</h2>
          <div className="mt-1">
            <div className="text-sm text-gray-400">Points disponibles</div>
            <div className="text-3xl font-bold text-white">{points}</div>
          </div>
        </div>
        {onConvert && (
          <button
            onClick={onConvert}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            Convertir en argent
          </button>
        )}
      </div>

      <div className="relative w-full h-[200px] mt-6">
        <Image
          src="/images/sac-de-coins.png"
          alt="Sac de pièces"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>
  );
}
