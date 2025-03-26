import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// Récupérer les paramètres
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

    // Récupérer les paramètres
    let settings = await prisma.settings.findFirst();

    // Si aucun paramètre n'existe, en créer un avec les valeurs par défaut
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          cardsPerGame: 2,
          costPerCard: 1,
          blackAfricaRate: 150,
          whiteAfricaRate: 0.5,
          europeRate: 1.0,
          asiaRate: 1.0,
          americaRate: 1.0,
          defaultPoints: 10,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// Mettre à jour les paramètres
export async function PUT(request: Request) {
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

    const data = await request.json();

    // Valider les données
    if (typeof data.cardsPerGame !== 'number' || data.cardsPerGame < 2) {
      return NextResponse.json(
        { error: 'Le nombre de cartes par partie doit être au moins 2' },
        { status: 400 }
      );
    }

    if (typeof data.costPerCard !== 'number' || data.costPerCard < 1) {
      return NextResponse.json(
        { error: 'Le coût par carte doit être au moins 1 point' },
        { status: 400 }
      );
    }

    // Valider les taux de conversion
    const rates = ['blackAfricaRate', 'whiteAfricaRate', 'europeRate', 'asiaRate', 'americaRate'];
    for (const rate of rates) {
      if (typeof data[rate] !== 'number' || data[rate] <= 0) {
        return NextResponse.json(
          { error: `Le taux de conversion pour ${rate} doit être positif` },
          { status: 400 }
        );
      }
    }

    if (typeof data.defaultPoints !== 'number' || data.defaultPoints < 0) {
      return NextResponse.json(
        { error: 'Les points par défaut doivent être positifs' },
        { status: 400 }
      );
    }

    // Mettre à jour les paramètres
    const settings = await prisma.settings.update({
      where: { id: data.id },
      data: {
        cardsPerGame: data.cardsPerGame,
        costPerCard: data.costPerCard,
        blackAfricaRate: data.blackAfricaRate,
        whiteAfricaRate: data.whiteAfricaRate,
        europeRate: data.europeRate,
        asiaRate: data.asiaRate,
        americaRate: data.americaRate,
        defaultPoints: data.defaultPoints,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}
