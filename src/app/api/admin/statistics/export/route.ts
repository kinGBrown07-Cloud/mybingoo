import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { User, Prize, Game, UserPrize, GameHistory, Category, Region } from '@prisma/client';

// Define the exact shape of prize data we need for statistics
interface PrizeStats {
  name: string;
  pointValue: number;
  category: Category;
  isActive: boolean;
  region: Region;
}

interface UserPrizeWithStats extends Omit<UserPrize, 'prize'> {
  prize: PrizeStats;
}

interface UserWithStats extends Omit<User, 'UserPrize'> {
  games: Game[];
  gameHistory: GameHistory[];
  UserPrize: UserPrizeWithStats[];
}

export async function GET() {
  try {
    // Récupérer tous les utilisateurs avec leurs statistiques
    const users = await prisma.user.findMany({
      include: {
        games: true,
        GameHistory: true,
        UserPrize: {
          include: {
            prize: {
              select: {
                name: true,
                pointValue: true,
                category: true,
                isActive: true,
                region: true
              }
            }
          }
        }
      }
    }) as unknown as UserWithStats[];

    // Préparer les données pour l'export Excel
    const data = users.map((user: UserWithStats) => {
      const totalGames = user.games.length;
      const gamesWon = user.gameHistory.filter((game: GameHistory) => game.won).length;
      const gamesLost = totalGames - gamesWon;
      const prizesWon = user.UserPrize.map((up: UserPrizeWithStats) => up.prize);

      return {
        userId: user.id,
        name: user.name || 'N/A',
        email: user.email || 'N/A',
        country: user.country || 'N/A',
        totalGames,
        gamesWon,
        gamesLost,
        winRate: totalGames > 0 ? ((gamesWon / totalGames) * 100).toFixed(2) + '%' : '0%',
        prizesWon: prizesWon.length,
        prizes: prizesWon.map((p: PrizeStats) => `${p.name} (${p.region})`).join(', '),
        registrationDate: user.createdAt.toISOString().split('T')[0],
        lastActivity: user.updatedAt.toISOString().split('T')[0],
        points: user.points,
        currency: user.currency || 'N/A'
      };
    });

    // Créer le workbook Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(wb, ws, 'User Statistics');

    // Générer le buffer Excel
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Retourner le fichier Excel
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=user_statistics.xlsx'
      }
    });
  } catch (error) {
    console.error('Error generating statistics:', error);
    return NextResponse.json({ error: 'Failed to generate statistics' }, { status: 500 });
  }
}
