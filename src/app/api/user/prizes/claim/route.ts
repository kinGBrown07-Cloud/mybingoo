import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { prizeId } = await request.json();

    if (!prizeId) {
      return new NextResponse('Prize ID is required', { status: 400 });
    }

    // Vérifier si le prix existe et est disponible
    const prize = await prisma.prize.findUnique({
      where: { id: prizeId },
    });
    
    if (!prize || !prize.isActive) {
      return new NextResponse('Prize not found or not available', { status: 404 });
    }

    // Vérifier si l'utilisateur a assez de points
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    });

    if (!user || user.points < prize.pointValue) {
      return new NextResponse('Insufficient points', { status: 400 });
    }

    // Créer l'enregistrement Game (cost = 0 car c'est une réclamation, pas un jeu)
    const gameData = {
      userId: session.user.id,
      prizeId: prize.id,
      points: prize.pointValue,
      won: true,
      status: 'COMPLETED' as const,
      cost: 0, // Pas de coût pour une réclamation (différent du coût de jeu de 1 point)
    };

    const game = await prisma.game.create({ data: gameData });

    // Créer l'historique de jeu et mettre à jour les points de l'utilisateur
    const gameHistoryData = {
      userId: session.user.id,
      gameId: game.id,
      prizeId: prize.id,
      won: true,
      points: prize.pointValue, // Points gagnés = valeur du prix
      cost: 0, // Pas de coût pour une réclamation (différent du coût de jeu de 1 point)
    };

    const [gameHistory] = await prisma.$transaction([
      prisma.gameHistory.create({ data: gameHistoryData }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          points: {
            decrement: prize.pointValue,
          },
        },
      }),
      prisma.prize.update({
        where: { id: prize.id },
        data: { isActive: false },
      }),
    ]);

    return NextResponse.json(gameHistory);
  } catch (error) {
    console.error('Error claiming prize:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}