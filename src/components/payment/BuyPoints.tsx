'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PaymentMethods from './PaymentMethods';
import { CurrencyDollarIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface BuyPointsProps {
  onSuccess?: () => void;
}

const REGION_CONFIG = {
  AFRIQUE_NOIRE: {
    currency: 'XOF',
    rate: 300,
    symbol: 'FCFA',
    pointsRate: { points: 2, amount: 300 }
  },
  AFRIQUE_BLANCHE: {
    currency: 'EUR',
    rate: 1,
    symbol: '€',
    pointsRate: { points: 2, amount: 1 }
  },
  EUROPE: {
    currency: 'EUR',
    rate: 2,
    symbol: '€',
    pointsRate: { points: 2, amount: 2 }
  },
  ASIE: {
    currency: 'USD',
    rate: 2,
    symbol: '$',
    pointsRate: { points: 2, amount: 2 }
  },
  AMERIQUE: {
    currency: 'USD',
    rate: 2,
    symbol: '$',
    pointsRate: { points: 2, amount: 2 }
  }
};

export default function BuyPoints({ onSuccess }: BuyPointsProps) {
  const supabase = createClientComponentClient();
  const [userRegion, setUserRegion] = useState<keyof typeof REGION_CONFIG>('EUROPE');
  const [pointsAmount, setPointsAmount] = useState(2);
  const [showPayment, setShowPayment] = useState(false);

  const regionConfig = REGION_CONFIG[userRegion];
  const basePoints = regionConfig.pointsRate.points;
  const baseAmount = regionConfig.pointsRate.amount;

  const calculateAmount = (points: number) => {
    return (points / basePoints) * baseAmount;
  };

  const pointsOptions = [2, 10, 20, 50, 100, 200].map(points => ({
    points,
    amount: calculateAmount(points)
  }));

  if (showPayment) {
    return (
      <PaymentMethods
        amount={calculateAmount(pointsAmount)}
        currency={regionConfig.currency}
        points={pointsAmount}
        onSuccess={onSuccess}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="space-y-6 p-6 bg-[#1a1f2e] rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-yellow-500" />
          Acheter des points
        </h2>
        <div className="px-3 py-1.5 bg-[#252b3b] rounded-lg">
          <span className="text-sm text-gray-400">Région : </span>
          <span className="text-sm font-medium text-white">{userRegion.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {pointsOptions.map(({ points, amount }) => (
          <button
            key={points}
            onClick={() => setPointsAmount(points)}
            className={`relative p-4 rounded-lg border-2 transition-all ${
              pointsAmount === points
                ? 'border-yellow-500 bg-[#252b3b]'
                : 'border-transparent bg-[#252b3b] hover:border-gray-600'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{points}</span>
              <span className="text-sm text-gray-400">points</span>
              <div className="mt-2 text-yellow-500 font-medium">
                {amount} {regionConfig.symbol}
              </div>
            </div>
            {pointsAmount === points && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 rounded-lg bg-[#252b3b]">
        <div>
          <p className="text-sm text-gray-400">Prix unitaire</p>
          <p className="text-white font-medium">
            {basePoints} points = {baseAmount} {regionConfig.symbol}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-lg font-bold text-white">
            {calculateAmount(pointsAmount)} {regionConfig.symbol}
          </p>
        </div>
      </div>

      <button
        onClick={() => setShowPayment(true)}
        className="w-full flex items-center justify-between p-4 bg-yellow-500 text-gray-900 rounded-xl font-medium hover:bg-yellow-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="w-6 h-6" />
          <span>Payer maintenant</span>
        </div>
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
