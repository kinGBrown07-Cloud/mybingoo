import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth.config';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        phone: true,
        country: true,
        image: true,
        points: true,
        GameHistory: {
          select: {
            won: true,
            createdAt: true,
          },
          take: 10,
        },
        transactions: {
          select: {
            amount: true,
            type: true,
            status: true,
            createdAt: true,
          },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const imageFile = formData.get('image') as File | null;

    let imageUrl = null;

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Créer un nom de fichier unique
      const uniqueId = uuidv4();
      const extension = imageFile.name.split('.').pop();
      const fileName = `${uniqueId}.${extension}`;

      // Définir le chemin de sauvegarde
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles');
      const filePath = join(uploadDir, fileName);

      // Sauvegarder le fichier
      await writeFile(filePath, buffer);

      // Mettre à jour l'URL de l'image
      imageUrl = `/uploads/profiles/${fileName}`;
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        country,
        ...(imageUrl && { image: imageUrl }),
      },
      select: {
        name: true,
        email: true,
        phone: true,
        country: true,
        image: true,
        points: true,
        GameHistory: {
          select: {
            won: true,
            createdAt: true,
          },
          take: 10,
        },
        transactions: {
          select: {
            amount: true,
            type: true,
            status: true,
            createdAt: true,
          },
          take: 10,
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}