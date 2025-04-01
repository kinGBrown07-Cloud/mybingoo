import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createAPISupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CountryCode = 'CI' | 'SN' | 'CM' | 'BF' | 'ML' | 'GN' | 'BJ' | 'TG' | 'NE' | 'CG' | 'GA' | 'CD' |
                   'MA' | 'DZ' | 'TN' |
                   'FR' | 'BE' | 'CH' | 'IT' | 'DE' | 'ES' | 'PT' | 'GB' |
                   'CN' | 'JP' | 'KR' | 'VN' | 'TH' | 'ID' | 'MY' | 'SG' |
                   'US' | 'CA' | 'BR' | 'MX';

const REGIONS = {
  AFRIQUE_NOIRE: {
    devise: 'XOF',
    pointPrice: 150,
    countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD'] as CountryCode[]
  },
  AFRIQUE_BLANCHE: {
    devise: 'EUR',
    pointPrice: 0.5,
    countries: ['MA', 'DZ', 'TN'] as CountryCode[]
  },
  EUROPE: {
    devise: 'EUR',
    pointPrice: 1,
    countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB'] as CountryCode[]
  },
  ASIE: {
    devise: 'USD',
    pointPrice: 1,
    countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG'] as CountryCode[]
  },
  AMERIQUE: {
    devise: 'USD',
    pointPrice: 1,
    countries: ['US', 'CA', 'BR', 'MX'] as CountryCode[]
  }
} as const;

type RegionKey = keyof typeof REGIONS;

export async function GET(request: NextRequest) {
  try {
    const supabase = createAPISupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 401 }
      );
    }

    const userDB = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { country: true }
    });

    if (!userDB || !userDB.country) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé ou pays non défini' },
        { status: 404 }
      );
    }

    // Vérifier que le pays est valide
    const country = userDB.country as CountryCode;

    // Trouver la région de l'utilisateur
    let userRegion: RegionKey = 'EUROPE'; // Par défaut
    for (const [region, data] of Object.entries(REGIONS)) {
      if (data.countries.includes(country)) {
        userRegion = region as RegionKey;
        break;
      }
    }

    return NextResponse.json({
      region: userRegion,
      ...REGIONS[userRegion]
    });

  } catch (error) {
    console.error('Error getting user region:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
