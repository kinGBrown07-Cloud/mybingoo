'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function TwoFactorAuth() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleEnable2FA = async () => {
    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (response.ok) {
        setShowQR(true);
        toast.success('Scannez le QR code avec votre application d\'authentification');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'activation de la 2FA');
    }
  };

  const handleVerify2FA = async () => {
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsEnabled(true);
        setShowQR(false);
        toast.success('Authentification à deux facteurs activée avec succès');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Code de vérification incorrect');
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">
        Authentification à deux facteurs (2FA)
      </h2>
      
      {!isEnabled && !showQR && (
        <div className="space-y-4">
          <p className="text-gray-300">
            Renforcez la sécurité de votre compte en activant l&apos;authentification à deux facteurs.
          </p>
          <button
            onClick={handleEnable2FA}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors"
          >
            Activer la 2FA
          </button>
        </div>
      )}

      {showQR && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg w-fit">
            {/* QR Code placeholder - will be populated by API */}
            <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Code de vérification
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Entrez le code à 6 chiffres"
            />
          </div>

          <button
            onClick={handleVerify2FA}
            disabled={verificationCode.length !== 6}
            className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Vérifier et activer
          </button>
        </div>
      )}

      {isEnabled && (
        <div className="flex items-center space-x-2 text-green-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>2FA activée</span>
        </div>
      )}
    </div>
  );
}
