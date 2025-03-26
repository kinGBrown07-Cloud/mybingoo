'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const REGION_CONFIG = {
  AFRIQUE_NOIRE: {
    countries: [
      { code: 'CI', name: 'Côte d\'Ivoire' },
      { code: 'SN', name: 'Sénégal' },
      { code: 'CM', name: 'Cameroun' },
      { code: 'BF', name: 'Burkina Faso' },
      { code: 'ML', name: 'Mali' },
      { code: 'GN', name: 'Guinée' },
      { code: 'BJ', name: 'Bénin' },
      { code: 'TG', name: 'Togo' },
      { code: 'NE', name: 'Niger' },
      { code: 'CG', name: 'Congo' },
      { code: 'GA', name: 'Gabon' },
      { code: 'CD', name: 'République démocratique du Congo' },
    ],
    currency: 'XOF',
    pointsPerPlay: 3,
    costPerPlay: 300,
  },
  AFRIQUE_BLANCHE: {
    countries: [
      { code: 'MA', name: 'Maroc' },
      { code: 'DZ', name: 'Algérie' },
      { code: 'TN', name: 'Tunisie' },
    ],
    currency: 'XOF',
    pointsPerPlay: 3,
    costPerPlay: 500,
  },
  EUROPE: {
    countries: [
      { code: 'FR', name: 'France' },
      { code: 'BE', name: 'Belgique' },
      { code: 'CH', name: 'Suisse' },
      { code: 'IT', name: 'Italie' },
      { code: 'DE', name: 'Allemagne' },
      { code: 'ES', name: 'Espagne' },
      { code: 'PT', name: 'Portugal' },
      { code: 'GB', name: 'Royaume-Uni' },
    ],
    currency: 'EUR',
    pointsPerPlay: 3,
    costPerPlay: 2,
  },
  ASIE: {
    countries: [
      { code: 'CN', name: 'Chine' },
      { code: 'JP', name: 'Japon' },
      { code: 'KR', name: 'Corée du Sud' },
      { code: 'VN', name: 'Vietnam' },
      { code: 'TH', name: 'Thaïlande' },
      { code: 'ID', name: 'Indonésie' },
      { code: 'MY', name: 'Malaisie' },
      { code: 'SG', name: 'Singapour' },
    ],
    currency: 'USD',
    pointsPerPlay: 3,
    costPerPlay: 2,
  },
};

// Aplatir la liste des pays pour le sélecteur
const countries = Object.entries(REGION_CONFIG).flatMap(([region, config]) =>
  config.countries.map(country => ({
    ...country,
    region,
    currency: config.currency,
    pointsPerPlay: config.pointsPerPlay,
    costPerPlay: config.costPerPlay,
  }))
);

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    affiliateCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validation côté client
    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.name.length < 2) {
      toast.error('Le nom doit contenir au moins 2 caractères');
      setLoading(false);
      return;
    }

    if (formData.phone.length < 8) {
      toast.error('Numéro de téléphone invalide');
      setLoading(false);
      return;
    }

    if (!formData.country) {
      toast.error('Veuillez sélectionner votre pays');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          country: formData.country,
          affiliateCode: formData.affiliateCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      const selectedRegion = Object.entries(REGION_CONFIG).find(([_, config]) =>
        config.countries.some(c => c.code === formData.country)
      );
      if (selectedRegion) {
        const [regionName, config] = selectedRegion;
        toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      }
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-orange-500 to-red-600 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Éléments graphiques */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/auth/login" className="font-medium text-red-600 hover:text-red-500">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm"
                placeholder="exemple@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm"
                placeholder="+225 0123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <select
                id="country"
                name="country"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              >
                <option value="">Sélectionnez votre pays</option>
                {Object.entries(REGION_CONFIG).map(([region, config]) => (
                  <optgroup key={region} label={region.replace('_', ' ')}>
                    {config.countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({config.costPerPlay} {config.currency} = {config.pointsPerPlay} points)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {formData.country && (() => {
                  const selectedRegion = Object.entries(REGION_CONFIG).find(([_, config]) =>
                    config.countries.some(c => c.code === formData.country)
                  );
                  if (selectedRegion) {
                    const [regionName, config] = selectedRegion;
                    return `Dans votre région (${regionName.replace('_', ' ').toLowerCase()}), une partie coûte ${config.costPerPlay} ${config.currency} et rapporte ${config.pointsPerPlay} points.`;
                  }
                  return '';
                })()}
              </p>
            </div>

            <div>
              <label htmlFor="affiliateCode" className="block text-sm font-medium text-gray-700 mb-1">
                Code d'affiliation (optionnel)
              </label>
              <input
                id="affiliateCode"
                name="affiliateCode"
                type="text"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Entrez le code d'affiliation si vous en avez un"
                value={formData.affiliateCode}
                onChange={(e) => setFormData({ ...formData, affiliateCode: e.target.value })}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Minimum 8 caractères"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-8 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white/80 backdrop-blur-sm"
                placeholder="Confirmez votre mot de passe"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-8 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création du compte...
                </span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
