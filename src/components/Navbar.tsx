'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { type BaseUser } from '@/lib/auth';
import { useSupabase } from '@/providers/SupabaseProvider';
import {
  HomeIcon,
  GiftIcon,
  TrophyIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ChevronDownIcon,
  TicketIcon,
  CurrencyEuroIcon,
  FireIcon,
  SparklesIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  TvIcon
} from '@heroicons/react/24/outline';

const formatDisplayName = (email: string | undefined): string => {
  if (!email) return 'Utilisateur';
  
  // Si c'est une adresse email
  if (email.includes('@')) {
    const [localPart] = email.split('@');
    const names = localPart.split('.');
    
    if (names.length > 1) {
      // S'il y a un nom et prénom (ex: jean.dupont@example.com)
      const firstName = names[0];
      const lastInitial = names[1][0];
      return `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)} ${lastInitial.toUpperCase()}.`;
    } else {
      // S'il n'y a qu'un nom (ex: jeandupont@example.com)
      return localPart.charAt(0).toUpperCase() + localPart.slice(1);
    }
  }
  
  // Si c'est déjà un nom formaté
  return email;
};

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  featured?: boolean;
  description: string;
  image?: string;
  theme?: boolean;
  items?: {
    name: string;
    value?: string;
    href?: string;
    icon?: React.ReactNode;
  }[];
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, signOut } = useSupabase();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  const menuItems: MenuItem[] = [
    {
      name: 'Super Lot',
      href: '/prizes/featured',
      icon: <FireIcon className="w-5 h-5 text-yellow-400" />,
      featured: true,
      description: 'Moto Scooter - Un scooter neuf avec casque et accessoires',
      image: '/images/prizes/super-prizes/motorcycle.png'
    },
    {
      name: 'Afrique Noire',
      href: '/play/afrique-noire',
      icon: <SparklesIcon className="w-5 h-5" />,
      description: '300 XOF - 2 points par partie',
      theme: true
    },
    {
      name: 'Afrique Blanche',
      href: '/play/afrique-blanche',
      icon: <SparklesIcon className="w-5 h-5" />,
      description: '1€ - 2 points par partie',
      theme: true
    },
    {
      name: 'Europe',
      href: '/play/europe',
      icon: <SparklesIcon className="w-5 h-5" />,
      description: '2€ - 2 points par partie',
      theme: true
    }
  ];

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 my-2 sm:my-4">
        <div className="flex justify-between h-12 sm:h-16 items-center bg-red-900/30 backdrop-blur-sm rounded-full px-3 sm:px-6 border border-yellow-400/20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Bingoo Tombola"
                width={32}
                height={32}
                className="rounded-full sm:w-10 sm:h-10"
              />
              <span className="text-white font-bold text-base sm:text-xl">Bingoo</span>
            </Link>
          </div>

          {/* Navigation principale - Desktop */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            <div className="relative group">
              <button
                onClick={() => toggleDropdown('lots')}
                className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
              >
                <GiftIcon className="w-5 h-5" />
                <span>Lots</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeDropdown === 'lots' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'lots' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-[90vw] max-w-[900px] -left-1/2 lg:left-0 bg-red-900/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yellow-400/20"
                  >
                    <div className="flex flex-col lg:flex-row gap-4 p-4 lg:p-6">
                      {/* Super lot du moment */}
                      <div className="w-full lg:w-[400px]">
                        <Link
                          href={menuItems[0].href}
                          className="block bg-red-800/30 rounded-lg overflow-hidden group transition-all hover:bg-red-800/50"
                        >
                          <div className="aspect-[16/9] relative">
                            {menuItems[0].image && (
                              <Image
                                src={menuItems[0].image}
                                alt={menuItems[0].name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-yellow-400/20">
                                {menuItems[0].icon}
                              </div>
                              <h3 className="text-base font-medium text-yellow-400">{menuItems[0].name}</h3>
                            </div>
                            <p className="text-sm text-yellow-400/90">{menuItems[0].description}</p>
                          </div>
                        </Link>
                      </div>

                      {/* Thèmes de jeux */}
                      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {menuItems.slice(1).map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block p-3 bg-red-800/30 rounded-lg group transition-all hover:bg-red-800/50"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-yellow-400/20">
                                {item.icon}
                              </div>
                              <h3 className="text-base font-medium text-white group-hover:text-yellow-400">{item.name}</h3>
                            </div>
                            <p className="text-sm text-yellow-400/70">{item.description}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative group">
              <button
                onClick={() => toggleDropdown('jouer')}
                className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
              >
                <TicketIcon className="w-5 h-5" />
                <span>Jouer</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeDropdown === 'jouer' ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === 'jouer' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-80 bg-red-900/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yellow-400/20"
                  >
                    <div className="p-2">
                      {[
                        {
                          name: 'Acheter des tickets',
                          href: '/play/buy',
                          icon: <TicketIcon className="w-5 h-5" />,
                          description: 'À partir de 0.50€ le ticket'
                        },
                        {
                          name: 'Points bonus',
                          href: '/play/bonus',
                          icon: <SparklesIcon className="w-5 h-5" />,
                          description: 'Gagnez jusqu\'à 5 points bonus par jour'
                        },
                        {
                          name: 'Mes tickets',
                          href: '/play/tickets',
                          icon: <CurrencyEuroIcon className="w-5 h-5" />,
                          description: 'Gérez vos tickets et points'
                        }
                      ].map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-start p-3 hover:bg-red-800/50 rounded-lg group"
                        >
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg">
                              {item.icon}
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-white group-hover:text-yellow-400">
                                {item.name}
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-yellow-400/70">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/tournaments"
              className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
            >
              <TrophyIcon className="w-5 h-5" />
              <span>Tournois</span>
            </Link>

            <Link
              href="/about"
              className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
              <span>À propos</span>
            </Link>
          </div>

          {/* Boutons de connexion/inscription */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span>Administration</span>
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('profile')}
                    className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors"
                  >
                    {userData?.image ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-yellow-400">
                        <Image
                          src={userData.image}
                          alt="Photo de profil"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Image
                        src="/images/default-avatar.png"
                        alt="Avatar par défaut"
                        width={32}
                        height={32}
                        className="object-cover rounded-full"
                      />
                    )}
                  </button>

                  {activeDropdown === 'profile' && (
                    <div className="absolute right-0 mt-2 w-64 bg-red-900/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yellow-400/20">
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4">
                          {userData?.image ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400">
                              <Image
                                src={userData.image}
                                alt="Photo de profil"
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <Image
                              src="/images/default-avatar.png"
                              alt="Avatar par défaut"
                              width={48}
                              height={48}
                              className="object-cover rounded-full"
                            />
                          )}
                          <div>
                            <p className="text-white font-medium">{formatDisplayName(user?.email)}</p>
                            <p className="text-yellow-400/70 text-sm">{user?.role}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors p-2 rounded-lg hover:bg-red-800/50"
                          >
                            <UserCircleIcon className="w-5 h-5" />
                            <span>Tableau de bord</span>
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors p-2 rounded-lg hover:bg-red-800/50 w-full"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
                >
                  <UserPlusIcon className="w-5 h-5" />
                  <span>Inscription</span>
                </Link>
              </>
            )}
          </div>

          {/* Menu burger - Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-x-0 top-[4.5rem] p-2 max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="bg-red-900/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yellow-400/20">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Super lot du moment */}
                <Link
                  href={menuItems[0].href}
                  className="block px-3 py-2 text-yellow-400 bg-red-800/30 rounded-lg"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                    {menuItems[0].image && (
                      <Image
                        src={menuItems[0].image}
                        alt={menuItems[0].name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-400/20">
                      {menuItems[0].icon}
                    </div>
                    <div>
                      <div className="font-medium">{menuItems[0].name}</div>
                      <div className="text-xs text-yellow-400/90">{menuItems[0].description}</div>
                    </div>
                  </div>
                </Link>

                {/* Thèmes de jeux */}
                <div className="pt-2 mt-2 border-t border-yellow-400/20">
                  <div className="px-3 mb-2">
                    <h3 className="font-medium text-white">Thèmes de jeux</h3>
                  </div>
                  {menuItems.slice(1).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 text-white hover:bg-red-800/30 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-400/20">
                          {item.icon}
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-yellow-400/70">{item.description}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Section authentification */}
                <div className="pt-2 mt-2 border-t border-yellow-400/20">
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-white hover:bg-red-800/30 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Cog6ToothIcon className="w-5 h-5" />
                            <span>Administration</span>
                          </div>
                        </Link>
                      )}
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-900">
                          {user?.email}
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formatDisplayName(user?.email || '')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.role === 'ADMIN' ? 'Administrateur' : 'Joueur'}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-white hover:bg-red-800/30 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <UserCircleIcon className="w-5 h-5" />
                          <span>Mon compte</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-3 py-2 text-white hover:bg-red-800/30 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <ArrowRightOnRectangleIcon className="w-5 h-5" />
                          <span>Déconnexion</span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-3 py-2 text-white hover:bg-red-800/30 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <UserCircleIcon className="w-5 h-5" />
                          <span>Connexion</span>
                        </div>
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block px-3 py-2 text-white hover:bg-red-800/30 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <UserPlusIcon className="w-5 h-5" />
                          <span>Inscription</span>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
