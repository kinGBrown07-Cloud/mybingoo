import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/auth/login`);
  }

  const supabase = createRouteHandlerClient({ cookies });
    
  try {
    if (type === 'email') {
      // Vérification d'email
      const { data: { user }, error } = await supabase.auth.verifyOtp({
        token_hash: code,
        type: 'email',
      });

      if (error) throw error;

      if (user) {
        // Créer une notification de bienvenue
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'VERIFICATION',
            message: 'Bienvenue sur Mybingoo ! Votre compte a été vérifié avec succès.',
            read: false
          },
        });
      }
    } else {
      // OAuth callback (Google, GitHub)
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    }

    return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
  } catch (error) {
    console.error('Erreur de vérification:', error);
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=verification_failed`);
  }
}
