import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Échange le code contre une session
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // Mettre à jour le statut de vérification dans notre base de données
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });

      // Créer une notification de bienvenue
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: 'VERIFICATION',
          message: 'Bienvenue sur Mybingoo ! Votre compte a été vérifié avec succès.',
          read: false
        },
      });

      // Rediriger vers le tableau de bord
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }
  }

  // En cas d'erreur, rediriger vers la page de connexion
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=verification_failed`);
}
