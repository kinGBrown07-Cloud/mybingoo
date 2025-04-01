'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/hooks/useSupabase';
import { REGION_CONFIG, type RegionKey } from '@/config/regions';
import { Illustration } from '@/types/illustration';
import ImageUploader from '@/components/admin/ImageUploader';

import {
  UsersIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ChartBarIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalRevenue: number;
  recentTransactions: {
    id: string;
    userId: string;
    amount: number;
    status: string;
    date: string;
  }[];
}

interface IllustrationFormData extends Omit<Illustration, 'id' | 'createdAt' | 'updatedAt'> {
  region: RegionKey;
}

const REGIONS: RegionKey[] = Object.keys(REGION_CONFIG) as RegionKey[];

const REGION_LABELS: Record<RegionKey, string> = {
  AFRIQUE_NOIRE: 'Afrique Noire',
  AFRIQUE_BLANCHE: 'Afrique Blanche',
  EUROPE: 'Europe',
  ASIE: 'Asie',
  AMERIQUE: 'Amérique'
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useSupabase();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('AFRIQUE_NOIRE');
  const [newIllustration, setNewIllustration] = useState<IllustrationFormData>({
    name: '',
    description: '',
    imageUrl: '',
    region: 'AFRIQUE_NOIRE',
    isActive: true
  });

  const refreshStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const handleImageUploaded = (url: string) => {
    setNewIllustration(prev => ({ ...prev, imageUrl: url }));
  };

  const handleAddIllustration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIllustration.imageUrl) {
      alert('Veuillez télécharger une image pour l\'illustration');
      return;
    }

    try {
      const response = await fetch('/api/admin/illustrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIllustration),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout de l\'illustration');

      const addedIllustration = await response.json();
      setIllustrations([...illustrations, addedIllustration]);
      alert('Illustration ajoutée avec succès');

      // Reset form
      setNewIllustration({
        name: '',
        description: '',
        imageUrl: '',
        region: selectedRegion,
        isActive: true
      });
    } catch (error) {
      alert('Erreur lors de l\'ajout de l\'illustration');
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/illustrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isActive: !illustrations.find(illus => illus.id === id)?.isActive 
        }),
      });

      if (response.ok) {
        setIllustrations(illustrations.map(illus => 
          illus.id === id ? { ...illus, isActive: !illus.isActive } : illus
        ));
        alert('Statut de l\'illustration mis à jour');
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour de l\'illustration');
    }
  };

  const handleDeleteIllustration = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette illustration ?')) return;

    try {
      const response = await fetch(`/api/admin/illustrations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIllustrations(illustrations.filter(illus => illus.id !== id));
        alert('Illustration supprimée avec succès');
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      alert('Erreur lors de la suppression de l\'illustration');
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      console.log('Current user:', user); // Pour le débogage
      console.log('User role:', user.role); // Pour le débogage

      if ((user.role || '').toUpperCase() !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }

      const fetchStats = async () => {
        try {
          const response = await fetch('/api/admin/stats');
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des statistiques:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    };

    checkAdmin();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-red-900 to-red-950">
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
            <button
              onClick={refreshStats}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalUsers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-50">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalRevenue || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-50">
                  <GiftIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Lots disponibles</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalPrizes || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-50">
                  <ChartBarIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats?.totalTransactions || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques par région */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Statistiques par région</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats?.regions.map((region) => (
                  <div key={region.name} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">{region.name}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Utilisateurs</span>
                        <span className="font-medium text-gray-900">{region.users}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenus</span>
                        <span className="font-medium text-gray-900">
                          {region.revenue.toLocaleString()} {region.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/users"
              className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Gestion des utilisateurs</h3>
                  <p className="text-sm text-gray-500">Gérer les comptes et les permissions</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Link>

            <Link
              href="/admin/prizes"
              className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Gestion des lots</h3>
                  <p className="text-sm text-gray-500">Ajouter ou modifier les lots</p>
                </div>
                <div className="p-2 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                  <GiftIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Link>

            <Link
              href="/admin/transactions"
              className="bg-white rounded-lg shadow p-6 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Transactions</h3>
                  <p className="text-sm text-gray-500">Historique et validation</p>
                </div>
                <div className="p-2 rounded-lg bg-yellow-50 group-hover:bg-yellow-100 transition-colors">
                  <ChartBarIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </Link>
          </div>

          {/* Transactions récentes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Transactions récentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats?.recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gestion des illustrations */}
          <div className="bg-white rounded-lg shadow mt-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Gestion des Illustrations</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une nouvelle illustration</h3>
                  <form onSubmit={handleAddIllustration} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de l'illustration
                      </label>
                      <input
                        type="text"
                        value={newIllustration.name}
                        onChange={(e) => setNewIllustration({ ...newIllustration, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newIllustration.description}
                        onChange={(e) => setNewIllustration({ ...newIllustration, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Région
                      </label>
                      <select
                        value={newIllustration.region}
                        onChange={(e) => setNewIllustration({ ...newIllustration, region: e.target.value as RegionKey })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        {REGIONS.map((region) => (
                          <option key={region} value={region}>
                            {REGION_LABELS[region]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <ImageUploader onImageUploaded={handleImageUploaded} />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Ajouter l'illustration
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Illustrations existantes</h3>
                  <div className="space-y-4">
                    {illustrations.map((illus) => (
                      <div
                        key={illus.id}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              src={illus.imageUrl}
                              alt={illus.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {illus.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {REGION_LABELS[illus.region as RegionKey]}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {illus.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleAvailability(illus.id)}
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                illus.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {illus.isActive ? 'Actif' : 'Inactif'}
                            </button>
                            <button
                              onClick={() => handleDeleteIllustration(illus.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}