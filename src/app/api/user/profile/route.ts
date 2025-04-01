import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createAPISupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

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

    // D'abord chercher l'utilisateur par supabaseId
    let userDB = await prisma.user.findUnique({
      where: { 
        supabaseId: user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        image: true,
        points: true,
        balance: true,
        currency: true,
        affiliateCode: true,
        referralCount: true,
        referralEarnings: true,
        region: {
          select: {
            costPerPoint: true,
            pointsPerPlay: true,
            currency: true
          }
        },
        GameHistory: {
          select: {
            id: true,
            gameId: true,
            prizeId: true,
            status: true,
            createdAt: true,
            game: {
              select: {
                won: true
              }
            }
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
        transactions: {
          select: {
            amount: true,
            type: true,
            status: true,
            createdAt: true,
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });

    // Si l'utilisateur n'est pas trouvé, essayer de le trouver par email
    if (!userDB && user.email) {
      userDB = await prisma.user.findUnique({
        where: { email: user.email },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          country: true,
          image: true,
          points: true,
          balance: true,
          currency: true,
          affiliateCode: true,
          referralCount: true,
          referralEarnings: true,
          region: {
            select: {
              costPerPoint: true,
              pointsPerPlay: true,
              currency: true
            }
          },
          GameHistory: {
            select: {
              id: true,
              gameId: true,
              prizeId: true,
              status: true,
              createdAt: true,
              game: {
                select: {
                  won: true
                }
              }
            },
            take: 10,
            orderBy: {
              createdAt: 'desc'
            }
          },
          transactions: {
            select: {
              amount: true,
              type: true,
              status: true,
              createdAt: true,
            },
            take: 10,
            orderBy: {
              createdAt: 'desc'
            }
          },
        },
      });

      // Si trouvé par email, mettre à jour le supabaseId
      if (userDB) {
        await prisma.user.update({
          where: { id: userDB.id },
          data: { supabaseId: user.id }
        });
      }
    }

    // Si toujours pas trouvé, créer un nouvel utilisateur
    if (!userDB && user.email) {
      try {
        // Récupérer la région par défaut (Europe)
        const defaultRegion = await prisma.regionModel.findFirst({
          where: { name: 'EUROPE' }
        });

        if (!defaultRegion) {
          throw new Error('Région par défaut non trouvée');
        }

        userDB = await prisma.user.create({
          data: {
            email: user.email,
            supabaseId: user.id,
            name: user.user_metadata?.name || user.email.split('@')[0],
            password: '', // Mot de passe non nécessaire avec Supabase auth
            regionId: defaultRegion.id,
            currency: defaultRegion.currency,
          },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            country: true,
            image: true,
            points: true,
            balance: true,
            currency: true,
            affiliateCode: true,
            referralCount: true,
            referralEarnings: true,
            region: {
              select: {
                costPerPoint: true,
                pointsPerPlay: true,
                currency: true
              }
            },
            GameHistory: {
              select: {
                id: true,
                gameId: true,
                prizeId: true,
                status: true,
                createdAt: true,
                game: {
                  select: {
                    won: true
                  }
                }
              },
              take: 10,
              orderBy: {
                createdAt: 'desc'
              }
            },
            transactions: {
              select: {
                amount: true,
                type: true,
                status: true,
                createdAt: true,
              },
              take: 10,
              orderBy: {
                createdAt: 'desc'
              }
            },
          },
        });
      } catch (createError) {
        console.error('Erreur lors de la création de l\'utilisateur:', createError);
        return NextResponse.json(
          { error: 'Erreur lors de la création du profil' },
          { status: 500 }
        );
      }
    }

    if (!userDB) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Calculer le coût par partie
    const costPerPlay = userDB.region 
      ? userDB.region.costPerPoint * userDB.region.pointsPerPlay
      : 0;

    // Ajouter le coût par partie à la réponse
    const response = {
      ...userDB,
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

    let imageUrl = undefined;
    if (imageFile) {
      try {
        // S'assurer que le bucket existe avec les bonnes politiques
        await ensureAvatarBucket();

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        // Supprimer les anciennes images de l'utilisateur
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

        // Upload de la nouvelle image
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

    const userDB = await prisma.user.update({
      where: { supabaseId: user.id },
      data: {
        name: name.trim(),
        phone: phone?.trim(),
        country,
        ...(imageUrl && { image: imageUrl }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        image: true,
        points: true,
        balance: true,
        currency: true,
        affiliateCode: true,
        referralCount: true,
        referralEarnings: true,
        region: {
          select: {
            costPerPoint: true,
            pointsPerPlay: true,
            currency: true
          }
        },
        GameHistory: {
          select: {
            id: true,
            gameId: true,
            prizeId: true,
            status: true,
            createdAt: true,
            game: {
              select: {
                won: true
              }
            }
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        },
        transactions: {
          select: {
            amount: true,
            type: true,
            status: true,
            createdAt: true,
          },
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    return NextResponse.json(userDB);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
}