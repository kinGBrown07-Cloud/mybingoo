import { User as PrismaUser, UserRole } from '@prisma/client';
import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

interface ExtendedUser extends DefaultUser {
  id: string;
  role: UserRole;
  isAdmin: boolean;
  image: string | null;
  regionId: string | null;
  referralCount: number;
  referralEarnings: number;
  supabaseId: string | null;
}

declare module 'next-auth' {
  interface User extends Omit<PrismaUser, 'password'> {
    isAdmin: boolean;
  }

  interface Session extends DefaultSession {
    user: ExtendedUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    isAdmin: boolean;
    image: string | null;
    regionId: string | null;
    referralCount: number;
    referralEarnings: number;
    supabaseId: string | null;
  }
}
