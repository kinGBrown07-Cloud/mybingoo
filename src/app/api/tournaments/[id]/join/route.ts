import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const tournamentId = params.id;

    // Vérifier si le tournoi existe et n'est pas complet
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        _count: {
          select: {
            participants: true
          }
        }
      }
    });

    if (!tournament) {
      return new NextResponse('Tournament not found', { status: 404 });
    }

    if (tournament._count.participants >= tournament.maxPlayers) {
      return new NextResponse('Tournament is full', { status: 400 });
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const existingParticipant = await prisma.tournamentParticipant.findUnique({
      where: {
        tournamentId_userId: {
          userId: session.user.id,
          tournamentId
        }
      }
    });

    if (existingParticipant) {
      return new NextResponse('Already participating', { status: 400 });
    }

    // Inscrire l'utilisateur au tournoi
    const participant = await prisma.tournamentParticipant.create({
      data: {
        id: crypto.randomUUID(),
        userId: session.user.id,
        tournamentId,
        score: 0
      }
    });

    return NextResponse.json(participant);
  } catch (error) {
    console.error('Error joining tournament:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
