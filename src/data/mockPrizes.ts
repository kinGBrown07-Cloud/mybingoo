import { Prize } from '@/types/game';

export const mockPrizes: Prize[] = [
  // Prix FOOD
  {
    name: 'Sac de riz 25kg',
    description: 'Un sac de riz de qualité supérieure',
    imageUrl: '/images/prizes/food/rice.png',
    pointValue: 50,
    category: 'FOOD',
    isActive: true,
    stock: 10,
    value: 15000,
    region: 'BLACK_AFRICA'
  },
  {
    name: 'Pack Huile de cuisine',
    description: '3 bouteilles d\'huile de cuisine de qualité',
    imageUrl: '/images/prizes/food/oil.png',
    pointValue: 75,
    category: 'FOOD',
    isActive: true,
    stock: 10,
    value: 20000,
    region: 'BLACK_AFRICA'
  },
  {
    name: 'Pack Spaghetti',
    description: 'Lot de 10 paquets de spaghetti',
    imageUrl: '/images/prizes/food/pasta.png',
    pointValue: 100,
    category: 'FOOD',
    isActive: true,
    stock: 10,
    value: 25000,
    region: 'BLACK_AFRICA'
  },
  {
    name: 'Pack Boîtes de tomates',
    description: 'Lot de 12 boîtes de tomates',
    imageUrl: '/images/prizes/food/tomatoes.png',
    pointValue: 150,
    category: 'FOOD',
    isActive: true,
    stock: 10,
    value: 30000,
    region: 'BLACK_AFRICA'
  },

  // Prix CLOTHING
  {
    name: 'Veste élégante',
    description: 'Une veste tendance pour homme ou femme',
    imageUrl: '/images/prizes/clothing/jacket.png',
    pointValue: 200,
    category: 'CLOTHING',
    isActive: true,
    stock: 5,
    value: 35000,
    region: 'BLACK_AFRICA'
  },
  {
    name: 'Chaussures de marque',
    description: 'Une paire de chaussures à la mode',
    imageUrl: '/images/prizes/clothing/shoes.png',
    pointValue: 250,
    category: 'CLOTHING',
    isActive: true,
    stock: 5,
    value: 40000,
    region: 'BLACK_AFRICA'
  },
  {
    name: 'Sac de luxe',
    description: 'Un sac à main ou sac à dos de marque',
    imageUrl: '/images/prizes/clothing/bag.png',
    pointValue: 300,
    category: 'CLOTHING',
    isActive: true,
    stock: 5,
    value: 45000,
    region: 'BLACK_AFRICA'
  },
  {
    name: 'Pack Parfum',
    description: 'Un coffret parfum de luxe',
    imageUrl: '/images/prizes/clothing/perfume.png',
    pointValue: 350,
    category: 'CLOTHING',
    isActive: true,
    stock: 5,
    value: 50000,
    region: 'BLACK_AFRICA'
  },

  // Prix SUPER
  {
    name: 'Voiture citadine',
    description: 'Une voiture neuve compacte et économique',
    imageUrl: '/images/prizes/super/car.png',
    pointValue: 10000,
    category: 'SUPER',
    isActive: true,
    stock: 1,
    value: 150000,
    region: 'BLACK_AFRICA'
  },
  {
    name: 'Scooter',
    description: 'Un scooter moderne et fiable',
    imageUrl: '/images/prizes/super/scooter.png',
    pointValue: 5000,
    category: 'SUPER',
    isActive: true,
    stock: 2,
    value: 200000,
    region: 'BLACK_AFRICA'
  },
  {
    name: 'Voyage de luxe',
    description: 'Un séjour all-inclusive pour 2 personnes',
    imageUrl: '/images/prizes/super/travel.png',
    pointValue: 7500,
    category: 'SUPER',
    isActive: true,
    stock: 2,
    value: 250000,
    region: 'BLACK_AFRICA'
  }
];