'use client';

import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-white/80">
            Ou{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-yellow-400 hover:text-yellow-300"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>
        
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
