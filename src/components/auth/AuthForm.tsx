'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faUser, faPhone, faGlobe, faCoins } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { REGION_CONFIG } from '@/config/regions';

interface AuthFormProps {
  mode: 'login' | 'register';
}

const supabase = createClientComponentClient();

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    currency: '',
    costPerPoint: 0,
    affiliateCode: '',
    referredBy: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'country') {
      // Trouver la région correspondante au pays
      const region = Object.entries(REGION_CONFIG).find(([_, config]) => 
        config.countries.includes(value as any)
      );

      if (region) {
        const [_, config] = region;
        const totalCost = config.costPerPoint * config.pointsPerPlay;
        setFormData(prev => ({
          ...prev,
          [name]: value,
          currency: config.currency,
          costPerPoint: totalCost,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        // Validation des champs requis
        if (!formData.name || !formData.phone || !formData.country) {
          toast.error('Veuillez remplir tous les champs obligatoires', { duration: 5000 });
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas', { duration: 5000 });
          setIsLoading(false);
          return;
        }

        // Validation du format de téléphone
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
          toast.error('Numéro de téléphone invalide', { duration: 5000 });
          setIsLoading(false);
          return;
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error('Adresse email invalide', { duration: 5000 });
          setIsLoading(false);
          return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              name: formData.name,
              phone: formData.phone,
              country: formData.country,
              currency: formData.currency,
              costPerPoint: formData.costPerPoint,
              affiliateCode: formData.affiliateCode,
              referredBy: formData.referredBy,
            },
          },
        });

        if (authError) {
          console.error('Erreur d\'inscription:', authError);
          if (authError.message === 'User already registered') {
            toast.error('Cet email est déjà enregistré', { duration: 5000 });
          } else if (authError.message.includes('password')) {
            toast.error('Le mot de passe doit contenir au moins 6 caractères', { duration: 5000 });
          } else {
            toast.error('Erreur lors de l\'inscription', { duration: 5000 });
          }
          setIsLoading(false);
          return;
        }

        if (authData) {
          toast.success('Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.', { duration: 8000 });
          router.push('/auth/verify-request');
        }
      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          console.error('Erreur de connexion:', authError);
          if (authError.message === 'Invalid login credentials') {
            toast.error('Email ou mot de passe incorrect', { duration: 5000 });
          } else if (authError.message === 'Email not confirmed') {
            toast.error('Votre email n\'a pas été confirmé. Veuillez vérifier votre boîte de réception.', { duration: 5000 });
            
            // Renvoyer l'email de confirmation
            await supabase.auth.resend({
              type: 'signup',
              email: formData.email,
            });
          } else {
            toast.error('Erreur lors de la connexion', { duration: 5000 });
          }
          setIsLoading(false);
          return;
        }

        if (authData.user) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('supabaseId', authData.user.id)
            .single();

          if (userError) {
            console.error('Erreur lors de la récupération du rôle:', userError);
            toast.error('Erreur lors de la récupération de vos données', { duration: 5000 });
            setIsLoading(false);
            return;
          }

          toast.success('Connexion réussie', { duration: 5000 });
          if (userData?.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else {
            router.push('/dashboard');
          }
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Erreur inattendue:', error);
      toast.error('Une erreur inattendue s\'est produite', { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Une erreur est survenue', { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {mode === 'register' && (
          <>
            {/* Section Informations Personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informations Personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Nom complet"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Numéro de téléphone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <FontAwesomeIcon icon={faGlobe} className="text-gray-400" />
                </div>
                <select
                  id="country"
                  name="country"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez votre pays</option>
                  <optgroup label="Afrique Noire">
                    <option value="CI">Côte d'Ivoire</option>
                    <option value="SN">Sénégal</option>
                    <option value="CM">Cameroun</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="ML">Mali</option>
                    <option value="GN">Guinée</option>
                    <option value="BJ">Bénin</option>
                    <option value="TG">Togo</option>
                    <option value="NE">Niger</option>
                    <option value="CG">Congo</option>
                    <option value="GA">Gabon</option>
                    <option value="CD">RD Congo</option>
                  </optgroup>
                  <optgroup label="Afrique Blanche">
                    <option value="MA">Maroc</option>
                    <option value="DZ">Algérie</option>
                    <option value="TN">Tunisie</option>
                  </optgroup>
                  <optgroup label="Europe">
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="IT">Italie</option>
                    <option value="DE">Allemagne</option>
                    <option value="ES">Espagne</option>
                    <option value="PT">Portugal</option>
                    <option value="GB">Royaume-Uni</option>
                  </optgroup>
                  <optgroup label="Asie">
                    <option value="CN">Chine</option>
                    <option value="JP">Japon</option>
                    <option value="KR">Corée du Sud</option>
                    <option value="VN">Vietnam</option>
                    <option value="TH">Thaïlande</option>
                    <option value="ID">Indonésie</option>
                    <option value="MY">Malaisie</option>
                    <option value="SG">Singapour</option>
                  </optgroup>
                  <optgroup label="Amérique">
                    <option value="US">États-Unis</option>
                    <option value="CA">Canada</option>
                    <option value="BR">Brésil</option>
                    <option value="MX">Mexique</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informations de Compte</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="costPerPoint" className="block text-sm font-medium text-gray-700 mb-1">
                    Coût par partie ({formData.currency || 'EUR'})
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FontAwesomeIcon icon={faCoins} className="text-gray-400" />
                  </div>
                  <input
                    id="costPerPoint"
                    name="costPerPoint"
                    type="number"
                    readOnly
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-gray-50"
                    value={formData.costPerPoint}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="affiliateCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Code d'affiliation
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    id="affiliateCode"
                    name="affiliateCode"
                    type="text"
                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Code d'affiliation (optionnel)"
                    value={formData.affiliateCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Code de parrainage
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <input
                  id="referredBy"
                  name="referredBy"
                  type="text"
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Code de parrainage (optionnel)"
                  value={formData.referredBy}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        )}

        {/* Section Compte */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">{mode === 'register' ? 'Informations de Compte' : 'Connexion'}</h3>
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-orange-700">
              Adresse email
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <FontAwesomeIcon icon={faEnvelope} className="text-orange-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-orange-700">
              Mot de passe
            </label>
            {mode === 'login' && (
              <a href="/auth/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-700">
                Mot de passe oublié ?
              </a>
            )}
          </div>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="text-orange-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="block w-full pl-10 pr-10 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              placeholder="Votre mot de passe"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-500 hover:text-orange-600"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {mode === 'register' && (
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-orange-700">
                Confirmer le mot de passe
              </label>
            </div>
          )}
          {mode === 'register' && (
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-orange-500" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="block w-full pl-10 pr-10 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-500 hover:text-orange-600"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'login' ? 'Connexion...' : 'Inscription...'}
              </span>
            ) : (
              mode === 'login' ? 'Se connecter' : "S'inscrire"
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <a href="/auth/register" className="font-medium text-orange-600 hover:text-orange-700">
                Créez-en un ici
              </a>
            </p>
          ) : (
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <a href="/auth/login" className="font-medium text-orange-600 hover:text-orange-700">
                Connectez-vous ici
              </a>
            </p>
          )}
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-orange-600" />
            <span className="ml-2">Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <FontAwesomeIcon icon={faGithub} className="h-5 w-5 text-gray-900" />
            <span className="ml-2">GitHub</span>
          </button>
        </div>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou avec votre email</span>
        </div>
      </div>
    </div>
  );
}
