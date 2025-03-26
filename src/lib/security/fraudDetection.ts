import prisma from '@/lib/prisma';
import { monitoring } from '@/lib/monitoring';
import { LogCategory, LogLevel } from '@prisma/client';

interface GamePoints {
  points: number;
}

export class FraudDetection {
  private static instance: FraudDetection;

  private constructor() {}

  public static getInstance(): FraudDetection {
    if (!FraudDetection.instance) {
      FraudDetection.instance = new FraudDetection();
    }
    return FraudDetection.instance;
  }

  async detectSuspiciousActivity(userId: string, action: string) {
    try {
      // Vérifier le nombre de transactions dans un court laps de temps
      const recentTransactions = await prisma.transaction.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000), // 5 dernières minutes
          },
        },
      });

      if (recentTransactions > 10) {
        await this.reportFraud(userId, 'too_many_transactions', 
          `Trop de transactions en peu de temps: ${recentTransactions} en 5 minutes`);
        return true;
      }

      // Vérifier les gains importants
      const recentWinnings = await prisma.game.findMany({
        where: {
          userId,
          won: true,
          createdAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000), // Dernière heure
          },
        },
        select: {
          points: true,
        },
      });

      const totalWinnings = recentWinnings.reduce((sum: number, game: GamePoints) => sum + game.points, 0);
      if (totalWinnings > 1000) { // Seuil arbitraire à ajuster
        await this.reportFraud(userId, 'suspicious_winnings',
          `Gains suspects: ${totalWinnings} points en 1 heure`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de la détection de fraude:', error);
      await monitoring.logEvent({
        level: LogLevel.ERROR,
        category: LogCategory.SECURITY,
        message: 'Erreur lors de la détection de fraude',
        metadata: { error, userId, action },
      });
      return false;
    }
  }

  private async reportFraud(userId: string, type: string, description: string) {
    try {
      await prisma.fraudAlert.create({
        data: {
          userId,
          type,
          description,
        },
      });

      await monitoring.logEvent({
        level: LogLevel.WARNING,
        category: LogCategory.SECURITY,
        message: 'Alerte de fraude détectée',
        metadata: { userId, type, description },
      });
    } catch (error) {
      console.error('Erreur lors du signalement de fraude:', error);
      await monitoring.logEvent({
        level: LogLevel.ERROR,
        category: LogCategory.SECURITY,
        message: 'Erreur lors du signalement de fraude',
        metadata: { error, userId, type, description },
      });
    }
  }
}

export const fraudDetection = FraudDetection.getInstance();