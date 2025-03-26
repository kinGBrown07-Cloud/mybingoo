import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Type étendu pour inclure tous les champs requis
interface ExtendedUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  points: number;
  image: string | null;
  regionId: string | null;
  country: string | null;
  phone: string | null;
  currency: string | null;
  costPerPlay: number | null;
  balance: number;
  emailVerified: Date | null;
  isAdmin: boolean;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  affiliateCode: string | null;
  referredBy: string | null;
  referralCount: number;
  referralEarnings: number;
  createdAt: Date;
  updatedAt: Date;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error('Email ou mot de passe incorrect');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Conversion en ExtendedUser pour satisfaire le typage
        const extendedUser: ExtendedUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points,
          image: user.image,
          regionId: user.regionId,
          country: user.country,
          phone: user.phone,
          currency: user.currency,
          costPerPlay: user.costPerPlay,
          balance: user.balance,
          emailVerified: user.emailVerified,
          isAdmin: user.role === 'ADMIN',
          resetToken: user.resetToken,
          resetTokenExpiry: user.resetTokenExpiry,
          affiliateCode: user.affiliateCode,
          referredBy: user.referredBy,
          referralCount: user.referralCount,
          referralEarnings: user.referralEarnings,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };

        return extendedUser;
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
        token.points = user.points as number;
        token.regionId = user.regionId as string | null;
        token.referralCount = user.referralCount as number;
        token.referralEarnings = user.referralEarnings as number;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as UserRole;
        session.user.points = token.points as number;
        session.user.regionId = token.regionId as string | null;
        session.user.referralCount = token.referralCount as number;
        session.user.referralEarnings = token.referralEarnings as number;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};