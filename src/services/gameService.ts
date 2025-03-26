import { PrismaClient, type Prize as PrismaPrice } from '@prisma/client';
import { type Prize } from '@/types/game';

const prisma = new PrismaClient();

export async function getUserPoints(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });
  return user?.points ?? 0;
}

export async function updateUserPoints(userId: string, points: number): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { points },
  });
}

export async function getAvailablePrizes(category: Prize['category']): Promise<Prize[]> {
  const prizes = await prisma.prize.findMany({
    where: {
      category,
      isActive: true,
      stock: {
        gt: 0,
      },
    },
  });

  return prizes.map((prize: PrismaPrice) => ({
    id: prize.id,
    name: prize.name,
    description: prize.description || '',
    image: prize.imageUrl || '',
    pointValue: prize.pointValue,
    category: prize.category,
    isActive: prize.isActive,
    stock: prize.stock,
    createdAt: prize.createdAt,
    updatedAt: prize.updatedAt,
    value: prize.pointValue, // La valeur est égale aux points pour le moment
    region: prize.region,
  }));
}

export async function saveGameHistory(
  userId: string,
  gameId: string,
  prizeId: string,
  cost: number,
  points: number,
  won: boolean
): Promise<void> {
  await prisma.gameHistory.create({
    data: {
      userId,
      gameId,
      prizeId,
      cost,
      points,
      won,
    },
  });
}