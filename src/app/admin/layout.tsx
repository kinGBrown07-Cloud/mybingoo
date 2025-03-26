'use client';

import AdminGuard from '@/components/auth/AdminGuard';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/dashboard', label: 'Tableau de bord' },
    { href: '/admin/users', label: 'Utilisateurs' },
    { href: '/admin/users/points', label: 'Gestion des Points' },
    { href: '/admin/prizes', label: 'Prix' },
    { href: '/admin/prizes/regions', label: 'Prix par Région' },
    { href: '/admin/transactions', label: 'Transactions' },
    { href: '/admin/settings', label: 'Paramètres' },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        {/* Barre latérale */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
              <p className="text-sm text-gray-500 mt-1">{session?.user?.email}</p>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t">
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="pl-64">
          <main className="p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
