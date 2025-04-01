interface RegionConfig {
  countries: readonly string[];
  currency: 'XOF' | 'EUR' | 'USD';
  pointsPerPlay: number;
  costPerPoint: number;
}

const REGION_CONFIG: Record<string, RegionConfig> = {
  AFRIQUE_NOIRE: {
    countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD'] as const,
    currency: 'XOF',
    pointsPerPlay: 2,
    costPerPoint: 150, // 300 XOF pour 2 points
  },
  AFRIQUE_BLANCHE: {
    countries: ['MA', 'DZ', 'TN'] as const,
    currency: 'EUR',
    pointsPerPlay: 2,
    costPerPoint: 0.5, // 1 EUR pour 2 points
  },
  EUROPE: {
    countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB'] as const,
    currency: 'EUR',
    pointsPerPlay: 2,
    costPerPoint: 1, // 2 EUR pour 2 points
  },
  ASIE: {
    countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG'] as const,
    currency: 'USD',
    pointsPerPlay: 2,
    costPerPoint: 1, // 2 USD pour 2 points
  },
  AMERIQUE: {
    countries: ['US', 'CA', 'BR', 'MX'] as const,
    currency: 'USD',
    pointsPerPlay: 2,
    costPerPoint: 1, // 2 USD pour 2 points
  },
} as const;

export function getRegionConfigByCountry(countryCode: string): { region: string } & RegionConfig {
  for (const [region, config] of Object.entries(REGION_CONFIG)) {
    if (config.countries.includes(countryCode)) {
      return { region, ...config };
    }
  }
  // Retourner la configuration par défaut pour l'Europe
  return {
    region: 'EUROPE',
    ...REGION_CONFIG.EUROPE
  };
}

export { REGION_CONFIG };
export type { RegionConfig };
