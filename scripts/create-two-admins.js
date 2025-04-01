const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTwoAdmins() {
  try {
    // Récupérer la région Europe
    const europeRegion = await prisma.regionModel.findFirst({
      where: {
        name: 'EUROPE'
      }
    });

    if (!europeRegion) {
      throw new Error('La région Europe n\'existe pas');
    }

    // Premier admin - Administrateur principal
    const password1 = 'Admin2025@Bingoo';
    const hashedPassword1 = await bcrypt.hash(password1, 10);
    
    const admin1 = await prisma.user.upsert({
      where: { email: 'admin.principal@mybingoo.com' },
      update: {
        password: hashedPassword1
      },
      create: {
        email: 'admin.principal@mybingoo.com',
        name: 'Administrateur Principal',
        password: hashedPassword1,
        role: 'ADMIN',
        points: 1000,
        balance: 1000,
        currency: 'EUR',
        phone: '+33600000000',
        country: 'FR',
        regionId: europeRegion.id
      },
    });

    // Deuxième admin - Administrateur secondaire
    const password2 = 'Admin2025@BingooTwo';
    const hashedPassword2 = await bcrypt.hash(password2, 10);
    
    const admin2 = await prisma.user.upsert({
      where: { email: 'admin.support@mybingoo.com' },
      update: {
        password: hashedPassword2
      },
      create: {
        email: 'admin.support@mybingoo.com',
        name: 'Administrateur Support',
        password: hashedPassword2,
        role: 'ADMIN',
        points: 500,
        balance: 500,
        currency: 'EUR',
        phone: '+33600000001',
        country: 'FR',
        regionId: europeRegion.id
      },
    });

    console.log('\nComptes administrateurs créés avec succès:');
    console.log('\nAdmin Principal:');
    console.log('Email:', admin1.email);
    console.log('Mot de passe:', password1);
    console.log('\nAdmin Support:');
    console.log('Email:', admin2.email);
    console.log('Mot de passe:', password2);
    console.log('\nVous pouvez maintenant vous connecter avec ces identifiants.');
    
  } catch (error) {
    console.error('Erreur lors de la création des comptes administrateurs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTwoAdmins();
