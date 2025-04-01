import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User not found:', userError);
      return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Current user:', user); // Pour le débogage

    // Vérifier si l'utilisateur existe dans la table users
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('role')
      .eq('supabaseId', user.id)
      .single();

    if (existingUserError) {
      console.error('Error checking existing user:', existingUserError);
      return new NextResponse('Error checking user', { status: 500 });
    }

    if (!existingUser) {
      // Créer l'utilisateur s'il n'existe pas
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            supabaseId: user.id,
            email: user.email,
            role: 'ADMIN'
          }
        ]);

      if (insertError) {
        console.error('Error creating user:', insertError);
        return new NextResponse('Error creating user', { status: 500 });
      }
    } else {
      // Mettre à jour le rôle si l'utilisateur existe
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'ADMIN' })
        .eq('supabaseId', user.id);

      if (updateError) {
        console.error('Error updating user role:', updateError);
        return new NextResponse('Error updating user', { status: 500 });
      }
    }

    // Rediriger vers le tableau de bord admin
    return NextResponse.redirect(new URL('/admin/dashboard', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Error in admin/become:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
