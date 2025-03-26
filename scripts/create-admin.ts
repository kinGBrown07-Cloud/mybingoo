import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { createInterface } from 'readline';

const prisma = new PrismaClient();

async function promptEmail(): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Email de l\'administrateur : ', (email) => {
      rl.close();
      resolve(email);
    });
  });
}

async function promptPassword(): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Mot de passe (minimum 8 caractères) : ', (password) => {
      rl.close();
      resolve(password);
    });
  });
}

async function main() {
  try {
    const email = await promptEmail();
    const password = await promptPassword();

    if (!password || password.length < 8) {
      console.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    const hashedPassword = await hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        points: 1000,
        name: 'Admin'
      }
    });

    console.log('Administrateur créé avec succès:', admin.email);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();