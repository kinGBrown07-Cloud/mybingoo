import { PrismaClient } from '@prisma/client';
import { mockPrizes } from '../src/data/mockPrizes';

const prisma = new PrismaClient();

async function main() {
  // Supprimer toutes les données existantes
  await prisma.prize.deleteMany();
  await prisma.regionModel.deleteMany();
  await prisma.settings.deleteMany();

  // Créer les régions avec les taux de conversion
  const regions = [
    {
      name: 'BLACK_AFRICA',
      XOFPerPoint: 150,
      euroPerPoint: 0.5,
      dollarPerPoint: 1
    },
    {
      name: 'WHITE_AFRICA',
      XOFPerPoint: 150,
      euroPerPoint: 1,
      dollarPerPoint: 1
    },
    {
      name: 'EUROPE',
      XOFPerPoint: 150,
      euroPerPoint: 2,
      dollarPerPoint: 2
    },
    {
      name: 'ASIA',
      XOFPerPoint: 150,
      euroPerPoint: 2,
      dollarPerPoint: 2
    },
    {
      name: 'AMERICA',
      XOFPerPoint: 150,
      euroPerPoint: 2,
      dollarPerPoint: 2
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
      europeRate: 2,
      asiaRate: 2,
      americaRate: 2,
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
        region: prize.region || 'BLACK_AFRICA'
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