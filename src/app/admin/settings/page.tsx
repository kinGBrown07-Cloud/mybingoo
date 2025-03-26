'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Settings {
  minDepositAmount: number;
  maxDepositAmount: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  pointsPerPlay: number;
  pointsToFcfaRate: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxDailyPlays: number;
  paymentMethods: {
    paypal: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    minDepositAmount: 500,
    maxDepositAmount: 100000,
    minWithdrawalAmount: 1000,
    maxWithdrawalAmount: 50000,
    pointsPerPlay: 100,
    pointsToFcfaRate: 1,
    maintenanceMode: false,
    registrationEnabled: true,
    maxDailyPlays: 10,
    paymentMethods: {
      paypal: true,
    },
    notifications: {
      email: true,
      push: false,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erreur lors de la recuperation des parametres');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Parametres enregistres avec succes');
      } else {
        toast.error('Erreur lors de l\'enregistrement des parametres');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de l\'enregistrement des parametres');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Parametres du systeme
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Configuration globale de la plateforme
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto disabled:opacity-50"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Parametres des transactions */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Parametres des transactions
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Montant minimum de depot (FCFA)
                </label>
                <input
                  type="number"
                  value={settings.minDepositAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minDepositAmount: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Montant maximum de depot (FCFA)
                </label>
                <input
                  type="number"
                  value={settings.maxDepositAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxDepositAmount: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Montant minimum de retrait (FCFA)
                </label>
                <input
                  type="number"
                  value={settings.minWithdrawalAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      minWithdrawalAmount: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Montant maximum de retrait (FCFA)
                </label>
                <input
                  type="number"
                  value={settings.maxWithdrawalAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxWithdrawalAmount: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parametres du jeu */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Parametres du jeu
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Points par partie
                </label>
                <input
                  type="number"
                  value={settings.pointsPerPlay}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pointsPerPlay: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Taux de conversion Points/FCFA
                </label>
                <input
                  type="number"
                  value={settings.pointsToFcfaRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pointsToFcfaRate: parseFloat(e.target.value),
                    })
                  }
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre maximum de parties par jour
                </label>
                <input
                  type="number"
                  value={settings.maxDailyPlays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxDailyPlays: parseInt(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Parametres du systeme */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Parametres du systeme
            </h3>
            <div className="mt-6 space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  Mode maintenance
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.registrationEnabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      registrationEnabled: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  Inscriptions activees
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Methodes de paiement */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Methodes de paiement
            </h3>
            <div className="mt-6 space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.paypal}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      paymentMethods: {
                        ...settings.paymentMethods,
                        paypal: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  PayPal
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Notifications
            </h3>
            <div className="mt-6 space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  Notifications par email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        push: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  Notifications push
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
