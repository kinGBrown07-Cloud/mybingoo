import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const REGIONS = {
  AFRIQUE_NOIRE: {
    countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD'],
    currency: 'XOF',
    pointCost: 150
  },
  AFRIQUE_BLANCHE: {
    countries: ['MA', 'DZ', 'TN'],
    currency: 'EUR',
    pointCost: 0.5
  },
  EUROPE: {
    countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB'],
    currency: 'EUR',
    pointCost: 1
  },
  ASIE: {
    countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG'],
    currency: 'USD',
    pointCost: 1
  },
  AMERIQUE: {
    countries: ['US', 'CA', 'BR', 'MX'],
    currency: 'USD',
    pointCost: 1
  }
};

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    // Vérifier si l'utilisateur est admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('supabaseId', session.user.id)
      .single();

    if (!userData || userData.role !== 'ADMIN') {
      console.log('Non autorisé:', { userData, sessionUserId: session.user.id });
      return new NextResponse('Non autorisé', { status: 401 });
    }

    console.log('Récupération des statistiques...'); // Pour le débogage

    // Récupérer les statistiques avec Supabase
    const [
      usersData,
      transactionsData,
      prizesData,
      recentTransactionsData
    ] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('transactions').select('*'),
      supabase.from('prizes').select('*'),
      supabase.from('transactions').select('*, user:users(name, email, country)').order('createdAt', { ascending: false }).limit(10)
    ]);

    const users = usersData.data || [];
    const transactions = transactionsData.data || [];
    const prizes = prizesData.data || [];
    const recentTransactions = recentTransactionsData.data || [];

    // Calculer les statistiques
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => new Date(u.updatedAt) >= thirtyDaysAgo).length,
      totalPrizes: prizes.length,
      totalTransactions: transactions.length,
      totalPoints: users.reduce((sum, user) => sum + (user.points || 0), 0),
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        status: t.status,
        createdAt: t.createdAt,
        user: t.user
      })),
      regions: [
        {
          name: 'AFRIQUE_NOIRE',
          users: users.filter(u => REGIONS.AFRIQUE_NOIRE.countries.includes(u.country || '')).length,
          revenue: transactions
            .filter(t => users.find(u => u.id === t.userId)?.country && REGIONS.AFRIQUE_NOIRE.countries.includes(users.find(u => u.id === t.userId)?.country || ''))
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          currency: REGIONS.AFRIQUE_NOIRE.currency
        },
        {
          name: 'AFRIQUE_BLANCHE',
          users: users.filter(u => REGIONS.AFRIQUE_BLANCHE.countries.includes(u.country || '')).length,
          revenue: transactions
            .filter(t => users.find(u => u.id === t.userId)?.country && REGIONS.AFRIQUE_BLANCHE.countries.includes(users.find(u => u.id === t.userId)?.country || ''))
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          currency: REGIONS.AFRIQUE_BLANCHE.currency
        },
        {
          name: 'EUROPE',
          users: users.filter(u => REGIONS.EUROPE.countries.includes(u.country || '')).length,
          revenue: transactions
            .filter(t => users.find(u => u.id === t.userId)?.country && REGIONS.EUROPE.countries.includes(users.find(u => u.id === t.userId)?.country || ''))
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          currency: REGIONS.EUROPE.currency
        },
        {
          name: 'ASIE',
          users: users.filter(u => REGIONS.ASIE.countries.includes(u.country || '')).length,
          revenue: transactions
            .filter(t => users.find(u => u.id === t.userId)?.country && REGIONS.ASIE.countries.includes(users.find(u => u.id === t.userId)?.country || ''))
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          currency: REGIONS.ASIE.currency
        },
        {
          name: 'AMERIQUE',
          users: users.filter(u => REGIONS.AMERIQUE.countries.includes(u.country || '')).length,
          revenue: transactions
            .filter(t => users.find(u => u.id === t.userId)?.country && REGIONS.AMERIQUE.countries.includes(users.find(u => u.id === t.userId)?.country || ''))
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          currency: REGIONS.AMERIQUE.currency
        }
      ]
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
