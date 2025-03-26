'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { POINTS_RATES, REGION_CURRENCIES, REGIONS } from '@/config/regions';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<number>(2);
  const [userRegion, setUserRegion] = useState(REGIONS.EUROPE);

  useEffect(() => {
    // Récupérer la région de l'utilisateur depuis la base de données
    const fetchUserRegion = async () => {
      if (session?.user?.regionId) {
        try {
          const response = await fetch(`/api/users/region/${session.user.regionId}`);
          if (response.ok) {
            const data = await response.json();
            setUserRegion(data.name || REGIONS.EUROPE);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la région:', error);
        }
      }
    };

    fetchUserRegion();
  }, [session?.user?.regionId]);

  const currency = REGION_CURRENCIES[userRegion];
  const pointsRate = POINTS_RATES[userRegion];

  const calculatePoints = (amount: number) => {
    return Math.floor((amount / pointsRate.amount) * pointsRate.points);
  };

  const handlePaypalApprove = async (data: any, actions: any) => {
    try {
      const order = await actions.order.capture();
      
      // Enregistrer le paiement et mettre à jour les points
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.purchase_units[0].amount.value,
          currency: order.purchase_units[0].amount.currency_code,
          provider: 'PAYPAL',
          points: calculatePoints(Number(order.purchase_units[0].amount.value)),
        }),
      });

      if (!response.ok) throw new Error('Erreur lors du traitement du paiement');

      toast.success('Paiement réussi !');
      onSuccess();
    } catch (error) {
      console.error('Erreur PayPal:', error);
      onError('Erreur lors du traitement du paiement');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Acheter des Points</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Montant ({currency})
        </label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-2 text-sm text-gray-600">
          Vous recevrez {calculatePoints(amount)} points
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(),
                    currency_code: currency,
                  },
                  description: `${calculatePoints(amount)} points pour Mybingoo`,
                },
              ],
            });
          }}
          onApprove={handlePaypalApprove}
          onError={(err) => {
            console.error('Erreur PayPal:', err);
            onError('Une erreur est survenue avec PayPal');
          }}
          style={{ layout: 'vertical' }}
        />
      </motion.div>
    </div>
  );
}
