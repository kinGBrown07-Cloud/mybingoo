import { Category as PrismaCategory, Region as PrismaRegion } from '@prisma/client';

export type CardStatus = 'hidden' | 'revealed' | 'matched';

export type GameCategory = PrismaCategory;
export type Region = PrismaRegion;

export interface RegionalPricing {
  region: Region;
  points: number;
  price: number;
  currency: 'XOF' | 'EUR' | 'USD';
}

export interface Card {
  id: string;
  image: string;
  status: CardStatus;
  prizeId: string;
}

export interface GameState {
  cards: Card[];
  selectedCards: string[];
  matchedPairs: string[][];
  gameStatus: 'playing' | 'won' | 'lost';
  remainingTries: number;
  points: number;
}

export type Prize = {
  id?: string;
  name: string;
  description?: string;
  category: GameCategory;
  pointValue: number;
  imageUrl?: string;
  value: number; // Ajoutez cette ligne pour inclure la propriété 'value'
  isActive?: boolean;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
  region: Region;
};


export interface GameConfig {
  gameType: GameCategory;
  cardCost: number; // Toujours 1 point par carte
  maxTries: number;
  winningCondition: number;
  gridSize: number;
  timeLimit?: number;
}

// Default regional pricing configuration
export const DEFAULT_REGIONAL_PRICING: RegionalPricing[] = [
  { region: 'BLACK_AFRICA', points: 2, price: 300, currency: 'XOF' },
  { region: 'WHITE_AFRICA', points: 2, price: 1, currency: 'EUR' },
  { region: 'EUROPE', points: 2, price: 2, currency: 'EUR' },
  { region: 'ASIA', points: 2, price: 2, currency: 'USD' },
  { region: 'AMERICA', points: 2, price: 2, currency: 'USD' }
] as const;