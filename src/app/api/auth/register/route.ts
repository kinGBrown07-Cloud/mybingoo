import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Schéma de validation
const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  country: z.string().min(2, 'Veuillez sélectionner un pays'),
  affiliateCode: z.string().optional(),
});

// Configuration des régions et devises
const REGION_CONFIG = {
  AFRIQUE_NOIRE: {
    countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD'],
    currency: 'XOF',
    pointsPerPlay: 5,
    costPerPlay: 500,
  },
  AFRIQUE_BLANCHE: {
    countries: ['MA', 'DZ', 'TN'],
    currency: 'XOF',
    pointsPerPlay: 5,
    costPerPlay: 800,
  },
  EUROPE: {
    countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB'],
    currency: 'EUR',
    pointsPerPlay: 5,
    costPerPlay: 3,
  },
  ASIE: {
    countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG'],
    currency: 'USD',
    pointsPerPlay: 5,
    costPerPlay: 3,
  },
};

// Fonction pour obtenir la configuration de la région en fonction du pays
function getRegionConfigByCountry(countryCode: string) {
  for (const [region, config] of Object.entries(REGION_CONFIG)) {
    if (config.countries.includes(countryCode)) {
      return { region, ...config };
    }
  }
  return null;
}

// Fonction pour générer un code d'affiliation unique
async function generateAffiliateCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let isUnique = false;

  while (!isUnique) {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingUser = await prisma.user.findUnique({
      where: { affiliateCode: code },
    });

    if (!existingUser) {
      isUnique = true;
    }
  }

  return code;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Obtenir la configuration de la région
    const regionConfig = getRegionConfigByCountry(validatedData.country);
    if (!regionConfig) {
      return NextResponse.json(
        { error: 'Pays non pris en charge' },
        { status: 400 }
      );
    }

    // Générer un code d'affiliation unique
    const affiliateCode = await generateAffiliateCode();

    // Créer l'utilisateur dans Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name,
          phone: validatedData.phone,
          country: validatedData.country
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte' },
        { status: 500 }
      );
    }

    // Créer l'utilisateur dans notre base de données
    const user = await prisma.user.create({
      data: {
        id: authData.user!.id, // Utiliser l'ID Supabase
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone,
        country: validatedData.country,
        currency: regionConfig.currency,
        costPerPlay: regionConfig.costPerPlay,
        role: 'USER',
        points: 0,
        affiliateCode,
        referredBy: validatedData.affiliateCode,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        points: true,
        country: true,
        phone: true,
        currency: true,
        costPerPlay: true,
        affiliateCode: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      user,
      message: 'Un email de vérification a été envoyé à votre adresse email'
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    );
  }
}
