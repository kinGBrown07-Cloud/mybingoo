import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { headers, cookies } from 'next/headers';

export async function POST(request: NextRequest, { params }: { params: { tournamentId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { tournamentId } = params;

    if (!tournamentId) {
      return NextResponse.json({ error: 'ID du tournoi manquant' }, { status: 400 });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        participants: true,
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: 'Tournoi non trouvé' }, { status: 404 });
    }

    if (tournament.status !== 'REGISTERING') {
      return NextResponse.json({ error: 'Les inscriptions sont fermées' }, { status: 400 });
    }

    if (tournament.participants.length >= tournament.maxPlayers) {
      return NextResponse.json({ error: 'Le tournoi est complet' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { points: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (user.points < tournament.entryFee) {
      return NextResponse.json({ error: 'Points insuffisants' }, { status: 400 });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const existingParticipation = await prisma.tournamentParticipant.findUnique({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId: session.user.id,
        },
      },
    });

    if (existingParticipation) {
      return NextResponse.json({ error: 'Déjà inscrit à ce tournoi' }, { status: 400 });
    }

    // Créer la participation et déduire les points
    await prisma.$transaction([
      prisma.tournamentParticipant.create({
        data: {
          id: `participant_${Date.now()}_${session.user.id}`,
          tournamentId,
          userId: session.user.id,
          score: 0,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          points: {
            decrement: tournament.entryFee,
          },
        },
      }),
    ]);

    return NextResponse.json({ message: 'Inscription réussie' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de l\'inscription au tournoi:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'inscription' }, { status: 500 });
  }
}