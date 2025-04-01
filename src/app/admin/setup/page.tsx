'use client';

import { useState } from 'react';
import { createAdminAccounts } from '@/utils/createAdminAccounts';

export default function AdminSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateAccounts = async () => {
    try {
      setIsCreating(true);
      setMessage('Création des comptes administrateurs en cours...');
      await createAdminAccounts();
      setMessage('Comptes administrateurs créés avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Une erreur est survenue lors de la création des comptes.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration des comptes administrateurs</h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Cette page permet de créer les comptes administrateurs par défaut :
          </p>
          
          <ul className="list-disc list-inside text-gray-600 ml-4">
            <li>Administrateur Principal (admin.principal@mybingoo.com)</li>
            <li>Administrateur Support (admin.support@mybingoo.com)</li>
          </ul>

          <div className="mt-6">
            <button
              onClick={handleCreateAccounts}
              disabled={isCreating}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {isCreating ? 'Création en cours...' : 'Créer les comptes administrateurs'}
            </button>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-md ${
              message.includes('succès') ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
