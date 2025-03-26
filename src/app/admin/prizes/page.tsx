'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Prize, Region, GameCategory } from '@/types/game';

interface PrizeFormData extends Omit<Prize, 'id' | 'createdAt' | 'updatedAt'> {
  stock: number;
  value: number; // Changez le type de value pour number
}

const REGIONS: Region[] = ['BLACK_AFRICA', 'WHITE_AFRICA', 'EUROPE', 'ASIA', 'AMERICA'];
const CATEGORIES: GameCategory[] = ['FOOD', 'CLOTHING', 'SUPER'];

const CATEGORY_LABELS = {
  FOOD: 'Kits Alimentaires',
  CLOTHING: 'Habillement',
  SUPER: 'Super Lots'
};

const REGION_LABELS = {
  BLACK_AFRICA: 'Afrique Noire',
  WHITE_AFRICA: 'Afrique Blanche',
  EUROPE: 'Europe',
  ASIA: 'Asie',
  AMERICA: 'Amérique'
};

export default function AdminPrizesPage() {
  const { data: session } = useSession();
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('FOOD');
  const [selectedRegion, setSelectedRegion] = useState<Region>('BLACK_AFRICA');
  const [newPrize, setNewPrize] = useState<PrizeFormData>({
    name: '',
    description: '',
    imageUrl: '',
    category: 'FOOD',
    pointValue: 0,
    isActive: true,
    stock: 0,
    region: 'BLACK_AFRICA',
    value: 0 // Initialisez value avec un nombre
  });

  const handleAddPrize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/prizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPrize),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout du prix');

      const addedPrize = await response.json();
      setPrizes([...prizes, addedPrize]);
      toast.success('Prix ajouté avec succès');

      // Reset form
      setNewPrize({
        name: '',
        description: '',
        imageUrl: '',
        category: selectedCategory,
        pointValue: 0,
        isActive: true,
        stock: 0,
        region: selectedRegion,
        value: 0 // Réinitialisez value avec un nombre
      });
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du prix');
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/prizes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !prizes.find(prize => prize.id === id)?.isActive }),
      });

      if (response.ok) {
        setPrizes(prizes.map(prize => prize.id === id ? { ...prize, isActive: !prize.isActive } : prize));
        toast.success('Statut du prix mis à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du prix');
    }
  };

  const handleDeletePrize = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/prizes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPrizes(prizes.filter(prize => prize.id !== id));
        toast.success('Prix supprimé avec succès');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression du prix');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des Prix</h1>

      {/* Sélecteurs de catégorie et région */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Catégorie</h2>
          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Région</h2>
          <div className="flex flex-wrap gap-4">
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-lg ${
                  selectedRegion === region
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {REGION_LABELS[region]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout de prix */}
      <form onSubmit={handleAddPrize} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Ajouter un nouveau prix</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Nom</label>
            <input
              type="text"
              value={newPrize.name}
              onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Image URL</label>
            <input
              type="url"
              value={newPrize.imageUrl}
              onChange={(e) => setNewPrize({ ...newPrize, imageUrl: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Valeur en Points</label>
            <input
              type="number"
              value={newPrize.pointValue}
              onChange={(e) => setNewPrize({ ...newPrize, pointValue: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block mb-2">Stock</label>
            <input
              type="number"
              value={newPrize.stock}
              onChange={(e) => setNewPrize({ ...newPrize, stock: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
              required
              min="0"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2">Description</label>
            <textarea
              value={newPrize.description}
              onChange={(e) => setNewPrize({ ...newPrize, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
              rows={3}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Ajouter le prix
          </button>
        </div>
      </form>

      {/* Liste des prix existants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prizes
          .filter((prize) =>
            prize.category === selectedCategory &&
            prize.region === selectedRegion
          )
          .map((prize) => (
            <motion.div
              key={prize.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <img
                src={prize.imageUrl}
                alt={prize.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{prize.name}</h3>
              <p className="text-gray-600 mb-2">{prize.description}</p>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">
                  Valeur: {prize.pointValue} points
                </p>
                <p className="text-sm text-gray-600">
                  Stock: {prize.stock}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleToggleAvailability(prize.id!)}
                  className={`px-4 py-2 rounded ${
                    prize.isActive
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {prize.isActive ? 'Disponible' : 'Indisponible'}
                </button>
                <button
                  onClick={() => handleDeletePrize(prize.id!)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
