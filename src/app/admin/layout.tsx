'use client';

import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  UsersIcon,
  GiftIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useSupabase } from '@/providers/SupabaseProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const navigation = [
  { name: 'Tableau de bord', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Utilisateurs', href: '/admin/users', icon: UsersIcon },
  { name: 'Lots', href: '/admin/prizes', icon: GiftIcon },
  { name: 'Transactions', href: '/admin/transactions', icon: CurrencyDollarIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, signOut } = useSupabase();
  const supabase = createClientComponentClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('supabaseId', user.id)
          .single();

        console.log('User data:', userData); // Pour le débogage

        if (!userData || userData.role.toUpperCase() !== 'ADMIN') {
          router.push('/admin/become');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
      }
    };

    checkSession();
  }, [user, supabase, router]);

  if (!user) {
    return null;
  }

  if (isAdmin === false) {
    return null;
  }

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Menu déroulant pour mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <button
                      type="button"
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Menu utilisateur */}
      <div className="fixed top-4 right-4 z-50">
        <Menu as="div" className="relative">
          <Menu.Button className="flex rounded-full bg-white p-1 shadow-lg focus:outline-none">
            <img
              src={user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40'}
              alt="Photo de profil"
              className="h-10 w-10 rounded-full object-cover"
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                {navigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        href={item.href}
                        className={`${
                          active ? 'bg-gray-50 text-blue-600' : 'text-gray-700'
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        <item.icon className="mr-2 h-5 w-5" aria-hidden="true" />
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={signOut}
                      className={`${
                        active ? 'bg-gray-50 text-red-600' : 'text-red-700'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                      Déconnexion
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
