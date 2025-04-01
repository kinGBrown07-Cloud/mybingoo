import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { getRegionConfigByCountry } from '@/lib/region-config';
import prisma from '@/lib/prisma';

// Configuration PayPal
const clientId = process.env.PAYPAL_CLIENT_ID!;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
if (process.env.NODE_ENV === 'production') {
  environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
}
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { points } = await request.json();

    if (!points || points <= 0) {
      return NextResponse.json(
        { error: 'Nombre de points invalide' },
        { status: 400 }
      );
    }

    // Récupérer les informations de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { country: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Obtenir la configuration de la région
    const regionConfig = getRegionConfigByCountry(user.country || 'FR');
    const amount = points * regionConfig.costPerPoint;

    // Créer la commande PayPal
    const order = new paypal.orders.OrdersCreateRequest();
    order.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: regionConfig.currency,
          value: amount.toFixed(2)
        },
        description: `Achat de ${points} points - Région: ${regionConfig.region}`
      }],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/capture-paypal-order`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      }
    });

    // Exécuter la requête
    const response = await client.execute(order);

    // Sauvegarder la transaction en attente
    const { error: dbError } = await supabase
      .from('pending_transactions')
      .insert({
        userId: session.user.id,
        orderId: response.result.id,
        amount,
        currency: regionConfig.currency,
        points,
        region: regionConfig.region,
        status: 'PENDING'
      });

    if (dbError) {
      throw new Error('Erreur lors de la sauvegarde de la transaction');
    }

    // Trouver le lien d'approbation
    const approvalUrl = response.result.links.find(
      (link: any) => link.rel === 'approve'
    )?.href;

    if (!approvalUrl) {
      throw new Error('Lien d\'approbation PayPal non trouvé');
    }

    return NextResponse.json({ 
      approvalUrl,
      orderDetails: {
        points,
        amount,
        currency: regionConfig.currency,
        region: regionConfig.region,
        costPerPoint: regionConfig.costPerPoint
      }
    });
  } catch (error) {
    console.error('Erreur PayPal:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
