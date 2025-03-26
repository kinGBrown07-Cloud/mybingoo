import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { userId, points } = await request.json();

    if (!userId || typeof points !== 'number') {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { points },
    });

    console.error(`Points modifiés pour l'utilisateur ${user.email} (${points} points)`);

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la modification des points:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la modification des points' },
      { status: 500 }
    );
  }
}
