import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { type Prisma } from '@prisma/client';
import { type Prize, type Region, type GameCategory } from '@/types/game';

type PrizeCreateData = Omit<Prisma.PrizeCreateInput, 'games' | 'gamePrizes' | 'tournaments' | 'userPrizes' | 'gameHistory'> & {
  name: string;
  category: GameCategory;
  pointValue: number;
  region: Region;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  stock?: number;
};

// Récupérer tous les prix
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
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

    // Récupérer les prix
    const prizes = await prisma.prize.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(prizes);
  } catch (error) {
    console.error('Error fetching prizes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des prix' },
      { status: 500 }
    );
  }
}

// Créer un nouveau prix
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
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

    const data = await request.json() as PrizeCreateData;
    
    // Validation des données
    if (!data.name || !data.category || !data.pointValue || !data.region) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Validation de la catégorie
    if (!['FOOD', 'CLOTHING', 'SUPER'].includes(data.category)) {
      return NextResponse.json(
        { error: 'Catégorie invalide' },
        { status: 400 }
      );
    }

    // Validation de la région
    if (!['BLACK_AFRICA', 'WHITE_AFRICA', 'EUROPE', 'ASIA', 'AMERICA'].includes(data.region)) {
      return NextResponse.json(
        { error: 'Région invalide' },
        { status: 400 }
      );
    }

    // Créer le prix
    const prize = await prisma.prize.create({
      data: {
        name: data.name,
        description: data.description || '',
        category: data.category,
        pointValue: data.pointValue,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive ?? true,
        stock: data.stock ?? 0,
        region: data.region
      },
    });

    return NextResponse.json(prize);
  } catch (error) {
    console.error('Error creating prize:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du prix' },
      { status: 500 }
    );
  }
}

// Mettre à jour un prix
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await request.json() as Partial<PrizeCreateData>;
    const prizeId = request.url.split('/').pop();

    if (!prizeId) {
      return NextResponse.json(
        { error: 'ID du prix manquant' },
        { status: 400 }
      );
    }

    // Mettre à jour le prix
    const prize = await prisma.prize.update({
      where: { id: prizeId },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        pointValue: data.pointValue,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        stock: data.stock,
        region: data.region
      },
    });

    return NextResponse.json(prize);
  } catch (error) {
    console.error('Error updating prize:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du prix' },
      { status: 500 }
    );
  }
}

// Supprimer un prix
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const prizeId = request.url.split('/').pop();

    if (!prizeId) {
      return NextResponse.json(
        { error: 'ID du prix manquant' },
        { status: 400 }
      );
    }

    // Supprimer le prix
    await prisma.prize.delete({
      where: { id: prizeId },
    });

    return NextResponse.json({ message: 'Prix supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting prize:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du prix' },
      { status: 500 }
    );
  }
}
