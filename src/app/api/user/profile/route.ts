import { NextRequest, NextResponse } from 'next/server';
import { createAPISupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const AVATAR_BUCKET = 'avatars';

async function ensureAvatarBucket() {
  try {
    // Vérifier si le bucket existe
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: any) => bucket.name === AVATAR_BUCKET);

    // Si le bucket n'existe pas, le créer
    if (!bucketExists) {
      const { data, error } = await supabaseAdmin.storage.createBucket(AVATAR_BUCKET, {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error ensuring avatar bucket exists:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAPISupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Erreur d\'authentification');
      return NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 401 }
      );
    }

    // D'abord chercher l'utilisateur dans Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        region:regions (
          costPerPoint,
          pointsPerPlay,
          currency
        ),
        game_history:game_histories (
          id,
          gameId,
          prizeId,
          status,
          createdAt,
          game:games (
            won
          )
        ),
        transactions (
          amount,
          type,
          status,
          createdAt
        )
      `)
      .eq('supabaseId', user.id)
      .order('game_history.createdAt', { foreignTable: 'game_histories', ascending: false })
      .order('transactions.createdAt', { foreignTable: 'transactions', ascending: false })
      .limit(10, { foreignTable: 'game_histories' })
      .limit(10, { foreignTable: 'transactions' })
      .single();

    if (userError) {
      console.error('Erreur de récupération des données utilisateur:', userError);
      return NextResponse.json(
        { error: 'Erreur de récupération des données utilisateur' },
        { status: 500 }
      );
    }

    // Si l'utilisateur n'existe pas dans Supabase, le créer
    if (!userData) {
      // Récupérer la région par défaut (Europe)
      const { data: defaultRegion } = await supabase
        .from('regions')
        .select('*')
        .eq('name', 'EUROPE')
        .single();

      if (!defaultRegion) {
        throw new Error('Région par défaut non trouvée');
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          supabaseId: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          phone: user.user_metadata?.phone,
          country: user.user_metadata?.country,
          regionId: defaultRegion.id,
          currency: defaultRegion.currency,
          role: user.user_metadata?.role || 'USER',
          emailVerified: user.email_confirmed_at ? true : false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select(`
          *,
          region:regions (
            costPerPoint,
            pointsPerPlay,
            currency
          )
        `)
        .single();

      if (createError) {
        console.error('Erreur de création utilisateur:', createError);
        return NextResponse.json(
          { error: 'Erreur de création utilisateur' },
          { status: 500 }
        );
      }

      return NextResponse.json(newUser);
    }

    // Calculer le coût par partie
    const costPerPlay = userData.region 
      ? userData.region.costPerPoint * userData.region.pointsPerPlay
      : 0;

    // Ajouter le coût par partie à la réponse
    const response = {
      ...userData,
      costPerPlay
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAPISupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Erreur d\'authentification');
      return NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const imageFile = formData.get('image') as File | null;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Le nom doit contenir au moins 2 caractères' },
        { status: 400 }
      );
    }

    if (phone && !phone.match(/^\+?[0-9\s-]{8,}$/)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    if (!country || country.length !== 2) {
      return NextResponse.json(
        { error: 'Code pays invalide' },
        { status: 400 }
      );
    }

    // Mise à jour des métadonnées Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: name.trim(),
        phone: phone?.trim(),
        country,
      }
    });

    if (authError) {
      console.error('Erreur de mise à jour des métadonnées:', authError);
      return NextResponse.json(
        { error: 'Erreur de mise à jour des métadonnées' },
        { status: 500 }
      );
    }

    let imageUrl = undefined;
    if (imageFile) {
      try {
        await ensureAvatarBucket();

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        // Supprimer les anciennes images
        const { data: files } = await supabase.storage
          .from(AVATAR_BUCKET)
          .list();
        
        if (files) {
          const oldUserFiles = files.filter((file: any) => 
            file.name.startsWith(`${user.id}-`)
          );

          if (oldUserFiles.length > 0) {
            await supabase.storage
              .from(AVATAR_BUCKET)
              .remove(oldUserFiles.map((file: any) => file.name));
          }
        }

        // Upload nouvelle image
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(AVATAR_BUCKET)
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      } catch (error: any) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
          { error: error.message || 'Erreur lors de l\'upload de l\'image' },
          { status: 500 }
        );
      }
    }

    // Mise à jour utilisateur avec toutes les relations
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        name: name.trim(),
        phone: phone?.trim(),
        country,
        ...(imageUrl && { image: imageUrl }),
        updatedAt: new Date().toISOString(),
      })
      .eq('supabaseId', user.id)
      .select(`
        *,
        region:regions (
          costPerPoint,
          pointsPerPlay,
          currency
        ),
        game_history:game_histories (
          id,
          gameId,
          prizeId,
          status,
          createdAt,
          game:games (
            won
          )
        ),
        transactions (
          amount,
          type,
          status,
          createdAt
        )
      `)
      .order('game_history.createdAt', { foreignTable: 'game_histories', ascending: false })
      .order('transactions.createdAt', { foreignTable: 'transactions', ascending: false })
      .limit(10, { foreignTable: 'game_histories' })
      .limit(10, { foreignTable: 'transactions' })
      .single();

    if (updateError) {
      console.error('Erreur de mise à jour utilisateur:', updateError);
      return NextResponse.json(
        { error: 'Erreur de mise à jour utilisateur' },
        { status: 500 }
      );
    }

    // Calculer le coût par partie
    const costPerPlay = updatedUser.region 
      ? updatedUser.region.costPerPoint * updatedUser.region.pointsPerPlay
      : 0;

    // Ajouter le coût par partie à la réponse
    const response = {
      ...updatedUser,
      costPerPlay
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}