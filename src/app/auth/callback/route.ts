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
        // Récupérer les métadonnées de l'utilisateur
        const metadata = user.user_metadata || {};
        
        // Déterminer la devise et le coût par partie en fonction du pays
        let currency = 'XOF';
        let costPerPlay = 300;
        
        if (['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB'].includes(metadata.country)) {
          currency = 'EUR';
          costPerPlay = 2;
        } else if (['MA', 'DZ', 'TN'].includes(metadata.country)) {
          currency = 'EUR';
          costPerPlay = 1;
        } else if (['US', 'CA', 'BR', 'MX'].includes(metadata.country) || 
                   ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG'].includes(metadata.country)) {
          currency = 'USD';
          costPerPlay = 2;
        }

        // Synchroniser avec la table users
        const { error: userError } = await supabase
          .from('users')
          .upsert({
            supabaseId: user.id,
            email: user.email,
            name: metadata.name || user.email?.split('@')[0],
            phone: metadata.phone,
            country: metadata.country,
            currency: currency,
            costPerPlay: costPerPlay,
            role: metadata.role || 'USER',
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            affiliateCode: metadata.affiliateCode,
            referredBy: metadata.referredBy
          });

        if (userError) {
          console.error('Erreur de synchronisation avec la table users:', userError);
        }

        // Créer une notification de bienvenue
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            userId: user.id,
            type: 'VERIFICATION',
            message: 'Bienvenue sur Mybingoo ! Votre compte a été vérifié avec succès.',
            read: false,
            createdAt: new Date().toISOString()
          });

        if (notifError) {
          console.error('Erreur de création de la notification:', notifError);
        }
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
