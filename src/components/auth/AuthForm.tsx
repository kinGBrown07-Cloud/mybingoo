import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash, faUser, faPhone, faGlobe, faCoins, faUserPlus, faMoneyBill } from '@fortawesome/free-solid-svg-icons';

interface AuthFormProps {
  mode: 'login' | 'register';
}

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
    currency: 'XOF',
    costPerPlay: 300,
    affiliateCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Les mots de passe ne correspondent pas');
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            country: formData.country,
            currency: formData.currency,
            costPerPlay: parseInt(formData.costPerPlay.toString()),
            affiliateCode: formData.affiliateCode,
          })
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        toast.success('Compte créé avec succès!');
        
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: '/dashboard'
        });

        if (signInResult?.error) {
          toast.error(signInResult.error);
          return;
        }

        router.push('/dashboard');
      } else {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: '/dashboard'
        });

        if (result?.error) {
          toast.error(result.error);
          return;
        }

        toast.success('Connexion réussie!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {mode === 'register' && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-orange-700">
                Nom complet
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-orange-500" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  placeholder="Votre nom complet"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-orange-700">
                Téléphone
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faPhone} className="text-orange-500" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  placeholder="Votre numéro de téléphone"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-orange-700">
            Email
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faEnvelope} className="text-orange-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-orange-700">
              Pays
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faGlobe} className="text-orange-500" />
              </div>
              <select
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
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
                  <option value="CD">République Démocratique du Congo</option>
                </optgroup>
                <optgroup label="Afrique du Nord">
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
              </select>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-orange-700">
            Mot de passe
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="text-orange-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              placeholder="Votre mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-500 hover:text-orange-600"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-orange-700">
                Confirmer le mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-orange-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  placeholder="Confirmez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-500 hover:text-orange-600"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-orange-700">
                Devise
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faMoneyBill} className="text-orange-500" />
                </div>
                <select
                  id="currency"
                  name="currency"
                  required
                  value={formData.currency}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                >
                  <option value="XOF">XOF (FCFA)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="costPerPlay" className="block text-sm font-medium text-orange-700">
                Coût par partie
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faCoins} className="text-orange-500" />
                </div>
                <input
                  id="costPerPlay"
                  name="costPerPlay"
                  type="number"
                  required
                  min="100"
                  step="100"
                  value={formData.costPerPlay}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  placeholder={`Coût en ${formData.currency}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="affiliateCode" className="block text-sm font-medium text-orange-700">
                Code d'affiliation (optionnel)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUserPlus} className="text-orange-500" />
                </div>
                <input
                  id="affiliateCode"
                  name="affiliateCode"
                  type="text"
                  value={formData.affiliateCode}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-orange-300 rounded-md text-orange-900 placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                  placeholder="Code d'affiliation (optionnel)"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
      >
        {isLoading ? (mode === 'login' ? 'Connexion en cours...' : 'Création en cours...') : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
      </button>
    </form>
  );
}
