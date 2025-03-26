import NextAuth from "next-auth";
import { UserRole } from '@prisma/client';

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: UserRole;
      points?: number;
      image?: string | null; // Assurez-vous que cette ligne est présente
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: UserRole;
    points?: number;
    country: string | null;
    phone: string | null;
    currency: string | null;
    costPerPlay: number | null;
    isAdmin: boolean;
    image?: string | null; // Ajoutez cette ligne pour inclure la propriété image
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    points: number;
    country: string | null;
    phone: string | null;
    currency: string | null;
    costPerPlay: number | null;
    image: string | null; // Assurez-vous que cette ligne est présente
  }
}
