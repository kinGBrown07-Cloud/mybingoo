'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { TicketIcon } from '@heroicons/react/24/outline';

export default function BuyTicketsPage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      // TODO: Implémenter la logique d'achat de tickets
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Tickets achetés avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'achat des tickets:', error);
      alert('Une erreur est survenue lors de l\'achat des tickets.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center mb-8">
            <TicketIcon className="h-16 w-16 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-6 text-black">
            Acheter des tickets
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Nombre de tickets
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAmount(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-red-50 text-black"
                >
                  -
                </button>
                <span className="text-xl font-semibold text-black">{amount}</span>
                <button
                  onClick={() => setAmount(prev => prev + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-red-50 text-black"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-black">Récapitulatif</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Prix unitaire</span>
                  <span className="text-black">3 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Quantité</span>
                  <span className="text-black">{amount}</span>
                </div>
                <div className="border-t border-red-200 pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-black">Total</span>
                    <span className="text-black">{amount * 3} points</span>
                  </div>
                </div>
                <div className="text-sm text-black mt-2">
                  Équivalent en XOF : {amount * 500} XOF
                </div>
              </div>
            </div>

            {session ? (
              <button
                onClick={handleBuy}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isLoading ? 'Traitement en cours...' : 'Acheter les tickets'}
              </button>
            ) : (
              <div className="text-center">
                <p className="text-black mb-4">
                  Connectez-vous pour acheter des tickets
                </p>
                <a
                  href="/auth/signin"
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Se connecter
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 