import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rediriger les anciennes routes vers les nouvelles
function redirectOldRoutes(req: NextRequest) {
  const redirects: Record<string, string> = {
    '/login': '/auth/login',
    '/register': '/auth/register'
  };

  const path = req.nextUrl.pathname;
  if (path in redirects) {
    return NextResponse.redirect(new URL(redirects[path], req.url));
  }
  return null;
}

export async function middleware(request: NextRequest) {
  // Vérifier d'abord les redirections
  const redirect = redirectOldRoutes(request);
  if (redirect) return redirect;

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Rafraîchir la session si elle existe
  const { data: { session } } = await supabase.auth.getSession();

  // En-têtes de sécurité
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Force dynamic rendering for authenticated routes
  res.headers.set('Cache-Control', 'no-store, max-age=0');

  // Vérifier si l'utilisateur est authentifié pour les routes protégées
  if (!session && (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/prizes') ||
    request.nextUrl.pathname.startsWith('/tournaments') ||
    request.nextUrl.pathname.startsWith('/play')
  )) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Vérifier si l'utilisateur est admin pour les routes admin
  if (session && request.nextUrl.pathname.startsWith('/admin')) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('supabaseId', session.user.id)
      .single();

    if (!userData || userData.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return res;
}

// Configuration des routes qui nécessitent le middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/prizes/:path*',
    '/tournaments/:path*',
    '/play/:path*',
    '/((?!api/auth|auth|_next|images|videos|favicon.ico|sitemap.xml).*)',
  ]
};
