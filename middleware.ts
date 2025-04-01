import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Ces routes sont accessibles sans authentification
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
  '/auth/verify-request',
  '/',
  '/how-to-play',
  '/contact'
];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Rafraîchir la session si elle existe
  const { data: { session } } = await supabase.auth.getSession();

  const requestPath = new URL(request.url).pathname;

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && !publicRoutes.includes(requestPath)) {
    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (session && requestPath.startsWith('/auth/')) {
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
};
