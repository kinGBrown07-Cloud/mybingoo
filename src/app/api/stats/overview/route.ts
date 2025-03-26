import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { subDays, format } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les statistiques des 7 derniers jours
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        GameHistory: {
          where: {
            createdAt: {
              gte: subDays(new Date(), 7)
            }
          },
          include: {
            prize: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Calculer les statistiques par jour
    const stats = last7Days.map(date => {
      const dayGames = user.GameHistory.filter(game => 
        format(new Date(game.createdAt), 'yyyy-MM-dd') === date
      );
      
      const totalGames = dayGames.length;
      const wonGames = dayGames.filter(game => game.won).length;
      const points = dayGames.reduce((acc, game) => acc + (game.prize?.pointValue || 0), 0);
      const winRate = totalGames > 0 ? (wonGames / totalGames) * 100 : 0;

      return {
        date: format(new Date(date), 'dd/MM'),
        games: totalGames,
        points,
        winRate: Math.round(winRate)
      };
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
