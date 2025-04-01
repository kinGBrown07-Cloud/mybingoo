import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier si l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer le code secret du body
    const { secretCode } = await request.json();
    
    // Vérifier si le code secret est correct
    const ADMIN_SECRET = 'kingDzdzi13-administration';
    if (secretCode !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Code incorrect' }, { status: 403 });
    }

    // Mettre à jour les métadonnées de l'utilisateur
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role: 'ADMIN' }
    });

    if (updateError) {
      console.error('Erreur lors de la mise à jour du rôle:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Mettre à jour également la table users
    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ role: 'ADMIN' })
      .eq('id', session.user.id);

    if (userUpdateError) {
      console.error('Erreur lors de la mise à jour de la table users:', userUpdateError);
      return NextResponse.json({ error: userUpdateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
