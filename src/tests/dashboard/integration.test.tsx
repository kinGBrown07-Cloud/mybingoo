import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, beforeEach, describe, test, expect } from 'vitest';
import Dashboard from '@/app/dashboard/page';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TestWrapper } from '../utils/TestWrapper';
import { createMockSupabaseClient } from '../utils/supabase-mock';
import type { Region, GameHistory, Transaction } from '@/types/user';

// Mock de Supabase
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(),
}));

// Mock de next/navigation
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: vi.fn(),
  };
});

// Configuration des régions pour les tests
const REGIONS = {
  AFRIQUE_NOIRE: {
    countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD'],
    currency: 'XOF',
    pointsPerPlay: 2,
    costPerPoint: 150,
  },
  AFRIQUE_BLANCHE: {
    countries: ['MA', 'DZ', 'TN'],
    currency: 'EUR',
    pointsPerPlay: 2,
    costPerPoint: 0.5,
  },
  EUROPE: {
    countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB'],
    currency: 'EUR',
    pointsPerPlay: 2,
    costPerPoint: 1,
  },
  ASIE: {
    countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG'],
    currency: 'USD',
    pointsPerPlay: 2,
    costPerPoint: 1,
  },
  AMERIQUE: {
    countries: ['US', 'CA', 'BR', 'MX'],
    currency: 'USD',
    pointsPerPlay: 2,
    costPerPoint: 1,
  },
};

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('affiche correctement les points et coûts selon la région', async () => {
    // Test pour chaque région
    for (const [region, config] of Object.entries(REGIONS)) {
      const mockUser = {
        id: '123',
        country: config.countries[0],
        points: 100,
        balance: 1000,
        currency: config.currency,
        region: {
          costPerPoint: config.costPerPoint,
          pointsPerPlay: config.pointsPerPlay,
          currency: config.currency,
        } as Region,
        gameHistory: [] as GameHistory[],
        transactions: [] as Transaction[],
      };

      // Mock de Supabase avec les données utilisateur
      const mockSupabase = createMockSupabaseClient(mockUser);
      (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

      const { container } = render(
        <TestWrapper>
          <Dashboard />
        </TestWrapper>
      );

      // Vérifier que les points sont affichés correctement
      await waitFor(() => {
        const pointsElement = screen.getByTestId('user-points');
        expect(pointsElement).toHaveTextContent('100');
      });

      // Vérifier que le coût par partie est correct
      const costPerPlay = config.costPerPoint * config.pointsPerPlay;
      await waitFor(() => {
        const costElement = screen.getByTestId('game-cost');
        expect(costElement).toHaveTextContent(`${costPerPlay} ${config.currency}`);
      });

      // Nettoyer le DOM avant le prochain test
      container.remove();
    }
  });

  test('calcule correctement les conversions de devises', async () => {
    const mockUser = {
      id: '123',
      country: 'FR',
      points: 100,
      balance: 1000,
      currency: 'EUR',
      region: {
        costPerPoint: 1,
        pointsPerPlay: 2,
        currency: 'EUR',
      } as Region,
      transactions: [
        {
          id: '1',
          amount: 50,
          points: 50,
          type: 'DEPOSIT',
          status: 'completed',
          provider: 'stripe',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          amount: 32750,
          points: 100,
          type: 'WITHDRAWAL',
          status: 'completed',
          provider: 'stripe',
          createdAt: new Date().toISOString(),
        },
      ] as Transaction[],
      gameHistory: [] as GameHistory[],
    };

    // Mock de Supabase avec les transactions
    const mockSupabase = createMockSupabaseClient(mockUser);
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    const { container } = render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Vérifier que les montants sont convertis correctement
    await waitFor(() => {
      const balanceElement = screen.getByTestId('user-balance');
      expect(balanceElement).toHaveTextContent('1000');

      const depositElement = screen.getByTestId('transaction-deposit');
      expect(depositElement).toHaveTextContent('50 USD');

      const withdrawalElement = screen.getByTestId('transaction-withdrawal');
      expect(withdrawalElement).toHaveTextContent('32750 XOF');
    });

    container.remove();
  });

  test('gère correctement les changements de région', async () => {
    const mockUser = {
      id: '123',
      country: 'FR',
      points: 100,
      balance: 1000,
      currency: 'EUR',
      region: {
        costPerPoint: 1,
        pointsPerPlay: 2,
        currency: 'EUR',
      } as Region,
      gameHistory: [] as GameHistory[],
      transactions: [] as Transaction[],
    };

    // Mock de Supabase avec changement de région
    const mockSupabase = createMockSupabaseClient({
      initial: mockUser,
      updated: {
        ...mockUser,
        country: 'CI',
        currency: 'XOF',
        region: {
          costPerPoint: 150,
          pointsPerPlay: 2,
          currency: 'XOF',
        } as Region,
      },
    });
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    const { container } = render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Vérifier l'affichage initial
    await waitFor(() => {
      const costElement = screen.getByTestId('game-cost');
      expect(costElement).toHaveTextContent('2 EUR');
    });

    // Simuler le changement de pays
    const countrySelect = await screen.findByTestId('country-select');
    fireEvent.change(countrySelect, { target: { value: 'CI' } });

    // Vérifier que les valeurs sont mises à jour
    await waitFor(() => {
      const costElement = screen.getByTestId('game-cost');
      expect(costElement).toHaveTextContent('300 XOF');
    });

    container.remove();
  });
});
