'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserCircleIcon,
  CreditCardIcon,
  BellIcon,
  TrophyIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const userNavItems: NavItem[] = [
  { name: 'Vue d\'ensemble', href: '/dashboard', icon: <HomeIcon className="w-6 h-6" /> },
  { name: 'Profil', href: '/dashboard/profile', icon: <UserCircleIcon className="w-6 h-6" /> },
  { name: 'Transactions', href: '/dashboard/transactions', icon: <CreditCardIcon className="w-6 h-6" /> },
  { name: 'Notifications', href: '/dashboard/notifications', icon: <BellIcon className="w-6 h-6" /> },
  { name: 'Tournois', href: '/dashboard/tournaments', icon: <TrophyIcon className="w-6 h-6" /> },
  { name: 'Statistiques', href: '/dashboard/stats', icon: <ChartBarIcon className="w-6 h-6" /> },
];

export default function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [pathname, isMobile]);

  // Gestion des touches du clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && isMobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMobile]);

  // Focus trap pour le menu mobile
  useEffect(() => {
    if (!isMobile || !isOpen || !navRef.current) return;

    const focusableElements = navRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Bouton du menu mobile avec aria-labels améliorés */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="nav-menu"
        aria-label={isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-600" aria-hidden="true" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-600" aria-hidden="true" />
        )}
      </button>

      {/* Overlay avec gestion du clic et du focus */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      {/* Navigation avec rôle et aria-labels */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            ref={navRef}
            id="nav-menu"
            role="navigation"
            aria-label="Menu principal"
            initial={isMobile ? { x: '-100%' } : undefined}
            animate={{ x: 0 }}
            exit={isMobile ? { x: '-100%' } : undefined}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className={`
              fixed left-0 top-0 bottom-0 z-40
              w-64 bg-white shadow-xl
              transform transition-transform duration-300 ease-in-out
              ${isMobile ? 'h-full overflow-y-auto' : 'sticky top-0 h-screen'}
            `}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200">
                <h2 id="nav-heading" className="text-xl font-bold text-gray-800">
                  Dashboard
                </h2>
              </div>

              <div
                className="flex-1 px-2 space-y-1 py-4"
                role="menu"
                aria-labelledby="nav-heading"
              >
                {userNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-lg
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500
                        ${isActive
                          ? 'bg-orange-100 text-orange-600'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <span className="mr-3" aria-hidden="true">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Contenu principal avec landmark */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${isOpen ? 'md:ml-64' : 'ml-0'}
          ${isMobile ? 'mt-16' : 'mt-0'}
        `}
        role="main"
        aria-label="Contenu principal"
      >
        <div className="container mx-auto px-4 py-8">
          {/* Le contenu du dashboard sera injecté ici */}
        </div>
      </main>
    </>
  );
}
