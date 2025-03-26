import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Pour des raisons de sécurité, on renvoie toujours un succès même si l'email n'existe pas
      return NextResponse.json(
        { message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.' },
        { status: 200 }
      );
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base de données
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // TODO: Envoyer l'email avec le lien de réinitialisation
    // Pour le moment, on simule juste l'envoi
    console.log(`Reset token for ${email}: ${resetToken}`);

    return NextResponse.json(
      { message: 'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la réinitialisation du mot de passe' },
      { status: 500 }
    );
  }
} 