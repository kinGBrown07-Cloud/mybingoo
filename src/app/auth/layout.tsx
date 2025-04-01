'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Masquer temporairement le Navbar et le Footer
  useEffect(() => {
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');
    
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';

    return () => {
      if (navbar) navbar.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full space-y-8 bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image à gauche */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto">
            <Image
              src="/images/auth/farmer.jpg"
              alt="Agriculteur africain récoltant des légumes"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Formulaire à droite */}
          <div className="w-full md:w-1/2 p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
