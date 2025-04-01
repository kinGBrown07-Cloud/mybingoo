const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const regions = [
  {
    id: 'afrique_noire',
    name: 'AFRIQUE_NOIRE',
    currency: 'XOF',
    pointsPerPlay: 2,
    costPerPoint: 150,
    countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD']
  },
  {
    id: 'afrique_blanche',
    name: 'AFRIQUE_BLANCHE',
    currency: 'EUR',
    pointsPerPlay: 2,
    costPerPoint: 0.5,
    countries: ['MA', 'DZ', 'TN']
  },
  {
    id: 'europe',
    name: 'EUROPE',
    currency: 'EUR',
    pointsPerPlay: 2,
    costPerPoint: 1,
    countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB']
  },
  {
    id: 'asie',
    name: 'ASIE',
    currency: 'USD',
    pointsPerPlay: 2,
    costPerPoint: 1,
    countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG']
  },
  {
    id: 'amerique',
    name: 'AMERIQUE',
    currency: 'USD',
    pointsPerPlay: 2,
    costPerPoint: 1,
    countries: ['US', 'CA', 'BR', 'MX']
  }
];

async function initRegions() {
  try {
    for (const region of regions) {
      await prisma.regionModel.upsert({
        where: { id: region.id },
        update: region,
        create: region
      });
    }
    console.log('Régions initialisées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des régions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initRegions();
