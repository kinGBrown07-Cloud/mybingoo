import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Vérifier et rafraîchir la session
  const { data: { session } } = await supabase.auth.getSession();

  // En-têtes de sécurité
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('X-XSS-Protection', '1; mode=block');

  // Routes publiques
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/callback',
    '/api/auth/register',
  ];

  // Vérifier si c'est une ressource statique (images, vidéos)
  const isStaticResource = req.nextUrl.pathname.startsWith('/images/') || 
                         req.nextUrl.pathname.startsWith('/videos/');

  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || 
    req.nextUrl.pathname.startsWith('/api/auth/')
  );

  if (isPublicRoute || isStaticResource) {
    return res;
  }

  // Vérifier l'authentification pour les routes protégées
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Vérifier les permissions admin
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  if (isAdminRoute) {
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.user_metadata?.role === 'ADMIN';
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|videos/).*)',
  ],
};
