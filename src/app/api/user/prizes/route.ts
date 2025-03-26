import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userPrizes = await prisma.userPrize.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        prize: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(userPrizes);
  } catch (error) {
    console.error('Erreur lors de la récupération des prix:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 