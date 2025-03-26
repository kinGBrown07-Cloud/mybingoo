import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    // Récupérer les statistiques
    const [
      totalUsers,
      activeUsers,
      totalPrizes,
      totalTransactions,
      totalPoints,
      recentTransactions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 derniers jours
          }
        }
      }),
      prisma.prize.count(),
      prisma.transaction.count(),
      prisma.user.aggregate({
        _sum: {
          points: true
        }
      }),
      prisma.transaction.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      totalPrizes,
      totalTransactions,
      totalPoints: totalPoints._sum.points || 0,
      recentTransactions
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
