import { PrismaClient } from '@prisma/client';
import { mockPrizes } from '../src/data/mockPrizes';

const prisma = new PrismaClient();

async function main() {
  // Supprimer toutes les données existantes
  await prisma.prize.deleteMany();
  await prisma.regionModel.deleteMany();
  await prisma.settings.deleteMany();

  // Créer les régions avec les configurations
  const regions = [
    {
      name: 'AFRIQUE_NOIRE',
      currency: 'XOF',
      pointsPerPlay: 2,
      costPerPoint: 150,
      countries: ['CI', 'SN', 'CM', 'BF', 'ML', 'GN', 'BJ', 'TG', 'NE', 'CG', 'GA', 'CD']
    },
    {
      name: 'AFRIQUE_BLANCHE',
      currency: 'EUR',
      pointsPerPlay: 2,
      costPerPoint: 0.5,
      countries: ['MA', 'DZ', 'TN']
    },
    {
      name: 'EUROPE',
      currency: 'EUR',
      pointsPerPlay: 2,
      costPerPoint: 1.0,
      countries: ['FR', 'BE', 'CH', 'IT', 'DE', 'ES', 'PT', 'GB']
    },
    {
      name: 'ASIE',
      currency: 'USD',
      pointsPerPlay: 2,
      costPerPoint: 1.0,
      countries: ['CN', 'JP', 'KR', 'VN', 'TH', 'ID', 'MY', 'SG']
    },
    {
      name: 'AMERIQUE',
      currency: 'USD',
      pointsPerPlay: 2,
      costPerPoint: 1.0,
      countries: ['US', 'CA', 'BR', 'MX']
    }
  ];

  for (const region of regions) {
    await prisma.regionModel.create({
      data: region
    });
  }

  // Créer les paramètres par défaut
  await prisma.settings.create({
    data: {
      cardsPerGame: 2,
      costPerCard: 1,
      blackAfricaRate: 150,
      whiteAfricaRate: 0.5,
      europeRate: 1.0,
      asiaRate: 1.0,
      americaRate: 1.0,
      minPointsPerGame: 1,
      maxPointsPerGame: 100,
      referralPoints: 5
    }
  });

  // Créer les prix
  for (const prize of mockPrizes) {
    await prisma.prize.create({
      data: {
        name: prize.name,
        description: prize.description || '',
        imageUrl: prize.imageUrl || '',
        pointValue: prize.pointValue,
        category: prize.category,
        isActive: prize.isActive ?? true,
        stock: prize.stock ?? 10,
        regionId: prize.region || 'AFRIQUE_NOIRE'
      },
    });
  }

  console.log('Base de données initialisée avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });