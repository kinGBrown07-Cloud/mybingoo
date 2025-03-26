import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createInterface } from 'readline';

const prisma = new PrismaClient();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptPassword() {
  return new Promise((resolve) => {
    rl.question('Entrez le mot de passe pour le compte admin : ', (password) => {
      resolve(password);
      rl.close();
    });
  });
}

async function createAdminUser() {
  try {
    const password = await promptPassword();
    
    if (!password || password.length < 8) {
      console.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@bingoo.com' },
      update: {
        password: hashedPassword
      },
      create: {
        email: 'admin@bingoo.com',
        name: 'Administrateur',
        password: hashedPassword,
        role: 'ADMIN',
        points: 0,
      },
    });

    console.log('Compte administrateur créé avec succès:', admin.email);
    console.log('Vous pouvez maintenant vous connecter avec ces identifiants.');
  } catch (error) {
    console.error('Erreur lors de la création du compte administrateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
