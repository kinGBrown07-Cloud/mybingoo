import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { Tournament, Prize } from '@prisma/client';

interface TournamentWithRelations extends Tournament {
  _count: {
    participants: number;
  };
  prize: Prize;
}

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les tournois actifs et à venir
    const tournaments = await prisma.tournament.findMany({
      where: {
        OR: [
          { status: 'UPCOMING' },
          { status: 'ACTIVE' },
          { status: 'REGISTERING' }
        ]
      },
      include: {
        _count: {
          select: { participants: true }
        },
        prize: true
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    const formattedTournaments = tournaments.map((tournament: TournamentWithRelations) => ({
      id: tournament.id,
      name: tournament.name,
      participants: tournament._count.participants,
      prize: tournament.prize.name,
      prizeValue: tournament.prize.pointValue,
      status: tournament.status,
      startDate: tournament.startTime,
      endDate: tournament.endTime,
      entryFee: tournament.entryFee
    }));

    return NextResponse.json(formattedTournaments);
  } catch (error) {
    console.error('Erreur lors de la récupération des tournois:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
