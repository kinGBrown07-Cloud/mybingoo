import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { getRegionConfigByCountry } from '@/lib/region-config';
import { PaymentProvider, PaymentStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { points, paymentMethod } = await request.json();

    if (!points || !paymentMethod) {
      return new NextResponse('Points et méthode de paiement requis', { status: 400 });
    }

    // Récupérer les informations de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { country: true }
    });

    if (!user) {
      return new NextResponse('Utilisateur non trouvé', { status: 404 });
    }

    // Obtenir la configuration de la région
    const regionConfig = getRegionConfigByCountry(user.country || 'FR');
    const totalAmount = points * regionConfig.costPerPoint;

    // Créer la transaction
    const paymentData: Prisma.PaymentUncheckedCreateInput = {
      userId: session.user.id,
      amount: totalAmount,
      currency: regionConfig.currency,
      provider: paymentMethod as PaymentProvider,
      type: 'POINTS_PURCHASE',
      status: PaymentStatus.PENDING,
      points: points,
      regionId: regionConfig.region
    };

    const payment = await prisma.payment.create({
      data: paymentData
    });

    // Ici, vous intégreriez votre logique de paiement réelle
    // Pour l'exemple, on simule un succès
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.COMPLETED }
    });

    // Mettre à jour les points de l'utilisateur
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: {
          increment: points
        }
      }
    });

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    return new NextResponse('Erreur lors du traitement du paiement', { status: 500 });
  }
}
