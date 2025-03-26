import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import * as XLSX from 'xlsx';

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

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
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

    // Récupérer tous les logs
    const logs = await prisma.log.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Formater les données pour l'export
    const formattedLogs = logs.map((log) => ({
      Date: new Date(log.createdAt).toLocaleString(),
      Niveau: log.level,
      Catégorie: log.category,
      Message: log.message,
      'Métadonnées': JSON.stringify(log.metadata, null, 2),
    }));

    // Créer le workbook
    const wb = XLSX.utils.book_new();

    // Ajouter la feuille
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(formattedLogs),
      'Logs'
    );

    // Générer le buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Retourner le fichier
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=logs.xlsx',
      },
    });
  } catch (error) {
    console.error('Export logs error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export des logs' },
      { status: 500 }
    );
  }
}
