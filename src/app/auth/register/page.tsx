'use client';

import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return (
    <div>
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
  );
}
