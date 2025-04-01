import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { PaymentStatus, PaymentProvider, Prisma } from '@prisma/client';

// Configuration PayPal
const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
if (process.env.NODE_ENV === 'production') {
  environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
}
const client = new paypal.core.PayPalHttpClient(environment);

interface PayPalSearchParams {
  token: string;
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      redirect('/auth/login');
    }

    // Récupérer l'ID de la commande depuis l'URL
    const url = new URL(req.url);
    const searchParams: PayPalSearchParams = {
      token: url.searchParams.get('token') || ''
    };

    if (!searchParams.token) {
      throw new Error('Token PayPal manquant');
    }

    // Récupérer la transaction en attente
    const pendingTx = await prisma.pendingTransaction.findUnique({
      where: { orderId: searchParams.token }
    });

    if (!pendingTx) {
      throw new Error('Transaction non trouvée');
    }

    // Capturer le paiement
    const captureRequest = new paypal.orders.OrdersCaptureRequest(searchParams.token);
    const response = await client.execute(captureRequest);

    if (response.result.status === 'COMPLETED') {
      const captureData = response.result;
      const orderId = captureData.id;

      // Mettre à jour le solde de points de l'utilisateur
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          points: {
            increment: pendingTx.points
          }
        }
      });

      // Créer le paiement
      const paymentData: Prisma.PaymentUncheckedCreateInput = {
        userId: pendingTx.userId,
        amount: pendingTx.amount,
        currency: pendingTx.currency,
        points: pendingTx.points,
        provider: PaymentProvider.PAYPAL,
        type: 'POINTS_PURCHASE',
        status: PaymentStatus.COMPLETED,
        paypalOrderId: searchParams.token,
        regionId: pendingTx.regionId,
        processedAt: new Date()
      };

      const payment = await prisma.payment.create({
        data: paymentData
      });

      // Mettre à jour le paiement avec les informations PayPal
      const updatedPaymentData: Prisma.PaymentUncheckedUpdateInput = {
        status: PaymentStatus.COMPLETED,
        paypalOrderId: orderId,
        transactionId: captureData.purchase_units[0].payments.captures[0].id,
        processedAt: new Date(),
        metadata: captureData
      };

      await prisma.payment.update({
        where: { id: payment.id },
        data: updatedPaymentData
      });

      // Supprimer la transaction en attente
      await prisma.pendingTransaction.delete({
        where: { orderId: searchParams.token }
      });

      // Rediriger vers le tableau de bord avec un message de succès
      redirect('/dashboard?payment=success');
    } else {
      throw new Error('Paiement non complété');
    }
  } catch (error) {
    console.error('Erreur capture PayPal:', error);
    redirect('/dashboard?payment=error');
  }
}
