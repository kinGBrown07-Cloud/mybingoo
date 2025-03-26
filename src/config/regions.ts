export const REGIONS = {
  BLACK_AFRICA: 'BLACK_AFRICA',
  WHITE_AFRICA: 'WHITE_AFRICA',
  EUROPE: 'EUROPE',
  ASIA: 'ASIA',
  AMERICA: 'AMERICA',
} as const;

export type Region = keyof typeof REGIONS;

export const REGION_CURRENCIES = {
  [REGIONS.BLACK_AFRICA]: 'EUR',
  [REGIONS.WHITE_AFRICA]: 'EUR',
  [REGIONS.EUROPE]: 'EUR',
  [REGIONS.ASIA]: 'USD',
  [REGIONS.AMERICA]: 'USD',
} as const;

export const POINTS_RATES = {
  [REGIONS.BLACK_AFRICA]: {
    points: 2,
    amount: 2,
    currency: 'EUR'
  },
  [REGIONS.WHITE_AFRICA]: {
    points: 2,
    amount: 1,
    currency: 'EUR'
  },
  [REGIONS.EUROPE]: {
    points: 2,
    amount: 2,
    currency: 'EUR'
  },
  [REGIONS.ASIA]: {
    points: 2,
    amount: 2,
    currency: 'USD'
  },
  [REGIONS.AMERICA]: {
    points: 2,
    amount: 2,
    currency: 'USD'
  },
} as const;

export const GAME_COSTS = {
  FOOD: 1,
  CLOTHING: 1,
  SUPER: 1,
} as const; // Chaque carte coûte 1 point

export const REGION_NAMES = {
  [REGIONS.BLACK_AFRICA]: 'Afrique Noire',
  [REGIONS.WHITE_AFRICA]: 'Afrique Blanche',
  [REGIONS.EUROPE]: 'Europe',
  [REGIONS.ASIA]: 'Asie',
  [REGIONS.AMERICA]: 'Amérique',
} as const;

export const PAYMENT_METHODS = {
  [REGIONS.BLACK_AFRICA]: ['PAYPAL'],
  [REGIONS.WHITE_AFRICA]: ['PAYPAL'],
  [REGIONS.EUROPE]: ['PAYPAL'],
  [REGIONS.ASIA]: ['PAYPAL'],
  [REGIONS.AMERICA]: ['PAYPAL'],
} as const;
