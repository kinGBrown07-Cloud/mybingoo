'use client';

import { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { CreditCardIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import PayPalProvider from '@/providers/PayPalProvider';
import Image from 'next/image';

interface PaymentMethodsProps {
  amount: number;
  currency: string;
  points: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentMethods({ amount, currency, points, onSuccess, onCancel }: PaymentMethodsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/payments/create-paypal-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          points
        }),
      });

      const order = await response.json();
      return order.id;
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast.error('Erreur lors de la création de la commande');
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      setIsLoading(true);
      window.location.href = `/api/payments/capture-paypal-order?token=${data.orderID}`;
    } catch (error) {
      console.error('Erreur lors de la validation du paiement:', error);
      toast.error('Erreur lors de la validation du paiement');
      setIsLoading(false);
    }
  };

  return (
    <PayPalProvider>
      <div className="flex items-center justify-center gap-8">
        <div className="relative w-[500px] h-[500px]">
          <Image
            src="/images/big-bonom.png"
            alt="Leprechaun avec un pot d'or"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        <div className="bg-[#1a1f2e] rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold text-white mb-4">
            Méthodes de paiement
          </h2>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded bg-[#252b3b] hover:bg-[#2a3040] transition-colors">
              <div className="flex items-center space-x-3">
                <CreditCardIcon className="w-5 h-5 text-gray-400" />
                <span className="text-white text-sm">Carte bancaire</span>
              </div>
              <span className="text-gray-400 text-sm">Via PayPal</span>
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded bg-[#252b3b] hover:bg-[#2a3040] transition-colors">
              <div className="flex items-center space-x-3">
                <BuildingLibraryIcon className="w-5 h-5 text-gray-400" />
                <span className="text-white text-sm">Compte bancaire</span>
              </div>
              <span className="text-gray-400 text-sm">Via PayPal</span>
            </button>
          </div>

          <div className="mt-3">
            <PayPalButtons
              style={{
                color: "gold",
                shape: "rect",
                label: "pay",
                height: 40
              }}
              createOrder={createOrder}
              onApprove={onApprove}
              disabled={isLoading}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              Paiement sécurisé via PayPal
            </p>
            <p className="text-xs text-gray-500">
              Vous pouvez utiliser votre carte bancaire ou votre compte PayPal
            </p>
          </div>
        </div>
      </div>
    </PayPalProvider>
  );
}
