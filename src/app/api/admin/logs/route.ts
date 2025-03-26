import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

// Récupérer les logs avec filtres et pagination
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

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const level = searchParams.get('level') || undefined;
    const category = searchParams.get('category') || undefined;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search') || undefined;

    // Construire les filtres
    const where: any = {};

    if (level) {
      where.level = level;
    }

    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { message: { contains: search } },
        { metadata: { path: '$', string_contains: search } },
      ];
    }

    // Récupérer le nombre total de logs
    const total = await prisma.log.count({ where });

    // Récupérer les logs
    const logs = await prisma.log.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get logs error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des logs' },
      { status: 500 }
    );
  }
}

// Supprimer tous les logs
export async function DELETE(request: Request) {
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

    // Supprimer tous les logs
    await prisma.log.deleteMany();

    return NextResponse.json({ message: 'Logs supprimés avec succès' });
  } catch (error) {
    console.error('Delete logs error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des logs' },
      { status: 500 }
    );
  }
}

// Créer un nouveau log
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { level, category, message, metadata } = data;

    // Créer le log
    const log = await prisma.log.create({
      data: {
        level,
        category,
        message,
        metadata,
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Create log error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du log' },
      { status: 500 }
    );
  }
}
