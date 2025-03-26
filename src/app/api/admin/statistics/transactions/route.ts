import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer les statistiques par type de transaction
    const stats = await prisma.transaction.groupBy({
      by: ['type'],
      where: {
        status: 'COMPLETED',
      },
      _count: {
        id: true,
      },
      _sum: {
        points: true,
      },
    });

    // Formater les données pour le graphique
    const formattedStats = stats.map((stat) => ({
      type: stat.type,
      count: stat._count.id,
      amount: stat._sum.points || 0,
    }));

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error('Get transaction stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques de transactions' },
      { status: 500 }
    );
  }
}
