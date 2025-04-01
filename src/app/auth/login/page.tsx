'use client';

import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-600">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre compte
          </p>
        </div>

        <AuthForm mode="login" />
      </div>
    </div>
  );
}
