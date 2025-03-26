import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { TrophyIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface TournamentCardProps {
  tournament: {
    id: string;
    name: string;
    participants: number;
    prize: string;
    prizeValue: number;
    status: string;
    startDate: string;
    endDate: string;
    entryFee: number;
  };
  onJoin: (id: string) => void;
  userPoints: number;
}

export default function TournamentCard({ tournament, onJoin, userPoints }: TournamentCardProps) {
  const isJoinable = ['UPCOMING', 'REGISTERING'].includes(tournament.status);
  const hasEnoughPoints = userPoints >= tournament.entryFee;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'text-blue-500 bg-blue-500/10';
      case 'REGISTERING':
        return 'text-green-500 bg-green-500/10';
      case 'ACTIVE':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'COMPLETED':
        return 'text-gray-500 bg-gray-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'À venir';
      case 'REGISTERING':
        return 'Inscriptions ouvertes';
      case 'ACTIVE':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminé';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">{tournament.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
            {getStatusText(tournament.status)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <UserGroupIcon className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">{tournament.participants}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <TrophyIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-300">Prix :</span>
          </div>
          <span className="text-yellow-500 font-medium">{tournament.prize}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
            <span className="text-gray-300">Frais d'entrée :</span>
          </div>
          <span className="text-white font-medium">{tournament.entryFee} points</span>
        </div>

        <div className="text-sm text-gray-400">
          <div>
            Début : {format(new Date(tournament.startDate), 'PPP', { locale: fr })}
          </div>
          <div>
            Fin : {format(new Date(tournament.endDate), 'PPP', { locale: fr })}
          </div>
        </div>

        {isJoinable && (
          <button
            onClick={() => onJoin(tournament.id)}
            disabled={!hasEnoughPoints}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
              hasEnoughPoints
                ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasEnoughPoints ? 'Rejoindre' : 'Points insuffisants'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
