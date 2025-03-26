'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Prize, Region, GameCategory } from '@/types/game';
import { REGIONS, REGION_NAMES, POINTS_RATES } from '@/config/regions';

interface RegionalPriceFormData {
  prizeId: string;
  region: Region;
  pointValue: number;
  stock: number;
}

export default function AdminRegionalPrizesPage() {
  const { data: session } = useSession();
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedPrize, setSelectedPrize] = useState<string>('');
  const [regionalPrices, setRegionalPrices] = useState<Record<string, RegionalPriceFormData[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrizes();
    fetchRegionalPrices();
  }, []);

  const fetchPrizes = async () => {
    try {
      const response = await fetch('/api/admin/prizes');
      if (response.ok) {
        const data = await response.json();
        setPrizes(data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des prix');
    }
  };

  const fetchRegionalPrices = async () => {
    try {
      const response = await fetch('/api/admin/prizes/regional');
      if (response.ok) {
        const data = await response.json();
        setRegionalPrices(data);
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des prix régionaux');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRegionalPrice = async (prizeId: string, region: Region, data: Partial<RegionalPriceFormData>) => {
    try {
      const response = await fetch(`/api/admin/prizes/${prizeId}/regional/${region}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success('Prix régional mis à jour');
        fetchRegionalPrices();
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du prix régional');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Prix par Région</h1>

      {/* Sélecteur de prix */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sélectionner un prix</h2>
        <select
          value={selectedPrize}
          onChange={(e) => setSelectedPrize(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded"
        >
          <option value="">Sélectionner un prix</option>
          {prizes.map((prize) => (
            <option key={prize.id} value={prize.id}>
              {prize.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau des prix par région */}
      {selectedPrize && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valeur en Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.keys(REGIONS).map((region) => {
                const regionalPrice = regionalPrices[selectedPrize]?.find(
                  (price) => price.region === region
                );

                return (
                  <tr key={region}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {REGION_NAMES[region as Region]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={regionalPrice?.pointValue || 0}
                        onChange={(e) =>
                          handleUpdateRegionalPrice(selectedPrize, region as Region, {
                            pointValue: parseInt(e.target.value),
                          })
                        }
                        className="w-24 p-1 border rounded"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={regionalPrice?.stock || 0}
                        onChange={(e) =>
                          handleUpdateRegionalPrice(selectedPrize, region as Region, {
                            stock: parseInt(e.target.value),
                          })
                        }
                        className="w-24 p-1 border rounded"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          handleUpdateRegionalPrice(selectedPrize, region as Region, {
                            pointValue: regionalPrice?.pointValue || 0,
                            stock: regionalPrice?.stock || 0,
                          })
                        }
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Sauvegarder
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}