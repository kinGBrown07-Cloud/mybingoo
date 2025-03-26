import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function GET() {
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

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Statistiques des utilisateurs
    const [
      totalUsers,
      activeUsers,
      newUsers,
      totalPoints,
      averagePointsPerUser
    ] = await Promise.all([
      // Total des utilisateurs
      prisma.user.count(),

      // Utilisateurs actifs (avec une session dans les 30 derniers jours)
      prisma.user.count({
        where: {
          Session: {
            some: {
              expires: {
                gte: thirtyDaysAgo
              }
            }
          }
        },
      }),

      // Nouveaux utilisateurs (30 derniers jours)
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      // Total des points
      prisma.user.aggregate({
        _sum: {
          points: true,
        },
      }),

      // Moyenne des points par utilisateur
      prisma.user.aggregate({
        _avg: {
          points: true,
        },
      }),
    ]);

    // Retourner les statistiques
    return NextResponse.json({
      totalUsers,
      activeUsers,
      newUsers,
      totalPoints: totalPoints._sum.points || 0,
      averagePointsPerUser: Math.round(averagePointsPerUser._avg.points || 0),
    });
  } catch (error) {
    console.error('Error getting user statistics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques utilisateurs' },
      { status: 500 }
    );
  }
}
