'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';

const REGION_CONFIG = {
  AFRIQUE_NOIRE: {
    currency: 'XOF',
    pointsRate: { points: 2, amount: 300 },
    symbol: 'FCFA'
  },
  AFRIQUE_BLANCHE: {
    currency: 'EUR',
    pointsRate: { points: 2, amount: 1 },
    symbol: '€'
  },
  EUROPE: {
    currency: 'EUR',
    pointsRate: { points: 2, amount: 2 },
    symbol: '€'
  },
  ASIE: {
    currency: 'USD',
    pointsRate: { points: 2, amount: 2 },
    symbol: '$'
  },
  AMERIQUE: {
    currency: 'USD',
    pointsRate: { points: 2, amount: 2 },
    symbol: '$'
  }
};

interface BuyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BuyPointsModal({ isOpen, onClose, onSuccess }: BuyPointsModalProps) {
  const supabase = createClientComponentClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [userRegion, setUserRegion] = useState<keyof typeof REGION_CONFIG>('EUROPE');
  const [pointsAmount, setPointsAmount] = useState(2);

  useEffect(() => {
    const getUserRegion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: userData } = await supabase
          .from('users')
          .select('region:regionId(name)')
          .eq('id', session.user.id)
          .single();
        
        if (userData?.region?.name) {
          setUserRegion(userData.region.name as keyof typeof REGION_CONFIG);
        }
      }
    };

    if (isOpen) {
      getUserRegion();
    }
  }, [isOpen, supabase]);

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

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Vous devez être connecté pour acheter des points');
        return;
      }

      const amount = calculateAmount(pointsAmount);

      // Créer une session de paiement PayPal
      const response = await fetch('/api/payments/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: regionConfig.currency,
          points: pointsAmount,
          region: userRegion
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const data = await response.json();
      
      // Rediriger vers PayPal
      window.location.href = data.approvalUrl;
      
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'achat des points');
      console.error('Erreur:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500/10 sm:mx-0 sm:h-10 sm:w-10">
                    <GlobeAltIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white">
                      Acheter des points
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        Région : {userRegion.replace('_', ' ')} ({basePoints} points = {baseAmount} {regionConfig.symbol})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="points" className="block text-sm font-medium text-gray-400">
                      Points à acheter
                    </label>
                    <select
                      id="points"
                      value={pointsAmount}
                      onChange={(e) => setPointsAmount(Number(e.target.value))}
                      className="mt-2 block w-full rounded-md border-0 bg-gray-800 py-2 pl-3 pr-10 text-white shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-yellow-500 sm:text-sm sm:leading-6"
                      disabled={isProcessing}
                    >
                      {pointsOptions.map(({ points, amount }) => (
                        <option key={points} value={points}>
                          {points} points ({amount} {regionConfig.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-md bg-yellow-500 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePurchase}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Traitement...' : `Acheter ${pointsAmount} points (${calculateAmount(pointsAmount)} ${regionConfig.symbol})`}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
