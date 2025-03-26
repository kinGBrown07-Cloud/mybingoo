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

    // Récupérer la période
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    // Calculer la date de début en fonction de la période
    const startDate = new Date();
    switch (period) {
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default: // 7d
        startDate.setDate(startDate.getDate() - 7);
    }

    // Récupérer les statistiques quotidiennes
    const dailyStats = await prisma.$queryRaw`
      WITH RECURSIVE dates AS (
        SELECT DATE(${startDate}) as date
        UNION ALL
        SELECT DATE_ADD(date, INTERVAL 1 DAY)
        FROM dates
        WHERE date < CURRENT_DATE()
      ),
      daily_transactions AS (
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as transactions,
          SUM(CASE WHEN status = 'COMPLETED' AND type = 'DEPOSIT' THEN amount ELSE 0 END) as revenue
        FROM Transaction
        WHERE createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
      ),
      daily_users AS (
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as new_users
        FROM User
        WHERE createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
      )
      SELECT 
        dates.date,
        COALESCE(daily_transactions.transactions, 0) as transactions,
        COALESCE(daily_transactions.revenue, 0) as revenue,
        COALESCE(daily_users.new_users, 0) as newUsers
      FROM dates
      LEFT JOIN daily_transactions ON dates.date = daily_transactions.date
      LEFT JOIN daily_users ON dates.date = daily_users.date
      ORDER BY dates.date ASC
    `;

    return NextResponse.json(dailyStats);
  } catch (error) {
    console.error('Get daily stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques quotidiennes' },
      { status: 500 }
    );
  }
}
