import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import { compare } from 'bcrypt';
import { User as PrismaUser, UserRole } from '@prisma/client';

type Role = 'USER' | 'ADMIN';

export interface AuthUser extends Omit<PrismaUser, 'password' | 'emailVerified' | 'createdAt' | 'updatedAt'> {
  isAdmin: boolean;
}

declare module 'next-auth' {
  interface User extends AuthUser {}
  interface Session {
    user: AuthUser;
  }
  interface JWT {
    role?: UserRole;
    isAdmin: boolean;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        const { password, emailVerified, createdAt, updatedAt, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          isAdmin: user.role === 'ADMIN'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
        token.isAdmin = Boolean(user.isAdmin);
        token.image = user.image || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as UserRole;
        session.user.isAdmin = Boolean(token.isAdmin);
        session.user.image = token.image || null;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  }
};