'use client';

import React from 'react';
import { UserData } from '@/types/user';
import { CurrencyDollarIcon, TrophyIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/outline';

interface StatsOverviewProps {
  userData: UserData | null;
}

export default function StatsOverview({ userData }: StatsOverviewProps) {
  const stats = [
    {
      title: 'Points',
      value: userData?.points || 0,
      icon: <StarIcon className="w-6 h-6 text-orange-600" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Solde',
      value: `${userData?.balance || 0} ${userData?.currency || 'EUR'}`,
      icon: <CurrencyDollarIcon className="w-6 h-6 text-green-600" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Parties jouées',
      value: userData?.gameHistory?.length || 0,
      icon: <ChartBarIcon className="w-6 h-6 text-blue-600" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Tournois actifs',
      value: userData?.tournaments?.filter(t => t.status === 'ACTIVE').length || 0,
      icon: <TrophyIcon className="w-6 h-6 text-purple-600" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6">Statistiques de jeu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
                <span className="text-sm font-medium text-gray-500">
                  {stat.title}
                </span>
              </div>
              <div className={`text-3xl font-bold ${stat.color}`} data-testid={stat.title.toLowerCase().replace(' ', '-')}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
