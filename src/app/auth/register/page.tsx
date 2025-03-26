'use client';

import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-orange-600">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-orange-700">
            Ou{' '}
            <Link
              href="/auth/login"
              className="font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>
        
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
