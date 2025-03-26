import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { amount, currency, paymentMethod } = await request.json();

    if (!amount || !currency || !paymentMethod) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Créer la transaction
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount,
        currency,
        provider: paymentMethod,
        type: 'POINTS_PURCHASE',
        status: 'PENDING'
      }
    });

    // Ici, vous intégreriez votre logique de paiement réelle
    // Pour l'exemple, on simule un succès
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED' }
    });

    // Mettre à jour les points de l'utilisateur
    const pointsToAdd = Math.floor(amount / 100); // 1 point pour chaque 100 unités de monnaie
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: {
          increment: pointsToAdd
        }
      }
    });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Error processing payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
