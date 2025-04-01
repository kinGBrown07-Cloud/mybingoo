'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useDataCache } from '@/hooks/useDataCache';

interface StatsData {
  date: string;
  points: number;
  games: number;
  winRate: number;
}

export default function StatsOverview() {
  const { data, loading } = useDataCache<StatsData[]>(
    async () => {
      const response = await fetch('/api/stats/overview');
      return response.json();
    },
    { key: 'stats-overview', ttl: 300 } // 5 minutes cache
  );

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 h-64"></div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-6">Statistiques de jeu</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data ?? []} // Assure que data est toujours un tableau
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EAB308" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWinRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#9CA3AF' }}
              itemStyle={{ color: '#F3F4F6' }}
            />
            <Area
              type="monotone"
              dataKey="points"
              stroke="#EAB308"
              fillOpacity={1}
              fill="url(#colorPoints)"
            />
            <Area
              type="monotone"
              dataKey="winRate"
              stroke="#22C55E"
              fillOpacity={1}
              fill="url(#colorWinRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
