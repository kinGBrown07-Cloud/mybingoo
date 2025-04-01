export const REGIONS = {
  AFRIQUE_NOIRE: 'AFRIQUE_NOIRE',
  AFRIQUE_BLANCHE: 'AFRIQUE_BLANCHE',
  EUROPE: 'EUROPE',
  ASIE: 'ASIE',
  AMERIQUE: 'AMERIQUE',
} as const;

export const REGION_NAMES = {
  AFRIQUE_NOIRE: 'Afrique Noire',
  AFRIQUE_BLANCHE: 'Afrique Blanche',
  EUROPE: 'Europe',
  ASIE: 'Asie',
  AMERIQUE: 'Amérique',
} as const;

export type RegionKey = 'AFRIQUE_NOIRE' | 'AFRIQUE_BLANCHE' | 'EUROPE' | 'ASIE' | 'AMERIQUE';

interface RegionConfig {
  countries: string[];
  currency: string;
  pointsPerGame: number;
  pointCost: number;
}

export const REGION_CONFIG: Record<RegionKey, RegionConfig> = {
  AFRIQUE_NOIRE: {
    countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD'],
    currency: 'XOF',
    pointsPerGame: 2,
    pointCost: 150
  },
  AFRIQUE_BLANCHE: {
    countries: ['MA', 'DZ', 'TN'],
    currency: 'EUR',
    pointsPerGame: 2,
    pointCost: 0.5
  },
  EUROPE: {
    countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB'],
    currency: 'EUR',
    pointsPerGame: 2,
    pointCost: 1
  },
  ASIE: {
    countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG'],
    currency: 'USD',
    pointsPerGame: 2,
    pointCost: 1
  },
  AMERIQUE: {
    countries: ['US', 'CA', 'BR', 'MX'],
    currency: 'USD',
    pointsPerGame: 2,
    pointCost: 1
  }
};

export const DEFAULT_REGION: RegionKey = 'EUROPE';

// Coût des différents types de cartes en points
export const CARD_COSTS = {
  FOOD: 1,
  CLOTHING: 1,
  SUPER: 1,
} as const;
