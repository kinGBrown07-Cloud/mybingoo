import { PrismaClient, TournamentStatus, TournamentParticipant } from '@prisma/client';
import { addHours, isAfter, isBefore } from 'date-fns';

const prisma = new PrismaClient();

interface TournamentConfig {
  name: string;
  description: string;
  entryFee: number;
  duration: number; // en heures
  minPlayers: number;
  maxPlayers: number;
  prizeId: string; // ID du prix associé au tournoi
  prizes: {
    rank: number;
    points: number;
  }[];
}

interface LeaderboardEntry {
  userId: string;
  name: string | null;
  score: number;
  rank: number;
}

export class TournamentSystem {
  private static instance: TournamentSystem;

  private constructor() {
    // Vérifier les tournois toutes les heures
    setInterval(() => this.checkTournaments(), 3600000);
  }

  public static getInstance(): TournamentSystem {
    if (!TournamentSystem.instance) {
      TournamentSystem.instance = new TournamentSystem();
    }
    return TournamentSystem.instance;
  }

  async createTournament(config: TournamentConfig): Promise<{
    success: boolean;
    tournamentId?: string;
    message: string;
  }> {
    try {
      const tournament = await prisma.tournament.create({
        data: {
          id: `tournament_${Date.now()}`, // Génération d'un ID unique
          name: config.name,
          description: config.description,
          entryFee: config.entryFee,
          startTime: new Date(),
          endTime: addHours(new Date(), config.duration),
          minPlayers: config.minPlayers,
          maxPlayers: config.maxPlayers,
          status: TournamentStatus.REGISTERING,
          prizes: config.prizes,
          prizeId: config.prizeId,
        },
      });

      return {
        success: true,
        tournamentId: tournament.id,
        message: 'Tournoi créé avec succès',
      };
    } catch (error) {
      console.error('Erreur lors de la création du tournoi:', error);
      return {
        success: false,
        message: 'Erreur lors de la création du tournoi',
      };
    }
  }

  async joinTournament(tournamentId: string, userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: {
          participants: true,
        },
      });

      if (!tournament) {
        return {
          success: false,
          message: 'Tournoi non trouvé',
        };
      }

      if (tournament.status !== TournamentStatus.REGISTERING) {
        return {
          success: false,
          message: 'Les inscriptions sont fermées',
        };
      }

      if (tournament.participants.length >= tournament.maxPlayers) {
        return {
          success: false,
          message: 'Le tournoi est complet',
        };
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { points: true },
      });

      if (!user) {
        return {
          success: false,
          message: 'Utilisateur non trouvé',
        };
      }

      if (user.points < tournament.entryFee) {
        return {
          success: false,
          message: 'Points insuffisants pour participer',
        };
      }

      // Vérifier si l'utilisateur est déjà inscrit
      const existingParticipation = await prisma.tournamentParticipant.findUnique({
        where: {
          tournamentId_userId: {
            tournamentId,
            userId,
          },
        },
      });

      if (existingParticipation) {
        return {
          success: false,
          message: 'Déjà inscrit à ce tournoi',
        };
      }

      // Créer la participation et déduire les points
      await prisma.$transaction([
        prisma.tournamentParticipant.create({
          data: {
            id: `participant_${Date.now()}_${userId}`,
            tournamentId,
            userId,
            score: 0,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            points: {
              decrement: tournament.entryFee,
            },
          },
        }),
      ]);

      return {
        success: true,
        message: 'Inscription au tournoi réussie',
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription au tournoi:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'inscription au tournoi',
      };
    }
  }

  async updateScore(tournamentId: string, userId: string, points: number): Promise<void> {
    await prisma.tournamentParticipant.update({
      where: {
        tournamentId_userId: {
          tournamentId,
          userId,
        },
      },
      data: {
        score: {
          increment: points,
        },
      },
    });
  }

  private async checkTournaments() {
    try {
      const now = new Date();

      // Mettre à jour les tournois qui devraient commencer
      await prisma.tournament.updateMany({
        where: {
          startTime: {
            lte: now,
          },
          status: TournamentStatus.REGISTERING,
        },
        data: {
          status: TournamentStatus.IN_PROGRESS,
        },
      });

      // Mettre à jour les tournois qui devraient se terminer
      await prisma.tournament.updateMany({
        where: {
          endTime: {
            lte: now,
          },
          status: TournamentStatus.IN_PROGRESS,
        },
        data: {
          status: TournamentStatus.COMPLETED,
        },
      });

      // Distribuer les récompenses pour les tournois terminés
      const completedTournaments = await prisma.tournament.findMany({
        where: {
          status: TournamentStatus.COMPLETED,
          endTime: {
            lte: now,
          },
        },
        include: {
          participants: {
            orderBy: {
              score: 'desc',
            },
          },
        },
      });

      for (const tournament of completedTournaments) {
        const prizes = tournament.prizes as { rank: number; points: number }[];
        
        for (const prize of prizes) {
          const participant = tournament.participants[prize.rank - 1];
          if (participant) {
            await prisma.user.update({
              where: { id: participant.userId },
              data: {
                points: {
                  increment: prize.points,
                },
              },
            });
          }
        }

        // Marquer le tournoi comme traité
        await prisma.tournament.update({
          where: { id: tournament.id },
          data: {
            status: TournamentStatus.COMPLETED,
          },
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des tournois:', error);
    }
  }

  async getTournamentLeaderboard(tournamentId: string): Promise<{
    success: boolean;
    leaderboard?: LeaderboardEntry[];
    message?: string;
  }> {
    try {
      const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          score: 'desc',
        },
      });

      const leaderboard = participants.map((p: TournamentParticipant & { user: { name: string | null } }, index: number) => ({
        userId: p.userId,
        name: p.user.name,
        score: p.score,
        rank: index + 1,
      }));

      return {
        success: true,
        leaderboard,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du classement:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération du classement',
      };
    }
  }
}

export const tournamentSystem = TournamentSystem.getInstance();