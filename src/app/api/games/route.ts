import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { logger } from '../../../lib/logger';
import { LogCategory } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const prizes = await prisma.prize.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(prizes);
  } catch (error) {
    console.error('Erreur lors de la récupération des prix:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();

    // Si c'est une requête de création de prix (admin)
    if (session.user.isAdmin) {
      const prize = await prisma.prize.create({
        data: {
          name: data.name,
          description: data.description,
          pointValue: data.pointValue,
          category: data.category,
          isActive: data.isActive,
          imageUrl: data.image || null,
        },
      });
      return NextResponse.json(prize);
    }

    // Si c'est une requête de jeu (utilisateur)
    const { id } = data;

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Récupérer le lot
    const prize = await prisma.prize.findUnique({
      where: { id },
    });

    if (!prize) {
      return NextResponse.json({ error: 'Lot non trouvé' }, { status: 404 });
    }

    // Vérifier si l'utilisateur a assez de points
    if (user.points < prize.pointValue) {
      return NextResponse.json(
        { error: 'Points insuffisants' },
        { status: 400 }
      );
    }

    // Vérifier si le lot est encore disponible
    if (!prize.isActive) {
      return NextResponse.json(
        { error: 'Lot non disponible' },
        { status: 400 }
      );
    }

    // Calculer si l'utilisateur a gagné (logique simple pour l'exemple)
    const hasWon = Math.random() < 0.3; // 30% de chance de gagner

    // Créer la transaction
    await prisma.$transaction([
      // Déduire les points
      prisma.user.update({
        where: { id: user.id },
        data: { points: { decrement: prize.pointValue } },
      }),
      // Enregistrer la partie
      prisma.game.create({
        data: {
          userId: user.id,
          prizeId: prize.id,
          cost: prize.pointValue,
          won: hasWon,
          points: hasWon ? prize.pointValue : 0, // Ajout du champ points manquant
        },
      }),
      // Si gagné, marquer le lot comme non disponible
      ...(hasWon
        ? [
            prisma.prize.update({
              where: { id: prize.id },
              data: { isActive: false },
            }),
          ]
        : []),
    ]);

    // Logger l'événement
    logger.info('GAME', 'Game played', {
      userId: user.id,
      prizeId: prize.id,
      points: prize.pointValue,
      won: hasWon,
    });

    return NextResponse.json({ won: hasWon });
  } catch (error) {
    logger.error('GAME', 'Error in game route', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json();
    const prize = await prisma.prize.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        pointValue: data.pointValue,
        category: data.category,
        isActive: data.isActive,
        imageUrl: data.image || null,
      },
    });
    return NextResponse.json(prize);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du prix:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    await prisma.prize.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du prix:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
