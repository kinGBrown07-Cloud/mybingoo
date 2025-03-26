'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  isFeatured?: boolean;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: session } = useSession() as { data: Session | null };

  const toggleDropdown = (menu: string) => {
    if (activeDropdown === menu) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
    }
  };

  const menuItems = {
    lots: [
      {
        name: 'Super Lot du Moment',
        href: '/prizes/super',
        icon: <SparklesIcon className="w-5 h-5" />,
        description: 'Tentez de gagner notre lot exceptionnel',
        isFeatured: true
      },
      {
        name: 'Lots du moment',
        href: '/prizes/current',
        icon: <FireIcon className="w-5 h-5" />,
        description: 'Découvrez nos lots exceptionnels'
      },
      {
        name: 'Tous les lots',
        href: '/prizes',
        icon: <GiftIcon className="w-5 h-5" />,
        description: 'Explorez notre catalogue complet'
      },
      {
        name: 'Gagnants',
        href: '/winners',
        icon: <TrophyIcon className="w-5 h-5" />,
        description: 'Nos heureux gagnants'
      }
    ],
    jouer: [
      {
        name: 'Acheter des tickets',
        href: '/play/buy',
        icon: <TicketIcon className="w-5 h-5" />,
        description: 'Participez à la tombola'
      },
      {
        name: 'Points bonus',
        href: '/play/bonus',
        icon: <SparklesIcon className="w-5 h-5" />,
        description: 'Gagnez des points supplémentaires'
      },
      {
        name: 'Convertir des points',
        href: '/play/convert',
        icon: <CurrencyEuroIcon className="w-5 h-5" />,
        description: 'Échangez vos points contre des tickets'
      }
    ]
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
        <div className="flex justify-between h-16 items-center bg-red-900/30 backdrop-blur-sm rounded-full px-6 border border-yellow-400/20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Bingoo Tombola"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-white font-bold text-xl">Bingoo</span>
            </Link>
          </div>

          {/* Navigation principale - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button
                onClick={() => toggleDropdown('lots')}
                className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
              >
                <GiftIcon className="w-5 h-5" />
                <span>Lots</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeDropdown === 'lots' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'lots' && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-[800px] bg-red-900/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yellow-400/20"
                  >
                    <div className="p-4">
                      <div className="grid grid-cols-12 gap-6">
                        {/* Super Lot du Moment */}
                        {menuItems.lots.filter(item => item.isFeatured).map((item) => (
                          <div key={item.name} className="col-span-5">
                            <Link href={item.href} className="group">
                              <div className="relative h-48 rounded-lg overflow-hidden mb-4 border-2 border-yellow-400/50">
                                <Image
                                  src='/images/prizes/super-prizes/motorcycle.png'
                                  alt={item.name}
                                  fill
                                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 to-transparent">
                                  <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="flex items-center space-x-2 text-yellow-400">
                                      {item.icon}
                                      <h3 className="text-lg font-bold">{item.name}</h3>
                                    </div>
                                    <p className="text-white/90 text-sm mt-1">{item.description}</p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}

                        {/* Autres lots */}
                        <div className="col-span-7">
                          <div className="grid grid-cols-2 gap-4">
                            {menuItems.lots.filter(item => !item.isFeatured).map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-start p-3 hover:bg-red-800/50 rounded-lg group"
                              >
                                <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden relative">
                                  <div className="flex items-center justify-center w-full h-full bg-yellow-400/10 rounded-md">
                                    {item.icon}
                                  </div>
                                </div>
                                <div className="ml-4">
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
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
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

              {activeDropdown === 'jouer' && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-80 bg-red-900/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yellow-400/20"
                  >
                    <div className="p-2">
                      {menuItems.jouer.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-start p-3 hover:bg-red-800/50 rounded-lg group"
                        >
                          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden relative">
                            <div className="flex items-center justify-center w-full h-full bg-yellow-400/10 rounded-md">
                              {item.icon}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              {item.icon}
                              <p className="ml-2 text-sm font-medium text-white group-hover:text-yellow-400">
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
                </AnimatePresence>
              )}
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
            {session ? (
              <>
                {session.user?.role === 'ADMIN' && (
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
                    {session?.user?.image ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-yellow-400">
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'Photo de profil'}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <UserCircleIcon className="w-8 h-8 text-yellow-400" />
                    )}
                  </button>

                  {activeDropdown === 'profile' && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-red-900/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yellow-400/20"
                      >
                        <div className="p-4">
                          <div className="flex items-center space-x-3 mb-4">
                            {session?.user?.image ? (
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400">
                                <Image
                                  src={session.user.image}
                                  alt={session.user.name || 'Photo de profil'}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <UserCircleIcon className="w-12 h-12 text-white" />
                            )}
                            <div>
                              <p className="text-white font-medium">{session.user?.name}</p>
                              <p className="text-yellow-400/70 text-sm">{session.user?.role}</p>
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
                              onClick={() => signOut()}
                              className="flex items-center space-x-2 text-white hover:text-yellow-400 transition-colors p-2 rounded-lg hover:bg-red-800/50 w-full"
                            >
                              <ArrowRightOnRectangleIcon className="w-5 h-5" />
                              <span>Déconnexion</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
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
                  className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors px-4 py-1.5 bg-red-700/50 rounded-full border border-yellow-400/30 hover:bg-red-600/50"
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
          <div className="md:hidden mt-2 bg-red-900/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-yellow-400/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/prizes"
                className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
              >
                Lots
              </Link>
              <Link
                href="/play"
                className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
              >
                Jouer
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
              >
                À propos
              </Link>
              {session ? (
                <>
                  {session.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                    >
                      Administration
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                  >
                    Mon compte
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-white hover:text-yellow-400 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block mx-3 my-2 px-4 py-2 text-white hover:text-yellow-400 transition-colors bg-red-700/50 rounded-full border border-yellow-400/30 hover:bg-red-600/50"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
