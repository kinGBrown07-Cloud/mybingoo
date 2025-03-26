import { GiftIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-emerald-900/95 via-red-900/95 to-red-800/95">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Logo et Description */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Bingoo Tombola"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-2xl font-bold text-white">Bingoo</span>
            </Link>
            <p className="text-gray-300 text-sm mb-6">
              Votre plateforme de loterie en ligne préférée. Tentez votre chance et gagnez des lots exceptionnels avec seulement quelques points.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-yellow-400 font-semibold mb-4">À Propos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Notre Histoire</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Carrières</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-yellow-400 font-semibold mb-4">Services Client</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Mon Compte</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Suivi des Points</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors">Support</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-yellow-400 font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300">
                <PhoneIcon className="h-5 w-5 mr-2 text-emerald-400" />
                +228 90367780
              </li>
              <li className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-emerald-400" />
                contact@mybingoo.com
              </li>
              <li className="flex items-center text-gray-300">
                <MapPinIcon className="h-5 w-5 mr-2 text-emerald-400" />
                123 Rue du Jeu, 75000 Paris
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 Bingoo. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Confidentialité</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Conditions d'utilisation</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
