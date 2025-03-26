import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: 'Token de vérification manquant' },
      { status: 400 }
    );
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Token de vérification invalide' },
        { status: 400 }
      );
    }

    // Mettre à jour le statut de vérification dans notre base de données
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    });

    // Créer une notification de bienvenue
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'Vérification réussie',
        message: 'Bienvenue sur Mybingoo ! Votre compte a été vérifié avec succès.',
        read: false
      },
    });

    return NextResponse.redirect(`${requestUrl.origin}/auth/login?verified=true`);
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}
